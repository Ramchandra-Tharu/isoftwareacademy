import mongoose, { Document, Model, Schema } from "mongoose";

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  content: string;
  parentId?: mongoose.Types.ObjectId; // For nested replies
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  dislikes: number;
  dislikedBy: mongoose.Types.ObjectId[];
  status: "pending" | "approved" | "rejected";
  rating?: number; // 1-5 for reviews
  isPinned: boolean;
  isSpam: boolean;
  reports: {
    userId: mongoose.Types.ObjectId;
    reason: string;
    createdAt: Date;
  }[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
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
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "Please provide a lesson ID"],
    },
    content: {
      type: String,
      required: [true, "Please provide comment content"],
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: {
      type: Number,
      default: 0,
    },
    dislikedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isSpam: {
      type: Boolean,
      default: false,
    },
    reports: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        reason: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
