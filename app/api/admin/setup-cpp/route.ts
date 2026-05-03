import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";

export async function GET() {
  try {
    await dbConnect();

    // 1. Find the C++ course
    const course = await Course.findOne({ title: /C\+\+/i });
    if (!course) {
      return NextResponse.json({ error: "C++ course not found" }, { status: 404 });
    }

    const courseId = course._id;

    // 2. Clear existing lessons for this course (optional, but good for clean setup)
    await Lesson.deleteMany({ courseId });

    // 3. Define the 7 chapters
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

    // 4. Create the lessons
    const createdLessons = await Lesson.insertMany(lessonsData);

    // 5. Update course total lessons count
    course.totalLessons = createdLessons.length;
    await course.save();

    return NextResponse.json({ 
      message: "C++ course module successfully designed and populated", 
      lessonCount: createdLessons.length 
    });

  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
