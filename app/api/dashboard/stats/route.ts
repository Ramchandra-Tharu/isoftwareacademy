import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Enrollment from "@/models/Enrollment";
import Progress from "@/models/Progress";
import Attempt from "@/models/Attempt";
import Certificate from "@/models/Certificate";
import Course from "@/models/Course";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;

    // 1. Active Courses
    const activeEnrollments = await Enrollment.countDocuments({ 
      userId, 
      type: "course",
      status: "active" 
    });

    // 2. Active Programs
    const activePrograms = await Enrollment.countDocuments({ 
      userId, 
      type: "program",
      status: "active" 
    });

    // 3. Lessons Completed & Progress
    const progressRecords = await Progress.find({ userId });
    const totalLessonsCompleted = progressRecords.reduce((acc, curr) => {
      return acc + (curr.completedLessons?.length || 0);
    }, 0);

    const completedCourses = progressRecords.filter(p => p.percentage === 100).length;
    
    const avgProgress = progressRecords.length > 0
      ? Math.round(progressRecords.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / progressRecords.length)
      : 0;

    // 4. Pending Tasks (Lessons not yet completed in enrolled courses)
    // Fetch all enrolled course IDs
    const enrollments = await Enrollment.find({ userId, type: "course", status: "active" }).select("courseId");
    const courseIds = enrollments.map(e => e.courseId);
    
    const courses = await Course.find({ _id: { $in: courseIds } }).select("totalLessons");
    const totalLessonsAvailable = courses.reduce((acc, curr) => acc + (curr.totalLessons || 0), 0);
    const pendingTasks = Math.max(0, totalLessonsAvailable - totalLessonsCompleted);

    // 5. Average Score
    const attempts = await Attempt.find({ userId });
    const avgScore = attempts.length > 0 
      ? Math.round(attempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / attempts.length)
      : 0;

    // 6. Certificates
    const certificatesCount = await Certificate.countDocuments({ userId });

    // 7. Streak & Time Spent (Mocking for now as models don't support it yet)
    // In a real app, we'd have a DailyActivity model or similar
    const streak = 5; // Mock
    const timeSpent = "12.5h"; // Mock

    return NextResponse.json({
      enrolled: activeEnrollments,
      programs: activePrograms,
      completedLessons: totalLessonsCompleted,
      completedCourses,
      avgProgress: `${avgProgress}%`,
      pendingTasks,
      avgScore: `${avgScore}%`,
      certs: certificatesCount,
      streak,
      timeSpent,
      achievements: certificatesCount + 3, // Mock achievements
      hasActivity: activeEnrollments > 0 || totalLessonsCompleted > 0 || attempts.length > 0
    });

  } catch (error: any) {
    console.error("Fetch stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
