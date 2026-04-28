import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Quiz from "@/models/Quiz";

export async function GET() {
  try {
    await dbConnect();
    const quizzes = await Quiz.find({ isPublished: true }).populate("courseId");
    return NextResponse.json(quizzes);
  } catch (error: any) {
    console.error("Fetch quizzes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
