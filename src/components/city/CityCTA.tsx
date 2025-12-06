import { City } from '@/lib/cityData';
import { Button } from '@/components/ui/button';

interface CityCTAProps {
  city: City;
}

export default function CityCTA({ city }: CityCTAProps) {
  return (
    <div className="bg-blue-600 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Get a Verified Tutor in {city.name} for Your Child
        </h2>
        
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Share your child's class, subject and area. We'll do the shortlisting and send 
          the best tutor options in {city.name} to you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            Find Your Tutor in {city.name}
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
            Call Us Now
          </Button>
        </div>
      </div>
    </div>
  );
}