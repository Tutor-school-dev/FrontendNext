import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import heroImage from "@/assets/hero-tutor.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary to-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium">
              <Star className="h-4 w-4 fill-primary text-primary" />
              100% Satisfaction Guarantee
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Find the Perfect <br />
                <span className="text-primary">Home Tutor</span> for Your Child
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Expert tutors for Classes 1-12 • CBSE, ICSE & State Boards • Personalized learning at your doorstep
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Verified Tutors</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Free Demo Class</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">No Hidden Fees</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full font-semibold">
                Book Free Demo Now
              </Button>
              <Button size="lg" variant="outline" className="rounded-full font-semibold">
                99420-12342
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-card rounded-2xl p-6 shadow-lg border">
                <div className="text-3xl font-bold text-primary">2,567+</div>
                <p className="text-sm text-muted-foreground mt-1">Happy Students</p>
              </div>
              
              <div className="bg-card rounded-2xl p-6 shadow-lg border">
                <div className="text-3xl font-bold text-primary">1,800+</div>
                <p className="text-sm text-muted-foreground mt-1">Expert Tutors</p>
              </div>
              
              <div className="bg-card rounded-2xl p-6 shadow-lg border">
                <div className="text-3xl font-bold text-primary">98%</div>
                <p className="text-sm text-muted-foreground mt-1">Success Rate</p>
              </div>
            </div>
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Professional tutor"
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-6 left-6 bg-card/95 backdrop-blur rounded-xl p-4 shadow-lg border">
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="text-2xl font-bold text-primary">₹500/hr</p>
              </div>
              <div className="absolute top-6 right-6 bg-primary rounded-full px-4 py-2 shadow-lg">
                <p className="text-white font-bold flex items-center gap-1">
                  <Star className="h-4 w-4 fill-white" />
                  4.9
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
