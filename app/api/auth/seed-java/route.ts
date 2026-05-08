import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Quiz from "@/models/Quiz";
import Course from "@/models/Course";

export async function GET() {
  try {
    await dbConnect();

    // 1. Find or create a Java course
    let course = await Course.findOne({ slug: "java-programming" });
    if (!course) {
      course = await Course.findOne({ slug: { $regex: /java/i } });
    }

    if (!course) {
      console.log("Creating default Java course...");
      course = await Course.create({
        title: "Java Programming Masterclass",
        slug: "java-programming",
        description: "Learn Java from scratch to advanced level, including Object-Oriented Programming (OOP), Multithreading, and more.",
        instructor: "Sandeep Tharu",
        category: "Programming",
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
        totalLessons: 26,
        duration: "20h 30m",
        difficulty: "Beginner",
        featured: true,
        isPublished: true,
      });
    }

    // 2. Define the 26 questions
    const questions = [
      {
        question: "What is Java?",
        options: ["Operating System", "Programming Language", "Database", "Browser"],
        correctAnswer: 1,
        explanation: "Java is a popular class-based, object-oriented programming language designed to have as few implementation dependencies as possible."
      },
      {
        question: "Who developed Java?",
        options: ["Microsoft", "Apple", "Sun Microsystems", "Google"],
        correctAnswer: 2,
        explanation: "Java was originally developed by James Gosling at Sun Microsystems and released in 1995."
      },
      {
        question: "Which keyword is used to define a class in Java?",
        options: ["define", "class", "object", "create"],
        correctAnswer: 1,
        explanation: "The 'class' keyword is used to declare a class in Java."
      },
      {
        question: "Which method is the entry point of a Java program?",
        options: ["start()", "run()", "main()", "init()"],
        correctAnswer: 2,
        explanation: "The main() method is the default starting point for any standalone Java application."
      },
      {
        question: "Which of these is a valid data type in Java?",
        options: ["integer", "number", "int", "decimal"],
        correctAnswer: 2,
        explanation: "'int' is a primitive data type used to store 32-bit signed integers in Java."
      },
      {
        question: "Which symbol is used to end a statement in Java?",
        options: [".", ":", ";", ","],
        correctAnswer: 2,
        explanation: "In Java, every statement must end with a semicolon (;)."
      },
      {
        question: "Which loop is guaranteed to execute at least once?",
        options: ["for loop", "while loop", "do-while loop", "nested loop"],
        correctAnswer: 2,
        explanation: "The do-while loop evaluates its test-expression at the bottom of the loop, guaranteeing at least one execution."
      },
      {
        question: "Which operator is used for comparison?",
        options: ["=", "==", "+=", "!="],
        correctAnswer: 1,
        explanation: "The '==' operator is used to compare values for equality in Java."
      },
      {
        question: "What is the default value of a boolean variable?",
        options: ["true", "false", "0", "null"],
        correctAnswer: 1,
        explanation: "The default value of a primitive boolean instance variable in Java is 'false'."
      },
      {
        question: "Which keyword is used to inherit a class in Java?",
        options: ["implement", "inherits", "extends", "super"],
        correctAnswer: 2,
        explanation: "The 'extends' keyword is used to establish inheritance in Java."
      },
      {
        question: "Which of these is not an access modifier?",
        options: ["public", "private", "protected", "package"],
        correctAnswer: 3,
        explanation: "Java has three explicit access modifiers: public, private, and protected. Default package-private access is defined by the absence of a modifier."
      },
      {
        question: "Which keyword is used to create an object?",
        options: ["class", "new", "object", "create"],
        correctAnswer: 1,
        explanation: "The 'new' keyword is used to instantiate an object in Java by allocating memory on the heap."
      },
      {
        question: "What is an array?",
        options: [
          "Collection of variables of different types",
          "Collection of elements of same type",
          "A loop structure",
          "A method"
        ],
        correctAnswer: 1,
        explanation: "An array is a container object that holds a fixed number of values of a single type."
      },
      {
        question: "Which package is automatically imported in every Java program?",
        options: ["java.io", "java.util", "java.lang", "java.net"],
        correctAnswer: 2,
        explanation: "The 'java.lang' package provides classes that are fundamental to the design of the Java programming language and is implicitly imported."
      },
      {
        question: "Which keyword is used to stop a loop?",
        options: ["stop", "end", "break", "exit"],
        correctAnswer: 2,
        explanation: "The 'break' keyword is used to terminate a loop or switch statement immediately."
      },
      {
        question: "Which of the following is used for comments in Java?",
        options: ["//", "##", "<!-- -->", "**"],
        correctAnswer: 0,
        explanation: "Double slashes (//) are used for single-line comments in Java."
      },
      {
        question: "What is the size of int in Java?",
        options: ["2 bytes", "4 bytes", "8 bytes", "16 bytes"],
        correctAnswer: 1,
        explanation: "In Java, the primitive data type 'int' is always 32 bits (4 bytes) in size."
      },
      {
        question: "Which keyword is used for exception handling?",
        options: ["error", "catch", "final", "import"],
        correctAnswer: 1,
        explanation: "The 'catch' block is used to handle exceptions thrown in the preceding 'try' block."
      },
      {
        question: "Which of these is a loop statement?",
        options: ["switch", "if", "for", "break"],
        correctAnswer: 2,
        explanation: "The 'for' statement provides a compact way to iterate over a range of values."
      },
      {
        question: "Which function is used to print output in Java?",
        options: ["print()", "echo()", "System.out.println()", "output()"],
        correctAnswer: 2,
        explanation: "System.out.println() is the standard method used to print messages to the console in Java."
      },
      {
        question: "Java is a:",
        options: [
          "Platform-dependent language",
          "Platform-independent language",
          "Machine language",
          "Assembly language"
        ],
        correctAnswer: 1,
        explanation: "Java's 'Write Once, Run Anywhere' (WORA) philosophy makes it highly platform-independent through the JVM."
      },
      {
        question: "Which keyword is used to define a constant variable?",
        options: ["static", "final", "const", "fixed"],
        correctAnswer: 1,
        explanation: "The 'final' keyword is used to declare a constant variable whose value cannot be reassigned."
      },
      {
        question: "Which statement is used for decision making?",
        options: ["loop", "if", "break", "continue"],
        correctAnswer: 1,
        explanation: "The 'if' statement is the most basic decision-making control flow statement in Java."
      },
      {
        question: "Which operator is used for addition?",
        options: ["*", "/", "+", "%"],
        correctAnswer: 2,
        explanation: "The '+' operator is used for addition as well as string concatenation in Java."
      },
      {
        question: "Which of the following is not an OOP concept in Java?",
        options: ["Inheritance", "Encapsulation", "Compilation", "Polymorphism"],
        correctAnswer: 2,
        explanation: "Inheritance, Encapsulation, and Polymorphism are core OOP pillars, whereas Compilation is a development process step."
      },
      {
        question: "Which keyword is used to return a value from a method?",
        options: ["break", "continue", "return", "void"],
        correctAnswer: 2,
        explanation: "The 'return' statement is used to send a value back to the caller of the method."
      }
    ];

    // 3. Create or update the Java Quiz
    const quizData = {
      courseId: course._id,
      title: "Java Fundamentals Quiz",
      slug: "java-fundamentals-quiz",
      description: "Test your knowledge of core Java concepts, syntax, variables, data types, and OOP basics with these 26 curated questions.",
      questions,
      duration: "30m",
      passingScore: 80,
      difficulty: "Medium",
      status: "Active",
    };

    const updatedQuiz = await Quiz.findOneAndUpdate(
      { slug: "java-fundamentals-quiz" },
      quizData,
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Java Quiz successfully seeded with 26 questions!",
      quizId: updatedQuiz._id,
      courseId: course._id,
      courseTitle: course.title,
    });
  } catch (error: any) {
    console.error("Failed to seed Java Quiz:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
