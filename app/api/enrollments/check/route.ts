import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Enrollment from "@/models/Enrollment";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ isEnrolled: false });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    await dbConnect();
    const enrollment = await Enrollment.findOne({
      userId: session.user.id,
      $or: [{ courseId: itemId }, { programId: itemId }],
      status: "active"
    });

    return NextResponse.json({ isEnrolled: !!enrollment });

  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
