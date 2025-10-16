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

const LearnerOnboarding = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    email: "",
    grade: "",
    subjects: [] as string[],
    learningGoals: "",
    preferredMode: "in-person",
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
      description: "You can now browse and connect with tutors",
    });
    router.push("/dashboard/learner");
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Learner Onboarding</h1>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step {currentStep} of {totalSteps}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Student Information"}
              {currentStep === 2 && "Parent/Guardian Details"}
              {currentStep === 3 && "Learning Requirements"}
              {currentStep === 4 && "Preferences"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about the student"}
              {currentStep === 2 && "Parent or guardian information"}
              {currentStep === 3 && "What subjects need tutoring?"}
              {currentStep === 4 && "Set your learning preferences"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name *</Label>
                  <Input
                    id="studentName"
                    placeholder="Enter student's full name"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Current Grade/Class *</Label>
                  <Input
                    id="grade"
                    placeholder="e.g., Class 10, 12th Grade"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                  <Input
                    id="parentName"
                    placeholder="Enter parent's full name"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="parent.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="space-y-4">
                  <Label>Subjects Needed *</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="goals">Learning Goals (Optional)</Label>
                  <Input
                    id="goals"
                    placeholder="e.g., Improve exam scores, entrance preparation"
                    value={formData.learningGoals}
                    onChange={(e) => setFormData({ ...formData, learningGoals: e.target.value })}
                  />
                </div>
              </>
            )}

            {currentStep === 4 && (
              <div className="space-y-3">
                <Label>Preferred Learning Mode</Label>
                <RadioGroup value={formData.preferredMode} onValueChange={(value) => setFormData({ ...formData, preferredMode: value })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-person" id="in-person" />
                    <Label htmlFor="in-person" className="font-normal cursor-pointer">In-person (Home/Tutor's place)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="font-normal cursor-pointer">Online (Video classes)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hybrid" id="hybrid" />
                    <Label htmlFor="hybrid" className="font-normal cursor-pointer">Hybrid (Both modes)</Label>
                  </div>
                </RadioGroup>
              </div>
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
                {currentStep === totalSteps ? "Start Learning" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearnerOnboarding;