"use client";

import React, { useState } from "react";
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
  CheckSquare
import Link from "next/link";
import { Loader2, Trash2, Edit2 } from "lucide-react";

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
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const deleteQuiz = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      const res = await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setQuizzes(quizzes.filter(q => q._id !== id));
      } else {
        alert("Failed to delete quiz");
      }
    } catch (err) {
      alert("Error deleting quiz");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Quiz Management</h1>
          <p className="text-gray-400 mt-1">Design assessments and monitor student performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10">
            <FileText size={18} />
            <span>Question Bank</span>
          </button>
          <Link href="/admin/quizzes/new" className="flex items-center gap-2 px-5 py-2.5 bg-[#EBBB54] hover:bg-[#d9ab4b] text-black font-semibold rounded-xl transition-all shadow-lg shadow-[#EBBB54]/10">
            <Plus size={18} />
            <span>Create Quiz</span>
          </Link>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#EBBB54]" size={32} /></div>
        ) : quizzes.length === 0 ? (
          <div className="text-center p-12 border border-white/10 rounded-2xl text-gray-500">No quizzes found. Create one to get started.</div>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                 <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-500 w-fit">
                    <HelpCircle size={32} />
                 </div>
                 
                 <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#EBBB54] transition-colors">{quiz.title}</h3>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-widest border ${quiz.isPublished ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-white/5 text-gray-500 border-white/5"}`}>
                        {quiz.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6">
                       <div className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckSquare size={16} />
                          <span>{quiz.questions?.length || 0} Questions</span>
                       </div>
                       <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock size={16} />
                          <span>{quiz.duration} Limit</span>
                       </div>
                       <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Settings2 size={16} />
                          <span>Passing: {quiz.passingScore}%</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-6">
                    <Link href={`/admin/quizzes/${quiz._id}/edit`} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EBBB54]/10 hover:bg-[#EBBB54]/20 text-[#EBBB54] rounded-xl text-sm font-bold transition-all">
                       <Edit2 size={16} />
                       <span>Edit</span>
                    </Link>
                    <button onClick={() => deleteQuiz(quiz._id)} className="p-2.5 text-gray-400 hover:text-red-500 bg-white/5 rounded-xl transition-all">
                       <Trash2 size={18} />
                    </button>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
