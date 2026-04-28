import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Course from "@/models/Course";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    await dbConnect();
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error: any) {
    console.error("Delete course error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      try {
        require("fs").appendFileSync("C:/Users/ACER/Desktop/isoftware/isoftwareacademy/api-error.log", "PATCH ERROR: Unauthorized. Role is " + session?.user?.role + "\n");
      } catch(e) {}
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    await dbConnect();
    const updatedCourse = await Course.findByIdAndUpdate(id, body, { new: true });

    if (!updatedCourse) {
      try {
        require("fs").appendFileSync("C:/Users/ACER/Desktop/isoftware/isoftwareacademy/api-error.log", "PATCH ERROR: Course not found for id " + id + "\n");
      } catch(e) {}
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCourse);
  } catch (error: any) {
    console.error("Update course error:", error);
    try {
      require("fs").appendFileSync("C:/Users/ACER/Desktop/isoftware/isoftwareacademy/api-error.log", "PATCH ERROR: " + String(error) + "\n");
    } catch(e) {}
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    await dbConnect();
    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error: any) {
    console.error("Get course error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
