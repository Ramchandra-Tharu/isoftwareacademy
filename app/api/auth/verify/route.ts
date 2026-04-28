import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Invalid or missing token" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token is invalid or has expired." },
        { status: 400 }
      );
    }

    // Update user: Set as verified and remove token
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Email verification successful." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
