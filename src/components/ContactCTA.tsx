import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, School } from "lucide-react";

const ContactCTA = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Take The First Step Today
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
          <Card className="border-2 hover:border-primary/50 transition-all">
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
          
          <Card className="border-2 hover:border-primary/50 transition-all">
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
        
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Have questions? Call us at <a href="tel:9942012342" className="font-semibold text-primary hover:underline">99420-12342</a></p>
          <p className="text-sm text-muted-foreground">Monday - Saturday: 9:00 AM - 7:00 PM IST</p>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
