"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Save, Loader2, CheckCircle, AlertCircle, Type, Link as LinkIcon, Clock, Target, Plus, Trash2, Image as ImageIcon, Upload
} from "lucide-react";
import Link from "next/link";

export default function NewQuizPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    image: "",
    courseId: "",
    duration: "30m",
    passingScore: 80,
    difficulty: "Medium",
    status: "Draft",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, image: data.url });
      } else {
        alert("Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
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
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-20 px-4">
      <div className="flex items-center gap-4">
        <Link href="/admin/quizzes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900 border border-gray-200 bg-white shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Quiz</h1>
          <p className="text-sm text-gray-500">Fill in the details below to deploy a new quiz.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 space-y-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section 1: General Information */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider border-l-2 border-blue-600 pl-3">01. General Information</h2>
            
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                <Type size={14} className="text-gray-400" /> Quiz Title
              </label>
              <input required type="text" value={formData.title} onChange={handleTitleChange} placeholder="e.g. React Fundamentals" className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                <LinkIcon size={14} className="text-gray-400" /> Access Slug
              </label>
              <input required type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="e.g. react-fundamentals" className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono text-blue-600" />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                 Linked Course
              </label>
              <div className="relative">
                <select required value={formData.courseId} onChange={(e) => setFormData({ ...formData, courseId: e.target.value })} className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all appearance-none">
                  <option value="">Select a Course</option>
                  {courses.map(c => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Description</label>
              <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Provide a brief overview of what this quiz covers..." className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all resize-none" />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                <ImageIcon size={14} className="text-gray-400" /> Quiz Cover Image
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="Image URL..." className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all" />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded object-cover border border-gray-200" />
                  )}
                </div>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="flex items-center justify-center bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md h-[38px] px-4 transition-all text-gray-700 font-medium text-xs gap-1.5">
                    {uploadingImage ? <Loader2 size={14} className="animate-spin text-gray-500" /> : <Upload size={14} className="text-gray-500" />}
                    {uploadingImage ? "Uploading..." : "Upload"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Quiz Settings */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider border-l-2 border-blue-600 pl-3">02. Quiz Settings</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <Clock size={14} className="text-gray-400" /> Duration
                </label>
                <input required type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 30m" className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <Target size={14} className="text-gray-400" /> Passing Score (%)
                </label>
                <input required type="number" min="1" max="100" value={formData.passingScore} onChange={(e) => setFormData({ ...formData, passingScore: Number(e.target.value) })} className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Difficulty</label>
                <div className="relative">
                  <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all appearance-none">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Status</label>
                <div className="relative">
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all appearance-none">
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Question Builder */}
        <div className="space-y-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider border-l-2 border-blue-600 pl-3">03. Questions</h2>
          </div>

          <div className="space-y-6">
            {formData.questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4 relative">
                {formData.questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Question {qIndex + 1}</label>
                  <input required type="text" value={q.question} onChange={(e) => updateQuestion(qIndex, "question", e.target.value)} placeholder="e.g. What is Next.js?" className="w-full bg-white border border-gray-300 rounded-md py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input type="radio" name={`correct-${qIndex}`} checked={q.correctAnswer === oIndex} onChange={() => updateQuestion(qIndex, "correctAnswer", oIndex)} className="accent-blue-600 w-4 h-4 cursor-pointer" />
                        <label className="text-xs font-medium text-gray-600 cursor-pointer">
                          Option {oIndex + 1} {q.correctAnswer === oIndex && <span className="text-blue-600 font-semibold ml-1">(Correct Answer)</span>}
                        </label>
                      </div>
                      <input required type="text" value={opt} onChange={(e) => updateOption(qIndex, oIndex, e.target.value)} placeholder={`Option {oIndex + 1}`} className={`w-full bg-white border rounded-md py-2 px-3 text-sm text-gray-900 focus:outline-none transition-all ${q.correctAnswer === oIndex ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <button type="button" onClick={addQuestion} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm">
              <Plus size={14} /> Add Question
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             {status === "success" && (
               <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold animate-pulse">
                 <CheckCircle size={16} /> Quiz saved successfully
               </div>
             )}
             {status === "error" && (
               <div className="flex items-center gap-1.5 text-red-600 text-xs font-semibold">
                 <AlertCircle size={16} /> Failed to save quiz
               </div>
             )}
          </div>
          
          <button disabled={loading} type="submit" className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm shadow-sm">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>Save Quiz</span>
          </button>
        </div>
      </form>
    </div>
  );
}
