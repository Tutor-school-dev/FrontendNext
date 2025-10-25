import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Star } from "lucide-react";
import Image from "next/image";
import codingImage from "@/assets/course-coding.jpg";
import brainImage from "@/assets/Brighter-Minds.png";
import gitaImage from "@/assets/Bhagavad-Gita.png";
import teachingImage from "@/assets/course-teaching.jpg";

const HolisticDevelopment = () => {
  const programs = [
    {
      image: gitaImage,
      title: "Bhagavad Gita Lessons for Kids",
      duration: "8h 30m",
      students: 156,
      rating: 4.8,
      instructor: "Tutorschool@Dev"
    },
    {
      image: codingImage,
      title: "Basics of Coding",
      duration: "12h 30m",
      students: 44,
      rating: 4.17,
      instructor: "Tutorschool@Dev"
    },
    {
      image: brainImage,
      title: "Brain Development Skills for Kids",
      duration: "19h 30m",
      students: 8,
      rating: 5.0,
      instructor: "Tutorschool@Dev"
    },
    {
      image: teachingImage,
      title: "Advanced Teaching Methods",
      duration: "15h 45m",
      students: 92,
      rating: 4.6,
      instructor: "Tutorschool@Dev"
    }
  ];
  
  return (
    <section id="courses" className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">Holistic Development</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Beyond Academics
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive skill development programs for students and professional growth opportunities for tutors
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/90 backdrop-blur-sm border-2 hover:border-primary/30">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={program.image} 
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  fill
                />
              </div>
              
              <CardContent className="pt-4">
                <h3 className="text-lg font-bold text-foreground mb-3">
                  {program.title}
                </h3>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {program.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {program.students}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-muted-foreground">{program.instructor}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">({program.rating})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HolisticDevelopment;
