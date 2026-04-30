import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Comment from "@/models/Comment";

export async function GET() {
  try {
    await dbConnect();

    // Fetch the latest 5 approved comments to show in the dashboard "Community Sync"
    const activities = await Comment.find({ 
      isDeleted: false,
      status: "approved" 
    })
      .populate("userId", "name image role")
      .populate("courseId", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    // Transform data for the dashboard UI
    const formattedActivities = activities.map(activity => {
        const user = activity.userId as any;
        return {
            id: activity._id,
            user: user?.name || "System Core",
            image: user?.image || null,
            action: `Commented on ${activity.courseId?.title || "a lesson"}`,
            content: activity.content,
            time: formatTimeAgo(activity.createdAt),
            points: activity.rating ? `${activity.rating} Stars` : "REPLY",
            type: "Comment"
        };
    });

    return NextResponse.json(formattedActivities);
  } catch (error: any) {
    console.error("Fetch dashboard activities error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}
