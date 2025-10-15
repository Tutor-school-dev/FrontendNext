import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Brain, GraduationCap } from "lucide-react";

const HolisticDevelopment = () => {
  const programs = [
    {
      icon: BookOpen,
      title: "Bhagavad Gita Lessons for Kids",
      description: "Ancient wisdom simplified for young minds. Teach values, ethics, and life lessons through engaging stories from the Bhagavad Gita."
    },
    {
      icon: Code,
      title: "Basics of Coding",
      description: "Introduce children to programming fundamentals. Learn Scratch, Python basics, and computational thinking through fun projects."
    },
    {
      icon: Brain,
      title: "Brain Development Skills",
      description: "Enhance cognitive abilities with memory games, logical reasoning, problem-solving activities, and critical thinking exercises."
    },
    {
      icon: GraduationCap,
      title: "Advanced Teaching Methods",
      description: "For tutors: Master modern pedagogical techniques, classroom management, and student engagement strategies."
    }
  ];
  
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">Holistic Development</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Beyond Academics
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive skill development programs for students and professional growth opportunities for tutors
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {program.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {program.description}
                    </p>
                    <Button variant="outline" size="sm">Learn More</Button>
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

export default HolisticDevelopment;
