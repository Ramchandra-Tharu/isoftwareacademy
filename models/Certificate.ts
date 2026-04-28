import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICertificate extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  certificateId: string;
  issueDate: Date;
  metadata: {
    studentName: string;
    courseTitle: string;
    grade?: string;
  };
  pdfUrl?: string; // If hosting actual PDFs
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user ID"],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Please provide a course ID"],
    },
    certificateId: {
      type: String,
      unique: true,
      required: [true, "Please provide a certificate ID"],
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      studentName: {
        type: String,
        required: [true, "Please provide the student name"],
      },
      courseTitle: {
        type: String,
        required: [true, "Please provide the course title"],
      },
      grade: {
        type: String,
      },
    },
    pdfUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Certificate: Model<ICertificate> = mongoose.models.Certificate || mongoose.model<ICertificate>("Certificate", CertificateSchema);

export default Certificate;
