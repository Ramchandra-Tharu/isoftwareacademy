import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  await dbConnect();
  const email = "admin@isoftware.com";
  const user = await User.findOne({ email });
  
  if (!user) {
    return NextResponse.json({ error: "User not found" });
  }

  const isMatch = await bcrypt.compare("admin", user.password);
  
  return NextResponse.json({
    email: user.email,
    hasPassword: !!user.password,
    isMatch,
    hashedPassword: user.password
  });
}
