import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Comment from "@/models/Comment";

// Authorization check helper (based on the project's header-based middleware pattern)
function isAdmin(req: Request) {
  const userRole = req.headers.get("x-user-role");
  return userRole === "admin";
}

export async function GET(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    
    // Filters
    const status = searchParams.get("status");
    const courseId = searchParams.get("courseId");
    const search = searchParams.get("search");
    const isDeleted = searchParams.get("isDeleted") === "true";

    const query: any = { isDeleted };

    if (status && status !== "all") query.status = status;
    if (courseId) query.courseId = courseId;
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const comments = await Comment.find(query)
      .populate("userId", "name email image role")
      .populate("courseId", "title")
      .populate("lessonId", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error: any) {
    console.error("Admin Fetch Comments Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const { ids, action, status: targetStatus } = await req.json();

    if (!ids || !Array.isArray(ids) || !action) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    let updateData: any = {};
    if (action === "status") {
      updateData = { status: targetStatus };
    } else if (action === "delete") {
      updateData = { isDeleted: true, deletedAt: new Date() };
    } else if (action === "restore") {
      updateData = { isDeleted: false, deletedAt: null };
    } else if (action === "spam") {
      updateData = { isSpam: true, status: "rejected" };
    }

    const result = await Comment.updateMany(
      { _id: { $in: ids } },
      { $set: updateData }
    );

    return NextResponse.json({ 
      message: `Bulk ${action} successful`, 
      modifiedCount: result.modifiedCount 
    });
  } catch (error: any) {
    console.error("Admin Bulk Action Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
