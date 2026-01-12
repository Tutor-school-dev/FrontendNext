"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Star, CheckCircle, Video, Users, Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTutorSearch, TutorSearchFilters } from "@/hooks/useTutorSearch";
import { Tutor } from "@/hooks/useTutorListing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllSubjects } from "@/lib/subjects";
import { EDUCATION_LEVELS } from "@/lib/educationLevels";
import { CITY_DATA, getCityBySlug } from "@/lib/cityData";

const TUTORS_PER_PAGE = 10;

interface TutorSearchContentNewProps {
  citySlug?: string;
  areaSlug?: string;
}

export default function TutorSearchContentNew({ citySlug, areaSlug }: TutorSearchContentNewProps) {
  const searchParams = useSearchParams();
  const { searchTutors, loading, error } = useTutorSearch();
  
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get initial search parameters with proper city/area handling
  const [filters, setFilters] = useState<TutorSearchFilters>({
    subjects: searchParams.get('subjects') || '',
    mode_of_teaching: (searchParams.get('mode_of_teaching') as any) || '',
    class_level: searchParams.get('class_level') || '',
    city: citySlug || '',
    area: (areaSlug && areaSlug !== 'all') ? areaSlug : '',
  });

  // Update filters when props change (e.g., navigation between areas)
  useEffect(() => {
    console.log('Props changed:', { citySlug, areaSlug });
    setFilters(prev => ({
      ...prev,
      city: citySlug || '',
      area: (areaSlug && areaSlug !== 'all') ? areaSlug : '',
    }));
  }, [citySlug, areaSlug]);
  
  console.log('TutorSearchContentNew rendering with props:', { citySlug, areaSlug });
  const cityData = citySlug ? getCityBySlug(citySlug) : null;
  console.log('cityData:', cityData);
  const areaData = areaSlug && areaSlug !== 'all' && cityData ? cityData.areas.find(a => a.slug === areaSlug) : null;
  console.log('areaData:', areaData, 'looking for:', areaSlug);
  const cityName = cityData?.name || "Bangalore";
  // Only show area name if we have valid area data, otherwise show city name
  const areaName = areaData?.name || cityName;
  // For display: show area if available, otherwise just city
  const locationDisplayName = areaData ? `${areaData.name}, ${cityName}` : cityName;
  console.log('Display values:', { cityName, areaName, locationDisplayName });

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "TutorSchool",
    "description": `Find qualified home tutors in ${locationDisplayName}. Verified teachers for Class 1-10.`,
    "url": `https://tutorschool.in/${citySlug}/tutors-in-${areaSlug}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": areaData?.name || cityName,
      "addressRegion": cityName,
      "addressCountry": "IN"
    },
    "areaServed": {
      "@type": "City",
      "name": cityName
    },
    "offers": {
      "@type": "Offer",
      "category": "Educational Services",
      "priceRange": "₹300-₹1500 per hour"
    }
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://tutorschool.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": cityName,
        "item": `https://tutorschool.in/${citySlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": areaData ? `Tutors in ${areaData.name}` : "All Tutors",
        "item": `https://tutorschool.in/${citySlug}/tutors-in-${areaSlug}`
      }
    ]
  };

  // Fetch tutors when filters change
  useEffect(() => {
    let isMounted = true;
    
    const fetchTutors = async () => {
      try {
        const result = await searchTutors(filters);
        if (isMounted) {
          setTutors(result.tutors);
          setTotal(result.total);
          setCurrentPage(1); // Reset to first page when filters change
        }
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };

    fetchTutors();

    return () => {
      isMounted = false;
    };
  }, [filters.subjects, filters.mode_of_teaching, filters.class_level, filters.city, filters.area]);

  const handleFilterChange = (key: keyof TutorSearchFilters, value: string) => {
    const processedValue = value === 'all' ? '' : value;
    const newFilters = { ...filters, [key]: processedValue };
    console.log('Filter changed:', key, value, newFilters);
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    // Preserve city and area from URL, clear only other filters
    const clearedFilters = {
      subjects: '',
      mode_of_teaching: '' as any,
      class_level: '',
      city: citySlug || '', // Always preserve city from URL
      area: (areaSlug && areaSlug !== 'all') ? areaSlug : '', // Preserve area unless it's 'all'
    };
    console.log('Clearing filters (preserving city/area):', clearedFilters);
    setFilters(clearedFilters);
    setCurrentPage(1); // Reset pagination when clearing filters
    
    // Manually trigger API call to ensure it gets called
    const fetchTutors = async () => {
      try {
        const result = await searchTutors(clearedFilters);
        setTutors(result.tutors);
        setTotal(result.total);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error fetching tutors after clearing filters:', error);
      }
    };
    fetchTutors();
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.subjects) count++;
    if (filters.mode_of_teaching) count++;
    if (filters.class_level) count++;
    if (filters.city) count++;
    if (filters.area) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Pagination
  const totalPages = Math.ceil(tutors.length / TUTORS_PER_PAGE);
  const paginatedTutors = tutors.slice(
    (currentPage - 1) * TUTORS_PER_PAGE,
    currentPage * TUTORS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      <Navbar hideMenuItems={true} />
      
      {/* Hero Section - Simple and Clean */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Find Home Tutors in {locationDisplayName}
          </h1>
          <p className="text-base text-gray-600">
            Connect with experienced tutors for personalized K-10 education. Verified teachers for all subjects at your doorstep.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters} 
                    className="text-sm text-gray-600 hover:text-gray-900"
                    disabled={loading || activeFiltersCount === 0}
                  >
                    {loading ? 'Clearing...' : 'Clear All'}
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Mode Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Mode
                    </label>
                    <Select 
                      value={filters.mode_of_teaching || 'all'} 
                      onValueChange={(value) => handleFilterChange('mode_of_teaching', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Modes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modes</SelectItem>
                        <SelectItem value="ONLINE">Online</SelectItem>
                        <SelectItem value="OFFLINE">Offline</SelectItem>
                        <SelectItem value="BOTH">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Grade Level Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Grade Level
                    </label>
                    <Select 
                      value={filters.class_level || 'all'} 
                      onValueChange={(value) => handleFilterChange('class_level', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        {EDUCATION_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subjects Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Subjects
                    </label>
                    <Select 
                      value={filters.subjects || 'all'} 
                      onValueChange={(value) => handleFilterChange('subjects', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {getAllSubjects().map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>            
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      // Force refresh the search results
                      const fetchTutors = async () => {
                        try {
                          const result = await searchTutors(filters);
                          setTutors(result.tutors);
                          setTotal(result.total);
                          setCurrentPage(1);
                        } catch (error) {
                          console.error('Error fetching tutors:', error);
                        }
                      };
                      fetchTutors();
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Applying...' : 'Apply Filters'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {total} Tutor{total !== 1 ? 's' : ''} Found
              </h2>
              <p className="text-sm text-gray-600">
                in {locationDisplayName}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error: {error}</p>
              </div>
            ) : tutors.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No tutors available in this area
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or check back later.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {paginatedTutors.map((tutor) => (
                  <TutorCardNew key={tutor.id} tutor={tutor} />
                ))}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-10"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Why Choose Section */}
        <WhyChooseSection areaName={locationDisplayName} />

        {/* FAQ Section */}
        <FAQSection areaName={locationDisplayName} />

        {/* Best Tutors Content Section */}
        <BestTutorsSection areaName={locationDisplayName} />
      </div>
      <Footer />
    </div>
  );
}

// New Tutor Card Component
const TutorCardNew: React.FC<{ tutor: Tutor }> = ({ tutor }) => {
  const getInitial = (name: string) => name.charAt(0).toUpperCase();
  
  // Tutor Structured Data
  const tutorStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": tutor.name,
    "jobTitle": "Home Tutor",
    "description": `${tutor.experience_years || 3}+ years experience teaching Class ${tutor.class_level || '1-10'}`,
    "knowsAbout": Array.isArray(tutor.subjects) ? tutor.subjects : [],
    "offers": {
      "@type": "Offer",
      "price": tutor.lesson_price || '500',
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tutor.rating || 4.5,
      "reviewCount": tutor.total_reviews || 50,
      "bestRating": "5",
      "worstRating": "1"
    }
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tutorStructuredData) }}
      />
      <Card className="border border-gray-200 hover:shadow-md transition-all hover:border-gray-300">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {tutor.profile_picture || tutor.profile_pic ? (
              <img
                src={tutor.profile_picture || tutor.profile_pic}
                alt={tutor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                {getInitial(tutor.name)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-semibold">{tutor.name}</h3>
                  {tutor.is_verified && (
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{tutor.rating || 4.5}</span>
                    <span className="ml-1">({tutor.total_reviews || 50})</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  ₹{tutor.lesson_price || '500'}/hour
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              {tutor.experience_years || 3}+ years experience • Class {tutor.class_level || '1-10'}
            </p>

            {/* Subjects */}
            <div className="flex flex-wrap gap-2 mb-3">
              {(Array.isArray(tutor.subjects) ? tutor.subjects : []).slice(0, 3).map((subject, index) => (
                <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                  {subject}
                </Badge>
              ))}
            </div>

            {/* Location and Mode */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{tutor.city || 'Bangalore'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Video className="w-4 h-4" />
                <span>{tutor.mode_of_teaching || 'Both'}</span>
              </div>
              {tutor.availability && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{tutor.availability}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                disabled
                className="flex-1 opacity-50 cursor-not-allowed"
              >
                Contact Tutor
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
};

// Why Choose Section
const WhyChooseSection: React.FC<{ areaName: string }> = ({ areaName }) => {
  const features = [
    {
      icon: Users,
      title: "Experienced Tutors",
      description: "All our tutors are thoroughly vetted with minimum 2+ years of teaching experience."
    },
    {
      icon: Star,
      title: "Personalized Learning",
      description: "One-on-one attention ensures your child learns at their own pace with customized study plans."
    },
    {
      icon: CheckCircle,
      title: "Proven Results",
      description: "95% of our students show significant improvement within the first 3 months."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Choose timings that work best for your family - weekdays, weekends, or evenings."
    },
    {
      icon: CheckCircle,
      title: "Safe & Verified",
      description: "Background-verified tutors with proper documentation for your peace of mind."
    }
  ];

  return (
    <div className="mt-20 mb-16">
      <h2 className="text-3xl font-bold mb-3">
        Why Choose Home Tutors in {areaName}?
      </h2>
      <p className="text-gray-600 mb-10 max-w-3xl">
        Find the perfect tutor for your child's academic success. Our vetted tutors in {areaName} provide personalized education right at your doorstep.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// FAQ Section
const FAQSection: React.FC<{ areaName: string }> = ({ areaName }) => {
  const faqs = [
    {
      question: `How do I find the best tutor for my child in ${areaName}?`,
      answer: "Browse our listings, filter by subject and grade level, read reviews from other parents, and contact tutors directly. All tutors are verified and experienced in teaching K-10 students."
    },
    {
      question: `What subjects do tutors in ${areaName} teach?`,
      answer: "Our tutors cover all major subjects including Mathematics, Science, English, Hindi, Social Studies, and specialized subjects like Computer Science and Environmental Studies for classes 1-10."
    },
    {
      question: "Are online tutoring options available?",
      answer: "Yes! Many of our tutors offer both online and offline sessions. You can filter by mode preference to find tutors who match your requirements."
    },
    {
      question: `How much does home tutoring cost in ${areaName}?`,
      answer: "Tutoring fees typically range from ₹300 to ₹1500 per hour depending on the subject, tutor experience, and class level. Each tutor sets their own rates visible on their profile."
    },
    {
      question: "How can I verify a tutor's credentials?",
      answer: "All tutors on our platform undergo verification. Look for the 'Verified' badge on profiles. You can also view their qualifications, experience, and read reviews from other parents."
    }
  ];

  // FAQ Structured Data for SEO
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="mt-20 mb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <h2 className="text-3xl font-bold mb-3">
        Frequently Asked Questions
      </h2>
      <p className="text-gray-600 mb-10">
        Everything you need to know about finding tutors in {areaName}.
      </p>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <ChevronDown className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Best Home Tutors Section
const BestTutorsSection: React.FC<{ areaName: string }> = ({ areaName }) => {
  return (
    <div className="mt-20 mb-0 bg-gradient-to-b from-gray-50 to-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Best Home Tutors in {areaName}
        </h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 mb-4">
            Looking for qualified home tutors in {areaName}? Our platform connects parents with experienced 
            educators who specialize in teaching students from Class 1 to Class 10. Whether your child needs 
            help with CBSE, ICSE, or State Board curriculum, we have tutors who can provide personalized attention.
          </p>
          <p className="text-gray-700 mb-4">
            {areaName} is known for its family-friendly environment and excellent educational opportunities. 
            Our network of tutors covers all major areas and surrounding neighborhoods. Many parents prefer 
            home tuition in {areaName} for the convenience and safety it offers.
          </p>
          <p className="text-gray-700">
            Our tutors specialize in various subjects including Mathematics, Science, English, Hindi, Social 
            Studies, and more. Whether you're looking for after-school tutoring, exam preparation, or help 
            with homework, our verified tutors are ready to support your child's educational journey.
          </p>
        </div>
      </div>
    </div>
  );
};
