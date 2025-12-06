"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Filter, SlidersHorizontal, MapPin, Users, Video, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTutorSearch, TutorSearchFilters } from "@/hooks/useTutorSearch";
import { Tutor } from "@/hooks/useTutorListing";
import TutorCard from "@/components/TutorCard";
import Pagination from "@/components/Pagination";
import { SUBJECTS, getAllSubjects } from "@/lib/subjects";
import { EDUCATION_LEVELS, getEducationLevelByValue } from "@/lib/educationLevels";
import { CITY_DATA } from "@/lib/cityData";

const TUTORS_PER_PAGE = 12;

export default function TutorSearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchTutors, loading, error } = useTutorSearch();
  
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get initial search parameters
  const [filters, setFilters] = useState<TutorSearchFilters>({
    subjects: searchParams.get('subjects') || '',
    mode_of_teaching: (searchParams.get('mode_of_teaching') as any) || 'BOTH',
    city: searchParams.get('city') || '',
    area: searchParams.get('area') || '',
    class_level: searchParams.get('class_level') || '',
  });

  // Get display information
  const selectedEducationLevel = filters.class_level ? getEducationLevelByValue(filters.class_level) : null;
  const selectedCity = filters.city ? Object.values(CITY_DATA).find(city => city.slug === filters.city) : null;
  const selectedArea = filters.area && selectedCity ? selectedCity.areas.find(area => area.slug === filters.area) : null;

  // Fetch tutors when filters change
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const result = await searchTutors(filters);
        setTutors(result.tutors);
        setTotal(result.total);
      } catch (error) {
        console.error('Failed to fetch tutors:', error);
      }
    };

    fetchTutors();
  }, [filters]);

  const handleFilterChange = (key: keyof TutorSearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value.trim()) params.set(key, value);
    });
    
    router.replace(`/tutor-search?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    const clearedFilters = {
      subjects: searchParams.get('subjects') || '',
      city: searchParams.get('city') || '',
      area: searchParams.get('area') || '',
      class_level: searchParams.get('class_level') || '',
      mode_of_teaching: 'BOTH' as const,
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactTutor = (tutor: Tutor) => {
    // TODO: Implement contact functionality
    console.log('Contact tutor:', tutor);
  };

  const handleSaveToFavorites = (tutor: Tutor) => {
    // TODO: Implement favorites functionality  
    console.log('Save to favorites:', tutor);
  };

  const startIndex = (currentPage - 1) * TUTORS_PER_PAGE;
  const endIndex = startIndex + TUTORS_PER_PAGE;
  const currentTutors = tutors.slice(startIndex, endIndex);
  const totalPages = Math.ceil(tutors.length / TUTORS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Tutor Search Results
                </h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  {selectedCity && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedCity.name}
                      {selectedArea && `, ${selectedArea.name}`}
                    </span>
                  )}
                  {selectedEducationLevel && (
                    <Badge variant="outline" className="text-xs">
                      {selectedEducationLevel.label}
                    </Badge>
                  )}
                  {filters.subjects && (
                    <Badge variant="outline" className="text-xs">
                      {filters.subjects}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Filters
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <Select
                    value={filters.subjects || 'ANY_SUBJECT'}
                    onValueChange={(value) => handleFilterChange('subjects', value === 'ANY_SUBJECT' ? '' : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ANY_SUBJECT">Any Subject</SelectItem>
                      {getAllSubjects().map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Teaching Mode Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teaching Mode
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant={filters.mode_of_teaching === 'BOTH' ? "default" : "outline"}
                      onClick={() => handleFilterChange('mode_of_teaching', 'BOTH')}
                      className="justify-start text-sm"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Both Online & Offline
                    </Button>
                    <Button
                      variant={filters.mode_of_teaching === 'ONLINE' ? "default" : "outline"}
                      onClick={() => handleFilterChange('mode_of_teaching', 'ONLINE')}
                      className="justify-start text-sm"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Online Only
                    </Button>
                    <Button
                      variant={filters.mode_of_teaching === 'OFFLINE' ? "default" : "outline"}
                      onClick={() => handleFilterChange('mode_of_teaching', 'OFFLINE')}
                      className="justify-start text-sm"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      In-Person Only
                    </Button>
                  </div>
                </div>

                {/* Education Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education Level
                  </label>
                  <Select
                    value={filters.class_level || 'ANY_LEVEL'}
                    onValueChange={(value) => handleFilterChange('class_level', value === 'ANY_LEVEL' ? '' : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Level" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      <SelectItem value="ANY_LEVEL">Any Level</SelectItem>
                      {EDUCATION_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{level.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  {loading ? (
                    "Searching..."
                  ) : (
                    `Showing ${currentTutors.length} of ${tutors.length} tutors`
                  )}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-80"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* No Results */}
            {!loading && !error && tutors.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No tutors found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search criteria.
                  </p>
                  <Button onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Tutors Grid */}
            {!loading && !error && currentTutors.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentTutors.map((tutor) => (
                  <TutorCard
                    key={tutor.id}
                    tutor={tutor}
                    onContact={handleContactTutor}
                    onSaveToFavorites={handleSaveToFavorites}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}