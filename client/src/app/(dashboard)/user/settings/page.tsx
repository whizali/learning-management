import SharedNotificationSettings from "@/components/SharedNotificationSettings";
import UserTypeSwitcher from "@/components/UserTypeSwitcher";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Bell, UserCog } from "lucide-react";

const UserSettings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="w-8 h-8" />
          Settings
        </h1>
        <p className="text-gray-400">Manage your account preferences and notification settings</p>
      </div>

      {/* Notifications Section */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription className="mt-1">
                Control how and when you receive notifications about your courses and activities
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SharedNotificationSettings
            title=""
            subtitle=""
          />
        </CardContent>
      </Card>

      {/* Developer Tools Section */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <UserCog className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <CardTitle>Developer Tools</CardTitle>
              <CardDescription className="mt-1">
                Switch between student and teacher roles for testing different features
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <UserTypeSwitcher />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;