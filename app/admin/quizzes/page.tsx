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
} from "lucide-react";

const mockQuizzes = [
  { id: "1", title: "React Fundamentals Quiz", course: "Advanced React Patterns", questions: 20, passingMark: "80%", timeLimit: "30m", attempts: 1240 },
  { id: "2", title: "Flutter Widgets Mastery", course: "Mastering Flutter & Dart", questions: 15, passingMark: "70%", timeLimit: "20m", attempts: 850 },
  { id: "3", title: "Backend API Security", course: "Node.js Backend Mastery", questions: 10, passingMark: "85%", timeLimit: "15m", attempts: 420 },
];

export default function QuizManagement() {
  const [search, setSearch] = useState("");

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
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#EBBB54] hover:bg-[#d9ab4b] text-black font-semibold rounded-xl transition-all shadow-lg shadow-[#EBBB54]/10">
            <Plus size={18} />
            <span>Create Quiz</span>
          </button>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 gap-6">
        {mockQuizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all group">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
               <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-500 w-fit">
                  <HelpCircle size={32} />
               </div>
               
               <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#EBBB54] transition-colors">{quiz.title}</h3>
                    <span className="px-2 py-0.5 bg-white/5 text-gray-500 text-[10px] font-bold rounded uppercase tracking-widest border border-white/5">
                      {quiz.course}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                     <div className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckSquare size={16} />
                        <span>{quiz.questions} Questions</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock size={16} />
                        <span>{quiz.timeLimit} Limit</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-gray-400">
                        <BarChart3 size={16} />
                        <span>{quiz.attempts} Total Attempts</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Settings2 size={16} />
                        <span>Passing: {quiz.passingMark}</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-6">
                  <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all">
                     <RotateCcw size={16} />
                     <span>Analytics</span>
                  </button>
                  <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EBBB54]/10 hover:bg-[#EBBB54]/20 text-[#EBBB54] rounded-xl text-sm font-bold transition-all">
                     <Plus size={16} />
                     <span>Edit Quiz</span>
                  </button>
                  <button className="p-2.5 text-gray-400 hover:text-white bg-white/5 rounded-xl transition-all">
                     <MoreVertical size={18} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
