import { City } from '@/lib/cityData';
import CityHero from './CityHero';
import CityQuickMatch from './CityQuickMatch';
import CityWhyChoose from './CityWhyChoose';
import CityNearbyAreas from './CityNearbyAreas';
import CitySubjects from './CitySubjects';
import CityTutors from './CityTutors';
import CityPricing from './CityPricing';
import CityTestimonials from './CityTestimonials';
import CityFAQ from './CityFAQ';
import CityCTA from './CityCTA';

interface CityLandingPageProps {
  city: City;
}

export default function CityLandingPage({ city }: CityLandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <CityHero city={city} />
      
      {/* Quick Match Form */}
      <CityQuickMatch city={city} />
      
      {/* Why Choose TutorSchool */}
      <CityWhyChoose city={city} />
      
      {/* Tutors Near Me */}
      <CityNearbyAreas city={city} />
      
      {/* Subjects Covered */}
      <CitySubjects city={city} />
      
      {/* Sample Tutors */}
      <CityTutors city={city} />
      
      {/* Pricing Table */}
      <CityPricing city={city} />
      
      {/* Testimonials */}
      <CityTestimonials city={city} />
      
      {/* FAQ */}
      <CityFAQ city={city} />
      
      {/* Final CTA */}
      <CityCTA city={city} />
    </div>
  );
}