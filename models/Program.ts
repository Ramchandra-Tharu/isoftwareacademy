import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProgram extends Document {
  title: string;
  slug: string;
  description: string;
  courses: mongoose.Types.ObjectId[];
  duration?: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema = new Schema<IProgram>(
  {
    title: {
      type: String,
      required: [true, "Please provide a program title"],
    },
    slug: {
      type: String,
      required: [true, "Please provide a program slug"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a program description"],
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    duration: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Program: Model<IProgram> = mongoose.models.Program || mongoose.model<IProgram>("Program", ProgramSchema);

export default Program;
