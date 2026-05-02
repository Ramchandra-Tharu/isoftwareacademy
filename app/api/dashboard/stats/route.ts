import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Enrollment from "@/models/Enrollment";
import Progress from "@/models/Progress";
import Attempt from "@/models/Attempt";
import Certificate from "@/models/Certificate";
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
      status: "active" 
    });

    // 2. Lessons Completed (Aggregate from Progress model)
    const progressRecords = await Progress.find({ userId });
    const totalLessonsCompleted = progressRecords.reduce((acc, curr) => {
      return acc + (curr.completedLessons?.length || 0);
    }, 0);

    // 3. Average Score
    const attempts = await Attempt.find({ userId });
    const avgScore = attempts.length > 0 
      ? Math.round(attempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / attempts.length)
      : 0;

    // 4. Certificates
    const certificatesCount = await Certificate.countDocuments({ userId });

    return NextResponse.json({
      enrolled: activeEnrollments,
      completed: totalLessonsCompleted,
      avgScore: `${avgScore}%`,
      certs: certificatesCount,
      hasActivity: activeEnrollments > 0 || totalLessonsCompleted > 0 || attempts.length > 0
    });

  } catch (error: any) {
    console.error("Fetch stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
