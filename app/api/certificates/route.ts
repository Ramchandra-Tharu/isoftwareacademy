import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Certificate from "@/models/Certificate";
import Course from "@/models/Course";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const certificates = await Certificate.find({ userId })
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json(certificates);
  } catch (error: any) {
    console.error("Fetch certificates error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, courseId } = await req.json();

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({ userId, courseId });
    if (existingCert) {
      return NextResponse.json(existingCert);
    }

    // Get user and course data for certificate metadata
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return NextResponse.json(
        { error: "User or course not found" },
        { status: 404 }
      );
    }

    // Generate a unique certificate ID
    const certificateId = `ISL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const certificate = await Certificate.create({
      userId,
      courseId,
      certificateId,
      metadata: {
        studentName: user.name,
        courseTitle: course.title,
      },
    });

    return NextResponse.json(certificate);
  } catch (error: any) {
    console.error("Generate certificate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
