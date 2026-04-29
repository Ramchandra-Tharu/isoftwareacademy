import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Comment from "@/models/Comment";

function isAdmin(req: Request) {
  const userRole = req.headers.get("x-user-role");
  return userRole === "admin";
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    await dbConnect();
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(updatedComment);
  } catch (error: any) {
    console.error("Admin Single Comment Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await dbConnect();
    
    // Soft delete
    const result = await Comment.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date()
    });

    if (!result) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Comment soft-deleted successfully" });
  } catch (error: any) {
    console.error("Admin Comment Delete Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
