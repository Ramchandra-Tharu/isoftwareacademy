import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Payment from "@/models/Payment";
import Enrollment from "@/models/Enrollment";

function isAdmin(req: Request) {
  return req.headers.get("x-user-role") === "admin";
}

export async function GET(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    
    let query = {};
    if (status && status !== "all") {
      query = { status };
    }

    const payments = await Payment.find(query)
      .populate("userId", "name email")
      .populate("courseId", "title")
      .populate("programId", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json(payments);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Manual Enrollment (Admin Bypass)
export async function POST(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, itemId, itemType } = await req.json();

    await dbConnect();

    const enrollment = await Enrollment.create({
      userId,
      courseId: itemType === "course" ? itemId : undefined,
      programId: itemType === "program" ? itemId : undefined,
      type: itemType,
      status: "active"
    });

    return NextResponse.json(enrollment);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "User is already enrolled in this item" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create manual enrollment" }, { status: 500 });
  }
}
