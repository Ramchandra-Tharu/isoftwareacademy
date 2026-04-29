import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  programId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  couponId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    programId: {
      type: Schema.Types.ObjectId,
      ref: "Program",
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    couponId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },
  },
  {
    timestamps: true,
  }
);

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
