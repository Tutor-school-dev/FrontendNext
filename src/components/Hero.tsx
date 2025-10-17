import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, Clock, Users } from "lucide-react";
import Image from "next/image";
import heroImage from "@/assets/hero-home-online.jpg";
import startupIndiaHub from "@/assets/startup-india-hub.png";
import startupBihar from "@/assets/startup-bihar.png";
import brighterMinds from "@/assets/brighter-minds.webp";
import gitopadesh from "@/assets/gitopadesh.png";
import het from "@/assets/het.png";
import cimpBiif from "@/assets/cimp-biif.jpg";
import bhub from "@/assets/bhub.jpg";

const Hero = () => {
  const partnerLogos = [
    { name: "Startup India Hub", src: startupIndiaHub },
    { name: "Startup Bihar", src: startupBihar },
    { name: "Brighter Minds", src: brighterMinds },
    { name: "Gitopadesh", src: gitopadesh },
    { name: "HET", src: het },
    { name: "CIMP BIIF", src: cimpBiif },
    { name: "Bhub", src: bhub }
  ];

  return (
    <section className="relative overflow-hidden bg-[#E0F9F4]">
      <div className="container mx-auto px-4 pt-16 md:pt-24 pb-2">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-4 w-4" />
              AI-Powered Tutor Matching
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Find Your Perfect <br />
                Tutor—<span className="text-primary">Home or Online</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Choose between personalized in-person home tutors or flexible online education—all on one platform. Get AI-matched with verified tutors in 24 hours.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">2000+ Verified Tutors</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Matched in 24 Hours</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">10,000+ Happy Students</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full font-semibold">
                Find Home Tutor
              </Button>
              <Button size="lg" variant="outline" className="rounded-full font-semibold">
                Find Online Tutor
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={heroImage} 
                alt="Home tutoring and online tutoring illustration"
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Partner Logos Slider */}
        <div className="relative overflow-hidden">
          <div 
            className="flex items-center transition-opacity duration-300 animate-logo-scroll"
          >
            {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, index) => (
              <div 
                key={index}
                className="flex-shrink-0 mx-6 h-12 w-24 flex items-center justify-center"
              >
                <Image
                  src={logo.src} 
                  alt={logo.name}
                  className="max-h-full max-w-full object-contain transition-all duration-300 hover:scale-105"
                  width={96}
                  height={48}
                  style={{
                    filter: 'brightness(1.2) contrast(1.15) saturate(1.25)'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
