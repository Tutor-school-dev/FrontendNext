import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, School, Phone, Mail, MapPin } from "lucide-react";

const ContactCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Take The First Step Today
          </h2>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-6">Contact Us</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="pt-8 text-center">
              <GraduationCap className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">For Teachers</h3>
              <h4 className="text-lg font-semibold text-foreground mb-3">
                Achieve professional and financial growth in teaching.
              </h4>
              <p className="text-muted-foreground mb-6">
                Join our community of educators and unlock new opportunities to grow your career while earning what you deserve.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="rounded-full">Request a Callback</Button>
                <Button size="lg" variant="outline" className="rounded-full">Learn More</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="pt-8 text-center">
              <School className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">For Schools</h3>
              <h4 className="text-lg font-semibold text-foreground mb-3">
                Find and hire skill-verified teachers from TutorSchool.
              </h4>
              <p className="text-muted-foreground mb-6">
                Access a curated pool of qualified, trained, and committed educators ready to make an impact in your classrooms.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="rounded-full">Book a Meeting</Button>
                <Button size="lg" variant="outline" className="rounded-full">Learn More</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-lg mb-6">
            Have questions? Call us at{" "}
            <a 
              href="tel:9942012342" 
              className="font-semibold text-primary hover:underline"
            >
              99420-12342
            </a>
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Monday - Saturday: 9:00 AM - 7:00 PM IST
          </p>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto border-2 border-primary/10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold text-foreground">TutorSchool</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Connecting students with expert tutors for academic excellence and personalized learning.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Phone className="h-6 w-6 text-primary" />
                <p className="font-semibold text-foreground">99420-12342</p>
                <p className="text-sm text-muted-foreground">Mon-Sat, 9AM-7PM</p>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                <p className="font-semibold text-foreground">info@tutorschool.in</p>
                <p className="text-sm text-muted-foreground">24/7 Email Support</p>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                <p className="font-semibold text-foreground">Nationwide Service</p>
                <p className="text-sm text-muted-foreground">Available across India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
