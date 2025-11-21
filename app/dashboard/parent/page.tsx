"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Users as UsersIcon, MessageCircle, GraduationCap, LogOut, Plus, Filter, SlidersHorizontal } from "lucide-react";
import Cookies from "js-cookie";
import useTutorListing, { TutorFilters, Tutor } from "../../../src/hooks/useTutorListing";
import TutorCard from "../../../src/components/TutorCard";
import TutorFiltersComponent from "../../../src/components/TutorFilters";
import Pagination from "../../../src/components/Pagination";
import { Button } from "../../../src/components/ui/button";
import { Badge } from "../../../src/components/ui/badge";

const TUTORS_PER_PAGE = 12;

export default function ParentDashboard() {
  const router = useRouter();
  const { tutors, loading, error, total, fetchTutors } = useTutorListing();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TutorFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const authToken = Cookies.get("jwt_Token");
    if (!authToken) {
      router.push("/auth?model=parent");
      return;
    }

    // Load initial tutors
    fetchTutors();
  }, []);

  const totalPages = Math.ceil(tutors.length / TUTORS_PER_PAGE);
  const startIndex = (currentPage - 1) * TUTORS_PER_PAGE;
  const paginatedTutors = tutors.slice(startIndex, startIndex + TUTORS_PER_PAGE);

  const handleFiltersChange = (newFilters: TutorFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchTutors(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactTutor = (tutor: Tutor) => {
    console.log('Contact tutor:', tutor);
  };

  const handleSaveToFavorites = (tutor: Tutor) => {
    console.log('Save to favorites:', tutor);
  };

  const handleLogout = () => {
    Cookies.remove("jwt_Token");
    Cookies.remove("refresh_token");
    Cookies.remove("access_hash");
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem("model");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      localStorage.removeItem("Phone");
    }
    
    router.push("/");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.subject && filters.subject.length > 0) count++;
    if (filters.mode_of_teaching) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-[#E0F9F4]">
      {/* Header */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-primary">
                TutorSchool
              </h1>
              
              {/* Stats */}
              <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <UsersIcon className="w-3 h-3 mr-1" />
                  {total} Tutors
                </Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <BookOpen className="w-3 h-3 mr-1" />
                  All Subjects
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/job-listings")}
                className="border-primary/20 text-primary hover:bg-primary/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post Job
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
            <GraduationCap className="w-4 h-4" />
            <span className="text-sm font-medium">Find Your Perfect Match</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Discover Amazing <span className="text-primary">Tutors</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with verified educators who inspire learning and help students achieve their goals. 
            Choose from personalized in-person or flexible online sessions.
          </p>
        </div>

        {/* Filters Toggle & Results */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
            
            <div className="text-sm text-muted-foreground">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                  Loading tutors...
                </div>
              ) : (
                `${tutors.length} tutors available`
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              <Filter className="w-3 h-3 mr-1" />
              Most Relevant
            </Button>
          </div>
        </div>

        {/* Collapsible Filters */}
        {showFilters && (
          <div className="mb-8">
            <TutorFiltersComponent
              onFiltersChange={handleFiltersChange}
              loading={loading}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Finding the best tutors for you...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => fetchTutors(filters)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Try Again
            </Button>
          </div>
        )}

        {/* Tutors Grid */}
        {!loading && !error && (
          <>
            {paginatedTutors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {paginatedTutors.map((tutor) => (
                  <TutorCard
                    key={tutor.id}
                    tutor={tutor}
                    onContact={handleContactTutor}
                    onSaveToFavorites={handleSaveToFavorites}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No tutors found</h3>
                <p className="text-muted-foreground mb-6">
                  {Object.keys(filters).length > 0
                    ? 'Try adjusting your filters to see more results'
                    : 'No tutors are currently available'}
                </p>
                {Object.keys(filters).length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({});
                      fetchTutors();
                    }}
                    className="border-primary/20 text-primary hover:bg-primary/10"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={loading}
              />
            )}
          </>
        )}

        {/* CTA Section */}
        {!loading && paginatedTutors.length > 0 && (
          <div className="mt-16 bg-card border border-border rounded-2xl p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Looking for something specific?
              </h3>
              <p className="text-muted-foreground mb-8">
                Can't find the perfect tutor? Post your requirements and let qualified educators reach out to you directly.
              </p>
              <Button
                size="lg"
                onClick={() => router.push("/job-listings")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Post Your Learning Needs
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}