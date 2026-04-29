import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Coupon from "@/models/Coupon";

function isAdmin(req: Request) {
  return req.headers.get("x-user-role") === "admin";
}

export async function GET(req: Request) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    await dbConnect();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const body = await req.json();
    await dbConnect();
    const coupon = await Coupon.create(body);
    return NextResponse.json(coupon);
  } catch (err: any) {
    if (err.code === 11000) return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { id, ...updateData } = await req.json();
    await dbConnect();
    const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(coupon);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await dbConnect();
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ message: "Coupon deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
