import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await dbConnect();
    
    const email = "admin@isoftware.com";
    const password = "admin";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = await User.findOne({ email });

    if (user) {
      user.password = hashedPassword;
      user.role = "admin";
      user.isVerified = true;
      await user.save();
    } else {
      user = await User.create({
        name: "Super Admin",
        email,
        password: hashedPassword,
        role: "admin",
        isVerified: true
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Admin account has been forcefully reset!",
      email: user.email,
      role: user.role
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
