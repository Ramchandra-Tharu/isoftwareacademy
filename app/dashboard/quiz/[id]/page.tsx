"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  ArrowLeft, CheckCircle, AlertCircle, Loader2, ArrowRight, Award, Brain, Clock, ChevronRight, Check, RefreshCw
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
          if (data.previousPassedAttempt) {
            setResult(data.previousPassedAttempt);
          } else {
            setAnswers(new Array(data.questions.length).fill(-1));
            setStartTime(new Date());
          }
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
        setResult(data.attempt);
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
      <div className="h-[60vh] flex flex-col items-center justify-center text-blue-600 gap-4">
        <Loader2 className="animate-spin" size={48} />
        <p className="text-gray-400 font-black text-xs uppercase tracking-widest">Loading Quiz Protocol...</p>
      </div>
    );
  }

  if (!quiz) return null;

  if (result) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white border border-gray-100 rounded-[2rem] p-10 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] text-gray-900 pointer-events-none">
             <Award size={250} />
          </div>

          <div className="space-y-2 relative z-10">
            <h2 className="text-3xl font-black text-gray-900">{result.passed ? "Quiz Passed! 🎉" : "Quiz Failed"}</h2>
            <p className="text-gray-500 font-medium">{result.passed ? "Excellent work! You've mastered this module." : "Don't worry, review the material and try again."}</p>
          </div>

          <div className="flex flex-col items-center justify-center py-4 relative z-10">
             <div className="relative w-40 h-40 group">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-50" />
                   <circle 
                     cx="50" 
                     cy="50" 
                     r="40" 
                     stroke="currentColor" 
                     strokeWidth="8" 
                     fill="transparent" 
                     strokeDasharray="251.2" 
                     strokeDashoffset={251.2 - (251.2 * result.percentage) / 100} 
                     className={`transition-all duration-1500 ease-out ${result.passed ? 'text-emerald-500' : 'text-red-500'}`} 
                     strokeLinecap="round" 
                   />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-500">
                   <span className={`text-4xl font-black ${result.passed ? 'text-emerald-500' : 'text-red-500'}`}>{Math.round(result.percentage)}%</span>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Score</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-8 border-y border-gray-100 relative z-10">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Obtained</p>
              <p className={`text-2xl md:text-3xl font-black ${result.passed ? 'text-emerald-500' : 'text-red-500'}`}>{result.score}</p>
            </div>
            <div className="space-y-1 border-x border-gray-100">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Marks</p>
              <p className="text-2xl md:text-3xl font-black text-gray-900">{result.maxScore}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Passing</p>
              <p className="text-2xl md:text-3xl font-black text-gray-500">{Math.ceil((quiz.passingScore / 100) * result.maxScore)}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative z-10">
            {result.passed ? (
               <Link href="/dashboard/certificates" className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 flex items-center gap-2 w-full sm:w-auto justify-center">
                 Get Certificate <Award size={16} />
               </Link>
            ) : (
               <button onClick={() => {
                  setResult(null);
                  setAnswers(Array(quiz.questions.length).fill(-1));
                  setCurrentQuestion(0);
                  setStartTime(new Date());
               }} className="px-8 py-3.5 bg-gray-900 hover:bg-blue-600 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg shadow-gray-900/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 flex items-center gap-2 w-full sm:w-auto justify-center">
                 Retake Quiz <RefreshCw size={16} />
               </button>
            )}
            <Link href="/dashboard/quiz" className="px-8 py-3.5 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-bold uppercase text-xs tracking-widest rounded-xl transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
              Back to Center
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const q = quiz.questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/quiz" className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-900">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{quiz.title}</h1>
            <p className="text-sm text-gray-500 font-medium">Question {currentQuestion + 1} of {quiz.questions.length}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100">
          <Clock size={16} />
          <span>{quiz.duration} Limit</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {quiz.questions.map((_: any, i: number) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-300 ${i === currentQuestion ? 'bg-blue-600' : i < currentQuestion ? 'bg-blue-200' : 'bg-gray-100'}`}></div>
        ))}
      </div>

      {/* Question Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 space-y-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 text-gray-50">
           <Brain size={200} />
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-gray-900 relative z-10 leading-relaxed">
          {q.question}
        </h2>

        <div className="grid grid-cols-1 gap-4 relative z-10">
          {q.options.map((opt: string, index: number) => (
            <button
              key={index}
              onClick={() => selectAnswer(index)}
              className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300 group
                ${answers[currentQuestion] === index 
                  ? 'bg-blue-50 border-2 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.08)]' 
                  : 'bg-gray-50 border-2 border-transparent hover:border-blue-200 hover:bg-blue-50/50'}`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors shrink-0
                ${answers[currentQuestion] === index ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                {answers[currentQuestion] === index && <Check size={12} className="text-white stroke-[3]" />}
              </div>
              <span className={`text-[15px] font-medium leading-snug ${answers[currentQuestion] === index ? 'text-blue-900 font-bold' : 'text-gray-700 group-hover:text-gray-900'}`}>
                {opt}
              </span>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 relative z-10">
          <button 
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`px-5 py-2.5 text-sm rounded-xl font-bold transition-all ${currentQuestion === 0 ? 'opacity-50 cursor-not-allowed text-gray-400' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900'}`}
          >
            Previous
          </button>
          
          {currentQuestion === quiz.questions.length - 1 ? (
            <button 
              onClick={submitQuiz}
              disabled={submitting || answers.includes(-1)}
              className={`flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all
                ${(submitting || answers.includes(-1)) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 shadow-xl shadow-gray-900/10 hover:shadow-blue-600/20'}`}
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
              Submit Quiz
            </button>
          ) : (
            <button 
              onClick={nextQuestion}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors shadow-md hover:shadow-blue-600/20"
            >
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
