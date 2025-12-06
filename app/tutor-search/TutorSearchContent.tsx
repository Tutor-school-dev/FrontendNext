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

export default function TutorSearchContent() {
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
        setCurrentPage(1); // Reset to first page when filters change
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };

    fetchTutors();
  }, [searchTutors]);

  const handleFilterChange = (key: keyof TutorSearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (value && value.trim()) params.set(key, value);
    });
    
    router.push(`/tutor-search?${params.toString()}`);
  };

  const clearFilters = () => {
    const clearedFilters = {
      subjects: '',
      mode_of_teaching: 'BOTH' as any,
      city: '',
      area: '',
      class_level: '',
    };
    setFilters(clearedFilters);
    router.push('/tutor-search');
  };

  const handleContactTutor = (tutor: Tutor) => {
    // Handle tutor contact logic
    console.log('Contact tutor:', tutor);
  };

  const handleSaveToFavorites = (tutor: Tutor) => {
    // Handle save to favorites logic
    console.log('Save to favorites:', tutor);
  };

  const paginatedTutors = tutors.slice(
    (currentPage - 1) * TUTORS_PER_PAGE,
    currentPage * TUTORS_PER_PAGE
  );

  const totalPages = Math.ceil(tutors.length / TUTORS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.back()}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Find Tutors</h1>
                <p className="text-sm text-gray-600">
                  {total} tutors found
                  {selectedEducationLevel && ` for ${selectedEducationLevel.label}`}
                  {selectedCity && ` in ${selectedCity.name}`}
                  {selectedArea && `, ${selectedArea.name}`}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subject Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Subject
                  </label>
                  <Select value={filters.subjects} onValueChange={(value) => handleFilterChange('subjects', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Subjects</SelectItem>
                      {getAllSubjects().map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Education Level Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Education Level
                  </label>
                  <Select value={filters.class_level} onValueChange={(value) => handleFilterChange('class_level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="">All Levels</SelectItem>
                      {EDUCATION_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mode of Teaching Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Teaching Mode
                  </label>
                  <Select value={filters.mode_of_teaching} onValueChange={(value) => handleFilterChange('mode_of_teaching', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BOTH">Both Online & Offline</SelectItem>
                      <SelectItem value="ONLINE">Online Only</SelectItem>
                      <SelectItem value="OFFLINE">Offline Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    City
                  </label>
                  <Select value={filters.city} onValueChange={(value) => handleFilterChange('city', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Cities</SelectItem>
                      {Object.values(CITY_DATA).map((city) => (
                        <SelectItem key={city.slug} value={city.slug}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Area Filter (only show if city is selected) */}
                {filters.city && selectedCity && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Area
                    </label>
                    <Select value={filters.area} onValueChange={(value) => handleFilterChange('area', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Areas</SelectItem>
                        {selectedCity.areas.map((area) => (
                          <SelectItem key={area.slug} value={area.slug}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error: {error}</p>
              </div>
            ) : tutors.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <Users className="h-full w-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search filters to find more tutors.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Active Filters */}
                {(filters.subjects || filters.class_level || filters.city || filters.area || filters.mode_of_teaching !== 'BOTH') && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-gray-600 mr-2">Active filters:</span>
                      {filters.subjects && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {filters.subjects}
                          <button onClick={() => handleFilterChange('subjects', '')}>×</button>
                        </Badge>
                      )}
                      {filters.class_level && selectedEducationLevel && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {selectedEducationLevel.label}
                          <button onClick={() => handleFilterChange('class_level', '')}>×</button>
                        </Badge>
                      )}
                      {filters.city && selectedCity && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {selectedCity.name}
                          <button onClick={() => handleFilterChange('city', '')}>×</button>
                        </Badge>
                      )}
                      {filters.area && selectedArea && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {selectedArea.name}
                          <button onClick={() => handleFilterChange('area', '')}>×</button>
                        </Badge>
                      )}
                      {filters.mode_of_teaching !== 'BOTH' && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {filters.mode_of_teaching}
                          <button onClick={() => handleFilterChange('mode_of_teaching', 'BOTH')}>×</button>
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Tutors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {paginatedTutors.map((tutor) => (
                    <TutorCard
                      key={tutor.id}
                      tutor={tutor}
                      onContact={handleContactTutor}
                      onSaveToFavorites={handleSaveToFavorites}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}