import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Certificate from "@/models/Certificate";
import Course from "@/models/Course";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin";
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!isAdmin && !userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    let query = {};
    if (!isAdmin || userId) {
       query = { userId };
    }

    const certificates = await Certificate.find(query)
      .populate("userId", "name email")
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json(certificates);
  } catch (error: any) {
    console.error("Fetch certificates error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, courseId } = await req.json();

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({ userId, courseId });
    if (existingCert) {
      return NextResponse.json(existingCert);
    }

    // Get user and course data for certificate metadata
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return NextResponse.json(
        { error: "User or course not found" },
        { status: 404 }
      );
    }

    // Generate a unique certificate ID
    const certificateId = `ISL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const certificate = await Certificate.create({
      userId,
      courseId,
      certificateId,
      metadata: {
        studentName: user.name,
        courseTitle: course.title,
      },
    });

    return NextResponse.json(certificate);
  } catch (error: any) {
    console.error("Generate certificate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 });
    }

    const deletedCert = await Certificate.findByIdAndDelete(id);
    if (!deletedCert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Certificate revoked successfully" });
  } catch (error: any) {
    console.error("Delete certificate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
