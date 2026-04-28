import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Quiz from "@/models/Quiz";
import Attempt from "@/models/Attempt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin";

    await dbConnect();

    // If admin, show all quizzes. If not, only published.
    const query = isAdmin ? {} : { isPublished: true };
    const quizzes = await Quiz.find(query).populate("courseId");

    if (isAdmin) {
      const quizzesWithAttempts = await Promise.all(
        quizzes.map(async (quiz) => {
          const attemptsCount = await Attempt.countDocuments({ quizId: quiz._id });
          return { ...quiz.toObject(), attemptsCount };
        })
      );
      return NextResponse.json(quizzesWithAttempts);
    }

    return NextResponse.json(quizzes);
  } catch (error: any) {
    console.error("Fetch quizzes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();

    const newQuiz = await Quiz.create(body);

    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error: any) {
    console.error("Create quiz error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
