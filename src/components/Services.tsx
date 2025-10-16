import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, User, Award, Clock } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: BookOpen,
      title: "All Subjects Covered",
      description: "Math, Science, English, Social Studies, and more - expert tutors for every subject from Class 1 to 12"
    },
    {
      icon: User,
      title: "Personalized Learning",
      description: "One-on-one attention tailored to your child's learning pace, style, and academic goals"
    },
    {
      icon: Award,
      title: "Board Exam Excellence",
      description: "Specialized coaching for CBSE, ICSE, and State Board exams with proven success strategies"
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Choose convenient time slots that fit your family's schedule - weekdays or weekends"
    }
  ];
  
  return (
    <section className="py-20 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">Our Services</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose TutorSchool?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We connect students with the best tutors to ensure academic success and confidence
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-xl duration-300 bg-white/90 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
