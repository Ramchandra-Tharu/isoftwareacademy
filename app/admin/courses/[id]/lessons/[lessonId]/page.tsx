"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash, 
  Type, 
  Code as CodeIcon, 
  Video as VideoIcon, 
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  GripVertical
} from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function LessonContentEditor() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const lessonId = params?.lessonId;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [lesson, setLesson] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [uploadingBlockIndex, setUploadingBlockIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lessons?courseId=${courseId}`);
        if (res.ok) {
          const allLessons = await res.json();
          const found = allLessons.find((l: any) => l._id === lessonId);
          if (found) {
            setLesson(found);
            setBlocks(found.content || []);
            setQuiz(found.quiz || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchLesson();
  }, [lessonId, courseId]);

  const handleBlockFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingBlockIndex(index);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const json = await res.json();
        updateBlock(index, json.url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Upload error");
    } finally {
      setUploadingBlockIndex(null);
    }
  };

  const addBlock = (type: "text" | "code" | "video" | "image") => {
    const newBlock = {
      type,
      content: type === "code" ? "// Write your code here" : "Enter content...",
      language: type === "code" ? "javascript" : undefined
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const updateBlock = (index: number, content: string, extra?: any) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], content, ...extra };
    setBlocks(newBlocks);
  };

  const addQuizQuestion = () => {
    setQuiz([...quiz, { 
      question: "New Question?", 
      options: ["Option A", "Option B", "Option C", "Option D"], 
      correctAnswer: 0 
    }]);
  };

  const removeQuizQuestion = (idx: number) => {
    setQuiz(quiz.filter((_, i) => i !== idx));
  };

  const updateQuizQuestion = (idx: number, field: string, value: any) => {
    const newQuiz = [...quiz];
    newQuiz[idx] = { ...newQuiz[idx], [field]: value };
    setQuiz(newQuiz);
  };

  const handleSave = async () => {
    setLoading(true);
    setStatus("idle");
    try {
      const payload = { 
        id: lessonId, 
        content: blocks,
        quiz: quiz 
      };
      console.log("Saving lesson with payload:", payload);
      
      const res = await fetch("/api/lessons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        const updated = await res.json();
        console.log("Save successful. Updated lesson:", updated);
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        const errorText = await res.text();
        console.error("Save failed with status:", res.status, errorText);
        setStatus("error");
      }
    } catch (err) {
      console.error("Save error:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-32 pt-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/courses/${courseId}/edit`} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 border border-gray-100">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">TOPIC_<span className="text-blue-600">EDITOR</span></h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{lesson?.title || "Untitled Topic"}</p>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-blue-600/20"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          SAVE_CHANGES
        </button>
      </div>

      {/* Block Controls */}
      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 w-fit">
        {[
          { icon: Type, label: "Text", type: "text" },
          { icon: CodeIcon, label: "Code", type: "code" },
          { icon: VideoIcon, label: "Video", type: "video" },
          { icon: ImageIcon, label: "Image", type: "image" }
        ].map((btn) => (
          <button 
            key={btn.type}
            onClick={() => addBlock(btn.type as any)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-white hover:shadow-sm rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-all"
          >
            <btn.icon size={14} /> {btn.label}
          </button>
        ))}
      </div>

      {/* Content Blocks */}
      <div className="space-y-6">
        {blocks.map((block, idx) => (
          <div key={idx} className="group relative bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:border-blue-200 transition-all">
            <div className="absolute -left-3 top-10 w-6 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-300 opacity-0 group-hover:opacity-100 transition-all cursor-grab">
              <GripVertical size={14} />
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  {block.type === "text" && <Type size={16} />}
                  {block.type === "code" && <CodeIcon size={16} />}
                  {block.type === "video" && <VideoIcon size={16} />}
                  {block.type === "image" && <ImageIcon size={16} />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{block.type}_BLOCK</span>
              </div>
              <button 
                onClick={() => removeBlock(idx)}
                className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash size={16} />
              </button>
            </div>

            {block.type === "text" && (
              <textarea 
                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-medium leading-relaxed focus:ring-0 resize-none min-h-[150px]"
                placeholder="Type your content here..."
                value={block.content}
                onChange={(e) => updateBlock(idx, e.target.value)}
              />
            )}

            {block.type === "code" && (
              <div className="space-y-4">
                <select 
                  className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none"
                  value={block.language || "javascript"}
                  onChange={(e) => updateBlock(idx, block.content, { language: e.target.value })}
                >
                  <option value="javascript">JAVASCRIPT</option>
                  <option value="cpp">C++</option>
                  <option value="python">PYTHON</option>
                  <option value="java">JAVA</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                </select>
                <textarea 
                  className="w-full bg-gray-900 text-blue-400 font-mono rounded-2xl p-6 text-xs leading-relaxed focus:ring-0 resize-none min-h-[200px]"
                  placeholder="// Paste your code here..."
                  value={block.content}
                  onChange={(e) => updateBlock(idx, e.target.value)}
                />
              </div>
            )}

            {(block.type === "video" || block.type === "image") && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input 
                    type="text"
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:border-blue-200 outline-none"
                    placeholder={block.type === "video" ? "YOUTUBE_URL_OR_SOURCE" : "IMAGE_URL"}
                    value={block.content}
                    onChange={(e) => updateBlock(idx, e.target.value)}
                  />
                  <div className="relative">
                    <input 
                      type="file"
                      accept={block.type === "image" ? "image/*" : "video/*"}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      onChange={(e) => handleBlockFileUpload(idx, e)}
                      disabled={uploadingBlockIndex === idx}
                    />
                    <button className="h-full px-6 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all flex items-center gap-2">
                      {uploadingBlockIndex === idx ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                      UPLOAD_LOCAL
                    </button>
                  </div>
                </div>
                {block.content && (
                  <div className="relative aspect-video rounded-2xl bg-gray-100 overflow-hidden border border-gray-100 group/media">
                    {block.type === "image" ? (
                      <img src={block.content} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <video src={block.content} controls className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 transition-all flex items-center justify-center">
                       <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{block.type}_ACTIVE_PREVIEW</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {blocks.length === 0 && (
          <div className="h-64 border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-gray-300 space-y-4">
             <Plus size={40} className="opacity-20" />
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">Block_Registry_Empty</p>
          </div>
        )}
      </div>

      {/* Quiz Management Section */}
      <div className="pt-20 border-t border-gray-100 space-y-10">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Topic_Quiz_Engine</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verify student understanding with mini-quizzes.</p>
           </div>
           <button 
             onClick={addQuizQuestion}
             className="px-6 py-3 bg-white border border-gray-100 text-[10px] font-black text-blue-600 uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
           >
             ADD_QUESTION +
           </button>
        </div>

        <div className="space-y-6">
           {quiz.map((q, qIdx) => (
             <div key={qIdx} className="bg-gray-50/50 border border-gray-100 rounded-[2.5rem] p-8 space-y-6 relative group">
                <button 
                  onClick={() => removeQuizQuestion(qIdx)}
                  className="absolute top-8 right-8 p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash size={16} />
                </button>

                <div className="space-y-4">
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Question 0{qIdx + 1}</p>
                   <input 
                     type="text"
                     className="w-full bg-white border border-gray-100 rounded-xl px-6 py-4 text-sm font-bold focus:border-blue-600 outline-none transition-all shadow-sm"
                     placeholder="Enter question text..."
                     value={q.question}
                     onChange={(e) => updateQuizQuestion(qIdx, 'question', e.target.value)}
                   />
                </div>

                <div className="space-y-4">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Options & Logic</p>
                   <div className="grid gap-3">
                      {q.options.map((opt: string, oIdx: number) => (
                        <div key={oIdx} className="flex items-center gap-3">
                           <button 
                             onClick={() => updateQuizQuestion(qIdx, 'correctAnswer', oIdx)}
                             className={cn(
                               "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                               q.correctAnswer === oIdx ? "border-emerald-500 bg-emerald-500 text-white" : "border-gray-200 text-transparent"
                             )}
                           >
                             <CheckCircle size={12} />
                           </button>
                           <input 
                             type="text"
                             className="flex-1 bg-white border border-gray-100 rounded-xl px-5 py-3 text-xs font-medium focus:border-blue-200 outline-none"
                             value={opt}
                             onChange={(e) => {
                               const newOptions = [...q.options];
                               newOptions[oIdx] = e.target.value;
                               updateQuizQuestion(qIdx, 'options', newOptions);
                             }}
                           />
                           <button 
                             onClick={() => {
                               if (q.options.length <= 2) return;
                               const newOptions = q.options.filter((_: any, i: number) => i !== oIdx);
                               updateQuizQuestion(qIdx, 'options', newOptions);
                             }}
                             className="p-2 text-gray-200 hover:text-red-400 transition-colors"
                           >
                             <Trash size={14} />
                           </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => updateQuizQuestion(qIdx, 'options', [...q.options, `New Option`])}
                        className="text-[9px] font-black text-blue-600 uppercase tracking-widest w-fit hover:underline ml-9 pt-2"
                      >
                        + Add_Option
                      </button>
                   </div>
                </div>
             </div>
           ))}

           {quiz.length === 0 && (
             <div className="py-12 flex flex-col items-center justify-center text-gray-300 space-y-4 border-2 border-dashed border-gray-50 rounded-[2.5rem]">
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">No Quiz Questions Configured</p>
             </div>
           )}
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="pt-12 flex justify-center border-t border-gray-100">
         <button 
           onClick={handleSave}
           disabled={loading}
           className="flex items-center gap-3 px-12 py-5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all shadow-2xl shadow-blue-600/10 active:scale-95"
         >
           {loading ? <Loader2 className="animate-spin" size={16} /> : status === "success" ? <CheckCircle size={16} className="text-emerald-400" /> : <Save size={16} />}
           {status === "success" ? "SYNC_COMPLETE" : "SAVE_ALL_CHANGES"}
         </button>
      </div>

      {/* Feedback Status */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
        {status === "success" && (
          <div className="flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10">
            <CheckCircle size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">DEPLOYMENT_SUCCESSFUL</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-3 bg-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl">
            <AlertCircle size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">SYSTEM_FAILURE</span>
          </div>
        )}
      </div>
    </div>
  );
}
