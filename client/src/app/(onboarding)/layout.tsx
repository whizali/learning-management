import React from 'react';

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="onboarding-layout min-h-screen">
      {children}
    </div>
  );
};

export default OnboardingLayout;
