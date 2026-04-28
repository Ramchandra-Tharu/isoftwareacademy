"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Loader2, 
  Search, 
  HelpCircle,
  FileText,
  Filter
} from "lucide-react";
import Link from "next/link";

export default function QuestionBankPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [filterQuiz, setFilterQuiz] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/quizzes");
        if (res.ok) {
          const data = await res.json();
          setQuizzes(data);
        }
      } catch (error) {
        console.error("Failed to fetch quizzes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // Extract all questions from all quizzes
  const allQuestions = quizzes.flatMap(quiz => {
    return (quiz.questions || []).map((q: any, index: number) => ({
      ...q,
      quizTitle: quiz.title || "Untitled Quiz",
      quizId: quiz._id,
      courseTitle: quiz.courseId?.title || "No Course",
      courseId: quiz.courseId?._id || "none",
      originalIndex: index
    }));
  });

  const uniqueQuizzes = Array.from(new Set(allQuestions.map(q => q.quizTitle)));

  const filteredQuestions = allQuestions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase()) || 
                          q.quizTitle.toLowerCase().includes(search.toLowerCase());
    const matchesQuiz = filterQuiz ? q.quizTitle === filterQuiz : true;
    return matchesSearch && matchesQuiz;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-mono pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/quizzes" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-white border border-white/5">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">QUESTION_<span className="text-[#EBBB54]">BANK</span></h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Aggregated from {quizzes.length} Quizzes</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH_QUESTIONS..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold tracking-tight text-white focus:outline-none focus:border-[#EBBB54]/50 focus:bg-white/10 transition-all w-64"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <select
              value={filterQuiz}
              onChange={(e) => setFilterQuiz(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold tracking-tight text-white focus:outline-none focus:border-[#EBBB54]/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-black">ALL_QUIZZES</option>
              {uniqueQuizzes.map((quizTitle: string, i) => (
                <option key={i} value={quizTitle} className="bg-black">{quizTitle}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-[#EBBB54]" size={40} />
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-white/10">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-bold">No Questions Found</p>
          <p className="text-sm mt-2">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
             <div className="p-3 bg-[#EBBB54]/10 text-[#EBBB54] rounded-xl">
               <HelpCircle size={24} />
             </div>
             <div>
               <p className="text-white font-bold">{filteredQuestions.length} Questions Available</p>
               <p className="text-xs text-gray-500">Across your entire curriculum</p>
             </div>
          </div>

          {filteredQuestions.map((q, idx) => (
            <div key={`${q.quizId}-${idx}`} className="bg-black border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{q.question}</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-[10px] font-bold rounded uppercase tracking-widest border border-white/5">
                      Quiz: {q.quizTitle}
                    </span>
                    <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-[10px] font-bold rounded uppercase tracking-widest border border-white/5">
                      Course: {q.courseTitle}
                    </span>
                  </div>
                </div>
                <div>
                  <Link href={`/admin/quizzes/${q.quizId}/edit`} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all inline-block border border-white/5">
                    View in Quiz
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                {q.options.map((opt: string, optIdx: number) => (
                  <div 
                    key={optIdx} 
                    className={`px-4 py-3 rounded-xl border text-sm font-bold ${
                      optIdx === q.correctAnswer 
                        ? 'bg-[#EBBB54]/10 border-[#EBBB54]/30 text-[#EBBB54]' 
                        : 'bg-white/[0.02] border-white/5 text-gray-400'
                    }`}
                  >
                    <span className="opacity-50 mr-2">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
