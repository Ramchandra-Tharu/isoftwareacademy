import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Quiz from "@/models/Quiz";
import Attempt from "@/models/Attempt";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, quizId, courseId, answers, startTime, endTime } = await req.json();

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score++;
      }
    });

    const maxScore = quiz.questions.length;
    const percentage = (score / maxScore) * 100;
    const passed = percentage >= quiz.passingScore;

    const attempt = await Attempt.create({
      userId,
      quizId,
      courseId,
      score,
      maxScore,
      percentage,
      passed,
      answers,
      startTime,
      endTime,
    });

    return NextResponse.json(attempt);
  } catch (error: any) {
    console.error("Submit quiz error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
