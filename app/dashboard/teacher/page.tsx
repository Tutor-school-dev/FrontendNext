"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TeacherNavbar from "../../../src/components/TeacherNavbar";
import {
  User,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Award,
  DollarSign,
  Mail,
  Phone,
} from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";
import { getDjangoAuthUrl } from "../../../src/lib/utils";
import { useAppliedJobs } from "../../../src/hooks/useAppliedJobs";
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card";
import { Badge } from "../../../src/components/ui/badge";
import { Button } from "../../../src/components/ui/button";

interface TutorData {
  id: string;
  name: string;
  email: string;
  primary_contact: string;
  state: string;
  area: string;
  pincode: string;
  profile_pic: string;
  lesson_price: string;
  teaching_mode: string;
  class_level: string;
  current_status: string;
  degree: string;
  university: string;
  introduction: string;
}

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [tutorData, setTutorData] = useState<TutorData | null>(null);
  const [loading, setLoading] = useState(true);
  const { applications, loading: appsLoading, fetchAppliedJobs } = useAppliedJobs();

  useEffect(() => {
    const authToken = Cookies.get("jwt_Token");

    if (!authToken) {
      router.push("/auth?model=teacher");
      return;
    }

    fetchTutorData(authToken);
    fetchAppliedJobs();
  }, []);

  const fetchTutorData = async (token: string) => {
    try {
      setLoading(true);
      const djangoUrl = getDjangoAuthUrl();
      const response = await axios.get(`${djangoUrl}/tutor/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTutorData(response.data.teacher);
    } catch (error: any) {
      console.error("Fetch tutor data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Applications",
      value: applications.length,
      icon: Briefcase,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Accepted",
      value: applications.filter((app) => app.status.toLowerCase() === "accepted").length,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending",
      value: applications.filter((app) => app.status.toLowerCase() === "pending").length,
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Teaching Rate",
      value: `₹${tutorData?.lesson_price || 0}/hr`,
      icon: DollarSign,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <TeacherNavbar />

      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex-1 mb-6 md:mb-0">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                    {tutorData?.profile_pic ? (
                      <img
                        src={tutorData.profile_pic}
                        alt={tutorData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <GraduationCap className="w-8 h-8 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                      Welcome back, {tutorData?.name}!
                    </h1>
                    <p className="text-blue-100 text-lg mt-1">
                      Ready to inspire minds today?
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {tutorData?.area}, {tutorData?.state}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {tutorData?.teaching_mode}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                    <Award className="w-3 h-3 mr-1" />
                    {tutorData?.degree}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push("/dashboard/teacher/opportunities")}
                  className="bg-white text-indigo-600 hover:bg-blue-50 font-semibold px-6 py-6 rounded-xl shadow-lg"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Browse Jobs
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/teacher/settings")}
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 font-semibold px-6 py-6 rounded-xl"
                >
                  <User className="w-5 h-5 mr-2" />
                  Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-4 rounded-2xl`}>
                    <stat.icon className="w-8 h-8 text-gray-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-xl">
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Your Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{tutorData?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="text-sm font-medium text-gray-900">{tutorData?.primary_contact}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Education</p>
                    <p className="text-sm font-medium text-gray-900">
                      {tutorData?.degree} from {tutorData?.university}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Teaching Level</p>
                    <p className="text-sm font-medium text-gray-900">Class {tutorData?.class_level}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-900">
                  <TrendingUp className="w-5 h-5" />
                  <span>Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-lg font-bold text-amber-900">
                    {applications.length > 0
                      ? Math.round(
                          (applications.filter((a) => a.status.toLowerCase() === "accepted")
                            .length /
                            applications.length) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        applications.length > 0
                          ? (applications.filter((a) => a.status.toLowerCase() === "accepted")
                              .length /
                              applications.length) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Applications */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-xl">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5" />
                    <span>Your Applications</span>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {applications.length} Total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {appsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No applications yet</p>
                    <p className="text-gray-400 text-sm mb-6">
                      Start applying to opportunities to see them here
                    </p>
                    <Button
                      onClick={() => router.push("/dashboard/teacher/opportunities")}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      Browse Opportunities
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300 bg-white hover:border-blue-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg text-gray-900">
                                {app.learner.guardian_name || app.learner.name}
                              </h3>
                              <Badge className={`${getStatusColor(app.status)} border`}>
                                <span className="flex items-center space-x-1">
                                  {getStatusIcon(app.status)}
                                  <span className="capitalize">{app.status}</span>
                                </span>
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <GraduationCap className="w-4 h-4" />
                                <span>Grade {app.learner.grade}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <BookOpen className="w-4 h-4" />
                                <span>{app.learner.board}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{app.learner.area}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <DollarSign className="w-4 h-4" />
                                <span>₹{app.learner.budget}/hr</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(() => {
                            let subjects = [];
                            if (app.learner.subjects) {
                              if (Array.isArray(app.learner.subjects)) {
                                subjects = app.learner.subjects;
                              } else if (typeof app.learner.subjects === 'string') {
                                try {
                                  // Handle string format like "['English', 'Maths', 'Chemistry']"
                                  if (app.learner.subjects.startsWith('[') && app.learner.subjects.endsWith(']')) {
                                    subjects = JSON.parse(app.learner.subjects.replace(/'/g, '"'));
                                  } else {
                                    // Handle comma-separated string
                                    subjects = app.learner.subjects.split(',').map(s => s.trim());
                                  }
                                } catch (e) {
                                  // Fallback to comma-separated parsing
                                  subjects = app.learner.subjects.split(',').map(s => s.trim());
                                }
                              }
                            }
                            
                            return subjects.slice(0, 3).map((subject, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {subject}
                              </Badge>
                            ));
                          })()}
                          {(() => {
                            let totalSubjects = 0;
                            if (app.learner.subjects) {
                              if (Array.isArray(app.learner.subjects)) {
                                totalSubjects = app.learner.subjects.length;
                              } else if (typeof app.learner.subjects === 'string') {
                                try {
                                  if (app.learner.subjects.startsWith('[') && app.learner.subjects.endsWith(']')) {
                                    totalSubjects = JSON.parse(app.learner.subjects.replace(/'/g, '"')).length;
                                  } else {
                                    totalSubjects = app.learner.subjects.split(',').length;
                                  }
                                } catch (e) {
                                  totalSubjects = app.learner.subjects.split(',').length;
                                }
                              }
                            }
                            
                            return totalSubjects > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{totalSubjects - 3} more
                              </Badge>
                            );
                          })()}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-500">
                            Applied on {new Date(app.applied_at).toLocaleDateString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {app.learner.preferred_mode}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
