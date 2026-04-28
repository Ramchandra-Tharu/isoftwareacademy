import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role");
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const users = await User.find({ isVerified: true }).sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error("API Admin Users GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role");
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id, role } = await req.json();
    if (!id || !role) {
      return NextResponse.json({ error: "ID and role are required" }, { status: 400 });
    }

    await dbConnect();
    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("API Admin Users PUT Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role");
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await dbConnect();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("API Admin Users DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
