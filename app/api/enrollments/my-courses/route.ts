import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Enrollment from "@/models/Enrollment";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import Progress from "@/models/Progress";
import Course from "@/models/Course";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;
    
    // 1. Fetch active enrollments
    const enrollments = await Enrollment.find({ 
      userId,
      status: "active" 
    })
    .populate("courseId")
    .populate("programId")
    .sort({ enrolledAt: -1 });

    // 2. Fetch progress records to catch courses started but not "officially" enrolled (or for free access)
    const progressRecords = await Progress.find({ userId }).populate("courseId");

    // 3. Merge and consolidate courses
    const courseMap = new Map();

    // Process enrollments first
    enrollments.forEach(e => {
       const item = e.courseId || e.programId;
       if (item) {
          const itemObj = item.toObject();
          courseMap.set(item._id.toString(), {
             ...itemObj,
             enrollmentType: e.type,
             enrolledAt: e.enrolledAt,
             progress: 0 // Default, will be updated if progress record exists
          });
       }
    });

    // Process progress records (will add new courses or update progress for existing ones)
    progressRecords.forEach(p => {
       if (p.courseId) {
          const courseIdStr = p.courseId._id.toString();
          if (courseMap.has(courseIdStr)) {
             // Update progress for existing enrolled course
             const existing = courseMap.get(courseIdStr);
             courseMap.set(courseIdStr, { ...existing, progress: p.percentage });
          } else {
             // Add course that has progress but no enrollment record
             const courseObj = p.courseId.toObject();
             courseMap.set(courseIdStr, {
                ...courseObj,
                enrollmentType: "course",
                enrolledAt: p.createdAt,
                progress: p.percentage
             });
          }
       }
    });

    const courses = Array.from(courseMap.values()).sort((a, b) => 
       new Date(b.enrolledAt || b.createdAt).getTime() - new Date(a.enrolledAt || a.createdAt).getTime()
    );

    return NextResponse.json(courses);

  } catch (error: any) {
    console.error("My Courses Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
