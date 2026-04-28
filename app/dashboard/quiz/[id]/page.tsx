"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  ArrowLeft, CheckCircle, AlertCircle, Loader2, ArrowRight, Award, Brain, Clock, ChevronRight, Check
} from "lucide-react";
import Link from "next/link";

export default function QuizAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id;
  const { data: session } = useSession();

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;
      try {
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (res.ok) {
          const data = await res.json();
          setQuiz(data);
          setAnswers(new Array(data.questions.length).fill(-1));
          setStartTime(new Date());
        } else {
          router.push("/dashboard/quiz");
        }
      } catch (err) {
        console.error("Error fetching quiz", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, router]);

  const selectAnswer = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    if (answers.includes(-1)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/quizzes/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          courseId: quiz.courseId._id || quiz.courseId,
          answers,
          startTime,
          endTime: new Date(),
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        alert("Failed to submit quiz.");
      }
    } catch (err) {
      alert("An error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-[#EBBB54] gap-4">
        <Loader2 className="animate-spin" size={48} />
        <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">Loading Assessment Protocol...</p>
      </div>
    );
  }

  if (!quiz) return null;

  if (result) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-[#1a1a1a] border border-white/10 rounded-[32px] p-10 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Award size={200} />
          </div>

          <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center border-4 ${result.passed ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-red-500 bg-red-500/10 text-red-500'}`}>
            {result.passed ? <CheckCircle size={48} /> : <AlertCircle size={48} />}
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white">{result.passed ? "Assessment Passed!" : "Assessment Failed"}</h2>
            <p className="text-gray-400">You scored {result.score} out of {result.maxScore}</p>
          </div>

          <div className="flex justify-center gap-8 py-8 border-y border-white/5">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Final Score</p>
              <p className={`text-3xl font-black ${result.passed ? 'text-green-500' : 'text-red-500'}`}>{Math.round(result.percentage)}%</p>
            </div>
            <div className="w-px bg-white/5"></div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Passing Req.</p>
              <p className="text-3xl font-black text-white">{quiz.passingScore}%</p>
            </div>
          </div>

          <Link href="/dashboard/quiz" className="inline-block px-8 py-4 bg-[#EBBB54] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-105 transition-transform">
            Return to Assessment Center
          </Link>
        </div>
      </div>
    );
  }

  const q = quiz.questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/quiz" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
            <p className="text-sm text-gray-400">Question {currentQuestion + 1} of {quiz.questions.length}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-[#EBBB54] bg-[#EBBB54]/10 px-4 py-2 rounded-xl text-sm font-bold">
          <Clock size={16} />
          <span>{quiz.duration} Limit</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {quiz.questions.map((_: any, i: number) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-300 ${i === currentQuestion ? 'bg-[#EBBB54]' : i < currentQuestion ? 'bg-[#EBBB54]/40' : 'bg-white/10'}`}></div>
        ))}
      </div>

      {/* Question Card */}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 md:p-12 space-y-10 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 text-white/[0.02]">
           <Brain size={200} />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white relative z-10 leading-tight">
          {q.question}
        </h2>

        <div className="grid grid-cols-1 gap-4 relative z-10">
          {q.options.map((opt: string, index: number) => (
            <button
              key={index}
              onClick={() => selectAnswer(index)}
              className={`flex items-center gap-4 p-5 md:p-6 rounded-2xl text-left transition-all duration-300 group
                ${answers[currentQuestion] === index 
                  ? 'bg-[#EBBB54]/10 border-2 border-[#EBBB54] shadow-[0_0_20px_rgba(235,187,84,0.1)]' 
                  : 'bg-white/5 border-2 border-transparent hover:border-white/10 hover:bg-white/10'}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors
                ${answers[currentQuestion] === index ? 'border-[#EBBB54] bg-[#EBBB54]' : 'border-gray-600 group-hover:border-gray-400'}`}>
                {answers[currentQuestion] === index && <Check size={14} className="text-black" />}
              </div>
              <span className={`text-lg font-medium ${answers[currentQuestion] === index ? 'text-[#EBBB54]' : 'text-gray-300 group-hover:text-white'}`}>
                {opt}
              </span>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-white/5 relative z-10">
          <button 
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${currentQuestion === 0 ? 'opacity-50 cursor-not-allowed text-gray-500' : 'bg-white/5 hover:bg-white/10 text-white'}`}
          >
            Previous
          </button>
          
          {currentQuestion === quiz.questions.length - 1 ? (
            <button 
              onClick={submitQuiz}
              disabled={submitting || answers.includes(-1)}
              className={`flex items-center gap-2 px-8 py-3 bg-[#EBBB54] text-black font-black uppercase tracking-widest text-sm rounded-xl transition-all
                ${(submitting || answers.includes(-1)) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-xl shadow-[#EBBB54]/20'}`}
            >
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
              Submit Assessment
            </button>
          ) : (
            <button 
              onClick={nextQuestion}
              className="flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
            >
              Next <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
