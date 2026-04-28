import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProgram extends Document {
  name: string;
  description: string;
  courses: mongoose.Types.ObjectId[];
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema = new Schema<IProgram>(
  {
    name: {
      type: String,
      required: [true, "Please provide a program name"],
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
