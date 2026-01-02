"use client"

import React from 'react'
import Link from 'next/link'
import { BookOpen, Bell } from 'lucide-react'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'

const NonDashboardNavbar = () => {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as 'teacher' | 'student';
  return (
    <div>
      <nav className="nondashboard-navbar">
        <div className='nondashboard-navbar__container'>
        <div className='nondashboard-navbar__search'>
          <Link href="/" className='nondashboard-navbar__brand'>
            Eduverse
          </Link>
          <div className='flex items-center gap-4'>
            <div className="relative group">
                <Link href="/search" className='nondashboard-navbar__search-input'>
                <span className='hidden sm:inline'>Search Courses</span>
                <span className='sm:hidden'>Search</span>
                </Link>
                <BookOpen className='nondashboard-navbar__search-icon' size={18}/>
            </div>
          </div>
        </div>
         <div className='nondashboard-navbar__actions'>
            
            {/* sign in button */}

            <SignedIn>
              <div className='flex items-center gap-4 px-4 py-2 bg-white rounded-full shadow-sm'>
                <UserButton showName={true} userProfileMode='navigation' appearance={{
                  elements: {
                    userButtonPopoverCard: {
                      backgroundColor: 'customgreys-primarybg',
                    },
                  },
                }} userProfileUrl={
                  userRole === "teacher" ? "/teacher/profile" : "/user/profile"
                } />
              </div>
            </SignedIn>

            <SignedOut>
              <Link href="/signin" className='nondashboard-navbar__auth-button--login'>Login</Link>
              <Link href="/signup" className='nondashboard-navbar__auth-button--signup'>Sign Up</Link>
            </SignedOut>

         </div>
         </div>
      </nav>
    </div>
  )
}

export default NonDashboardNavbar
