import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Progress from "@/models/Progress";
import Lesson from "@/models/Lesson";
import Quiz from "@/models/Quiz";
import Certificate from "@/models/Certificate";
import User from "@/models/User";
import Course from "@/models/Course";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    let query: any = { userId: session.user.id };
    if (courseId) {
      query.courseId = courseId;
    }

    const progress = await Progress.find(query).populate("courseId", "title totalLessons thumbnail");

    // If fetching for a specific course and it doesn't exist yet, return an empty template
    if (courseId && progress.length === 0) {
      return NextResponse.json({
        userId: session.user.id,
        courseId,
        completedLessons: [],
        completedQuizzes: [],
        percentage: 0,
        lastAccessed: new Date(),
      });
    }

    return NextResponse.json(courseId ? progress[0] : progress);
  } catch (error: any) {
    console.error("Fetch progress error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { courseId, lessonId, action = "toggleComplete" } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: "courseId required" }, { status: 400 });
    }

    const userId = session.user.id;

    // 1. Fetch or create progress record
    let progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedLessons: [],
        completedQuizzes: [],
        percentage: 0,
      });
    }

    if (action === "toggleComplete" && lessonId) {
        // 2. Toggle completion
        const lessonIndex = progress.completedLessons.indexOf(lessonId);
        if (lessonIndex > -1) {
          progress.completedLessons.splice(lessonIndex, 1);
        } else {
          progress.completedLessons.push(lessonId);
        }
    }

    progress.lastAccessed = new Date();

    // 3. Recalculate percentage if lessons exist
    const totalLessons = await Lesson.countDocuments({ courseId });
    const completedCount = progress.completedLessons.length;
    
    if (totalLessons > 0) {
      progress.percentage = Math.min(100, Math.round((completedCount / totalLessons) * 100));
    } else {
      progress.percentage = completedCount > 0 ? 100 : 0;
    }

    await progress.save();

    // 4. Auto-generate certificate if 100%
    let certificateGenerated = false;
    let newCertificateId = null;

    if (progress.percentage >= 100) {
      const existingCert = await Certificate.findOne({ userId, courseId });
      if (!existingCert) {
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);
        
        if (user && course) {
          const certificateId = `ISL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          
          await Certificate.create({
            userId,
            courseId,
            certificateId,
            metadata: {
              studentName: user.name,
              courseTitle: course.title,
              grade: "Completed",
            },
          });
          
          certificateGenerated = true;
          newCertificateId = certificateId;
        }
      }
    }

    return NextResponse.json({
      progress,
      certificateGenerated,
      newCertificateId
    });

  } catch (error: any) {
    console.error("Update progress error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
