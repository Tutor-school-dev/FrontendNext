import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";
import employerImage from "@/assets/TS Teacher.jpg";

const ForEmployers = () => {
  return (
    <section id="teachers" className="py-20 bg-gradient-to-br from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-primary/10">
          <div className="grid md:grid-cols-2 gap-0 items-center">
            <div className="relative order-2 md:order-1 min-h-[400px] md:min-h-[600px]">
              <Image
                src={employerImage} 
                alt="Professional education environment"
                className="w-full h-full object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
            </div>
            
            <div className="space-y-8 p-8 md:p-12 order-1 md:order-2">
              <div className="space-y-4">
                <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20">
                  <Building2 className="h-4 w-4" />
                  FOR SCHOOLS & INSTITUTIONS
                </Badge>
                
                <h2 className="text-3xl md:text-4xl font-bold leading-tight text-foreground">
                  Need <span className="text-primary">Qualified Educators</span> for Your Institution?
                </h2>
                
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Access India's largest pool of verified tutors and teachers. Our AI-powered platform helps you find the perfect educators faster than traditional hiring.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">2,000+ Verified</p>
                    <p className="text-sm text-muted-foreground">Expert Educators</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">24-Hour</p>
                    <p className="text-sm text-muted-foreground">Quick Matching</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">100% Free</p>
                    <p className="text-sm text-muted-foreground">No Hidden Costs</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Smart Filters</p>
                    <p className="text-sm text-muted-foreground">AI-Powered Search</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button size="lg" className="w-full md:w-auto rounded-full font-semibold group">
                  Post Your Requirement
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-sm text-muted-foreground">
                  ✨ Currently in beta testing, will be live soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForEmployers;
