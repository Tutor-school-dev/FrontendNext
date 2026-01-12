import { City } from '@/lib/cityData';

interface CitySubjectsProps {
  city: City;
}

export default function CitySubjects({ city }: CitySubjectsProps) {
  const subjects = [
    'Math Tutors',
    'Science Tutors',
    'English Tutors',
    'Physics Tutors',
    'Chemistry Tutors',
    'Biology Tutors',
    'Spoken English Tutors',
    'Olympiad & NTSE Tutors',
  ];

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Subjects Covered in {city.name}
          </h2>
          <p className="text-lg text-gray-600">
            From basics to board exams and entrance prep.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="block p-4 text-center border border-gray-200 rounded-lg"
            >
              <span className="text-blue-600 font-medium">
                {subject} in {city.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}