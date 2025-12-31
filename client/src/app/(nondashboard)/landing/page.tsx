"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCarousel } from '@/hooks/useCarousel'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetCoursesQuery } from '@/state/api'
import CourseCardSearch from '@/components/CourseCardSearch'
import { useRouter } from 'next/navigation'

const LoadingSkeleton = () => {
    return (
        <div className="landing-skeleton">
            <div className="landing-skeleton__hero">
                <div className="landing-skeleton__hero-content">
                    <Skeleton className="landing-skeleton__title" />
                    <Skeleton className="landing-skeleton__subtitle" />
                    <Skeleton className="landing-skeleton__subtitle-secondary" />
                    <Skeleton className="landing-skeleton__button" />
                </div>
                <Skeleton className="landing-skeleton__hero-image" />
            </div>

            <div className="landing-skeleton__featured">
                <Skeleton className="landing-skeleton__featured-title" />
                <Skeleton className="landing-skeleton__featured-description" />
                
                <div className="landing-skeleton__tags">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
                        <Skeleton key={index} className="landing-skeleton__tag" />
                    ))}
                </div>

                <div className="landing-skeleton__courses">
                    {[1, 2, 3, 4].map((_, index) => (
                        <Skeleton key={index} className="landing-skeleton__course-card" />
                    ))}
                </div>
            </div>
        </div>
    )
}

const Landing = () => {
    const router = useRouter();
    const currentImage = useCarousel({ totalImages: 3 })
    const { data: courses, isLoading, isError } = useGetCoursesQuery({});

    const handleCourseClick = (courseId: string) => {
        router.push(`/search?courseId=${courseId}`);
    }

    console.log('=== COURSES DEBUG ===');
    console.log('courses data:', courses);
    console.log('courses type:', typeof courses);
    console.log('courses is array:', Array.isArray(courses));
    console.log('isLoading:', isLoading);
    console.log('isError:', isError);
    console.log('===================');

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (isError) {
        return (
            <div className="landing">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Courses</h2>
                    <p className="text-gray-600">Please try again later.</p>
                </div>
            </div>
        );
    }

  return (
    <motion.div
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        transition={{ duration: 0.5 }}
        className='landing'
    >
        <motion.div initial={{ y: 20, opacity: 0}} animate={{ y: 0, opacity: 1}} transition={{ duration: 0.5}} className='landing__hero'>
            <div className='landing__hero-content'>
                <h1 className='landing__title'>Courses for everyone</h1>
                <p className='landing__description'>the list of courses you can enroll in with a wide range of categories
                <br />
                Courses when you need them and want them
                </p>
                <div className="landing__cta">
                    <Link href="/search">
                    <div className="landing__cta-button">Search for Courses</div>
                    </Link>
                </div>
            </div>
            <div className="landing__hero-images">
                {["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"].map((src, index) => (
                    <Image
                        key={index}
                        src={src}
                        alt={`Hero Image ${index + 1}`}
                        fill
                        priority={index === currentImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`landing__hero-image ${index === currentImage ? 'landing__hero-image--active' : ''}`}
                    />

                ))}
            </div>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0}} whileInView={{ y: 0, opacity: 1}} transition={{ duration: 0.5}}
        viewport={{ amount: 0.3, once: true }} className='landing__featured'>
            <h2 className='landing__featured-title'>Featured Courses</h2>
            <p className='landing__featured-description'>
                The list of courses you can enroll in with a wide range of categories
            </p>
            <div className="landing__tags">
                {["web development", "programming", "data science", "artificial intelligence", "machine learning", "cloud computing", "cybersecurity", "blockchain", "software engineering", "game development"].map((tag, index) => (
                    <span key={index} className="landing__tag">
                        {tag}
                    </span>
                ))}
            </div>
            <p className='landing__featured-subtitle'>
                Courses when you need them and want them
            </p>
            <div className="landing__courses">
                {courses && Array.isArray(courses) && courses.slice(0, 4).map((course: Course, index: number) => (
                    <motion.div key={course.courseId} initial={{ y: 50, opacity: 0}} whileInView={{ y: 0, opacity: 1}} transition={{ duration: 0.5, delay: index * 0.2 }} viewport={{ amount: 0.4, once: true }}>
                        <CourseCardSearch course={course} onClick={() => handleCourseClick(course.courseId)} />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    </motion.div>
  )
}

export default Landing
