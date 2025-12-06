'use client';

import { City } from '@/lib/cityData';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface CityFAQProps {
  city: City;
}

export default function CityFAQ({ city }: CityFAQProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: `What is the average cost of a home tutor in ${city.name}?`,
      answer: `Home tutor fees in ${city.name} typically range from ₹350 to ₹900 per hour, depending on the class, subject, and tutor's experience. Class 1-4 tutors charge ₹350-500, while Class 11-12 tutors for competitive exams may charge ₹600-900 per hour.`,
    },
    {
      question: `How quickly can TutorSchool arrange a tutor in ${city.name}?`,
      answer: `We guarantee to send you 3-5 verified tutor options within 24 hours of your request in ${city.name}. Most parents finalize a tutor within 2-3 days after comparing profiles and conducting demo classes.`,
    },
    {
      question: `Do you cover all areas of ${city.name}?`,
      answer: `Yes, we cover all major areas of ${city.name} including ${city.areas.slice(0, 4).map(a => a.name).join(', ')} and many more localities. Our tutors are available across the entire ${city.name} metropolitan area.`,
    },
    {
      question: `Can I change the tutor if it doesn't work out?`,
      answer: `Absolutely! We offer a 7-day replacement guarantee. If you're not satisfied with the tutor for any reason, we'll provide a replacement within 7 days at no additional cost in ${city.name}.`,
    },
  ];

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            FAQ: Tutors in {city.name}
          </h2>
          <p className="text-lg text-gray-600">
            Short answers that parents usually ask us.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <Collapsible open={openItems.includes(index)} onOpenChange={() => toggleItem(index)}>
                <CollapsibleTrigger className="flex justify-between items-center w-full p-6 text-left hover:bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openItems.includes(index) ? 'rotate-180' : ''
                    }`} 
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}