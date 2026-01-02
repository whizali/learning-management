"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Loading from "@/components/Loading";
import { useCourseProgressData } from "@/hooks/useCourseProgressData";
import VideoPlayer from "@/components/VideoPlayer";
import { 
  CheckCircle, 
  FileText, 
  BookOpen, 
  ChevronRight,
  Play
} from "lucide-react";

const Course = () => {
  const {
    user,
    course,
    userProgress,
    currentSection,
    currentChapter,
    isLoading,
    isChapterCompleted,
    updateChapterProgress,
    hasMarkedComplete,
    setHasMarkedComplete,
  } = useCourseProgressData();

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (
      state.played >= 0.8 &&
      !hasMarkedComplete &&
      currentChapter &&
      currentSection &&
      userProgress?.sections &&
      !isChapterCompleted()
    ) {
      setHasMarkedComplete(true);
      updateChapterProgress(
        currentSection.sectionId,
        currentChapter.chapterId,
        true
      );
    }
  };

  // Calculate overall course progress
  const calculateProgress = () => {
    if (!userProgress?.sections) return 0;
    
    const totalChapters = userProgress.sections.reduce(
      (acc, section) => acc + section.chapters.length,
      0
    );
    const completedChapters = userProgress.sections.reduce(
      (acc, section) => acc + section.chapters.filter(ch => ch.completed).length,
      0
    );
    
    return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  };

  const progress = calculateProgress();

  if (isLoading) return <Loading />;
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Please Sign In</h3>
            <p className="text-gray-600">Sign in to view this course content.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!course || !userProgress) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Course Not Found</h3>
            <p className="text-gray-600">Unable to load course content.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Breadcrumb and Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="hover:text-gray-400 cursor-pointer">{course.title}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-gray-400 cursor-pointer">{currentSection?.sectionTitle}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-400 font-medium">{currentChapter?.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {currentChapter?.title}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage alt={course.teacherName} />
                  <AvatarFallback className="text-xs bg-blue-500 text-white">
                    {course.teacherName[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-400 dark:text-gray-300">
                  {course.teacherName}
                </span>
              </div>
              {isChapterCompleted() && (
                <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </Badge>
              )}
            </div>
          </div>

          {/* Progress Card */}
          <Card className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 lg:w-64">
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Progress</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Video Player */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-black">
            {currentChapter?.video ? (
              <VideoPlayer
                src={currentChapter.video as string}
                onProgress={handleProgress}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Play className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">No video available for this chapter</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content and Instructor Info */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Notes Section */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Chapter Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {currentChapter?.content ? (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {currentChapter.content}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No notes available for this chapter</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructor Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Your Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="w-8 h-8">
                  <AvatarImage alt={course.teacherName} />
                  <AvatarFallback className="text-lg bg-linear-to-br from-blue-500 to-purple-500 text-white">
                    {course.teacherName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {course.teacherName}
                  </h4>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Course;