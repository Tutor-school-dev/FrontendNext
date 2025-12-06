import { City } from '@/lib/cityData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CityTutorsProps {
  city: City;
}

export default function CityTutors({ city }: CityTutorsProps) {
  // Sample tutors data - this will be replaced with real API data later
  const sampleTutors = [
    {
      name: 'Anjali Singh',
      subject: 'Math',
      experience: '6 years experience',
      area: city.areas[0]?.name || 'Central Area',
      classes: 'Class 6-10',
      board: 'CBSE / ICSE',
      mode: 'Home & Online',
      description: 'Known for simplifying algebra and geometry. Parents report clear improvement in test scores within 8–10 weeks.',
      fee: '₹500',
    },
    {
      name: 'Rahul Verma',
      subject: 'Science',
      experience: '8 years experience',
      area: city.areas[1]?.name || 'North Area',
      classes: 'Class 9-10',
      board: 'Board exam focus',
      mode: 'Home Tutor',
      description: 'Focus on concept clarity and exam-style questions. Follows a weekly test pattern with feedback to parents.',
      fee: '₹600',
    },
    {
      name: 'Neha Kumari',
      subject: 'English',
      experience: '5 years experience',
      area: city.areas[2]?.name || 'South Area',
      classes: 'Class 4-8',
      board: 'Grammar + Writing',
      mode: 'Online',
      description: 'Works on reading fluency, grammar and written expression with weekly assignments and corrections.',
      fee: '₹400',
    },
  ];

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Verified Tutors in {city.name}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Sample of tutors active on TutorSchool in {city.name}.
          </p>
          <Button variant="outline" className="mb-8">
            View all tutors in {city.name}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTutors.map((tutor, index) => (
            <Card key={index} className="border-2 hover:border-blue-200 transition-colors duration-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{tutor.name}</h3>
                    <p className="text-blue-600 font-medium">
                      {tutor.subject} · {tutor.experience}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {tutor.area}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Classes:</span>
                    <span className="font-medium">{tutor.classes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Board:</span>
                    <span className="font-medium">{tutor.board}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mode:</span>
                    <span className="font-medium">{tutor.mode}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {tutor.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="text-xl font-bold text-blue-600">
                    {tutor.fee} / hour
                  </div>
                  <Button size="sm">View profile</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}