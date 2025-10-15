import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, IndianRupee, Calendar, TrendingUp } from "lucide-react";

const TutoringOpportunities = () => {
  const filters = [
    "All Opportunities",
    "Home Tuition",
    "Online Teaching",
    "Full-time",
    "Part-time",
    "Mathematics",
    "Science",
    "Languages"
  ];

  const opportunities = [
    {
      active: true,
      title: "Mathematics Tutor Needed",
      organization: "Delhi Public School",
      location: "South Delhi",
      salary: "₹15,000 - 25,000",
      duration: "6 Months",
      type: "Home Tuition"
    },
    {
      active: true,
      title: "Science Teacher - Classes 9-10",
      organization: "FIITJEE Academy",
      location: "Gurugram",
      salary: "₹20,000 - 35,000",
      duration: "1 Year",
      type: "Home Tuition"
    },
    {
      active: false,
      title: "English Language Expert",
      organization: "British Council",
      location: "Mumbai",
      salary: "₹18,000 - 30,000",
      duration: "3 Months",
      type: "Online"
    },
    {
      active: true,
      title: "Physics Tutor for IIT-JEE",
      organization: "Resonance",
      location: "Bangalore",
      salary: "₹25,000 - 40,000",
      duration: "1 Year",
      type: "Home Tuition"
    }
  ];

  return (
    <section className="py-20 bg-[#E8F4F8]">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Tutoring Opportunities
          </h2>
          
          <div className="flex flex-wrap gap-3 mb-8">
            {filters.map((filter, index) => (
              <Badge 
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {filter}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {opportunities.map((opp, index) => (
            <Card key={index} className="bg-card hover:shadow-lg transition-all border-2 hover:border-primary/30">
              <CardContent className="pt-6">
                {opp.active && (
                  <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Actively hiring
                  </Badge>
                )}
                
                <h3 className="font-bold text-lg text-foreground mb-2">
                  {opp.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {opp.organization}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {opp.location}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IndianRupee className="h-4 w-4" />
                    {opp.salary}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {opp.duration}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {opp.type}
                  </Badge>
                  <Button variant="link" className="text-primary p-0 h-auto font-semibold">
                    View details →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <Button variant="outline" size="lg" className="rounded-full">
            View All Opportunities
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TutoringOpportunities;
