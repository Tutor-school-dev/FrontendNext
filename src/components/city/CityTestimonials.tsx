import { City } from '@/lib/cityData';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface CityTestimonialsProps {
  city: City;
}

export default function CityTestimonials({ city }: CityTestimonialsProps) {
  // Sample testimonials - will be replaced with real data
  const testimonials = [
    {
      content: `My son in Class 9 was struggling with Math. TutorSchool matched us with a tutor from ${city.areas[0]?.name || 'Central Area'} who started with basics and within two months his school test marks jumped from 42 to 78%.`,
      author: `Parent of Class 9 student, ${city.areas[0]?.name || 'Central Area'}`,
      rating: 5,
    },
    {
      content: `We wanted a calm female tutor for our daughter in Class 6 near ${city.areas[1]?.name || 'North Area'}. The team shared three options, we did a demo with two and finalised in one week. Very smooth process.`,
      author: `Parent of Class 6 student, ${city.areas[1]?.name || 'North Area'}`,
      rating: 5,
    },
  ];

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What {city.name} Parents Say
          </h2>
          <p className="text-lg text-gray-600">
            Real stories from parents using TutorSchool in {city.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2 border-gray-100">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-6 text-lg leading-relaxed italic">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="text-sm font-medium text-gray-900">
                  — {testimonial.author}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}