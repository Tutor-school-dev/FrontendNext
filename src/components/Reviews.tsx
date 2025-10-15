import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Reviews = () => {
  const reviews = [
    {
      name: "Priya Sharma",
      role: "Parent of Class 10 Student",
      initials: "PS",
      review: "My daughter's Math scores improved from 65% to 92% in just 3 months. The tutor was patient and explained concepts clearly. Highly recommended!"
    },
    {
      name: "Rajesh Kumar",
      role: "Parent of Class 8 Student",
      initials: "RK",
      review: "Finding a good Science tutor was difficult until we found TutorSchool. The verification process gave us confidence, and the results speak for themselves."
    },
    {
      name: "Meena Patel",
      role: "Parent of Class 12 Student",
      initials: "MP",
      review: "The board exam preparation was excellent. Our son scored 95% in his CBSE exams. Thank you for the dedicated support throughout the year!"
    }
  ];
  
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-2">Parent Reviews</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by 1000+ Learners
          </h2>
          <p className="text-lg text-muted-foreground">
            Real stories from real families who trust TutorSchool
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {review.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "{review.review}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
