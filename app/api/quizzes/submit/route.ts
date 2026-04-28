import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Quiz from "@/models/Quiz";
import Attempt from "@/models/Attempt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { quizId, courseId, answers, startTime, endTime } = await req.json();
    const userId = session.user.id;

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
