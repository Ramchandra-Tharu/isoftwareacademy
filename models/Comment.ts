import mongoose, { Document, Model, Schema } from "mongoose";

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  content: string;
  parentId?: mongoose.Types.ObjectId; // For nested replies
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  isDeleted: boolean;
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
