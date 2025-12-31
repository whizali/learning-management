"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateUserMutation } from "@/state/api";
import { toast } from "sonner";

const UserTypeSelection = () => {
  const { user } = useUser();
  const router = useRouter();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [selectedType, setSelectedType] = useState<"student" | "teacher" | null>(null);

  const handleUserTypeSelection = async (userType: "student" | "teacher") => {
    if (!user) {
      toast.error("User not found. Please try again.");
      return;
    }

    try {
      setSelectedType(userType);
      
      await updateUser({
        userId: user.id,
        publicMetadata: {
          userType,
          settings: user.publicMetadata.settings || {
            emailAlerts: true,
            smsAlerts: false,
            courseNotifications: false,
            notificationFrequency: "daily",
          },
        },
      }).unwrap();

      toast.success(`Account set up as ${userType}!`);
      
      // Redirect based on user type
      setTimeout(() => {
        if (userType === "teacher") {
          router.push("/teacher/courses");
        } else {
          router.push("/user/courses");
        }
      }, 500);
    } catch (error) {
      console.error("Error updating user type:", error);
      toast.error("Failed to set up account. Please try again.");
      setSelectedType(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-4xl shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-8">
          <CardTitle className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Learning Management System!
          </CardTitle>
          <CardDescription className="text-lg">
            Please select your role to get started
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Student Card */}
            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                selectedType === "student" 
                  ? "border-blue-500 bg-blue-50 shadow-lg scale-105" 
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => !isLoading && handleUserTypeSelection("student")}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                <div className={`p-6 rounded-full ${
                  selectedType === "student" 
                    ? "bg-blue-500 text-white" 
                    : "bg-blue-100 text-blue-600"
                }`}>
                  <GraduationCap className="w-16 h-16" />
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">Student</h3>
                  <p className="text-gray-600">
                    I want to learn and enroll in courses
                  </p>
                </div>

                <ul className="text-sm text-gray-600 space-y-2 text-left w-full">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Browse and enroll in courses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Track your learning progress</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Access course materials</span>
                  </li>
                </ul>

                {selectedType === "student" && isLoading && (
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                )}
              </CardContent>
            </Card>

            {/* Teacher Card */}
            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                selectedType === "teacher" 
                  ? "border-purple-500 bg-purple-50 shadow-lg scale-105" 
                  : "border-gray-200 hover:border-purple-300"
              }`}
              onClick={() => !isLoading && handleUserTypeSelection("teacher")}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                <div className={`p-6 rounded-full ${
                  selectedType === "teacher" 
                    ? "bg-purple-500 text-white" 
                    : "bg-purple-100 text-purple-600"
                }`}>
                  <BookOpen className="w-16 h-16" />
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">Teacher</h3>
                  <p className="text-gray-600">
                    I want to create and manage courses
                  </p>
                </div>

                <ul className="text-sm text-gray-600 space-y-2 text-left w-full">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Create and publish courses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Manage course content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Track student progress</span>
                  </li>
                </ul>

                {selectedType === "teacher" && isLoading && (
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-sm text-gray-500 mt-6">
            <p>You can always contact support to change your role later if needed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTypeSelection;
