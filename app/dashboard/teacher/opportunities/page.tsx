"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { GraduationCap, MapPin, Calendar, Filter, ChevronLeft, ChevronRight, X, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { BarLoader } from 'react-spinners';
import { useJobListings, JobFilters, Job } from "@/hooks/useJobListings";
// Note: Removed useDashboardStore import to avoid old API calls
// import { useDashboardStore } from "@/hooks/useDashboardStore";
import Cookies from "js-cookie";
import { AUTH_COOKIE } from "@/lib/constants";
import TeacherNavbar from "@/components/TeacherNavbar";
import { useApplyJob } from "@/hooks/useApplyJob";
import { toast } from "sonner";

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

export default function TeacherOpportunitiesPage() {
  const router = useRouter();
  // Note: Removed useDashboardStore usage to avoid old API calls
  // const { teacher, teacher_subscription, get_dashboard_data, get_teacher_subs } = useDashboardStore();
  const teacher = null; // Will be replaced with new API data when available
  const teacher_subscription = null; // Will be replaced with new API data when available
  const { apply_job } = useApplyJob();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [modeOfTeaching, setModeOfTeaching] = useState<string>("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [radius, setRadius] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<JobFilters>({});
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const itemsPerPage = 12;

  // Note: Temporarily defaulting to premium access since we're not loading old dashboard API
  // TODO: Get subscription status from new API when available
  const hasPremium = true; // teacher_subscription?.name === 'Premium';

  // Check authentication
  useEffect(() => {
    const authToken = Cookies.get("jwt_Token");
    
    console.log('🔍 Opportunities: Initial load check', {
      hasToken: !!authToken,
      note: 'Using opportunities page without old API calls'
    });
    
    if (!authToken) {
      router.push("/auth?model=teacher");
      return;
    }

    // Skip loading dashboard data - using new tutor dashboard data instead
    // Note: Removed calls to get_dashboard_data() and get_teacher_subs() 
    // as requested to stop calling old API endpoints
    setDataLoaded(true);
    console.log('🏁 Opportunities: Skipping old API calls, ready to show opportunities');
  }, []);

  // Note: Removed teacher state logging since we're not using old API data
  // useEffect(() => {
  //   console.log('👤 Opportunities: Teacher state updated:', {
  //     hasTeacher: !!teacher,
  //     teacherId: teacher?.id,
  //     teacherName: teacher?.name,
  //     teacherEmail: teacher?.email
  //   });
  // }, [teacher]);

  // Initialize with user location if available
  useEffect(() => {
    const jwt_Token = Cookies.get(AUTH_COOKIE.JWT_TOKEN);
    // Note: Skip location-based filtering since we're not loading teacher location from old API
    // TODO: Get teacher location from new API when available
    if (jwt_Token) {
      setFilters({
        radius: 50
        // latitude: teacher.latitude,
        // longitude: teacher.longitude,
      });
    }
  }, []);

  const { jobsData, loading: jobsLoading, error, refetch } = useJobListings(filters);

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

    const baseFilters = { ...newFilters };
    // Note: Skip location-based filtering since we're not loading teacher location from old API
    // TODO: Get teacher location from new API when available
    // if (teacher?.latitude && teacher?.longitude) {
    //   baseFilters.latitude = teacher.latitude;
    //   baseFilters.longitude = teacher.longitude;
    // }
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
    console.log('🎯 Opportunities: handleApplyJob called for jobId:', jobId);
    console.log('👤 Opportunities: Teacher from store:', teacher);
    console.log('🔑 Opportunities: Has auth token:', !!Cookies.get("jwt_Token"));
    
    // If we're on this page, user must be authenticated (protected by useEffect above)
    // So we can safely apply for the job
    const authToken = Cookies.get("jwt_Token");
    if (!authToken) {
      toast.error("Authentication required. Please login again.");
      router.push("/auth?model=teacher");
      return;
    }

    console.log('✅ Opportunities: User authenticated, applying directly');
    setApplyingJobId(jobId);
    try {
      const result = await apply_job(jobId);
      console.log('📝 Opportunities: Apply result:', result);
      if (result.status === 201 || result.status === 200) {
        console.log('✅ Application submitted successfully');
        // No redirect - stay on the opportunities page
      }
    } catch (error) {
      console.error("❌ Opportunities: Application error:", error);
    } finally {
      setApplyingJobId(null);
    }
  };

  // Show loading state while dashboard data is loading
  if (!dataLoaded && !teacher) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TeacherNavbar />
        <div className="pt-16 flex items-center justify-center" style={{ height: 'calc(100vh - 4rem)' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TeacherNavbar />
        <div className="pt-16 px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-medium">Failed to load job listings</p>
              <Button onClick={() => refetch(filters)} className="mt-4">
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNavbar />
      
      <div className="pt-16 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Teaching Opportunities</h1>
            <p className="mt-2 text-gray-600">
              Browse and apply for teaching positions that match your expertise
            </p>
          </div>

          {/* Main Content with Sidebar */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters */}
            <div className="lg:w-80 shrink-0">
              <Card className="sticky top-20 bg-white shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  </div>

                  {/* Mode of Teaching */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mode of Teaching
                    </label>
                    <Select value={modeOfTeaching} onValueChange={setModeOfTeaching}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
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
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subjects
                    </label>
                    <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-3">
                      {SUBJECTS.map((subject) => (
                        <label key={subject} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={selectedSubjects.includes(subject)}
                            onChange={() => toggleSubject(subject)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{subject}</span>
                        </label>
                      ))}
                    </div>
                    {selectedSubjects.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedSubjects.map((subject) => (
                          <span
                            key={subject}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                          >
                            {subject}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-blue-900"
                              onClick={() => toggleSubject(subject)}
                            />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Radius Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Radius: {radius} km
                    </label>
                    <Slider
                      value={[radius]}
                      onValueChange={(value) => setRadius(value[0])}
                      min={5}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5 km</span>
                      <span>100 km</span>
                    </div>
                  </div>

                  {/* Apply Filters Button */}
                  <Button
                    onClick={handleApplyFilters}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Apply Filters
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Jobs List */}
            <div className="flex-1">
              {/* Search Bar */}
              <div className="mb-6">
                <Input
                  type="text"
                  placeholder="Search by student name, grade, board, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-6 text-base"
                />
              </div>

              {/* Loading State */}
              {jobsLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <BarLoader color="#2563eb" width={200} />
                  <p className="mt-4 text-gray-600">Loading opportunities...</p>
                </div>
              )}

              {/* No Results */}
              {!jobsLoading && paginatedJobs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                  <p className="text-gray-600 text-lg">No opportunities found</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
                </div>
              )}

              {/* Job Cards */}
              {!jobsLoading && paginatedJobs.length > 0 && (
                <div className="space-y-4">
                  {paginatedJobs.map((job) => {
                    const subjectsArray = typeof job.subjects === 'string' 
                      ? JSON.parse(job.subjects || '[]')
                      : job.subjects || [];

                    return (
                      <Card
                        key={job.id}
                        className="bg-white hover:shadow-xl border-gray-200 shadow-md transition-all duration-300 overflow-hidden group"
                      >
                        <CardContent className="p-6">
                          <div className="flex md:flex-row flex-col gap-6 md:gap-8">
                            {/* Left Section - Job Details */}
                            <div className="flex-1 space-y-4">
                              {/* Header */}
                              <div>
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {job.learner_name}
                                  </h3>
                                  {!hasPremium && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-full">
                                      <Crown className="w-3 h-3 text-yellow-600" />
                                      <span className="text-xs text-yellow-700 font-medium">Premium</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-gray-600">Grade {job.grade} • {job.board}</p>
                              </div>

                              {/* Subjects */}
                              <div className="flex flex-wrap gap-2">
                                {subjectsArray.map((subject: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                                  >
                                    <GraduationCap className="w-3 h-3" />
                                    {subject}
                                  </span>
                                ))}
                              </div>

                              {/* Additional Info */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                {/* Location */}
                                <div className="flex items-start gap-2 relative">
                                  <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                                  <div>
                                    <p className="text-xs text-gray-500">Location</p>
                                    <p className={`font-medium ${!hasPremium ? 'blur-sm select-none' : 'text-gray-900'}`}>
                                      {blurLocation(`${job.area}, ${job.state}`)}
                                    </p>
                                  </div>
                                  {!hasPremium && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <Crown className="w-4 h-4 text-yellow-500" />
                                    </div>
                                  )}
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
                                onClick={() => {
                                  console.log('🔵 Button clicked for job:', job.id);
                                  handleApplyJob(job.id.toString());
                                }}
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
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
