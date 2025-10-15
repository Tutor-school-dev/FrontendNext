"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, IndianRupee, Calendar, TrendingUp, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { useState } from "react";

interface Opportunity {
  active?: boolean;
  title: string;
  organization: string;
  location: string;
  salary: string;
  duration: string;
  isLoginCard?: boolean;
}

const TutoringOpportunities = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const opportunitiesPerSlide = 4;

  const opportunities: Opportunity[] = [
    {
      active: true,
      title: "Mathematics Tutor Needed",
      organization: "Delhi Public School",
      location: "South Delhi",
      salary: "₹15,000 - 25,000",
      duration: "6 Months"
    },
    {
      active: true,
      title: "Science Teacher - Classes 9-10",
      organization: "FIITJEE Academy",
      location: "Gurugram",
      salary: "₹20,000 - 35,000",
      duration: "1 Year"
    },
    {
      active: false,
      title: "English Language Expert",
      organization: "British Council",
      location: "Mumbai",
      salary: "₹18,000 - 30,000",
      duration: "3 Months"
    },
    {
      active: true,
      title: "Physics Tutor for IIT-JEE",
      organization: "Resonance",
      location: "Bangalore",
      salary: "₹25,000 - 40,000",
      duration: "1 Year"
    },
    {
      active: true,
      title: "Chemistry Tutor Required",
      organization: "Aakash Institute",
      location: "Chennai",
      salary: "₹22,000 - 32,000",
      duration: "8 Months"
    },
    {
      active: true,
      title: "Computer Science Teacher",
      organization: "Coding Ninjas",
      location: "Hyderabad",
      salary: "₹30,000 - 45,000",
      duration: "1 Year"
    },
    {
      active: false,
      title: "History & Social Studies",
      organization: "DPS International",
      location: "Pune",
      salary: "₹16,000 - 28,000",
      duration: "6 Months"
    }
  ];

  const totalSlides = Math.ceil((opportunities.length + 1) / opportunitiesPerSlide); // +1 for login card

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentSlideOpportunities = (): Opportunity[] => {
    const start = currentSlide * opportunitiesPerSlide;
    const end = start + opportunitiesPerSlide;
    const slideOpportunities = opportunities.slice(start, end);
    
    // If we're on the last slide and showing less than 4 items, add the login card
    if (currentSlide === totalSlides - 1 && slideOpportunities.length < opportunitiesPerSlide) {
      slideOpportunities.push({
        isLoginCard: true,
        title: "See More Opportunities",
        organization: "Login Required",
        location: "All Locations",
        salary: "Competitive",
        duration: "Various"
      });
    }
    
    return slideOpportunities;
  };

  return (
    <section className="py-12 bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Tutoring Opportunities
            </h2>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="rounded-full p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-muted-foreground px-3">
                {currentSlide + 1} / {totalSlides}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1}
                className="rounded-full p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[280px]">
          {getCurrentSlideOpportunities().map((opp, index) => {
            if (opp.isLoginCard) {
              return (
                <Card key="login-card" className="bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-2 border-primary/50 relative overflow-hidden">
                  <CardContent className="pt-4 pb-4 text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5"></div>
                    <div className="relative z-10">
                      <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                      
                      <h3 className="font-bold text-base text-foreground mb-2">
                        {opp.title}
                      </h3>
                      
                      <p className="text-xs text-muted-foreground mb-3">
                        Login to see more opportunities
                      </p>
                      
                      <div className="space-y-1 mb-3 opacity-60">
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {opp.location}
                        </div>
                        
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <IndianRupee className="h-3 w-3" />
                          {opp.salary}
                        </div>
                      </div>
                      
                      <Button size="sm" className="w-full rounded-full text-xs">
                        Login to View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            return (
              <Card key={index} className="bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
                <CardContent className="pt-4 pb-4">
                  {opp.active && (
                    <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary text-xs">
                      <TrendingUp className="h-2 w-2 mr-1" />
                      Actively hiring
                    </Badge>
                  )}
                  
                  <h3 className="font-bold text-base text-foreground mb-2">
                    {opp.title}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground mb-3">
                    {opp.organization}
                  </p>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {opp.location}
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <IndianRupee className="h-3 w-3" />
                      {opp.salary}
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {opp.duration}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button variant="link" className="text-primary p-0 h-auto font-semibold text-xs">
                      View details →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="flex justify-center mt-6">
          <Button variant="outline" size="default" className="rounded-full">
            View All Opportunities
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TutoringOpportunities;
