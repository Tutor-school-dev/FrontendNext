import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const TrendingNow = () => {
  const trendingItems = [
    {
      bgGradient: "from-orange-500 to-red-500",
      badge: "Placement courses",
      title: "Big Diwali Sale",
      subtitle: "Online Courses with Placement",
      description: "Diwali Sale: Save up to ₹13,000!",
    },
    {
      bgGradient: "from-blue-500 to-purple-500", 
      badge: "Certification courses",
      title: "Special offer for your college!",
      subtitle: "Get FLAT 80% OFF on all online trainings",
      description: "",
    },
    {
      bgGradient: "from-green-500 to-teal-500",
      badge: "Campus Competition", 
      title: "TATA CRUCIBLE",
      subtitle: "THE CAMPUS QUIZ",
      description: "Dream Internships at the Tata Group • ₹2.5L Grand Prize • Epic Rewards",
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-left mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trending now
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
          {trendingItems.map((item, index) => (
            <div 
              key={index} 
              className={`bg-gradient-to-br ${item.bgGradient} p-6 rounded-3xl text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105 min-h-[200px] flex flex-col`}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col flex-grow">
                <div className="mb-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                    {item.badge}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold mb-2">
                  {item.title}
                </h3>
                
                <h4 className="text-lg font-medium mb-3 opacity-90">
                  {item.subtitle}
                </h4>
                
                {item.description && (
                  <p className="text-sm opacity-80 mb-4">
                    {item.description}
                  </p>
                )}
                
                <div className="mt-auto">
                  <Button 
                    variant="secondary"
                    className="w-full bg-white/20 text-white border-white/30 hover:bg-white hover:text-gray-800 transition-all duration-300"
                  >
                    Know more
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;