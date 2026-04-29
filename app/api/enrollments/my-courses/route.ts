import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Enrollment from "@/models/Enrollment";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Fetch active enrollments and populate course/program details
    const enrollments = await Enrollment.find({ 
      userId: session.user.id,
      status: "active" 
    })
    .populate("courseId")
    .populate("programId")
    .sort({ enrolledAt: -1 });

    // Extract only the course/program objects
    const courses = enrollments.map(e => {
       const item = e.courseId || e.programId;
       return {
          ...item.toObject(),
          enrollmentType: e.type,
          enrolledAt: e.enrolledAt
       };
    });

    return NextResponse.json(courses);

  } catch (error: any) {
    console.error("My Courses Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
