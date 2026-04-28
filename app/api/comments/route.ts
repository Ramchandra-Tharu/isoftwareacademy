import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Comment from "@/models/Comment";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    const comments = await Comment.find({ lessonId, isDeleted: false })
      .populate("userId", "name role image")
      .sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error: any) {
    console.error("Fetch comments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, courseId, lessonId, content, parentId } = await req.json();

    const comment = await Comment.create({
      userId,
      courseId,
      lessonId,
      content,
      parentId,
    });

    const populatedComment = await comment.populate("userId", "name role image");

    return NextResponse.json(populatedComment);
  } catch (error: any) {
    console.error("Create comment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
