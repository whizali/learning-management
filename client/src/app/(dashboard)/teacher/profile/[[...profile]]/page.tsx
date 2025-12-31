import React from 'react'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { UserProfile } from '@clerk/nextjs'

const TeacherProfilePage = () => {
  return (
    <>
      <Header title="Profile" subtitle="Manage your profile settings" rightElement={<Button variant="outline">Edit Profile</Button>} />
      <UserProfile path="/teacher/profile" routing="path" appearance={{
        elements: {
          userButtonPopoverCard: {
            backgroundColor: 'customgreys-primarybg',
          },
        },
      }} />
    </>
  )
}

export default TeacherProfilePage;
