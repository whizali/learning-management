import SharedNotificationSettings from "@/components/SharedNotificationSettings";
import UserTypeSwitcher from "@/components/UserTypeSwitcher";
import React from "react";

const TeacherSettings = () => {
  return (
    <div className="w-3/5">
      <SharedNotificationSettings
        title="Teacher Settings"
        subtitle="Manage your teacher notification settings"
      />
      <UserTypeSwitcher />
    </div>
  );
};

export default TeacherSettings;