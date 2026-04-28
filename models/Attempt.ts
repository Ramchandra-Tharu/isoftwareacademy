import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  answers: number[];
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AttemptSchema = new Schema<IAttempt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user ID"],
    },
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "Please provide a quiz ID"],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Please provide a course ID"],
    },
    score: {
      type: Number,
      required: [true, "Please provide a score"],
    },
    maxScore: {
      type: Number,
      required: [true, "Please provide max score"],
    },
    percentage: {
      type: Number,
      required: [true, "Please provide a percentage"],
    },
    passed: {
      type: Boolean,
      required: [true, "Please provide passed status"],
    },
    answers: {
      type: [Number],
      required: [true, "Please provide user answers"],
    },
    startTime: {
      type: Date,
      required: [true, "Please provide start time"],
    },
    endTime: {
      type: Date,
      required: [true, "Please provide end time"],
    },
  },
  {
    timestamps: true,
  }
);

const Attempt: Model<IAttempt> = mongoose.models.Attempt || mongoose.model<IAttempt>("Attempt", AttemptSchema);

export default Attempt;
