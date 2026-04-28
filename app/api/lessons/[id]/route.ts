import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Lesson from "@/models/Lesson";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    const lesson = await Lesson.findById(id).populate("courseId");
    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error("Fetch lesson error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
