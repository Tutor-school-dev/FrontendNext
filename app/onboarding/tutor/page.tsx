"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const TutorOnboarding = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    education: "",
    experience: "",
    subjects: [] as string[],
    workRadius: "5",
    tutorType: "part-time",
    identityProof: "",
    educationProof: "",
  });

  const subjectOptions = ["Mathematics", "Science", "English", "Hindi", "Social Studies", "Physics", "Chemistry", "Biology"];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    toast({
      title: "Profile Created!",
      description: "Your tutor profile is now active",
    });
    // In real app, save to backend
    router.push("/dashboard/tutor");
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tutor Onboarding</h1>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step {currentStep} of {totalSteps}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Professional Details"}
              {currentStep === 3 && "Teaching Preferences"}
              {currentStep === 4 && "Work Settings"}
              {currentStep === 5 && "Document Verification"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Let's start with your basic details"}
              {currentStep === 2 && "Tell us about your qualifications"}
              {currentStep === 3 && "What subjects do you teach?"}
              {currentStep === 4 && "Set your working preferences"}
              {currentStep === 5 && "Upload verification documents"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="education">Highest Education *</Label>
                  <Input
                    id="education"
                    placeholder="e.g., B.Tech, M.Sc, B.Ed"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Teaching Experience *</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="0"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <Label>Select Subjects You Teach *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {subjectOptions.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={formData.subjects.includes(subject)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, subjects: [...formData.subjects, subject] });
                          } else {
                            setFormData({ ...formData, subjects: formData.subjects.filter(s => s !== subject) });
                          }
                        }}
                      />
                      <Label htmlFor={subject} className="font-normal cursor-pointer">
                        {subject}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <>
                <div className="space-y-3">
                  <Label>Tutor Type</Label>
                  <RadioGroup value={formData.tutorType} onValueChange={(value) => setFormData({ ...formData, tutorType: value })}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="part-time" id="part-time" />
                      <Label htmlFor="part-time" className="font-normal cursor-pointer">Part-time (Side income)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full-time" id="full-time" />
                      <Label htmlFor="full-time" className="font-normal cursor-pointer">Full-time (Primary income)</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radius">Work Radius (km) *</Label>
                  <Input
                    id="radius"
                    type="number"
                    placeholder="5"
                    value={formData.workRadius}
                    onChange={(e) => setFormData({ ...formData, workRadius: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">How far are you willing to travel?</p>
                </div>
              </>
            )}

            {currentStep === 5 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="identity">Identity Proof (Aadhaar/PAN) *</Label>
                  <Input
                    id="identity"
                    type="text"
                    placeholder="Enter document number"
                    value={formData.identityProof}
                    onChange={(e) => setFormData({ ...formData, identityProof: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eduProof">Education Certificate *</Label>
                  <Input
                    id="eduProof"
                    type="text"
                    placeholder="Enter certificate number"
                    value={formData.educationProof}
                    onChange={(e) => setFormData({ ...formData, educationProof: e.target.value })}
                  />
                </div>
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-accent-foreground">
                    ✓ Documents will be verified within 24-48 hours
                  </p>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="flex-1"
              >
                {currentStep === totalSteps ? "Complete Profile" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorOnboarding;