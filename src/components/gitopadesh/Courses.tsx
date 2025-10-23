import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Courses = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
            Explore Our Courses
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12">
            Deepen your understanding of the Bhagavad Gita with our comprehensive courses
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:border-blue-300 transition-all">
              <div className="flex justify-center mb-6">
                <Image 
                  src="/gita-course.jpg" 
                  alt="Gita Course" 
                  width={200}
                  height={150}
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground text-center">
                Bhagavad Gita Foundation Course
              </h3>
              <p className="text-muted-foreground mb-6 text-center">
                A comprehensive introduction to the teachings of the Bhagavad Gita, perfect for beginners and those wanting to refresh their understanding.
              </p>
              <div className="text-center">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Learn More
                </Button>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 hover:border-orange-300 transition-all">
              <div className="flex justify-center mb-6">
                <Image 
                  src="/gita-course.jpg" 
                  alt="Advanced Gita Course" 
                  width={200}
                  height={150}
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground text-center">
                Advanced Gita Studies
              </h3>
              <p className="text-muted-foreground mb-6 text-center">
                Dive deeper into the philosophical and spiritual aspects of the Bhagavad Gita with our advanced course curriculum.
              </p>
              <div className="text-center">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Learn More
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;