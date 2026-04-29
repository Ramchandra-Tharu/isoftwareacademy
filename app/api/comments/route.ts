import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Comment from "@/models/Comment";
import Notification from "@/models/Notification";
import { checkSpam } from "@/utils/spamFilter";

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

    // Only fetch approved comments for students
    const comments = await Comment.find({ 
      lessonId, 
      isDeleted: false,
      status: "approved" 
    })
      .populate("userId", "name role image")
      .sort({ isPinned: -1, createdAt: -1 });

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
    const { userId, courseId, lessonId, content, parentId, rating } = await req.json();

    const spamCheck = checkSpam(content);

    const comment = await Comment.create({
      userId,
      courseId,
      lessonId,
      content,
      parentId: parentId || null,
      rating,
      isSpam: spamCheck.isSpam,
      status: spamCheck.isSpam ? "rejected" : "pending"
    });

    // If it's a reply, notify the parent comment owner
    if (parentId) {
      const parentComment = await Comment.findById(parentId).populate("userId");
      if (parentComment && parentComment.userId.toString() !== userId) {
        await Notification.create({
          userId: parentComment.userId,
          title: "New Reply to your comment",
          message: `${comment.content.substring(0, 50)}...`,
          type: "CommentReply",
          link: `/dashboard/courses/${courseId}?lessonId=${lessonId}`
        });
      }
    }

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
