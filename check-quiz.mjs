import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://sirzan143:Sirzan1431@cluster0.lm4udem.mongodb.net/isoftwarelabacademy?appName=Cluster0";

const QuizSchema = new mongoose.Schema({
  title: String,
  slug: String,
  questions: Array,
});

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    const quiz = await Quiz.findOne({ slug: "java-fundamentals-quiz" });
    if (quiz) {
      console.log(`✅ Success: Java Quiz found in database with title "${quiz.title}" and ${quiz.questions.length} questions.`);
    } else {
      console.log("❌ Java Quiz NOT found in database.");
    }
    process.exit(0);
  } catch (err) {
    console.error("Failed:", err);
    process.exit(1);
  }
}

check();
