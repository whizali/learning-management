import SharedNotificationSettings from "@/components/SharedNotificationSettings";
import UserTypeSwitcher from "@/components/UserTypeSwitcher";
import React from "react";

const UserSettings = () => {
  return (
    <div className="w-3/5">
      <SharedNotificationSettings
        title="User Settings"
        subtitle="Manage your user notification settings"
      />
      <UserTypeSwitcher />
    </div>
  );
};

export default UserSettings;