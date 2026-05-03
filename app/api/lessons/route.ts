import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Lesson from "@/models/Lesson";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const lessons = await Lesson.find({ courseId }).sort({ order: 1 });
    return NextResponse.json(lessons);
  } catch (error: any) {
    console.error("Fetch lessons error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
