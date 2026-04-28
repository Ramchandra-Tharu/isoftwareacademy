"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Save, Loader2, CheckCircle, AlertCircle, Type, Link as LinkIcon, Clock, Target, Plus, Trash2
} from "lucide-react";
import Link from "next/link";

export default function NewQuizPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [courses, setCourses] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    courseId: "",
    duration: "30m",
    passingScore: 80,
    difficulty: "Medium",
    isPublished: false,
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      }
    ]
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, courseId: data[0]._id }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };
    fetchCourses();
  }, []);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ ...formData, title, slug: generateSlug(title) });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }
      ]
    });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...formData.questions];
    newQuestions.splice(index, 1);
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...formData.questions];
    (newQuestions[index] as any)[field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => router.push("/admin/quizzes"), 1500);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-mono pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/quizzes" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-white border border-white/5">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">DEPLOY_<span className="text-[#EBBB54]">QUIZ</span></h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Registering unique assessment unit to quiz_db</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-black border border-white/10 rounded-[32px] p-10 space-y-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Save size={120} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Section 1: Core Identity */}
          <div className="space-y-8">
            <h2 className="text-xs font-black text-[#EBBB54] uppercase tracking-[0.3em] border-l-2 border-[#EBBB54] pl-3">01. CORE_IDENTITY</h2>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <Type size={12} /> Quiz_Title
              </label>
              <input required type="text" value={formData.title} onChange={handleTitleChange} placeholder="E.G. REACT_FUNDAMENTALS" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-[#EBBB54]/50 focus:bg-white/5 transition-all" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <LinkIcon size={12} /> Access_Slug
              </label>
              <input required type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-[#EBBB54]/50 focus:bg-white/5 transition-all font-mono text-[#EBBB54]/70" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                 Linked_Course
              </label>
              <select required value={formData.courseId} onChange={(e) => setFormData({ ...formData, courseId: e.target.value })} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-[#EBBB54]/50 focus:bg-white/5 transition-all appearance-none">
                <option value="">SELECT_COURSE</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Description</label>
              <textarea rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="BRIEF_OVERVIEW..." className="w-full bg-white/[0.02] border border-white/10 rounded-[24px] py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-[#EBBB54]/50 focus:bg-white/5 transition-all resize-none" />
            </div>
          </div>

          {/* Section 2: Technical Metadata */}
          <div className="space-y-8">
            <h2 className="text-xs font-black text-[#EBBB54] uppercase tracking-[0.3em] border-l-2 border-[#EBBB54] pl-3">02. TECHNICAL_META</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <Clock size={12} /> Duration
                </label>
                <input required type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="E.G. 30m" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-[#EBBB54]/50 focus:bg-white/5 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <Target size={12} /> Passing_Score_%
                </label>
                <input required type="number" min="1" max="100" value={formData.passingScore} onChange={(e) => setFormData({ ...formData, passingScore: Number(e.target.value) })} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-[#EBBB54]/50 focus:bg-white/5 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                 Difficulty
              </label>
              <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold tracking-tight focus:outline-none focus:border-[#EBBB54]/50 focus:bg-white/5 transition-all appearance-none">
                <option value="Easy">EASY</option>
                <option value="Medium">MEDIUM</option>
                <option value="Hard">HARD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Question Builder */}
        <div className="space-y-8 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-[#EBBB54] uppercase tracking-[0.3em] border-l-2 border-[#EBBB54] pl-3">03. QUESTION_BANK</h2>
            <button type="button" onClick={addQuestion} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2">
              <Plus size={14} /> ADD_QUESTION
            </button>
          </div>

          <div className="space-y-6">
            {formData.questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-white/[0.01] border border-white/10 rounded-2xl p-6 space-y-6 relative">
                {formData.questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Q_{qIndex + 1}_TEXT</label>
                  <input required type="text" value={q.question} onChange={(e) => updateQuestion(qIndex, "question", e.target.value)} placeholder="WHAT IS NEXT.JS?" className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-sm font-bold tracking-tight focus:outline-none focus:border-[#EBBB54]/50 focus:bg-white/5 transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="radio" name={`correct-${qIndex}`} checked={q.correctAnswer === oIndex} onChange={() => updateQuestion(qIndex, "correctAnswer", oIndex)} className="accent-[#EBBB54] w-4 h-4" />
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">OPT_{oIndex + 1} {q.correctAnswer === oIndex && <span className="text-[#EBBB54] ml-1">(CORRECT)</span>}</label>
                      </div>
                      <input required type="text" value={opt} onChange={(e) => updateOption(qIndex, oIndex, e.target.value)} placeholder={`OPTION ${oIndex + 1}`} className={`w-full bg-white/[0.02] border rounded-xl py-3 px-4 text-sm font-bold tracking-tight focus:outline-none transition-all ${q.correctAnswer === oIndex ? 'border-[#EBBB54]/50 text-[#EBBB54]' : 'border-white/10 focus:border-[#EBBB54]/50 focus:bg-white/5'}`} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
                <div className="relative inline-block w-12 h-6">
                  <input type="checkbox" id="publish" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="sr-only peer" />
                  <label htmlFor="publish" className="absolute inset-0 cursor-pointer bg-white/10 rounded-full transition-colors peer-checked:bg-[#EBBB54]"></label>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6"></div>
                </div>
                <label htmlFor="publish" className="text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer">
                  LIVE_STATUS
                </label>
             </div>

             <div className="h-6 w-px bg-white/5"></div>

             <div className="flex items-center gap-4">
               {status === "success" && (
                 <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                   <CheckCircle size={14} /> ASSET_DEPLOYED
                 </div>
               )}
               {status === "error" && (
                 <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                   <AlertCircle size={14} /> DEPLOY_FAILED
                 </div>
               )}
             </div>
          </div>
          
          <button disabled={loading} type="submit" className="w-full md:w-auto px-12 py-5 bg-[#EBBB54] text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#EBBB54]/20 flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>EXECUTE_DEPLOYMENT</span>
          </button>
        </div>
      </form>
    </div>
  );
}
