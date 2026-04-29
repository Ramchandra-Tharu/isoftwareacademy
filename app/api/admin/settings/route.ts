import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Setting from "@/models/Setting";

function isAdmin(req: Request) {
  const userRole = req.headers.get("x-user-role");
  return userRole === "admin";
}

export async function GET(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    
    // Find the single settings document, or create it if it doesn't exist
    let settings = await Setting.findOne({});
    
    if (!settings) {
      settings = await Setting.create({});
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Admin Settings GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    await dbConnect();

    // Update the singleton settings document
    const settings = await Setting.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true }
    );

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Admin Settings PUT Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
