import { City } from '@/lib/cityData';

interface CityNearbyAreasProps {
  city: City;
}

export default function CityNearbyAreas({ city }: CityNearbyAreasProps) {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tutors Near Me in {city.name}
          </h2>
          <p className="text-lg text-gray-600">
            We cover all major localities in and around {city.name} city.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {city.areas.map((area) => (
            <div
              key={area.slug}
              className="block p-4 text-center border border-gray-200 rounded-lg"
            >
              <span className="text-blue-600 font-medium">
                {area.name} Tutors
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}