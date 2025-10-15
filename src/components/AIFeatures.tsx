import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Brain, BarChart3 } from "lucide-react";

const AIFeatures = () => {
  const features = [
    {
      icon: Bot,
      title: "AI Teaching Assistant",
      subtitle: "For Teachers",
      description: "Free AI teachers' intelligent support for lesson planning, content creation, and classroom management."
    },
    {
      icon: Brain,
      title: "Personalized Learning AI",
      subtitle: "For Students",
      description: "Monthly subscription for students: adaptive learning paths, instant doubt solving, and progress tracking."
    },
    {
      icon: BarChart3,
      title: "Smart Assessment Engine",
      subtitle: "For Schools",
      description: "AI-powered analytics and progress for schools to track student performance and identify improvement areas."
    }
  ];
  
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Bot className="h-8 w-8 text-primary" />
            <p className="text-sm font-medium text-primary">AI-Powered Education</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Future of Learning is Here
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Harness the power of artificial intelligence to enhance teaching, personalize learning, and improve outcomes.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-xs font-medium text-primary mb-2">{feature.subtitle}</p>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <Button variant="outline" size="sm">Explore Feature</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Experience AI-Enhanced Learning?
          </h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of students, teachers, and schools already benefiting from our AI-powered platform.
          </p>
          <Button size="lg" className="rounded-full font-semibold">
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;
