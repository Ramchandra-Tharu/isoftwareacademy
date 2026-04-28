"use client";

import React, { useState, useEffect } from "react";
import { 
  HelpCircle, 
  Plus, 
  Search, 
  FileText, 
  Clock, 
  BarChart3, 
  MoreVertical,
  Settings2,
  Play,
  RotateCcw,
  CheckSquare,
  Trash2,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      const res = await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchQuizzes();
      } else {
        alert("Failed to delete quiz");
      }
    } catch (error) {
      console.error("Delete error", error);
      alert("Failed to delete quiz");
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title?.toLowerCase().includes(search.toLowerCase()) ||
    quiz.courseId?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Quiz Management</h1>
          <p className="text-gray-400 mt-1">Design assessments and monitor student performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/quizzes/question-bank" className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10">
            <FileText size={18} />
            <span>Question Bank</span>
          </Link>
          <Link href="/admin/quizzes/new" className="flex items-center gap-2 px-5 py-2.5 bg-[#EBBB54] hover:bg-[#d9ab4b] text-black font-semibold rounded-xl transition-all shadow-lg shadow-[#EBBB54]/10">
            <Plus size={18} />
            <span>Create Quiz</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#EBBB54]" size={40} />
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-white/10">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-bold">No Quizzes Found</p>
          <p className="text-sm mt-2">Create your first quiz to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all group relative">
              {!quiz.isPublished && (
                <div className="absolute top-4 right-4 px-2 py-1 bg-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded">
                  Draft
                </div>
              )}
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-purple-500/10 text-purple-500 shrink-0 border border-white/5 relative">
                  {quiz.image ? (
                    <img src={quiz.image} alt={quiz.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HelpCircle size={32} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 pr-20">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#EBBB54] transition-colors">{quiz.title}</h3>
                      <span className="px-2 py-0.5 bg-white/5 text-gray-500 text-[10px] font-bold rounded uppercase tracking-widest border border-white/5">
                        {quiz.courseId?.title || "No Course"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckSquare size={16} />
                          <span>{quiz.questions?.length || 0} Questions</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock size={16} />
                          <span>{quiz.duration || "N/A"} Limit</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <BarChart3 size={16} />
                          <span>{quiz.attemptsCount || 0} Total Attempts</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Settings2 size={16} />
                          <span>Passing: {quiz.passingScore || 80}%</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-6">
                    <Link href={`/admin/quizzes/${quiz._id}/analytics`} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all text-white">
                        <RotateCcw size={16} />
                        <span>Analytics</span>
                    </Link>
                    <Link href={`/admin/quizzes/${quiz._id}/edit`} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EBBB54]/10 hover:bg-[#EBBB54]/20 text-[#EBBB54] rounded-xl text-sm font-bold transition-all">
                        <Settings2 size={16} />
                        <span>Edit Quiz</span>
                    </Link>
                    <button onClick={() => handleDelete(quiz._id)} className="p-2.5 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all">
                        <Trash2 size={18} />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
