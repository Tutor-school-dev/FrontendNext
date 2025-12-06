import { City } from '@/lib/cityData';
import { Button } from '@/components/ui/button';

interface CityHeroProps {
  city: City;
}

export default function CityHero({ city }: CityHeroProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Main content */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Find the Best Tutors in{' '}
              <span className="text-blue-600">{city.name}</span> for Your Child
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Get verified tutors across {city.areas.slice(0, 3).map(area => area.name).join(', ')} and all major 
              areas of {city.name}. Area-wise, subject-wise and budget-wise matching in under 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="text-lg px-8 py-3">
                Find Your Tutor
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Talk to TutorSchool Counselor
              </Button>
            </div>
          </div>

          {/* Right side - Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600">350+</div>
              <div className="text-sm text-gray-600">Active tutors in {city.name}</div>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600">2,400+</div>
              <div className="text-sm text-gray-600">Students matched</div>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600">4.8 / 5</div>
              <div className="text-sm text-gray-600">Avg. rating</div>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600">24 hrs</div>
              <div className="text-sm text-gray-600">Match guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}