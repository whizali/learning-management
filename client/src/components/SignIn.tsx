"use client";

import React from 'react'
import { SignIn, useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation';

const SignInComponent = () => {
    const { user } = useUser();
    const searchParams = useSearchParams();
    const isCheckoutPage = searchParams.get('showSignUp') !== null;
    const courseId = searchParams.get('id');

    const signUpUrl = isCheckoutPage ? `/checkout?step=1&id=${courseId}&showSignUp=true` : `/signup`;
    const getRedirectUrl = () => {
      if (isCheckoutPage) {
      return `/checkout?step=2&id=${courseId}&showSignUp=true`;
    }
        const userType = user?.publicMetadata?.userType as string;
        
        // If user doesn't have a userType, redirect to setup page
        if (!userType) {
            return `/setup`;
        }
        
        if (userType === "teacher") {
            return `/teacher/courses`;
        }
        return `/user/courses`;
    }

  return (
    <div>
      <SignIn signUpUrl={signUpUrl} forceRedirectUrl={getRedirectUrl()} routing="hash" afterSignOutUrl="/" />
    </div>
  )
}

export default SignInComponent;
