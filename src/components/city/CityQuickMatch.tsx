"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { City } from '@/lib/cityData';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { EDUCATION_LEVELS, getAllCategories } from '@/lib/educationLevels';
import { SUBJECTS, getAllSubjects } from '@/lib/subjects';

interface CityQuickMatchProps {
  city: City;
}

export default function CityQuickMatch({ city }: CityQuickMatchProps) {
  const router = useRouter();
  const [selectedEducationLevel, setSelectedEducationLevel] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ANY_SUBJECT');
  const [selectedMode, setSelectedMode] = useState('BOTH');
  const [selectedArea, setSelectedArea] = useState('ANY_AREA');

  const handleGetTutorOptions = () => {
    const params = new URLSearchParams();
    
    // Add city parameter
    params.set('city', city.slug);
    
    // Add other parameters if selected and not 'ANY_' values
    if (selectedEducationLevel && selectedEducationLevel.trim() && selectedEducationLevel !== 'ANY_LEVEL') {
      params.set('class_level', selectedEducationLevel);
    }
    
    if (selectedSubject && selectedSubject.trim() && selectedSubject !== 'ANY_SUBJECT') {
      params.set('subjects', selectedSubject);
    }
    
    if (selectedMode && selectedMode !== 'BOTH') {
      params.set('mode_of_teaching', selectedMode);
    }
    
    if (selectedArea && selectedArea.trim() && selectedArea !== 'ANY_AREA') {
      params.set('area', selectedArea);
    }
    
    // Navigate to tutor search results
    router.push(`/tutor-search?${params.toString()}`);
  };

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Quick Match in {city.name}
          </h2>
          <p className="text-lg text-gray-600">
            Tell us what you need. We'll send 3–5 best-fit tutor options within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Left side - Form */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Educational Level</label>
                    <Select value={selectedEducationLevel} onValueChange={setSelectedEducationLevel}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Level" />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {getAllCategories().map((category) => (
                          <div key={category}>
                            <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                              {category}
                            </div>
                            {EDUCATION_LEVELS
                              .filter(level => level.category === category)
                              .map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{level.label}</span>
                                    <span className="text-xs text-gray-500">{level.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Any" />
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                    <Select value={selectedMode} onValueChange={setSelectedMode}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Both Online & Offline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BOTH">Both Online & Offline</SelectItem>
                        <SelectItem value="OFFLINE">Home Tutor (In-Person)</SelectItem>
                        <SelectItem value="ONLINE">Online Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area / Locality</label>
                    <Select value={selectedArea} onValueChange={setSelectedArea}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ANY_AREA">Any Area</SelectItem>
                        {city.areas.map((area) => (
                          <SelectItem key={area.slug} value={area.slug}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-lg text-gray-600">
                    Fees per hour (approx): <span className="font-semibold text-blue-600">₹350 – ₹900</span>
                  </p>
                </div>

                <div className="text-center">
                  <Button 
                    size="lg" 
                    className="text-lg px-12 py-4 h-14"
                    onClick={handleGetTutorOptions}
                  >
                    Get Tutor Options
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Illustration/Image */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-blue-200 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Find Perfect Match
              </h3>
              <p className="text-gray-600 text-sm">
                Get matched with verified tutors in {city.name} based on your specific requirements
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}