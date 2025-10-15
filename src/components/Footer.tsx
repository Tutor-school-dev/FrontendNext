import Image from "next/image";
import tutorSchoolLogo from "@/assets/tutorschool.jpeg";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src={tutorSchoolLogo} 
                alt="TutorSchool Logo" 
                className="h-8 w-8 rounded-sm object-contain"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold">TutorSchool</span>
            </div>
            <p className="text-sm text-background/70">
              Empowering students and tutors to achieve academic excellence together.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Students</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-primary transition-colors">Find Tutors</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">All Subjects</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Tutors</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-primary transition-colors">Become a Tutor</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Resources</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 pt-8 text-center text-sm text-background/70">
          <p>&copy; 2025 TutorSchool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
