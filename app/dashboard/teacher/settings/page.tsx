"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TeacherNavbar from "@/components/TeacherNavbar";
// Note: Removed useDashboardStore import to avoid old API calls
// import { useDashboardStore } from "@/hooks/useDashboardStore";
import Cookies from "js-cookie";
import { 
  User, MapPin, GraduationCap, Video, DollarSign, 
  Briefcase, Save, Loader2, Camera, Upload, Check, Plus, X, BookOpen
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { SUBJECTS, getAllSubjects, isValidSubject } from "@/lib/subjects";
import { getDjangoAuthUrl } from "@/lib/utils";
import Location from "../../../teacher-profile/Location";

interface ProfileSection {
  name: string;
  primary_contact: string;
  email: string;
}

interface LocationSection {
  state: string;
  area: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
}

interface ProfessionalSection {
  introduction: string;
  teaching_desc: string;
  lesson_price: number | null;
  teaching_mode: string;
  current_status: string;
  subjects: string[];
}

interface EducationSection {
  university: string;
  degree: string;
  class_field: string;
}

const DEGREE_OPTIONS = [
  { value: "high_school", label: "High School" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "phd", label: "PhD/Doctorate" },
  { value: "professional", label: "Professional Degree" },
  { value: "other", label: "Other" }
];

interface MediaSection {
  profile_pic: string;
  video_url: string;
}

export default function TeacherSettingsPage() {
  const router = useRouter();
  // Note: Removed get_dashboard_data to stop calling old API endpoints
  // const { teacher, get_dashboard_data } = useDashboardStore();
  const teacher = null; // Will be replaced with new API data when available
  
  // Section states
  const [profileData, setProfileData] = useState<ProfileSection>({
    name: "",
    primary_contact: "",
    email: ""
  });
  
  const [professionalData, setProfessionalData] = useState<ProfessionalSection>({
    introduction: "",
    teaching_desc: "",
    lesson_price: null,
    teaching_mode: "",
    current_status: "",
    subjects: []
  });
  
  const [educationData, setEducationData] = useState<EducationSection>({
    university: "",
    degree: "",
    class_field: ""
  });
  
  const [mediaData, setMediaData] = useState<MediaSection>({
    profile_pic: "",
    video_url: ""
  });
  
  // Loading states per section
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingProfessional, setSavingProfessional] = useState(false);
  const [savingEducation, setSavingEducation] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState<string | null>(null);
  
  // File upload states
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  // Subject management
  const [newSubject, setNewSubject] = useState("");
  
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch tutor data from API
  const fetchTutorData = async () => {
    const authToken = Cookies.get("jwt_Token");
    if (!authToken) {
      router.push("/auth?model=teacher");
      return;
    }

    try {
      const djangoUrl = getDjangoAuthUrl();
      const response = await axios.get(`${djangoUrl}/tutor/`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      // API returns { teacher: {...} }
      const data = response.data.teacher;
      console.log("Fetched tutor data:", data);

      // Pre-fill all form sections
      if (data) {
        setProfileData({
          name: data.name || "",
          primary_contact: data.primary_contact || "",
          email: data.email || ""
        });

        setProfessionalData({
          introduction: data.introduction || "",
          teaching_desc: data.teaching_desc || "",
          lesson_price: data.lesson_price ? parseFloat(data.lesson_price) : null,
          teaching_mode: data.teaching_mode || "",
          current_status: data.current_status || "",
          subjects: (() => {
            if (Array.isArray(data.subjects)) {
              return data.subjects;
            } else if (typeof data.subjects === 'string') {
              try {
                // Handle string format like "['English', 'Maths', 'Chemistry']"
                if (data.subjects.startsWith('[') && data.subjects.endsWith(']')) {
                  return JSON.parse(data.subjects.replace(/'/g, '"'));
                } else {
                  // Handle comma-separated string
                  return data.subjects.split(',').map(s => s.trim());
                }
              } catch (e) {
                // Fallback to comma-separated parsing
                return data.subjects.split(',').map(s => s.trim());
              }
            }
            return [];
          })()
        });

        setEducationData({
          university: data.university || "",
          degree: data.degree || "",
          class_field: data.class_level || ""
        });

        setMediaData({
          profile_pic: data.profile_pic || "",
          video_url: data.video_url || ""
        });
      }
    } catch (error: any) {
      console.error("Error fetching tutor data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setDataLoaded(true);
    }
  };

  // Check authentication and load data
  useEffect(() => {
    const authToken = Cookies.get("jwt_Token");
    
    if (!authToken) {
      router.push("/auth?model=teacher");
      return;
    }

    // Fetch tutor data from GET API
    fetchTutorData();
    
    // Note: Removed dashboard API call as requested to stop calling old endpoints
    // TODO: Get subscription info from new API when available
    // get_dashboard_data(authToken).catch(error => {
    //   console.error("Settings: Error loading dashboard data:", error);
    // });
  }, []);

  // API helper
  const updateProfile = async (data: Partial<any>, section: string) => {
    const authToken = Cookies.get("jwt_Token");
    if (!authToken) {
      toast.error("Authentication required");
      return false;
    }

    try {
      const djangoUrl = getDjangoAuthUrl();
      const response = await axios.put(
        `${djangoUrl}/tutor/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      toast.success(`${section} updated successfully!`, { duration: 2500 });
      
      // Refresh tutor data
      await fetchTutorData();
      return true;
    } catch (error: any) {
      console.error(`Error updating ${section}:`, error);
      toast.error(error.response?.data?.message || `Failed to update ${section}`);
      return false;
    }
  };

  // File upload helper - CORRECTED ENDPOINT
  const uploadMedia = async (file: File, mediaType: 'profile_pictures' | 'profile_videos') => {
    const authToken = Cookies.get("jwt_Token");
    if (!authToken) {
      toast.error("Authentication required");
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('media_type', mediaType);

    try {
      setUploadingMedia(mediaType);
      
      const response = await axios.post(
        "https://stagingapi.tutorschool.in/api/media/upload/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      toast.success(`${mediaType === 'profile_pictures' ? 'Profile picture' : 'Video'} uploaded successfully!`, { 
        duration: 2500 
      });
      
      // Refresh tutor data
      await fetchTutorData();
      return response.data.url;
    } catch (error: any) {
      console.error(`Error uploading ${mediaType}:`, error);
      toast.error(error.response?.data?.message || `Failed to upload ${mediaType}`);
      return null;
    } finally {
      setUploadingMedia(null);
    }
  };

  // Subject management functions
  const addSubject = () => {
    const trimmedSubject = newSubject.trim();
    
    if (!trimmedSubject) {
      toast.error("Please enter a subject");
      return;
    }
    
    if (professionalData.subjects.includes(trimmedSubject)) {
      toast.error("This subject is already added");
      return;
    }
    
    // Check if it's a valid subject from our standardized list
    const validSubjects = getAllSubjects();
    const isValid = validSubjects.some(subject => 
      subject.toLowerCase() === trimmedSubject.toLowerCase()
    );
    
    if (!isValid) {
      toast.error(`Please select from available subjects: ${validSubjects.slice(0, 5).join(', ')}...`);
      return;
    }
    
    // Find the exact case match from our subjects list
    const correctSubject = validSubjects.find(subject => 
      subject.toLowerCase() === trimmedSubject.toLowerCase()
    ) || trimmedSubject;
    
    setProfessionalData({
      ...professionalData,
      subjects: [...professionalData.subjects, correctSubject]
    });
    setNewSubject("");
    toast.success(`${correctSubject} added successfully`);
  };

  const removeSubject = (index: number) => {
    setProfessionalData({
      ...professionalData,
      subjects: professionalData.subjects.filter((_, i) => i !== index)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubject();
    }
  };

  // Section save handlers
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const success = await updateProfile({
      name: profileData.name,
      email: profileData.email,
      p_contact: profileData.primary_contact
    }, "Profile");
    setSavingProfile(false);
  };

  const handleSaveProfessional = async () => {
    setSavingProfessional(true);
    const success = await updateProfile(professionalData, "Professional Info");
    setSavingProfessional(false);
  };

  const handleSaveEducation = async () => {
    setSavingEducation(true);
    const success = await updateProfile(educationData, "Education");
    setSavingEducation(false);
  };

  const handleProfilePicUpload = async () => {
    if (!profilePicFile) return;
    const url = await uploadMedia(profilePicFile, 'profile_pictures');
    if (url) {
      setMediaData(prev => ({ ...prev, profile_pic: url }));
      setProfilePicFile(null);
    }
  };

  const handleVideoUpload = async () => {
    if (!videoFile) return;
    const url = await uploadMedia(videoFile, 'profile_videos');
    if (url) {
      setMediaData(prev => ({ ...prev, video_url: url }));
      setVideoFile(null);
    }
  };

  // Loading state
  if (!dataLoaded && !teacher) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TeacherNavbar />
        <div className="pt-16 flex items-center justify-center" style={{ height: 'calc(100vh - 4rem)' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNavbar />
      
      <div className="pt-16 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="mt-2 text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* Basic Profile Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <CardTitle>Basic Information</CardTitle>
                </div>
                <CardDescription>
                  Your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primary_contact">Primary Contact *</Label>
                    <Input
                      id="primary_contact"
                      value={profileData.primary_contact}
                      readOnly
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                      placeholder="+91 XXXXXXXXXX"
                    />
                    <p className="text-xs text-gray-500">Contact number cannot be changed</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Picture & Video Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <CardTitle>Profile Media</CardTitle>
                </div>
                <CardDescription>
                  Upload your profile picture and introduction video
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profile Picture */}
                  <div className="space-y-3">
                    <Label>Profile Picture</Label>
                    <div className="flex flex-col items-center gap-4">
                      {mediaData.profile_pic ? (
                        <img 
                          src={mediaData.profile_pic} 
                          alt="Profile" 
                          className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="w-full">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setProfilePicFile(e.target.files?.[0] || null)}
                          className="mb-2"
                        />
                        {profilePicFile && (
                          <Button
                            onClick={handleProfilePicUpload}
                            disabled={uploadingMedia === 'profile_pic'}
                            size="sm"
                            className="w-full"
                          >
                            {uploadingMedia === 'profile_pic' ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Picture
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Video URL */}
                  <div className="space-y-3">
                    <Label>Introduction Video</Label>
                    <div className="flex flex-col gap-4">
                      {mediaData.video_url ? (
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                          <Video className="w-12 h-12 text-gray-400" />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <Video className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm">No video uploaded</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="w-full">
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                          className="mb-2"
                        />
                        {videoFile && (
                          <Button
                            onClick={handleVideoUpload}
                            disabled={uploadingMedia === 'video_url'}
                            size="sm"
                            className="w-full"
                          >
                            {uploadingMedia === 'video_url' ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Video
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Section - Reusing signup flow component */}
            <Location 
              onNext={() => {
                toast.success("Location updated successfully!");
                fetchTutorData();
              }}
              model="teacher"
              fromSettings={true}
            />

            {/* Professional Information Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <CardTitle>Professional Information</CardTitle>
                </div>
                <CardDescription>
                  Your teaching experience and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="introduction">Introduction</Label>
                    <Textarea
                      id="introduction"
                      value={professionalData.introduction}
                      onChange={(e) => setProfessionalData({ ...professionalData, introduction: e.target.value })}
                      placeholder="Write a brief introduction about yourself..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="teaching_desc">Teaching Description</Label>
                    <Textarea
                      id="teaching_desc"
                      value={professionalData.teaching_desc}
                      onChange={(e) => setProfessionalData({ ...professionalData, teaching_desc: e.target.value })}
                      placeholder="Describe your teaching methodology and experience..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lesson_price">Lesson Price (₹/hour)</Label>
                      <Input
                        id="lesson_price"
                        type="number"
                        value={professionalData.lesson_price || ""}
                        onChange={(e) => setProfessionalData({ ...professionalData, lesson_price: parseFloat(e.target.value) || null })}
                        placeholder="500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="teaching_mode">Teaching Mode</Label>
                      <Select
                        value={professionalData.teaching_mode}
                        onValueChange={(value) => setProfessionalData({ ...professionalData, teaching_mode: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="current_status">Current Status</Label>
                      <Select
                        value={professionalData.current_status}
                        onValueChange={(value) => setProfessionalData({ ...professionalData, current_status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="busy">Busy</SelectItem>
                          <SelectItem value="unavailable">Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Subjects Section */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Subjects You Teach
                    </Label>
                    
                    {/* Subject Tags */}
                    {professionalData.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
                        {professionalData.subjects.map((subject, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            <span>{subject}</span>
                            <button
                              type="button"
                              onClick={() => removeSubject(index)}
                              className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Add Subject Dropdown/Input */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Select
                          value=""
                          onValueChange={(value) => {
                            setNewSubject(value);
                            setTimeout(() => addSubject(), 100);
                          }}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select a subject to add" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAllSubjects()
                              .filter(subject => !professionalData.subjects.includes(subject))
                              .map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Or type a custom subject"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={addSubject}
                          disabled={!newSubject.trim()}
                          variant="outline"
                          size="sm"
                          className="px-4"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      Select from the dropdown or type a custom subject. Standard subjects are recommended for better visibility.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveProfessional}
                    disabled={savingProfessional}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {savingProfessional ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <CardTitle>Education & Qualifications</CardTitle>
                </div>
                <CardDescription>
                  Your academic background and credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">University/Institution</Label>
                    <Input
                      id="university"
                      value={educationData.university}
                      onChange={(e) => setEducationData({ ...educationData, university: e.target.value })}
                      placeholder="Enter university name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree *</Label>
                    <Select
                      value={educationData.degree}
                      onValueChange={(value) => setEducationData({ ...educationData, degree: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEGREE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="class_field">Teaching Level</Label>
                    <Select
                      value={educationData.class_field}
                      onValueChange={(value) => setEducationData({ ...educationData, class_field: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary (1-5)</SelectItem>
                        <SelectItem value="middle">Middle (6-8)</SelectItem>
                        <SelectItem value="secondary">Secondary (9-10)</SelectItem>
                        <SelectItem value="senior_secondary">Senior Secondary (11-12)</SelectItem>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="all">All Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveEducation}
                    disabled={savingEducation}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {savingEducation ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
