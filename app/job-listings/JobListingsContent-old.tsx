"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar, MapPin, User, Phone, Search, Filter, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SocialShare } from "@/components/SocialShare";
import { BarLoader } from 'react-spinners';
import { JobPreview } from "@/components/JobPreview";
import { useJobListings, JobFilters } from "@/hooks/useJobListings";
import { generateJobSlug, extractJobIdFromUrl } from "@/lib/seoUtils";
import { useDashboardStore } from "@/hooks/useDashboardStore";
import Cookies from "js-cookie";
import { AUTH_COOKIE } from "@/lib/constants";

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
  { value: "both", label: "Both Online & Offline" }
];

export default function JobListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { teacher } = useDashboardStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [modeOfTeaching, setModeOfTeaching] = useState<string>("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [radius, setRadius] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<JobFilters>({});
  const itemsPerPage = 10;

  const job_id = extractJobIdFromUrl(searchParams);

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

    if (modeOfTeaching) {
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

  // Get unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    const locations = jobsData?.map((job) => job.area) || [];
    return Array.from(new Set(locations)).sort();
  }, [jobsData]);

  // Filter and search jobs (client-side for search term only)
  const filteredJobs = useMemo(() => {
    return jobsData?.filter((job) => {
      const matchesSearch =
        searchTerm === "" ||
        job.subjects?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.area.toLowerCase().includes(searchTerm.toLowerCase()) ||

        job.learner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.learner_phone.includes(searchTerm);

      return matchesSearch;
    }) || [];
  }, [searchTerm, jobsData]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
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

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  const handleJobClick = (jobId: number) => {
    const job = jobsData?.find(j => j.id === jobId);
    if (!job) return;
    
    const slug = generateJobSlug(job);
    const url = `/${slug}?id=${jobId}`;
    
    // Create clean URL with just the job ID
    router.push(url);
  };

  const handleBackToList = () => {
    router.push('/job-listings');
  };

  if (error) {
    return (
      <main className="bg-background min-h-screen">
        <div className="mx-auto px-4 py-8 container">
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <h3 className="mb-2 font-semibold text-card-foreground text-lg">Error loading jobs</h3>
              <p className="text-muted-foreground">Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      {job_id ? (
        <JobPreview job_id={job_id} jobsData={jobsData} onBack={handleBackToList} />
      ) : (
        <div className="mx-auto px-4 py-8 container">
          <div className="mb-8">
            <h1 className="mb-2 font-bold text-foreground text-4xl text-balance">Find Your Next Opportunity</h1>
            <p className="text-muted-foreground text-lg">Discover amazing job opportunities from top companies</p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <BarLoader color="#36d7b7" width={150} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search and Filters */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-muted-foreground" />
                      <h2 className="font-semibold text-card-foreground text-lg">Search & Filter Jobs</h2>
                    </div>
                    {(modeOfTeaching || selectedSubjects.length > 0 || radius !== 50) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear Filters
                      </Button>
                    )}
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                    <Input
                      placeholder="Search jobs, location, company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-input pl-10 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Filters Grid */}
                  <div className="space-y-4">
                    {/* Mode of Teaching */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Mode of Teaching</label>
                      <Select value={modeOfTeaching} onValueChange={setModeOfTeaching}>
                        <SelectTrigger className="bg-input border-border text-foreground">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="all">All Modes</SelectItem>
                          {MODES_OF_TEACHING.map((mode) => (
                            <SelectItem key={mode.value} value={mode.value} className="text-popover-foreground">
                              {mode.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subjects */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Subjects</label>
                      <div className="flex flex-wrap gap-2">
                        {SUBJECTS.map((subject) => (
                          <Badge
                            key={subject}
                            variant={selectedSubjects.includes(subject) ? "default" : "outline"}
                            className={`cursor-pointer transition-colors ${
                              selectedSubjects.includes(subject)
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-accent"
                            }`}
                            onClick={() => toggleSubject(subject)}
                          >
                            {subject}
                            {selectedSubjects.includes(subject) && (
                              <X className="w-3 h-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                      {selectedSubjects.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {selectedSubjects.length} subject{selectedSubjects.length > 1 ? 's' : ''} selected
                        </p>
                      )}
                    </div>

                    {/* Radius Slider */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-foreground">Search Radius</label>
                        <span className="text-sm text-muted-foreground font-semibold">{radius} km</span>
                      </div>
                      <Slider
                        value={[radius]}
                        onValueChange={(value) => setRadius(value[0])}
                        min={5}
                        max={200}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>5 km</span>
                        <span>200 km</span>
                      </div>
                      {(!teacher?.latitude || !teacher?.longitude) && (
                        <p className="text-xs text-yellow-600 mt-2">
                          ⚠️ Login and set your location in profile for location-based search
                        </p>
                      )}
                    </div>

                    {/* Apply Filters Button */}
                    <Button
                      onClick={handleApplyFilters}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Apply Filters
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Results Summary */}
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">
                  Showing {paginatedJobs.length} of {filteredJobs.length} jobs
                </p>
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  Page {currentPage} of {totalPages}
                </Badge>
              </div>

              {/* Job Cards */}
              <div className="gap-4 grid">
                {paginatedJobs.map((job) => (
                  <Card
                    key={job.id}
                    onClick={() => handleJobClick(job.id)}
                    className="bg-card hover:bg-blue-50 shadow-md p-4 border-border rounded-xl transition-colors hover:cursor-pointer"
                  >
                    <CardHeader>
                      <div className="flex md:flex-row flex-col md:justify-between md:items-start gap-6">
                        <div className="flex-1">
                          <h3 className="mb-3 font-bold text-card-foreground text-2xl leading-tight">
                            {job.subjects || 'Subject not specified'}
                          </h3>

                          <p className="mb-4 text-muted-foreground text-base leading-relaxed">
                            {`${job.grade} ${job.board} - ${job.subjects || 'Subject not specified'}`}
                          </p>

                          <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{job.area}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{job.learner_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{job.learner_phone}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <Badge className="bg-primary shadow px-3 py-1 rounded-lg text-primary-foreground text-sm">
                            {job.mode_of_teaching || 'Teaching mode not specified'}
                          </Badge>
                          <div className="space-y-1 text-muted-foreground text-xs text-right">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Created: {formatDate(job.created_at)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Posted: {formatDate(job.created_at)}
                            </div>
                          </div>
                          <div className="mt-4">
                            <SocialShare 
                              job={job}
                              title={`${job.subjects} in ${job.area}`}
                            />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-secondary hover:bg-accent border-border text-secondary-foreground"
                  >
                    <ChevronLeft className="mr-1 w-4 h-4" />
                    Previous
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
                          className={
                            currentPage === pageNum
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary border-border text-secondary-foreground hover:bg-accent"
                          }
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
                    className="bg-secondary hover:bg-accent border-border text-secondary-foreground"
                  >
                    Next
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* No Results */}
              {filteredJobs.length === 0 && (
                <Card className="bg-card border-border">
                  <CardContent className="py-12 text-center">
                    <Search className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
                    <h3 className="mb-2 font-semibold text-card-foreground text-lg">No jobs found</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria or filters to find more results.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}