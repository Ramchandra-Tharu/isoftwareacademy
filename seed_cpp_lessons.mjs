import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://sirzan143:Sirzan1431@cluster0.lm4udem.mongodb.net/isoftwarelabacademy?appName=Cluster0";

const LessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  moduleName: String,
  title: String,
  slug: String,
  description: String,
  content: Array,
  duration: String,
  order: Number,
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const CourseSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  totalLessons: { type: Number, default: 0 },
  totalChapters: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true, strict: false });

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

const curriculumData = [
  {
    chapter: "Introduction to C++",
    topics: [
      "What is C++",
      "History of C++",
      "Features of C++",
      "Structure of a C++ Program",
      "Basic Syntax",
      "Keywords and Identifiers",
      "Data Types Overview",
      "Variables Introduction",
      "Input and Output (cin, cout)",
      "First Program (Hello World)",
      "Compilation and Execution Process"
    ]
  },
  { chapter: "Variables and Data Types", topics: ["Introduction to Variables"] },
  { chapter: "Operators and Expressions", topics: ["Basic Operators"] },
  { chapter: "Control Statements", topics: ["If-Else Statements"] },
  { chapter: "Functions", topics: ["Defining Functions"] },
  { chapter: "Arrays and Strings", topics: ["Working with Arrays"] },
  { chapter: "Pointers", topics: ["Pointer Basics"] }
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

// Helper to format minutes as MM:SS
function formatDuration(minutes) {
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    const course = await Course.findOne({
      $or: [
        { title: "C++ Programming" },
        { title: /C\+\+/i },
        { slug: /cpp/i }
      ]
    });

    if (!course) {
      console.error("ERROR: C++ Course not found.");
      process.exit(1);
    }

    console.log(`Found Course: "${course.title}" (ID: ${course._id})`);

    console.log("Cleaning up old lessons...");
    await Lesson.deleteMany({ courseId: course._id });

    const lessonsToInsert = [];
    let globalOrder = 1;

    for (const item of curriculumData) {
      const targetChapterMinutes = 600; // 10 Hours per chapter
      const minutesPerTopic = targetChapterMinutes / item.topics.length;
      
      for (const topicTitle of item.topics) {
        lessonsToInsert.push({
          courseId: course._id,
          moduleName: item.chapter,
          title: topicTitle,
          slug: slugify(topicTitle),
          description: `Detailed lesson on ${topicTitle} in C++.`,
          order: globalOrder++,
          duration: formatDuration(minutesPerTopic),
          isPublished: true,
          content: [
            { type: "text", content: `In this lesson, we cover ${topicTitle}. This is part of the ${item.chapter} module.` }
          ]
        });
      }
    }

    console.log(`Inserting ${lessonsToInsert.length} topics...`);
    await Lesson.insertMany(lessonsToInsert);

    course.totalLessons = lessonsToInsert.length;
    course.set('totalChapters', curriculumData.length);
    course.set('totalTopics', lessonsToInsert.length);
    course.set('lastUpdated', new Date());
    await course.save();

    console.log("\nSUCCESS: C++ Course Curriculum updated!");
    console.log(`Each of the ${curriculumData.length} chapters now sums to 10 hours.`);
    process.exit(0);
  } catch (err) {
    console.error("CRITICAL ERROR:", err);
    process.exit(1);
  }
}

seed();
