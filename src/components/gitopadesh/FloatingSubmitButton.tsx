"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const FloatingSubmitButton = () => {
  const scrollToRegistration = () => {
    const element = document.getElementById('registration-form');
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={scrollToRegistration}
        className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-14 h-14 p-0"
      >
        <Send className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default FloatingSubmitButton;