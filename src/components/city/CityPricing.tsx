import { City } from '@/lib/cityData';

interface CityPricingProps {
  city: City;
}

export default function CityPricing({ city }: CityPricingProps) {
  const pricingData = [
    {
      class: 'Class 1–4',
      mode: 'Home / Online',
      subjects: 'All subjects',
      fees: '₹350 – ₹500',
    },
    {
      class: 'Class 5–8',
      mode: 'Home / Online',
      subjects: 'Math, Science, English',
      fees: '₹400 – ₹650',
    },
    {
      class: 'Class 9–10',
      mode: 'Home / Online',
      subjects: 'Math, Science',
      fees: '₹500 – ₹800',
    },
    {
      class: 'Class 11–12',
      mode: 'Home / Online',
      subjects: 'PCM / PCB',
      fees: '₹600 – ₹900',
    },
  ];

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tutor Fees in {city.name} (2025)
          </h2>
          <p className="text-lg text-gray-600">
            Typical hourly charges. Exact fee depends on tutor profile and your location.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mode</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subjects</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hourly Fees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pricingData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.class}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.mode}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.subjects}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">{row.fees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}