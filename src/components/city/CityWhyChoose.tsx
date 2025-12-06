import { City } from '@/lib/cityData';
import { Shield, TrendingUp, RefreshCw } from 'lucide-react';

interface CityWhyChooseProps {
  city: City;
}

export default function CityWhyChoose({ city }: CityWhyChooseProps) {
  const features = [
    {
      icon: Shield,
      title: 'Background-verified tutors',
      description: 'All tutors go through strict background verification and skill assessment before joining our platform.',
    },
    {
      icon: TrendingUp,
      title: 'Weekly progress updates',
      description: 'Get detailed weekly reports on your child\'s learning progress and areas of improvement.',
    },
    {
      icon: RefreshCw,
      title: 'Replacement within 7 days',
      description: 'Not satisfied with the tutor? Get a replacement within 7 days with no additional charges.',
    },
  ];

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why {city.name} Parents Choose TutorSchool
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}