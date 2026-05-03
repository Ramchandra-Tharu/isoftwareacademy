import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Lesson from "@/models/Lesson";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const lessons = await Lesson.find({ courseId }).sort({ order: 1 });
    return NextResponse.json(lessons);
  } catch (error: any) {
    console.error("Fetch lessons error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const lesson = await Lesson.create(data);
    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error("Create lesson error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const { id, ...updateData } = data;
    const lesson = await Lesson.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error("Update lesson error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await Lesson.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete lesson error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
