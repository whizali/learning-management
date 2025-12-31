import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isStudentRoute = createRouteMatcher([
  '/user(.*)',
]);

const isTeacherRoute = createRouteMatcher([
  '/teacher(.*)',
]);

const isOnboardingRoute = createRouteMatcher([
  '/setup',
]);

const isAuthRoute = createRouteMatcher([
  '/signin(.*)',
  '/signup(.*)',
]);


export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId } = await auth();
  const userRole = (sessionClaims?.metadata as { userType: 'student' | 'teacher' })?.userType;

  // Allow access to auth routes and onboarding setup
  if (isAuthRoute(req) || isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  // If user is authenticated but hasn't selected a user type, redirect to setup
  if (userId && !userRole && !isOnboardingRoute(req)) {
    const url = new URL('/setup', req.url);
    return NextResponse.redirect(url);
  }

  if (isStudentRoute(req)) {
    if (userRole !== 'student') {
      const url = new URL('/teacher/courses', req.url)
      return NextResponse.redirect(url)
    }
  }

  if (isTeacherRoute(req)) {
    if (userRole !== 'teacher') {
      const url = new URL('/user/courses', req.url)
      return NextResponse.redirect(url)
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
 