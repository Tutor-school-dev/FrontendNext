import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";

const VideoTestimonials = () => {
  const videos = [
    {
      name: "Rahul Kumar",
      class: "Class 11, CBSE",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop"
    },
    {
      name: "Sneha Reddy",
      class: "Class 9, ICSE",
      thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop"
    }
  ];
  
  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-foreground mb-2 text-center">Video Testimonials</h3>
      <p className="text-muted-foreground mb-8 text-center">Hear directly from our successful students</p>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {videos.map((video, index) => (
          <Card key={index} className="overflow-hidden border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-0">
              <div className="relative aspect-video">
                <img 
                  src={video.thumbnail} 
                  alt={video.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4 text-center">
                <h4 className="font-bold text-foreground">{video.name}</h4>
                <p className="text-sm text-muted-foreground">{video.class}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VideoTestimonials;
