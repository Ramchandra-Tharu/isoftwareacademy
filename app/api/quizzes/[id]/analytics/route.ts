import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Attempt from "@/models/Attempt";
import Quiz from "@/models/Quiz";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    await dbConnect();

    // Verify quiz exists
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Fetch attempts and populate the user details
    const attempts = await Attempt.find({ quizId: id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    // Calculate aggregated analytics
    const totalAttempts = attempts.length;
    let totalScore = 0;
    let passedCount = 0;

    attempts.forEach(attempt => {
      totalScore += attempt.percentage;
      if (attempt.passed) passedCount++;
    });

    const averageScore = totalAttempts > 0 ? (totalScore / totalAttempts) : 0;
    const passRate = totalAttempts > 0 ? (passedCount / totalAttempts) * 100 : 0;

    return NextResponse.json({
      quizTitle: quiz.title,
      totalAttempts,
      averageScore,
      passRate,
      attempts
    });
  } catch (error: any) {
    console.error("Get quiz analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
