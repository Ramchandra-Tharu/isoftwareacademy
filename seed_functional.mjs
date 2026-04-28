import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Load environment variables natively in Node 22+
try {
  process.loadEnvFile(".env");
} catch(e) {}
try {
  process.loadEnvFile(".env.local");
} catch(e) {}

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ ERROR: MONGODB_URI is not defined.");
  process.exit(1);
}

// Inline schemas for seeding
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  isVerified: { type: Boolean, default: true },
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  description: String,
  instructor: String,
  category: String,
  thumbnail: String,
  totalLessons: Number,
  duration: String,
  difficulty: String,
  featured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

const lessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  moduleName: String,
  title: String,
  slug: String,
  content: Array,
  duration: String,
  order: Number,
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  title: String,
  slug: { type: String, unique: true },
  questions: Array,
  duration: String,
  passingScore: Number,
  difficulty: String,
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
const Lesson = mongoose.models.Lesson || mongoose.model("Lesson", lessonSchema);
const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

async function seed() {
  console.log("⏳ Seeding Functional Data...");
  
  try {
    await mongoose.connect(uri);
    console.log("✅ Database Connected.");

    // Clear existing data (optional, but good for fresh start)
    // await Course.deleteMany({});
    // await Lesson.deleteMany({});
    // await Quiz.deleteMany({});

    // 1. Create a Featured Course
    const course1 = await Course.findOneAndUpdate(
      { slug: "nextjs-15-masterclass" },
      {
        title: "Next.js 15 Masterclass: From Beginner to Pro",
        slug: "nextjs-15-masterclass",
        description: "Master the latest features of Next.js 15, including Server Actions, PPR, and more.",
        instructor: "Sandeep Tharu",
        category: "Frontend",
        thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60",
        totalLessons: 10,
        duration: "12h 45m",
        difficulty: "Intermediate",
        featured: true,
        isPublished: true,
      },
      { upsert: true, new: true }
    );

    // 2. Add some lessons to the course
    const lessonsData = [
      {
        courseId: course1._id,
        moduleName: "Module 1: Getting Started",
        title: "Introduction to Next.js 15",
        slug: "intro-nextjs-15",
        content: [
          { type: "text", content: "Next.js 15 introduces several groundbreaking features..." },
          { type: "code", language: "javascript", content: "npx create-next-app@latest" }
        ],
        duration: "05:00",
        order: 1,
      },
      {
        courseId: course1._id,
        moduleName: "Module 1: Getting Started",
        title: "Server vs Client Components",
        slug: "server-vs-client",
        content: [
          { type: "text", content: "Understanding the boundary between server and client is crucial." }
        ],
        duration: "12:00",
        order: 2,
      }
    ];

    for (const lesson of lessonsData) {
      await Lesson.findOneAndUpdate({ slug: lesson.slug }, lesson, { upsert: true });
    }

    // 3. Add a Quiz
    await Quiz.findOneAndUpdate(
      { slug: "nextjs-foundations-quiz" },
      {
        courseId: course1._id,
        title: "Next.js Foundations Quiz",
        slug: "nextjs-foundations-quiz",
        questions: [
          {
            question: "What is the default rendering mode for components in Next.js App Router?",
            options: ["Server Components", "Client Components", "Static Components"],
            correctAnswer: 0,
          },
          {
            question: "Which hook is used to access search parameters in a Client Component?",
            options: ["useParams", "useSearchParams", "useRouter"],
            correctAnswer: 1,
          }
        ],
        duration: "10 min",
        passingScore: 80,
        difficulty: "Easy",
        isPublished: true,
      },
      { upsert: true }
    );

    console.log("✅ Seed Data Inserted for iSoftware Lab Academy.");

  } catch (error) {
    console.error("❌ Seed Failed:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
