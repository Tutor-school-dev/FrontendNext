"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Star } from "lucide-react";
import Image from "next/image";

const Hero = () => {
  const scrollToNext = () => {
    const aboutSection = document.getElementById("about");
    aboutSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/hero-meditation.jpg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-pink-50/50 to-white/60" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 text-4xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>🌸</div>
      <div className="absolute top-32 right-20 text-4xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}>🪷</div>
      <div className="absolute bottom-40 left-20 text-3xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>✨</div>
      <div className="absolute bottom-32 right-32 text-3xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }}>⭐</div>
      
      <div className="container mx-auto px-4 py-32 relative z-10 mt-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-primary/30 shadow-lg animate-scale-in">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-primary font-semibold">Global Competition</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary via-pink-500 to-purple-600 leading-tight">
            Gitopadesh
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground/90">
            Global Sloka Competition
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of students worldwide in reciting the sacred slokas of the Bhagavad Gita. 
            Experience spiritual growth while competing for amazing prizes!
          </p>
          
          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              size="lg" 
              onClick={() => scrollToSection('registration-form')}
              className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Register Now - It's Free!
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={scrollToNext}>
        <ChevronDown className="w-8 h-8 text-primary" />
      </div>
    </section>
  );
};

export default Hero;