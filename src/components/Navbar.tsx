import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">TutorBuddy</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#courses" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Courses
            </a>
            <a href="#parents" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              For Parents
            </a>
            <a href="#teachers" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              For Teachers
            </a>
            <a href="#schools" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              For Schools
            </a>
            <a href="#ai" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              AI Features
            </a>
            <a href="#tutors" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              For Tutors
            </a>
          </div>
          
          <Button className="rounded-full font-semibold">
            Book Demo
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
