"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateUserMutation } from "@/state/api";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

const UserTypeSwitcher = () => {
  const { user } = useUser();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const currentUserType = user?.publicMetadata?.userType as "student" | "teacher" | undefined;

  const handleSwitchUserType = async () => {
    if (!user || !currentUserType) {
      toast.error("User information not available");
      return;
    }

    const newUserType = currentUserType === "teacher" ? "student" : "teacher";

    try {
      await updateUser({
        userId: user.id,
        publicMetadata: {
          ...user.publicMetadata,
          userType: newUserType,
        },
      }).unwrap();

      toast.success(`Switched to ${newUserType} mode!`);
      
      // Reload the page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error switching user type:", error);
      toast.error("Failed to switch user type");
    }
  };

  if (!currentUserType) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Developer: Switch User Type</CardTitle>
        <CardDescription>
          For testing purposes, you can switch between student and teacher roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Current Role: <span className="capitalize font-bold">{currentUserType}</span></p>
            <p className="text-xs text-gray-500 mt-1">
              Switch to {currentUserType === "teacher" ? "student" : "teacher"} to test different features
            </p>
          </div>
          <Button
            onClick={handleSwitchUserType}
            disabled={isLoading}
            variant="outline"
            className="gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Switching...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Switch to {currentUserType === "teacher" ? "Student" : "Teacher"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserTypeSwitcher;
