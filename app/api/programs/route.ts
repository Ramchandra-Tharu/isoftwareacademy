import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Program from "@/models/Program";

export async function GET(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role");
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const programs = await Program.find({}).populate("courses").sort({ createdAt: -1 });
    return NextResponse.json(programs);
  } catch (error) {
    console.error("API Programs GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role");
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { title, slug, description, courses, duration, thumbnail } = await req.json();

    if (!title || !slug || !description) {
      return NextResponse.json({ error: "Title, slug, and description are required" }, { status: 400 });
    }

    await dbConnect();
    const newProgram = await Program.create({
      title,
      slug,
      description,
      courses: courses || [],
      duration,
      thumbnail
    });

    return NextResponse.json(newProgram, { status: 201 });
  } catch (error) {
    console.error("API Programs POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
