import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEnrollment extends Document {
  userId: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  programId?: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId;
  type: "course" | "program";
  enrolledAt: Date;
  status: "active" | "expired" | "revoked";
}

const EnrollmentSchema = new Schema<IEnrollment>(
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
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    type: {
      type: String,
      enum: ["course", "program"],
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "expired", "revoked"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate enrollments
EnrollmentSchema.index({ userId: 1, courseId: 1, programId: 1 }, { unique: true });

const Enrollment: Model<IEnrollment> = mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);

export default Enrollment;
