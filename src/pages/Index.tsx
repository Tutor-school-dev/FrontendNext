import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import Reviews from "@/components/Reviews";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Services from "@/components/Services";
import HolisticDevelopment from "@/components/HolisticDevelopment";
import ForTutors from "@/components/ForTutors";
import TutoringOpportunities from "@/components/TutoringOpportunities";
import ForEmployers from "@/components/ForEmployers";
import ForSchools from "@/components/ForSchools";
import AIFeatures from "@/components/AIFeatures";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Reviews />
      <Process />
      <Testimonials />
      <Services />
      <HolisticDevelopment />
      <ForTutors />
      <TutoringOpportunities />
      <ForEmployers />
      <ForSchools />
      <AIFeatures />
      <ContactCTA />
      <Footer />
    </div>
  );
};

export default Index;
