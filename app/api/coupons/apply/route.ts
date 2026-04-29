import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    const { code, amount } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    await dbConnect();
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid or expired coupon code" }, { status: 400 });
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    if (coupon.minPurchase && amount < coupon.minPurchase) {
      return NextResponse.json({ 
        error: `Minimum purchase of ₹${coupon.minPurchase} required for this coupon` 
      }, { status: 400 });
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (amount * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    const finalAmount = Math.max(0, amount - discount);

    return NextResponse.json({
      success: true,
      couponId: coupon._id,
      discount,
      finalAmount,
      code: coupon.code
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
