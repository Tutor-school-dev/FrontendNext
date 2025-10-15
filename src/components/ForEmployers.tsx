import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import employerImage from "@/assets/employer-banner.jpg";

const ForEmployers = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
            <div className="relative">
              <img 
                src={employerImage} 
                alt="Professional employer"
                className="w-full max-w-md mx-auto rounded-2xl"
              />
            </div>
            
            <div className="space-y-6 text-white">
              <Badge variant="secondary" className="bg-blue-500/30 text-white border-white/20">
                TUTORSCHOOL FOR SCHOOLS
              </Badge>
              
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Looking to hire qualified tutors and teachers?
              </h2>
              
              <p className="text-blue-100 text-lg">
                Access India's largest pool of 2,000+ verified tutors with AI-powered matching and smart filters to hire faster.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded-full">
                  Post requirement for free →
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/20">
                <div>
                  <div className="text-2xl font-bold">2,000+</div>
                  <p className="text-sm text-blue-200">Verified Tutors</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">24hr</div>
                  <p className="text-sm text-blue-200">Quick Matching</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">₹0</div>
                  <p className="text-sm text-blue-200">Posting Fee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForEmployers;
