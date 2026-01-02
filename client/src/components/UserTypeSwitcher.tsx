"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Role:</span>
          <span className="px-3 py-1 text-sm font-bold capitalize bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full">
            {currentUserType}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Switch to {currentUserType === "teacher" ? "student" : "teacher"} mode to test different features and permissions
        </p>
      </div>
      <Button
        onClick={handleSwitchUserType}
        disabled={isLoading}
        variant="outline"
        className="gap-2 shrink-0"
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
  );
};

export default UserTypeSwitcher;
