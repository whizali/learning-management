import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import UserCourseProgress from "../models/userCourseProgressModel.js";
import Course from "../models/courseModel.js";
import { calculateOverallProgress, mergeSections } from "../utils/utils.js";

export const getUserEnrolledCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const auth = getAuth(req);

  if (!auth || auth.userId !== userId) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  try {
    const enrolledCourses = await UserCourseProgress.query("userId")
      .eq(userId)
      .exec();
    const courseIds = enrolledCourses.map((item: any) => item.courseId);
    const courses = await Course.batchGet(courseIds);
    res.json({
      message: "Enrolled courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving enrolled courses", error });
  }
};

export const getUserCourseProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;

  if (!userId || !courseId) {
    res.status(400).json({ message: "User ID and Course ID are required" });
    return;
  }

  try {
    const progress = await UserCourseProgress.get({ userId, courseId });
    if (!progress) {
      res
        .status(404)
        .json({ message: "Course progress not found for this user" });
      return;
    }
    res.json({
      message: "Course progress retrieved successfully",
      data: progress,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user course progress", error });
  }
};

export const updateUserCourseProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;
  const progressData = req.body;

  if (!userId || !courseId) {
    res.status(400).json({ message: "User ID and Course ID are required" });
    return;
  }

  try {
    const existingProgress = await UserCourseProgress.get({ userId, courseId });

    if (!existingProgress) {
      // If no progress exists, create initial progress
      const newProgress = new UserCourseProgress({
        userId,
        courseId,
        enrollmentDate: new Date().toISOString(),
        overallProgress: 0,
        sections: progressData.sections || [],
        lastAccessedTimestamp: new Date().toISOString(),
      });
      await newProgress.save();
      res.json({
        message: "",
        data: newProgress,
      });
      return;
    }

    // Merge existing progress with new progress data
    existingProgress.sections = mergeSections(
      existingProgress.sections,
      progressData.sections || []
    );
    existingProgress.lastAccessedTimestamp = new Date().toISOString();
    existingProgress.overallProgress = calculateOverallProgress(existingProgress.sections);

    await existingProgress.save();

    res.json({
      message: "",
      data: existingProgress,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({
      message: "Error updating user course progress",
      error,
    });
  }
};