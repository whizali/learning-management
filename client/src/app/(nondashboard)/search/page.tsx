"use client"

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useGetCoursesQuery } from '@/state/api'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Loading from '@/components/Loading'
import { motion } from 'framer-motion'
import CourseCardSearch from '@/components/CourseCardSearch'
import SelectedCourse from './SelectedCourse'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search as SearchIcon, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'


const Search = () => {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const { data: courses, isLoading, isError } = useGetCoursesQuery({});
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const router = useRouter();

    // Get unique categories and levels from courses
    const categories = useMemo(() => {
        if (!courses) return [];
        const uniqueCategories = Array.from(new Set(courses.map(c => c.category)));
        return uniqueCategories.filter(Boolean);
    }, [courses]);

    // Filter courses based on search and filters
    const filteredCourses = useMemo(() => {
        if (!courses) return [];
        
        return courses.filter((course) => {
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                course.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
            
            const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
            
            return matchesSearch && matchesCategory && matchesLevel;
        });
    }, [courses, searchTerm, selectedCategory, selectedLevel]);

     useEffect(() => {
        if (filteredCourses.length > 0) {
            if (id) {
                const course = filteredCourses.find((c) => c.courseId === id);
                setSelectedCourse(course || filteredCourses[0]);
            } else {
                setSelectedCourse(filteredCourses[0]);
            }
        } else {
            setSelectedCourse(null);
        }
     }, [filteredCourses, id])

     if (isLoading) {
        return <Loading />
     }
     if (isError || !courses) {
        return <div>Failed to load courses</div>
     }

     const handleCourseSelect = (course: Course) => {
        setSelectedCourse(course);
        router.push(`/search?id=${course.courseId}`, { scroll: false });
     }

     const handleEnrollNow = (courseId: string) => {
        router.push(`/checkout?step=1&id=${courseId}&showSignUp=false`);
     }

     const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedLevel('all');
     }

     const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all';

  return (
    <motion.div initial={{ opacity: 0}} animate={{ opacity: 1}} transition={{ duration: 0.5 }} className='search'>
      <div className='space-y-4 mb-6'>
        <h1 className='text-neutral-300 font-bold text-3xl'>Explore Courses</h1>
        <p className='search__subtitle text-gray-400'>Discover and enroll in courses that match your interests</p>
        
        {/* Search and Filter Section */}
        <div className='space-y-4'>
          {/* Search Bar */}
          <div className='relative'>
            <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
            <Input
              type='text'
              placeholder='Search courses by title, description, or instructor...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-10 py-6 text-base bg-violet-100'
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='absolute right-3 top-1/2 -translate-y-1/2'
              >
                <X className='w-5 h-5' />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className='flex flex-wrap items-center gap-3'>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className='w-[180px] bg-violet-100 border-gray-700'>
                <SelectValue placeholder='Category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className='capitalize'>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className='w-[180px] bg-violet-100 border-gray-700'>
                <SelectValue placeholder='Level' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Levels</SelectItem>
                <SelectItem value='Beginner'>Beginner</SelectItem>
                <SelectItem value='Intermediate'>Intermediate</SelectItem>
                <SelectItem value='Advanced'>Advanced</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant='ghost'
                size='sm'
                onClick={clearFilters}
                className='text-gray-400 hover:text-gray-900'
              >
                <X className='w-4 h-4 mr-1' />
                Clear Filters
              </Button>
            )}

            <div className='ml-auto'>
              <Badge variant='outline' className='text-gray-400 border-gray-700'>
                {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className='search__content'>
        <motion.div initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{ duration: 0.5, delay: 0.2 }} className='search__courses-grid'>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course: Course) => (
              <CourseCardSearch 
                key={course.courseId} 
                course={course} 
                isSelected={selectedCourse?.courseId === course.courseId} 
                onClick={() => handleCourseSelect(course)} 
              />
            ))
          ) : (
            <div className='col-span-full text-center py-12'>
              <SearchIcon className='w-16 h-16 mx-auto mb-4 text-gray-600' />
              <h3 className='text-xl font-semibold text-gray-400 mb-2'>No courses found</h3>
              <p className='text-gray-500 mb-4'>
                {searchTerm 
                  ? `No courses match your search "${searchTerm}"`
                  : 'Try adjusting your filters to see more results'
                }
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant='outline'>
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </motion.div>

        {selectedCourse && (
          <motion.div initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{ duration: 0.5, delay: 0.2 }} className='search__selected-course'>
            <SelectedCourse course={selectedCourse} handleEnrollNow={handleEnrollNow} />
          </motion.div>
        )}

      </div>
    </motion.div>
  )
}

export default Search
