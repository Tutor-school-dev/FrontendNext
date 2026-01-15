import { City } from '@/lib/cityData';

interface CityNearbyAreasProps {
  city: City;
}

export default function CityNearbyAreas({ city }: CityNearbyAreasProps) {
  // For Bengaluru, show all areas including the commented ones
  const allBengaluruAreas = city.slug === 'bengaluru' ? [
    { name: "HSR Layout", slug: "hsr-layout", active: true },
    { name: "Koramangala", slug: "koramangala", active: false },
    { name: "Indiranagar", slug: "indiranagar", active: false },
    { name: "Whitefield", slug: "whitefield", active: false },
    { name: "Jayanagar", slug: "jayanagar", active: false },
    { name: "BTM Layout", slug: "btm-layout", active: false },
    { name: "Electronic City", slug: "electronic-city", active: false },
    { name: "Marathahalli", slug: "marathahalli", active: false },
    { name: "Banashankari", slug: "banashankari", active: false },
    { name: "Rajajinagar", slug: "rajajinagar", active: false },
    { name: "Malleswaram", slug: "malleswaram", active: false },
    { name: "Yelahanka", slug: "yelahanka", active: false },
  ] : city.areas.map(area => ({ ...area, active: true }));

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
          {allBengaluruAreas.map((area) => (
            <div
              key={area.slug}
              className={`block p-4 text-center border rounded-lg ${
                area.active 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <span className={`font-medium ${
                area.active 
                  ? 'text-blue-600' 
                  : 'text-gray-500'
              }`}>
                {area.name} Tutors
              </span>
              {!area.active && (
                <div className="text-xs text-gray-400 mt-1">
                  Coming Soon
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}