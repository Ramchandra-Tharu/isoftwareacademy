import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  completedLessons: mongoose.Types.ObjectId[];
  completedQuizzes: mongoose.Types.ObjectId[];
  percentage: number;
  lastAccessed: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
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
    completedLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    completedQuizzes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Progress) {
  delete mongoose.models.Progress;
}

const Progress: Model<IProgress> = mongoose.model<IProgress>("Progress", ProgressSchema);

export default Progress;
