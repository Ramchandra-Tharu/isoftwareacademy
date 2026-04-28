import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Quiz from "@/models/Quiz";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin";
    
    await dbConnect();
    const query = isAdmin ? {} : { isPublished: true };
    const quizzes = await Quiz.find(query).populate("courseId");
    
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

    const body = await req.json();
    await dbConnect();

    const quiz = await Quiz.create(body);
    return NextResponse.json(quiz, { status: 201 });
  } catch (error: any) {
    console.error("Create quiz error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
