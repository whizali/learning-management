"use client";

import Toolbar from "@/components/Toolbar";
import CourseCard from "@/components/CourseCard";
import { useGetUserEnrolledCoursesQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState, useMemo } from "react";
import Loading from "@/components/Loading";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, GraduationCap, TrendingUp, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Courses = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    data: courses,
    isLoading,
    isError,
  } = useGetUserEnrolledCoursesQuery(user?.id ?? "", {
    skip: !isLoaded || !user,
  });

  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  // Calculate stats
  const totalCourses = courses?.length || 0;
  // Note: Progress tracking would require fetching UserCourseProgress for each course
  // For now, showing simple stats based on enrollment
  const inProgressCourses = 0; // TODO: Implement with progress data
  const completedCourses = 0; // TODO: Implement with progress data

  const handleGoToCourse = (course: Course) => {
    if (
      course.sections &&
      course.sections.length > 0 &&
      course.sections[0].chapters.length > 0
    ) {
      const firstChapter = course.sections[0].chapters[0];
      router.push(
        `/user/courses/${course.courseId}/chapters/${firstChapter.chapterId}`,
        {
          scroll: false,
        }
      );
    } else {
      router.push(`/user/courses/${course.courseId}`, {
        scroll: false,
      });
    }
  };

  if (!isLoaded || isLoading) return <Loading />;
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Please Sign In</h3>
            <p className="text-gray-600 mb-4">Sign in to view your courses and track your progress.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="user-courses space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">My Learning</h1>
        <p className="text-gray-400">Track your progress and continue your learning journey</p>
      </div>

      {/* Stats Cards */}
      {courses && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Courses</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">{totalCourses}</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-full">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">In Progress</p>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-2">{inProgressCourses}</p>
                </div>
                <div className="p-3 bg-orange-500 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">{completedCourses}</p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter Toolbar */}
      {courses && courses.length > 0 && (
        <Toolbar
          onSearch={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />
      )}

      {/* Empty State */}
      {(isError || !courses || courses.length === 0) && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Courses Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-sm">
              You haven't enrolled in any courses yet. Start your learning journey by exploring available courses.
            </p>
            <Link href="/search">
              <Button className="gap-2">
                <Search className="w-4 h-4" />
                Browse Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* No Results State */}
      {courses && courses.length > 0 && filteredCourses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Courses Grid */}
      {filteredCourses.length > 0 && (
        <div className="user-courses__grid">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.courseId}
              course={course}
              onGoToCourse={handleGoToCourse}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;