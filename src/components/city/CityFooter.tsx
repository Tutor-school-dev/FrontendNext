import { getAllCities, generateCityURL } from '@/lib/cityData';

export default function CityFooter() {
  const cities = getAllCities();

  return (
    <div className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            Find Tutors in Your City
          </h3>
          <p className="text-gray-400">
            Choose your city to find verified tutors near you
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {cities.map((city) => (
            <div
              key={city.slug}
              className="block p-3 text-center border border-gray-700 rounded-lg"
            >
              <span className="text-blue-400 font-medium">
                Tutors in {city.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}