import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Enrollment from "@/models/Enrollment";
import Progress from "@/models/Progress";
import Attempt from "@/models/Attempt";
import Certificate from "@/models/Certificate";
import Course from "@/models/Course";
import Quiz from "@/models/Quiz"; // To populate quiz titles
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

    // 4. Pending Tasks
    const enrollments = await Enrollment.find({ userId, type: "course", status: "active" }).select("courseId");
    const courseIds = enrollments.map(e => e.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } }).select("totalLessons");
    const totalLessonsAvailable = courses.reduce((acc, curr) => acc + (curr.totalLessons || 0), 0);
    const pendingTasks = Math.max(0, totalLessonsAvailable - totalLessonsCompleted);

    // 5. Performance Analytics (Genuine data from attempts)
    const allAttempts = await Attempt.find({ userId }).populate("quizId", "title").sort({ createdAt: 1 });
    
    const totalAttemptsCount = allAttempts.length;
    const passedAttempts = allAttempts.filter(a => a.passed).length;
    const avgScore = totalAttemptsCount > 0 
      ? Math.round(allAttempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / totalAttemptsCount)
      : 0;

    const successRate = totalAttemptsCount > 0 ? Math.round((passedAttempts / totalAttemptsCount) * 100) : 0;

    // Last 7 attempts for trend chart
    const recentAttempts = allAttempts.slice(-7).map(a => ({
      title: (a.quizId as any)?.title?.substring(0, 15) + ((a.quizId as any)?.title?.length > 15 ? "..." : "") || "Quiz",
      score: a.percentage,
      passed: a.passed,
      date: a.createdAt.toISOString().split('T')[0]
    }));

    // 6. Genuine Time Calculation from attempts (seconds spent)
    const totalSecondsSpentOnQuizzes = allAttempts.reduce((acc, curr) => {
      if (curr.startTime && curr.endTime) {
        return acc + Math.floor((new Date(curr.endTime).getTime() - new Date(curr.startTime).getTime()) / 1000);
      }
      return acc;
    }, 0);
    const hoursSpent = (totalSecondsSpentOnQuizzes / 3600).toFixed(1);

    // 8. Genuine Daily Activity Array (Mon - Sun distribution over all time or last 7 days)
    const weeklyActivity = [0, 0, 0, 0, 0, 0, 0]; // M T W T F S S
    const now = new Date();
    
    [...allAttempts.map(a => a.createdAt), ...progressRecords.map(p => p.updatedAt)].forEach(dateStr => {
        const date = new Date(dateStr);
        // Only aggregate last 7 days of behavior to match the UI label
        const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff < 7) {
            let dayIdx = date.getDay(); // 0=Sun
            let mappedIdx = dayIdx === 0 ? 6 : dayIdx - 1; // M=0...S=6
            weeklyActivity[mappedIdx] += 1;
        }
    });

    // 9. Certificates
    const certificatesCount = await Certificate.countDocuments({ userId });

    return NextResponse.json({
      enrolled: activeEnrollments,
      programs: activePrograms,
      completedLessons: totalLessonsCompleted,
      completedCourses,
      avgProgress: `${avgProgress}%`,
      pendingTasks,
      avgScore: `${avgScore}%`,
      certs: certificatesCount,
      streak: activeDates.size, // Genuine: Number of active study days
      timeSpent: `${hoursSpent}h`, // Genuine time recorded in sessions
      achievements: certificatesCount, // Pure genuine count of earned items
      hasActivity: totalAttemptsCount > 0 || totalLessonsCompleted > 0,
      analytics: {
        attemptsTrend: recentAttempts,
        weeklyActivity,
        summary: {
          totalAttempts: totalAttemptsCount,
          passed: passedAttempts,
          failed: totalAttemptsCount - passedAttempts,
          successRate,
        }
      }
    });

  } catch (error: any) {
    console.error("Fetch stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

