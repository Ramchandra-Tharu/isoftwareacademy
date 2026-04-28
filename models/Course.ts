import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  instructor: string;
  category: string;
  thumbnail: string;
  totalLessons: number;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  enrolledCount: number;
  featured: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "Please provide a course title"],
    },
    slug: {
      type: String,
      required: [true, "Please provide a course slug"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a course description"],
    },
    instructor: {
      type: String,
      required: [true, "Please provide an instructor name"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    thumbnail: {
      type: String,
      required: [true, "Please provide a thumbnail URL"],
    },
    totalLessons: {
      type: Number,
      required: [true, "Please provide total lessons count"],
      default: 0,
    },
    duration: {
      type: String,
      required: [true, "Please provide total duration"],
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
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

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
