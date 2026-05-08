import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Quiz from "@/models/Quiz";

export async function GET() {
  try {
    await dbConnect();
    const quiz = await Quiz.findOne({ slug: "java-fundamentals-quiz" });
    if (quiz) {
      return NextResponse.json({
        exists: true,
        title: quiz.title,
        questionsCount: quiz.questions.length,
      });
    } else {
      return NextResponse.json({
        exists: false,
        message: "Java Quiz not found.",
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
