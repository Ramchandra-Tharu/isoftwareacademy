import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/utils/db";
import Payment from "@/models/Payment";
import Course from "@/models/Course";
import Program from "@/models/Program";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId, itemType, couponId } = await req.json();

    if (!itemId || !itemType) {
      return NextResponse.json({ error: "Item ID and type are required" }, { status: 400 });
    }

    await dbConnect();

    let item: any;
    if (itemType === "course") {
      item = await Course.findById(itemId);
    } else {
      item = await Program.findById(itemId);
    }

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    let finalPrice = item.price;
    let validCouponId = null;

    if (couponId) {
       const Coupon = (await import("@/models/Coupon")).default;
       const coupon = await Coupon.findById(couponId);
       if (coupon && coupon.isActive && coupon.expiresAt > new Date() && coupon.usageCount < coupon.usageLimit) {
          let discount = 0;
          if (coupon.discountType === "percentage") {
             discount = (item.price * coupon.value) / 100;
          } else {
             discount = coupon.value;
          }
          finalPrice = Math.max(0, item.price - discount);
          validCouponId = couponId;
       }
    }

    const amount = Math.round(finalPrice * 100); // Amount in paise

    // 1. Create Razorpay Order
    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // 2. Save Pending Payment in DB
    await Payment.create({
      userId: session.user.id,
      courseId: itemType === "course" ? itemId : undefined,
      programId: itemType === "program" ? itemId : undefined,
      amount: finalPrice,
      currency: "INR",
      status: "pending",
      razorpayOrderId: order.id,
      couponId: validCouponId,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
