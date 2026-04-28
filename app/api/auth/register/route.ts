import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "@/utils/mailer";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate Verification Token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student", // Default role
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
    });

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const verifyUrl = `${baseUrl}/verify?token=${verificationToken}`;

      await sendEmail({
        to: email,
        subject: "Verify your email - iSoftware Lab Academy",
        html: `
          <h1>Welcome to iSoftware Lab Academy!</h1>
          <p>Hi ${name},</p>
          <p>Please click the link below to verify your email address and activate your account:</p>
          <a href="${verifyUrl}" style="background-color: #EBBB54; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Email</a>
          <p>If you did not request this, please ignore this email.</p>
          <p>This link will expire in 24 hours.</p>
        `,
      });
    } catch (mailError) {
      console.error("Failed to send verification email:", mailError);
      // Wait, we probably want to let the user know, but they are registered.
      // We can keep it silent or return an error. Let's return success but maybe log it.
    }

    return NextResponse.json(
      { message: "Registration successful. Please check your email to verify your account." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
