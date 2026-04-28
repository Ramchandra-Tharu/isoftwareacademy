import mongoose, { Document, Model, Schema } from "mongoose";

export interface ILesson extends Document {
  courseId: mongoose.Types.ObjectId;
  moduleName: string;
  title: string;
  slug: string;
  description: string;
  content: {
    type: "video" | "text" | "code" | "image";
    content: string;
    language?: string;
    caption?: string;
    duration?: string;
  }[];
  duration: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Please provide a course ID"],
    },
    moduleName: {
      type: String,
      required: [true, "Please provide a module name"],
    },
    title: {
      type: String,
      required: [true, "Please provide a lesson title"],
    },
    slug: {
      type: String,
      required: [true, "Please provide a lesson slug"],
    },
    description: {
      type: String,
    },
    content: [
      {
        type: {
          type: String,
          enum: ["video", "text", "code", "image"],
          required: [true, "Please provide content type"],
        },
        content: {
          type: String,
          required: [true, "Please provide content source or text"],
        },
        language: {
          type: String,
        },
        caption: {
          type: String,
        },
        duration: {
          type: String,
        },
      },
    ],
    duration: {
      type: String,
      required: [true, "Please provide lesson duration"],
    },
    order: {
      type: Number,
      required: [true, "Please provide lesson order"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Lesson: Model<ILesson> = mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema);

export default Lesson;
