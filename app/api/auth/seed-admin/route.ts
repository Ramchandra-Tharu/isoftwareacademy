import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// SECRET ENDPOINT: Only run once or secure via an ENV var check
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Simple protection measure
    if (body.setupKey !== "SUPER_SECRET_SETUP_KEY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const { name, email, password } = body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: "Admin email already registered" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    return NextResponse.json({ message: "Admin account seeded successfully" }, { status: 201 });

  } catch (error) {
    console.error("Seed error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
