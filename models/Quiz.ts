import mongoose, { Document, Model, Schema } from "mongoose";

export interface IQuiz extends Document {
  courseId: mongoose.Types.ObjectId;
  lessonId?: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  image?: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }[];
  duration: string;
  passingScore: number;
  difficulty: "Easy" | "Medium" | "Hard";
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema = new Schema<IQuiz>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Please provide a course ID"],
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },
    title: {
      type: String,
      required: [true, "Please provide a quiz title"],
    },
    slug: {
      type: String,
      required: [true, "Please provide a quiz slug"],
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    questions: [
      {
        question: {
          type: String,
          required: [true, "Please provide a question"],
        },
        options: {
          type: [String],
          required: [true, "Please provide options"],
        },
        correctAnswer: {
          type: Number,
          required: [true, "Please provide the zero-indexed correct option index"],
        },
        explanation: {
          type: String,
        },
      },
    ],
    duration: {
      type: String,
      required: [true, "Please provide quiz duration"],
    },
    passingScore: {
      type: Number,
      required: [true, "Please provide a passing score"],
      default: 80,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
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

const Quiz: Model<IQuiz> = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
