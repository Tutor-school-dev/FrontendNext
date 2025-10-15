import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Video, Users } from "lucide-react";

const ForSchools = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Save Time with Pre-Trained Teachers",
      description: "Hire verified, experienced, and qualified teachers who are ready to step into classrooms."
    },
    {
      icon: Video,
      title: "Hire Confidently with Video Profiles",
      description: "Assess teaching style, communication skills, and classroom presence through detailed video profiles before interviewing."
    },
    {
      icon: Users,
      title: "Long-Term, Committed Educators for Your School",
      description: "Connect with teachers committed to long-term placements and reduce staff turnover."
    }
  ];
  
  return (
    <section id="schools" className="py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">For Educational Institutions</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How TutorSchool Helps Schools
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            TutorSchool helps schools access a diverse pool of highly qualified teachers. TutorSchool Teachers undergo rigorous quality checks and comprehensive cultural training to ensure seamless integration into classrooms.
          </p>
        </div>
        
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Benefits of Hiring From TutorSchool</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardContent className="pt-6 text-center">
                    <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-foreground mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        
        <div className="text-center">
          <Button size="lg" className="rounded-full font-semibold">
            Partner With TutorSchool
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ForSchools;
