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
            <button className='nondashboard-navbar__notification-button'>
                <span className="nondashboard-navbar__notification-indicator"></span>
                <Bell className='nondashboard-navbar__notification-icon' size={18}/>
            </button>
            {/* sign in button */}

            <SignedIn>
              <UserButton showName={true} userProfileMode='navigation' appearance={{
                elements: {
                  userButtonPopoverCard: {
                    backgroundColor: 'customgreys-primarybg',
                  },
                },
              }} userProfileUrl={
                userRole === "teacher" ? "/teacher/profile" : "/user/profile"
              } />
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
