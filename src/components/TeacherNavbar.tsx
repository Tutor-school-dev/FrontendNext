"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "../hooks/useDashboardStore";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import Cookies from "js-cookie";

export default function TeacherNavbar() {
  const router = useRouter();
  const { teacher } = useDashboardStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    console.log("TeacherNavbar: Logout function called");
    // Clear all cookies and localStorage
    Cookies.remove("authToken");
    Cookies.remove("jwt_Token"); // Also remove the correct token name
    Cookies.remove("refreshToken");
    localStorage.removeItem("model");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    
    // Redirect to home
    router.push("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b transition-all duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">TutorSchool</h1>
          </div>

          {/* Right side - User profile */}
          <div className="flex items-center space-x-4">
            {/* Profile Picture and Name */}
            <div className="flex items-center space-x-3">
              {teacher?.profile_pic ? (
                <img
                  src={teacher.profile_pic}
                  alt={teacher.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {teacher?.name || "Teacher"}
              </span>
            </div>

            {/* Dropdown Menu */}
            <div className="relative">
              <button 
                className="flex items-center space-x-1 px-3 py-1 rounded-md hover:bg-gray-100"
                onClick={() => {}}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              {/* Simple dropdown for now */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 hidden">
                <div className="py-1">
                  <button 
                    onClick={() => router.push("/profile")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}