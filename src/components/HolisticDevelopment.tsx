"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCourses, Course } from "@/hooks/useCourses";
import CourseEnrollmentDialog from "./CourseEnrollmentDialog";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/authUtils";
import axios from "axios";
import { toast } from "sonner";

const HolisticDevelopment = () => {
  const { courses, loading, error } = useCourses();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const [enrollLoading, setEnrollLoading] = useState(false);

  // On mount, check if a pending course enrollment exists after login/signup
  useEffect(() => {
    if (isAuthenticated() && typeof window !== 'undefined') {
      const pendingCourseId = localStorage.getItem('pendingCourseId');
      if (pendingCourseId) {
        const courseToEnroll = courses.find(c => String(c.c_id) === String(pendingCourseId));
        if (courseToEnroll) {
          (async () => {
            setEnrollLoading(true);
            try {
              const apiUrl = process.env.NEXT_PUBLIC_GO_APP_URL || 'https://api.tutorschool.in';
              await axios.post(
                `${apiUrl}/parent/enroll-course`,
                { course_id: courseToEnroll.c_id },
                {
                  headers: {
                    authorization: `bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)jwt_Token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
                  }
                }
              );
              toast.success(`Congratulations! You have enrolled in ${courseToEnroll.c_name}`);
              localStorage.removeItem('pendingCourseId');
              router.push("/dashboard/parent");
            } catch (error: any) {
              toast.error(error?.response?.data?.message || "Enrollment failed. Please try again.");
              localStorage.removeItem('pendingCourseId');
            } finally {
              setEnrollLoading(false);
            }
          })();
        } else {
          localStorage.removeItem('pendingCourseId');
        }
      }
    }
  }, [courses]);

  // Number of courses to show at once
  const coursesPerView = 4;
  const totalSlides = Math.max(0, courses.length - coursesPerView + 1);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  
  // Helper function to format duration from minutes to readable format
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };
  
  // Helper function to get level color
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'text-green-600 border-green-200';
      case 'intermediate':
        return 'text-yellow-600 border-yellow-200';
      case 'advanced':
        return 'text-red-600 border-red-200';
      default:
        return 'text-blue-600 border-blue-200';
    }
  };

  if (loading) {
    return (
      <section id="courses" className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-2">Holistic Development</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Beyond Academics
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive skill development programs for students and professional growth opportunities for tutors
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="courses" className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-2">Holistic Development</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Beyond Academics
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive skill development programs for students and professional growth opportunities for tutors
            </p>
          </div>
          <div className="text-center text-red-600">
            <p>Failed to load courses. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section id="courses" className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-2">Holistic Development</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Beyond Academics
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive skill development programs for students and professional growth opportunities for tutors
            </p>
          </div>
          <div className="text-center text-muted-foreground">
            <p>No courses available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="courses" className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">Holistic Development</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Beyond Academics
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive skill development programs for students and professional growth opportunities for tutors
          </p>
        </div>
        
        <div className="relative">
          {/* Navigation buttons - only show if more than 4 courses */}
          {courses.length > coursesPerView && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white"
                onClick={prevSlide}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white"
                onClick={nextSlide}
                disabled={currentIndex >= totalSlides - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {/* Courses container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / coursesPerView)}%)`,
                width: `${(courses.length / coursesPerView) * 100}%`
              }}
            >
              {courses.map((course, index) => (
                <div
                  key={course.c_id}
                  className="w-full px-3"
                  style={{ width: `${100 / courses.length}%` }}
                >
                  <Dialog open={dialogOpen && selectedCourse?.c_id === course.c_id} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) setSelectedCourse(null);
                  }}>
                    <DialogTrigger asChild>
                      <Card
                        className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/90 backdrop-blur-sm border-2 hover:border-primary/30 h-full"
                        onClick={() => {
                          setSelectedCourse(course);
                          setDialogOpen(true);
                        }}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={course.c_image}
                            alt={course.c_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/gita-course.jpg';
                            }}
                          />
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 backdrop-blur-sm bg-white/90 ${getLevelColor(course.c_level)}`}>
                              {course.c_level}
                            </span>
                          </div>
                        </div>
                        <CardContent className="pt-4">
                          <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                            {course.c_name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {course.c_desc}
                          </p>
                          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(course.c_total_time)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {course.c_participants}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t">
                            <span className="text-sm text-muted-foreground">{course.c_instructor_name}</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-semibold">({course.c_rating || 'New'})</span>
                            </div>
                          </div>
                          {course.c_total_price > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-primary">
                                  {course.c_currency} {course.c_total_price}
                                </span>
                                {course.c_discount > 0 && (
                                  <span className="text-sm text-green-600 font-medium">
                                    {course.c_discount}% OFF
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          {course.c_total_price === 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <span className="text-lg font-bold text-green-600">Free</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{selectedCourse?.c_name}</DialogTitle>
                        <DialogDescription>{selectedCourse?.c_desc}</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{selectedCourse && formatDuration(selectedCourse.c_total_time)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{selectedCourse?.c_participants}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 backdrop-blur-sm bg-white/90 ${selectedCourse ? getLevelColor(selectedCourse.c_level) : ''}`}>
                            {selectedCourse?.c_level}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Instructor: {selectedCourse?.c_instructor_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">({selectedCourse?.c_rating || 'New'})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedCourse?.c_total_price > 0 ? (
                            <span className="text-lg font-bold text-primary">
                              {selectedCourse?.c_currency} {selectedCourse?.c_total_price}
                            </span>
                          ) : (
                            <span className="text-lg font-bold text-green-600">Free</span>
                          )}
                          {selectedCourse?.c_discount > 0 && (
                            <span className="text-sm text-green-600 font-medium">
                              {selectedCourse?.c_discount}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          className="w-full"
                          onClick={() => {
                            window.location.href = '/select-role';
                          }}
                        >
                          Enroll Now
                        </Button>
                        <DialogClose asChild>
                          <Button variant="outline" className="w-full mt-2">Cancel</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                    {showLoginDialog && selectedCourse && (
                      <CourseEnrollmentDialog
                        courseId={selectedCourse.c_id}
                        courseData={selectedCourse}
                        onClose={() => setShowLoginDialog(false)}
                      />
                    )}
                  </Dialog>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots indicator - only show if more than 4 courses */}
          {courses.length > coursesPerView && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HolisticDevelopment;
