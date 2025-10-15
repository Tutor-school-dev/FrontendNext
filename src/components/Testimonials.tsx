import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VideoTestimonials from "./VideoTestimonials";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      class: "Class 10, CBSE",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      testimonial: "TutorSchool helped me improve my math scores from 65% to 92%! The personalized attention and clear explanations made all the difference."
    },
    {
      name: "Arjun Patel",
      class: "Class 12, ICSE",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
      testimonial: "The science tutors at TutorSchool are amazing. They made complex topics easy to understand and helped me ace my board exams!"
    },
    {
      name: "Ananya Singh",
      class: "Class 8, State Board",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
      testimonial: "I was struggling with English grammar, but my tutor's patience and teaching methods helped me gain confidence. Highly recommend!"
    }
  ];
  
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">Student Success Stories</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Learners Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Real feedback from students who achieved their academic goals with TutorSchool
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4 border-4 border-primary/20">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="font-bold text-foreground mb-1">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{testimonial.class}</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {testimonial.testimonial}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <VideoTestimonials />
      </div>
    </section>
  );
};

export default Testimonials;
