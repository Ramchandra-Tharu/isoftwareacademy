import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Course from "@/models/Course";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const slug = searchParams.get("slug");
    
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin";

    await dbConnect();

    let query: any = {};
    if (!isAdmin) {
      query.isPublished = true;
    }
    
    if (category && category !== "All") {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (slug) {
      query.slug = slug;
    }

    console.log("api/courses: Querying with", { query, isAdmin, user: session?.user?.email });
    const courses = await Course.find(query).sort({ createdAt: -1 });
    console.log(`api/courses: Found ${courses.length} courses`);
    
    return NextResponse.json(courses);
  } catch (error: any) {
    console.error("Fetch courses error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    await dbConnect();

    const newCourse = await Course.create(body);
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error: any) {
    console.error("Create course error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
