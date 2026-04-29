import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Quiz from "@/models/Quiz";
import Attempt from "@/models/Attempt";
import Certificate from "@/models/Certificate";
import User from "@/models/User";
import Course from "@/models/Course";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, quizId, courseId, answers, startTime, endTime } = await req.json();

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score++;
      }
    });

    const maxScore = quiz.questions.length;
    const percentage = (score / maxScore) * 100;
    const passed = percentage >= quiz.passingScore;

    const attempt = await Attempt.create({
      userId,
      quizId,
      courseId,
      score,
      maxScore,
      percentage,
      passed,
      answers,
      startTime,
      endTime,
    });

    let certificateGenerated = false;
    let newCertificateId = null;

    if (passed) {
      // Check if a certificate already exists for this user and course
      const existingCert = await Certificate.findOne({ userId, courseId });
      
      if (!existingCert) {
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);
        
        if (user && course) {
          const certificateId = `ISL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          
          await Certificate.create({
            userId,
            courseId,
            certificateId,
            metadata: {
              studentName: user.name,
              courseTitle: course.title,
              grade: `${percentage.toFixed(0)}%`,
            },
          });
          
          certificateGenerated = true;
          newCertificateId = certificateId;
        }
      }
    }

    return NextResponse.json({
      attempt,
      certificateGenerated,
      newCertificateId
    });
  } catch (error: any) {
    console.error("Submit quiz error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
