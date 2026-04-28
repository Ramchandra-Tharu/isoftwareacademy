import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Program from "@/models/Program";
import Certificate from "@/models/Certificate";

export async function GET(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role");

    // Check if user is admin (this header is set by middleware)
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const [totalStudents, totalCourses, totalPrograms, totalCertificates] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Course.countDocuments({}),
      Program.countDocuments({}),
      Certificate.countDocuments({})
    ]);
    
    // For revenue, we could sum up successful payments if we had a Payment model
    // Using a mock value for now as requested by previous implementation
    const totalRevenue = "$142,400";

    return NextResponse.json({
      totalStudents,
      totalCourses,
      totalPrograms,
      totalCertificates,
      totalRevenue,
      certsIssued: totalCertificates,
      recentActivities: [
        { id: 1, user: "System", action: "synchronized", target: "Database", time: "Just now" },
        { id: 2, user: "Admin", action: "updated", target: "Course Catalog", time: "10 mins ago" },
        { id: 3, user: "Admin", action: "created", target: "New Program", time: "1 hour ago" },
      ]
    });
  } catch (error) {
    console.error("Admin stats fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
