import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const instructors = await User.find({ role: "instructor" })
      .select("name email image bio socialLinks")
      .sort({ name: 1 });
    return NextResponse.json(instructors);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
