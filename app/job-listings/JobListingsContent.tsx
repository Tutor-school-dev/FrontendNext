"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { GraduationCap, MapPin, Calendar, Filter, ChevronLeft, ChevronRight, X, Lock, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { BarLoader } from 'react-spinners';
import { useJobListings, JobFilters, Job } from "@/hooks/useJobListings";
import { useDashboardStore } from "@/hooks/useDashboardStore";
import Cookies from "js-cookie";
import { AUTH_COOKIE } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApplyJob } from "@/hooks/useApplyJob";
import { toast } from "sonner";
import { saveRedirectFlow, getRedirectFlow, RedirectSource, generateAuthUrl } from "@/lib/redirectFlows";

// Common subjects list
const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology", 
  "English", "Hindi", "Science", "Computer Science",
  "History", "Geography", "Economics", "Accountancy",
  "Business Studies", "Political Science"
];

const MODES_OF_TEACHING = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "both", label: "Both" }
];

export default function JobListingsContent() {
  const router = useRouter();
  const { teacher, teacher_subscription } = useDashboardStore();
  const { apply_job } = useApplyJob();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [modeOfTeaching, setModeOfTeaching] = useState<string>("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [radius, setRadius] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<JobFilters>({});
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const itemsPerPage = 12;

  const hasPremium = teacher_subscription?.name === 'Premium';

  // Initialize with user location if available
  useEffect(() => {
    const jwt_Token = Cookies.get(AUTH_COOKIE.JWT_TOKEN);
    if (jwt_Token && teacher?.latitude && teacher?.longitude) {
      setFilters({
        latitude: teacher.latitude,
        longitude: teacher.longitude,
        radius: 50
      });
    }
  }, [teacher]);

  const { jobsData, loading, error, refetch } = useJobListings(filters);

  // Apply filters
  const handleApplyFilters = () => {
    const newFilters: JobFilters = {
      radius: radius
    };

    if (modeOfTeaching && modeOfTeaching !== "all") {
      newFilters.mode_of_teaching = modeOfTeaching;
    }

    if (selectedSubjects.length > 0) {
      newFilters.subjects = selectedSubjects;
    }

    if (teacher?.latitude && teacher?.longitude) {
      newFilters.latitude = teacher.latitude;
      newFilters.longitude = teacher.longitude;
    }

    setFilters(newFilters);
    refetch(newFilters);
    setCurrentPage(1);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setModeOfTeaching("");
    setSelectedSubjects([]);
    setRadius(50);
    const baseFilters: JobFilters = {
      radius: 50
    };
    if (teacher?.latitude && teacher?.longitude) {
      baseFilters.latitude = teacher.latitude;
      baseFilters.longitude = teacher.longitude;
    }
    setFilters(baseFilters);
    refetch(baseFilters);
  };

  // Toggle subject selection
  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  // Filter jobs by search term (client-side)
  const filteredJobs = useMemo(() => {
    return jobsData?.filter((job) => {
      const matchesSearch =
        searchTerm === "" ||
        job.learner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.board.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.state.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    }) || [];
  }, [searchTerm, jobsData]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const blurLocation = (location: string) => {
    if (hasPremium) return location;
    return location.split('').map((char, i) => i < 2 ? char : '•').join('');
  };

  const handleApplyJob = async (jobId: string) => {
    console.log('🎯 JobListings: handleApplyJob called for jobId:', jobId);
    console.log('👤 JobListings: Teacher exists:', !!teacher);
    
    if (!teacher) {
      console.log('🔒 JobListings: User not authenticated, saving redirect flow');
      
      const redirectData = {
        source: RedirectSource.JOB_LISTING,
        jobId: jobId,
        returnUrl: '/dashboard/teacher/opportunities'
      };
      
      console.log('📦 JobListings: Redirect data to save:', redirectData);
      
      // Save redirect flow before redirecting to auth
      saveRedirectFlow(redirectData);
      
      // Verify it was saved
      const saved = getRedirectFlow();
      console.log('✔️ JobListings: Verified saved data:', saved);
      
      const authUrl = generateAuthUrl('teacher', redirectData);
      
      console.log('🔗 JobListings: Redirecting to:', authUrl);
      toast.info("Please login to apply for this opportunity");
      router.push(authUrl);
      return;
    }

    console.log('✅ JobListings: User authenticated, applying directly');
    setApplyingJobId(jobId);
    try {
      const result = await apply_job(jobId);
      console.log('📝 JobListings: Apply result:', result);
      if (result.status === 201 || result.status === 200) {
        // Redirect to dashboard after successful application
        setTimeout(() => {
          router.push('/dashboard/teacher');
        }, 2500);
      }
    } catch (error) {
      console.error("❌ JobListings: Application error:", error);
    } finally {
      setApplyingJobId(null);
    }
  };

  if (error) {
    return (
      <>
        <Navbar />
        <main className="bg-background min-h-screen pt-20">
          <div className="mx-auto px-4 py-8 container">
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <h3 className="mb-2 font-semibold text-card-foreground text-lg">Error loading jobs</h3>
                <p className="text-muted-foreground">Please try again later.</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-blue-50 to-white min-h-screen pt-20">
        <div className="mx-auto px-4 py-8 container max-w-7xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 font-bold text-4xl text-foreground md:text-5xl">
              Find Your Perfect Teaching Opportunity
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Connect with students looking for quality tutoring. Apply now and start teaching!
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <BarLoader color="#2563eb" width={150} />
            </div>
          ) : (
            <div className="gap-8 grid lg:grid-cols-4">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <Card className="bg-white border-gray-200 shadow-lg sticky top-24">
                  <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-blue-600" />
                        <h2 className="font-semibold text-foreground text-lg">Filters</h2>
                      </div>
                      {(modeOfTeaching || selectedSubjects.length > 0 || radius !== 50) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearFilters}
                          className="h-8 text-xs"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Clear
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 pt-6">
                    {/* Search */}
                    <div>
                      <Input
                        placeholder="Search by grade, board..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-50 border-gray-200"
                      />
                    </div>

                    {/* Mode of Teaching */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Mode</label>
                      <Select value={modeOfTeaching} onValueChange={setModeOfTeaching}>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                          <SelectValue placeholder="All modes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Modes</SelectItem>
                          {MODES_OF_TEACHING.map((mode) => (
                            <SelectItem key={mode.value} value={mode.value}>
                              {mode.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subjects */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Subjects</label>
                      <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                        {SUBJECTS.map((subject) => (
                          <Badge
                            key={subject}
                            variant={selectedSubjects.includes(subject) ? "default" : "outline"}
                            className={`cursor-pointer text-xs ${
                              selectedSubjects.includes(subject)
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => toggleSubject(subject)}
                          >
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Radius */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Radius</label>
                        <span className="text-sm text-blue-600 font-semibold">{radius} km</span>
                      </div>
                      <Slider
                        value={[radius]}
                        onValueChange={(value) => setRadius(value[0])}
                        min={5}
                        max={200}
                        step={5}
                      />
                      {(!teacher?.latitude || !teacher?.longitude) && (
                        <p className="text-xs text-yellow-600 mt-2">
                          ⚠️ Set location in profile
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handleApplyFilters}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Apply Filters
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Jobs List */}
              <div className="lg:col-span-3 space-y-6">
                {/* Results Summary */}
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground text-sm">
                    <span className="font-semibold text-foreground">{filteredJobs.length}</span> opportunities found
                  </p>
                  {!hasPremium && (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                      <Lock className="w-3 h-3 mr-1" />
                      Upgrade for full details
                    </Badge>
                  )}
                </div>

                {/* Job Cards */}
                <div className="gap-4 grid">
                  {paginatedJobs.map((job) => {
                    return (
                      <Card
                        key={job.id}
                        className="bg-white hover:shadow-xl border-gray-200 shadow-md transition-all duration-300 overflow-hidden group"
                      >
                        <CardContent className="p-6">
                          <div className="flex md:flex-row flex-col md:justify-between gap-6">
                            {/* Left Section */}
                            <div className="flex-1 space-y-4">
                              {/* Header */}
                              <div>
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-bold text-2xl text-gray-900">
                                    Class {job.grade} - {job.board}
                                  </h3>
                                  <Badge className="bg-blue-100 text-blue-700 shrink-0">
                                    <GraduationCap className="w-3 h-3 mr-1" />
                                    Grade {job.grade}
                                  </Badge>
                                </div>
                                <p className="text-gray-600">Student needs tutoring</p>
                              </div>

                              {/* Details Grid */}
                              <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                                {/* Location - Blurred if not premium */}
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                                  <div>
                                    <p className="text-xs text-gray-500">Location</p>
                                    <p className={`font-medium text-gray-900 ${!hasPremium && 'blur-sm select-none'}`}>
                                      {job.area}, {job.state}
                                    </p>
                                    {!hasPremium && (
                                      <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                                        <Lock className="w-3 h-3" />
                                        Premium only
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Board */}
                                <div className="flex items-start gap-2">
                                  <GraduationCap className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                                  <div>
                                    <p className="text-xs text-gray-500">Board</p>
                                    <p className="font-medium text-gray-900">{job.board}</p>
                                  </div>
                                </div>

                                {/* Posted Date */}
                                <div className="flex items-start gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                                  <div>
                                    <p className="text-xs text-gray-500">Posted</p>
                                    <p className="font-medium text-gray-900">{formatDate(job.created_at)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Section - CTA */}
                            <div className="flex md:flex-col flex-row items-end md:items-end justify-between md:justify-start gap-4">
                              <Button
                                onClick={() => handleApplyJob(job.id.toString())}
                                disabled={applyingJobId === job.id.toString()}
                                className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg font-semibold text-white transition-all md:w-full"
                              >
                                {applyingJobId === job.id.toString() ? "Applying..." : "Apply Now"}
                              </Button>
                              
                              {!hasPremium && (
                                <Button
                                  variant="outline"
                                  onClick={() => router.push("/dashboard/teacher/subscription")}
                                  className="border-yellow-500 hover:bg-yellow-50 text-yellow-700 md:w-full whitespace-nowrap"
                                >
                                  <Crown className="w-4 h-4 mr-2" />
                                  Get Premium
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* No Results */}
                {filteredJobs.length === 0 && (
                  <Card className="bg-white border-gray-200">
                    <CardContent className="py-16 text-center">
                      <GraduationCap className="mx-auto mb-4 w-16 h-16 text-gray-300" />
                      <h3 className="mb-2 font-semibold text-gray-900 text-lg">No jobs found</h3>
                      <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
                      <Button onClick={handleClearFilters} variant="outline">
                        Clear All Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        if (pageNum > totalPages) return null;

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={currentPage === pageNum ? "bg-blue-600" : ""}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
