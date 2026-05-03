import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://sirzan143:Sirzan1431@cluster0.lm4udem.mongodb.net/isoftwarelabacademy?appName=Cluster0";

const LessonSchema = new mongoose.Schema({
  courseId: mongoose.Schema.Types.ObjectId,
  moduleName: String,
  title: String,
  slug: String,
  description: String,
  content: Array,
  duration: String,
  order: Number,
  isPublished: Boolean
}, { timestamps: true });

const CourseSchema = new mongoose.Schema({
  title: String,
  totalLessons: Number
});

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    console.log("Searching for course with title or slug containing 'C++'...");
    let course = await Course.findOne({ 
      $or: [
        { title: /C\+\+/i },
        { slug: /c\+\+/i },
        { title: /cpp/i },
        { slug: /cpp/i }
      ]
    });

    if (!course) {
      console.error("CRITICAL: Course not found. Please ensure a course with 'C++' or 'cpp' in its title/slug exists.");
      const allCourses = await Course.find({}, 'title slug');
      console.log("Available courses:", allCourses);
      process.exit(1);
    }

    console.log(`Found course: "${course.title}" (ID: ${course._id})`);

    const courseId = course._id;
    await Lesson.deleteMany({ courseId });

    const lessonsData = [
      {
        courseId,
        moduleName: "Module 1: Introduction",
        title: "Introduction to C++ Fundamentals",
        slug: "intro-to-cpp",
        description: "Learn the basics of C++, its history, and how to set up your environment.",
        order: 1,
        duration: "45m",
        isPublished: true,
        content: [
          { type: "text", content: "C++ is a high-level, general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language." },
          { type: "text", content: "Key features include performance, efficiency, and support for object-oriented programming." },
          { type: "code", language: "cpp", content: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello World!\" << std::endl;\n    return 0;\n}" }
        ]
      },
      {
        courseId,
        moduleName: "Module 2: Core Concepts",
        title: "Variables, Data Types, and Operators",
        slug: "cpp-core-concepts",
        description: "Master the building blocks of C++ programming.",
        order: 2,
        duration: "1h",
        isPublished: true,
        content: [
          { type: "text", content: "In C++, variables are used to store data. Common data types include int, float, double, char, and bool." },
          { type: "code", language: "cpp", content: "int age = 25;\ndouble price = 19.99;\nchar grade = 'A';\nbool isPassed = true;" },
          { type: "text", content: "Operators allow you to perform arithmetic, comparisons, and logical operations." }
        ]
      },
      {
        courseId,
        moduleName: "Module 3: Control Flow",
        title: "Control Statements and Loops",
        slug: "cpp-control-flow",
        description: "Control the logic and flow of your programs.",
        order: 3,
        duration: "1h 15m",
        isPublished: true,
        content: [
          { type: "text", content: "Conditional statements like 'if', 'else if', and 'else' allow your code to make decisions." },
          { type: "code", language: "cpp", content: "if (score >= 50) {\n    cout << \"Pass\";\n} else {\n    cout << \"Fail\";\n}" },
          { type: "text", content: "Loops like 'for', 'while', and 'do-while' enable code repetition." }
        ]
      },
      {
        courseId,
        moduleName: "Module 4: Functions",
        title: "Functions and Recursion",
        slug: "cpp-functions",
        description: "Encapsulate logic into reusable blocks.",
        order: 4,
        duration: "50m",
        isPublished: true,
        content: [
          { type: "text", content: "Functions are blocks of code that perform a specific task and can be called multiple times." },
          { type: "code", language: "cpp", content: "int add(int a, int b) {\n    return a + b;\n}\n\n// Usage\nint sum = add(5, 3);" },
          { type: "text", content: "Recursion is a process where a function calls itself to solve a problem." }
        ]
      },
      {
        courseId,
        moduleName: "Module 5: Data Structures",
        title: "Arrays and Strings",
        slug: "cpp-arrays-strings",
        description: "Learn to handle collections of data efficiently.",
        order: 5,
        duration: "1h",
        isPublished: true,
        content: [
          { type: "text", content: "An array is a collection of items of the same type stored at contiguous memory locations." },
          { type: "code", language: "cpp", content: "int numbers[5] = {1, 2, 3, 4, 5};\nstring name = \"C++ Academy\";" }
        ]
      },
      {
        courseId,
        moduleName: "Module 6: OOP",
        title: "Object-Oriented Programming (OOP)",
        slug: "cpp-oop",
        description: "The core paradigm of modern C++ development.",
        order: 6,
        duration: "2h",
        isPublished: true,
        content: [
          { type: "text", content: "OOP focuses on objects and classes. Key concepts include Encapsulation, Inheritance, and Polymorphism." },
          { type: "code", language: "cpp", content: "class Animal {\npublic:\n    void sound() { cout << \"Generic sound\"; }\n};\n\nclass Dog : public Animal {\npublic:\n    void sound() { cout << \"Bark\"; }\n};" }
        ]
      },
      {
        courseId,
        moduleName: "Module 7: Advanced",
        title: "Pointers, Memory, and STL",
        slug: "cpp-advanced",
        description: "Master memory management and the Standard Template Library.",
        order: 7,
        duration: "1h 30m",
        isPublished: true,
        content: [
          { type: "text", content: "Pointers store memory addresses of other variables, providing powerful low-level control." },
          { type: "code", language: "cpp", content: "int x = 10;\nint* ptr = &x;\ncout << *ptr; // Outputs 10" },
          { type: "text", content: "The STL provides ready-to-use data structures like vectors, lists, and maps." }
        ]
      }
    ];

    console.log(`Inserting ${lessonsData.length} lessons...`);
    await Lesson.insertMany(lessonsData);
    
    course.totalLessons = lessonsData.length;
    await course.save();

    console.log("SUCCESS: C++ Course Curriculum seeded successfully!");
    console.log("Please refresh your dashboard at /dashboard/courses/" + (course.slug || course._id));
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed", err);
    process.exit(1);
  }
}

seed();
