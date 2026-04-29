import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/utils/db";
import Payment from "@/models/Payment";
import Enrollment from "@/models/Enrollment";
import Notification from "@/models/Notification";

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    await dbConnect();

    // 1. Update Payment Status
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { 
        status: "success",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      },
      { new: true }
    );

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    // 2. Create Enrollment
    try {
      await Enrollment.create({
        userId: payment.userId,
        courseId: payment.courseId,
        programId: payment.programId,
        paymentId: payment._id,
        type: payment.courseId ? "course" : "program",
      });

      // 3. Update Coupon Usage
      if (payment.couponId) {
         const Coupon = (await import("@/models/Coupon")).default;
         await Coupon.findByIdAndUpdate(payment.couponId, { $inc: { usageCount: 1 } });
      }

      // 4. Notify User
      await Notification.create({
        userId: payment.userId,
        title: "Enrollment Successful!",
        message: `You have successfully enrolled. You can now access your content in the dashboard.`,
        type: "Info",
        link: "/dashboard/my-courses"
      });

    } catch (err: any) {
      // If enrollment already exists (duplicate verification), ignore error
      if (err.code !== 11000) throw err;
    }

    return NextResponse.json({ 
      success: true, 
      message: "Payment verified and enrollment completed" 
    });

  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
