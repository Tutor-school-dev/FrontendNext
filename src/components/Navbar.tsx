"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import tutorSchoolLogo from "@/assets/tutorschool.jpeg";

const Navbar = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image 
              src={tutorSchoolLogo} 
              alt="TutorSchool Logo" 
              className="h-8 w-8 rounded-sm object-contain"
              width={32}
              height={32}
            />
            <span className="text-xl font-bold text-foreground">TutorSchool</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('courses')}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Courses
            </button>
            <button 
              onClick={() => scrollToSection('parents')}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              For Parents
            </button>
            <button 
              onClick={() => scrollToSection('teachers')}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              For Teachers
            </button>
            <button 
              onClick={() => scrollToSection('schools')}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              For Schools
            </button>
            <button 
              onClick={() => scrollToSection('ai')}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              AI Features
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => scrollToSection('tutors')}
              className="px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-full hover:bg-primary/10 transition-all duration-200 hover:border-primary/50"
            >
              For Tutors
            </button>
            <Button className="rounded-full font-semibold">
              Book Demo Classes
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
