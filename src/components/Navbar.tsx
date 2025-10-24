"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import tutorSchoolLogo from "@/assets/tutorschool.jpeg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    console.log('Scrolling to section:', sectionId);
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
    
    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      console.log('Element found:', element);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        console.warn(`Element with id "${sectionId}" not found`);
        // Try again after a short delay
        setTimeout(() => {
          const retryElement = document.getElementById(sectionId);
          if (retryElement) {
            console.log('Element found on retry:', retryElement);
            retryElement.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      }
    }, 10);
  };

  const handleExternalLink = (url: string) => {
    setIsMobileMenuOpen(false);
    window.open(url, '_blank');
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
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
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
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
            <a 
              href="/job-listings"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Job Listings
            </a>
            <button 
              onClick={() => handleExternalLink('https://tutorschool.in/blog')}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Blogs
            </button>
          </div>
          
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => window.location.href = '/select-role'}
              className="px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-full hover:bg-primary/10 transition-all duration-200 hover:border-primary/50"
            >
              For Tutors
            </button>
            <Button 
              className="rounded-full font-semibold text-sm px-4 py-2"
              onClick={() => window.location.href = '/select-role'}
            >
              Book Demo
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => scrollToSection('courses')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              >
                Courses
              </button>
              <button 
                onClick={() => scrollToSection('parents')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              >
                For Parents
              </button>
              <button 
                onClick={() => scrollToSection('teachers')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              >
                For Teachers
              </button>
              <button 
                onClick={() => scrollToSection('schools')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              >
                For Schools
              </button>
              <button 
                onClick={() => scrollToSection('ai')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              >
                AI Features
              </button>
              <button 
                onClick={() => handleExternalLink('https://tutorschool.in/blog')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              >
                Blogs
              </button>
              
              {/* Mobile Action Buttons */}
              <div className="pt-4 pb-2 space-y-2">
                <button 
                  onClick={() => handleExternalLink('https://app.tutorschool.in')}
                  className="block w-full px-3 py-2 text-center text-sm font-medium text-primary border border-primary/30 rounded-full hover:bg-primary/10 transition-all duration-200"
                >
                  For Tutors
                </button>
                <Button 
                  className="w-full rounded-full font-semibold"
                  onClick={() => window.location.href = '/select-role'}
                >
                  Book Demo Classes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
