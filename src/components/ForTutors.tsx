import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users, CheckCircle2, Clock } from "lucide-react";

const ForTutors = () => {
  const benefits = [
    {
      icon: CheckCircle2,
      title: "100% Earnings Retention",
      description: "Keep every rupee you earn - no commission deductions"
    },
    {
      icon: Users,
      title: "Consistent Student Flow",
      description: "Get matched with students actively seeking quality tutors"
    },
    {
      icon: Star,
      title: "Verified Platform",
      description: "Build credibility with our trusted verification system"
    }
  ];
  
  const stats = [
    { value: "₹0", label: "Commission Fee", sublabel: "Unlike others who charge 15-30%" },
    { value: "1,800+", label: "Active Tutors", sublabel: "Growing community nationwide" },
    { value: "4.9★", label: "Tutor Rating", sublabel: "Average platform satisfaction" },
    { value: "24hr", label: "Quick Approval", sublabel: "Start teaching fast" }
  ];
  
  return (
    <section id="tutors" className="py-20 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">For Tutors</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Zero Commission. Keep 100% of Your Earnings
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join 1,800+ tutors who are earning more with TutorSchool. No hidden fees, no commission cuts - your hard work, your money.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="border-2 text-center hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-white/90 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <Icon className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mb-12">
          <Button size="lg" className="rounded-full font-semibold">
            Apply as Tutor Now
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
              <p className="font-semibold text-foreground mb-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForTutors;
