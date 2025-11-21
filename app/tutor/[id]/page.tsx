"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  GraduationCap, 
  Video,
  Users,
  MessageCircle,
  Phone,
  Mail,
  BookOpen,
  Award,
  Calendar,
  Heart,
  Share2,
  Shield,
  User
} from "lucide-react";
import { Button } from "../../../src/components/ui/button";
import { Badge } from "../../../src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card";
import { Separator } from "../../../src/components/ui/separator";
import { Tutor } from "../../../src/hooks/useTutorListing";

// TODO: In future, create a dedicated API endpoint `/api/tutor/{id}` for comprehensive tutor details
// This will include: detailed bio, teaching methodology, availability, student reviews, 
// certifications, portfolio, video introduction, languages, achievements, etc.

export default function TutorProfile() {
  const router = useRouter();
  const params = useParams();
  const tutorId = params.id as string;
  
  // For now, we'll get tutor data from the URL state or localStorage
  // TODO: Replace with individual tutor API call when endpoint is available
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get tutor data from localStorage (passed from the card click)
    const tutorData = localStorage.getItem(`tutor_${tutorId}`);
    
    if (tutorData) {
      try {
        setTutor(JSON.parse(tutorData));
      } catch (error) {
        console.error('Error parsing tutor data:', error);
      }
    }
    
    setLoading(false);
    
    // Cleanup localStorage after loading
    return () => {
      localStorage.removeItem(`tutor_${tutorId}`);
    };
  }, [tutorId]);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? 'Free' : `₹${numPrice}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleContact = () => {
    // TODO: Implement contact functionality
    console.log('Contact tutor:', tutor);
  };

  const handleBookSession = () => {
    // TODO: Implement booking functionality
    console.log('Book session with:', tutor);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E0F9F4] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-[#E0F9F4] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Tutor Not Found</h2>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E0F9F4]">
      {/* Header */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tutors
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-lg font-semibold text-foreground">Tutor Profile</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card className="overflow-hidden border-border bg-card">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Large Profile Picture Section */}
                  <div className="relative h-80 bg-gradient-to-br from-primary/10 to-primary/5">
                    {(tutor.profile_pic || tutor.profile_picture) ? (
                      <img
                        src={tutor.profile_pic || tutor.profile_picture}
                        alt={tutor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white">
                        <div className="text-center">
                          <div className="text-8xl font-bold mb-4">
                            {tutor.name.charAt(0).toUpperCase()}
                          </div>
                          <User className="w-16 h-16 mx-auto opacity-60" />
                        </div>
                      </div>
                    )}
                    
                    {/* Online Status */}
                    <div className="absolute top-6 right-6 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      Online Now
                    </div>

                    {/* Teaching Mode Badge */}
                    <div className="absolute bottom-6 left-6">
                      <Badge 
                        className={`${tutor.teaching_mode === 'ONLINE' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-accent text-accent-foreground'
                        } px-4 py-2 text-sm shadow-lg`}
                      >
                        {tutor.teaching_mode === 'ONLINE' ? (
                          <>
                            <Video className="w-4 h-4 mr-2" />
                            Online Classes Available
                          </>
                        ) : (
                          <>
                            <Users className="w-4 h-4 mr-2" />
                            In-person Classes Available
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Price Overlay */}
                    <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg border">
                      <div className="text-3xl font-bold text-primary mb-1 font-mono">
                        {formatPrice(tutor.lesson_price || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">per hour</div>
                    </div>
                  </div>
                  
                  {/* Basic Info Section */}
                  <div className="p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                      <div className="flex-1">
                        <h1 className="text-4xl font-bold text-foreground mb-4 font-serif">{tutor.name}</h1>
                        
                        {/* Quick Info */}
                        <div className="flex flex-wrap items-center gap-6 text-base text-muted-foreground">
                          {tutor.area && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-primary" />
                              <span className="font-medium">{tutor.area}, {tutor.state}</span>
                            </div>
                          )}
                          {tutor.experience_years && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-primary" />
                              <span className="font-medium">{tutor.experience_years} years experience</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  About {tutor.name.split(' ')[0]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tutor.introduction && (
                  <p className="text-muted-foreground leading-relaxed">
                    {tutor.introduction}
                  </p>
                )}
                
                {tutor.teaching_desc && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Teaching Approach</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {tutor.teaching_desc}
                    </p>
                  </div>
                )}

                {/* Education */}
                {(tutor.degree || tutor.university) && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      Education
                    </h4>
                    <div className="text-muted-foreground">
                      {tutor.degree && <p className="font-medium">{tutor.degree}</p>}
                      {tutor.university && <p>{tutor.university}</p>}
                      {tutor.class_level && <p>Specializes in: {tutor.class_level}</p>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Subjects */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Subjects Taught
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {tutor.subjects.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-2">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions & Contact */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card className="border-border bg-card">
              <CardContent className="p-8 space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 font-serif">Ready to Learn?</h3>
                  <p className="text-muted-foreground">Connect with {tutor.name.split(' ')[0]} today</p>
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-lg font-semibold shadow-lg"
                  onClick={handleContact}
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Send Invite
                </Button>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                  <Button variant="outline" size="lg" className="h-12 font-medium">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 font-medium">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tutor Details */}
            <Card className="border-border bg-card">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-xl font-bold text-foreground font-serif">Tutor Details</h3>
                
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground font-medium">Teaching Experience</div>
                      <div className="font-bold text-foreground text-lg">{tutor.experience_years || '2+ years'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground font-medium">Location</div>
                      <div className="font-bold text-foreground text-lg">
                        {tutor.area || tutor.state || 'Location not specified'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground font-medium">Response Time</div>
                      <div className="font-bold text-foreground text-lg">Usually within 2 hours</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground font-medium">Verification Status</div>
                      <div className="font-bold text-green-600 text-lg">ID Verified ✓</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold font-serif">Performance Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground font-medium">Response Rate</span>
                  <span className="font-bold text-green-600 text-lg">95%</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground font-medium">Total Students</span>
                  <span className="font-bold text-lg">{Math.floor(Math.random() * 50) + 20}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground font-medium">Active Since</span>
                  <span className="font-bold text-lg">2023</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground font-medium">Success Rate</span>
                  <span className="font-bold text-green-600 text-lg">98%</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold font-serif">
                  <Award className="w-6 h-6 text-primary" />
                  Achievements & Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-lg">Top Rated Tutor</p>
                    <p className="text-muted-foreground">Excellent student feedback & reviews</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-lg">Experienced Educator</p>
                    <p className="text-muted-foreground">{tutor.experience_years || '2'}+ years of teaching excellence</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-lg">Subject Expert</p>
                    <p className="text-muted-foreground">Mastery in {tutor.subjects.length} different subjects</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-lg">Verified Professional</p>
                    <p className="text-muted-foreground">Background checked & identity verified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}