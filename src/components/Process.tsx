import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, Calendar, TrendingUp } from "lucide-react";

const Process = () => {
  const steps = [
    {
      number: "01",
      title: "Tell Us Your Needs",
      description: "Share your class, subjects, and learning goals. We'll find the perfect match.",
      icon: Search
    },
    {
      number: "02",
      title: "Meet Your Tutor",
      description: "Review tutor profiles, qualifications, and student reviews. Book a free demo.",
      icon: Users
    },
    {
      number: "03",
      title: "Schedule Classes",
      description: "Choose flexible time slots that work for you. Start with a risk-free trial.",
      icon: Calendar
    },
    {
      number: "04",
      title: "Track Progress",
      description: "See improvements with regular assessments and detailed progress reports.",
      icon: TrendingUp
    }
  ];
  
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">Simple Process</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How TutorSchool Helps Learners
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in minutes with our simple 4-step process
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="relative border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="absolute -top-4 left-6 bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg shadow-lg">
                    {step.number}
                  </div>
                  <div className="mt-6 mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
