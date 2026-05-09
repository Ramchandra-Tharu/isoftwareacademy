import React from "react";
import { 
  Play, 
  FileText, 
  Code, 
  Image as ImageIcon, 
  CheckCircle2, 
  Clock, 
  Download,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ContentBlock {
  type: "text" | "code" | "image" | "video";
  content: string;
  language?: string;
  caption?: string;
}

interface ContentSectionProps {
  title: string;
  blocks: ContentBlock[];
  duration: string;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  nextUnitName?: string;
  prevUnitName?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export default function ContentSection({ 
  title, 
  blocks, 
  duration, 
  isCompleted = false,
  onToggleComplete,
  onNext,
  onPrevious,
  nextUnitName,
  prevUnitName,
  quiz
}: ContentSectionProps) {
  const [loading, setLoading] = React.useState(false);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, number>>({});
  const [showResults, setShowResults] = React.useState(false);
  const [revealedAnswers, setRevealedAnswers] = React.useState<Record<number, boolean>>({});

  const handleComplete = async () => {
    if (!onToggleComplete || loading) return;
    setLoading(true);
    await onToggleComplete();
    setLoading(false);
  };

  const isYoutube = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleOptionSelect = (qIdx: number, oIdx: number) => {
    if (showResults || revealedAnswers[qIdx]) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      {/* Lesson Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-gray-100">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-100 shadow-sm">
                 Unit_Content
              </span>
              <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                 <span className="flex items-center gap-1.5"><Clock size={14} /> {duration}</span>
                 <span className={cn(
                   "flex items-center gap-1.5",
                   isCompleted ? "text-emerald-500" : "text-gray-400"
                 )}>
                    <CheckCircle2 size={14} /> {isCompleted ? "Verified" : "Pending"}
                 </span>
              </div>
           </div>
           <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase leading-none">
             {title}
           </h1>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 rounded-2xl transition-all shadow-sm">
              <Bookmark size={20} />
           </button>
           <button 
             onClick={handleComplete}
             disabled={loading}
             className={cn(
               "flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl",
               isCompleted 
                 ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                 : "bg-blue-600 text-white shadow-blue-600/20 hover:scale-105"
             )}
           >
              {loading ? <span className="animate-pulse">Syncing...</span> : isCompleted ? <><CheckCircle2 size={16} /> Completed</> : "Mark_Complete"}
           </button>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="space-y-12">
        {blocks.map((block, i) => {
          switch (block.type) {
            case "text":
              return (
                <div key={i} className="max-w-none">
                  <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap font-medium">
                    {block.content}
                  </p>
                </div>
              );
            case "code":
              return (
                <div key={i} className="space-y-0 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-100">
                     <div className="flex items-center gap-2">
                        <Code size={16} className="text-blue-600" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{block.language || "Terminal"}</span>
                     </div>
                     <button className="text-[9px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Copy_Code</button>
                  </div>
                  <pre className="p-8 bg-[#0F172A] overflow-x-auto custom-scrollbar">
                    <code className="text-sm font-mono text-blue-200/90 whitespace-pre">
                      {block.content}
                    </code>
                  </pre>
                </div>
              );
            case "image":
              return (
                <div key={i} className="space-y-4">
                   <div className="relative group rounded-[2.5rem] overflow-hidden border border-gray-100 bg-gray-50 shadow-lg">
                      <img 
                        src={block.content} 
                        alt={block.caption || "Asset"} 
                        className="w-full h-auto max-h-[600px] object-contain group-hover:scale-105 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-xl">
                            Asset_View_Active
                         </div>
                      </div>
                   </div>
                   {block.caption && (
                     <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                       // {block.caption}
                     </p>
                   )}
                </div>
              );
            case "video":
              return (
                <div key={i} className="relative aspect-video rounded-[3rem] overflow-hidden group shadow-2xl shadow-blue-600/10 border border-gray-100 bg-black">
                   {isYoutube(block.content) ? (
                     <iframe 
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${getYoutubeId(block.content)}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                     ></iframe>
                   ) : (
                     <video 
                        src={block.content} 
                        controls 
                        className="w-full h-full object-contain"
                     />
                   )}
                </div>
              );
            default:
              return null;
          }
        })}
      </div>

      {/* Interactive Unit Quiz */}
      {quiz && quiz.length > 0 && (
        <div className="pt-16 pb-8 border-t border-gray-100 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <span className="w-8 h-[1px] bg-blue-600/30"></span>
               <p className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-600/60">Knowledge_Verification</p>
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Concept Check</h2>
          </div>

          <div className="space-y-8">
            {quiz.map((q, qIdx) => {
              const isSelectedAny = selectedAnswers[qIdx] !== undefined;
              const isRevealed = !!revealedAnswers[qIdx];

              return (
                <div 
                  key={qIdx} 
                  className="bg-[#EAFBF1] rounded-[2rem] p-6 md:p-8 border border-[#BFF3D9] space-y-6 shadow-sm shadow-[#BFF3D9]/10 animate-in fade-in duration-300"
                >
                  <div className="space-y-3">
                    <h3 className="text-xl font-extrabold text-[#115E59] tracking-tight">Quiz</h3>
                    <p className="text-lg font-bold text-gray-900 leading-snug">{q.question}</p>
                  </div>

                  <div className="grid gap-3">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[qIdx] === oIdx;
                      const isCorrect = q.correctAnswer === oIdx;
                      
                      let btnClasses = "w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-300 font-bold text-sm flex items-center justify-between select-none ";
                      
                      if (isRevealed && isCorrect) {
                        btnClasses += "bg-[#34A853] border-[#34A853] text-white shadow-md shadow-[#34A853]/15";
                      } else if (isSelected) {
                        if (isCorrect) {
                          btnClasses += "bg-[#34A853] border-[#34A853] text-white shadow-md shadow-[#34A853]/15";
                        } else {
                          btnClasses += "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/15";
                        }
                      } else {
                        btnClasses += "bg-white border-[#FFA480] hover:border-orange-400 text-gray-800 hover:bg-orange-50/5";
                      }
                      
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleOptionSelect(qIdx, oIdx)}
                          disabled={isRevealed || isSelectedAny}
                          className={btnClasses}
                        >
                          <span className="leading-tight">{opt}</span>
                          
                          {/* Premium Verification Icons */}
                          {((isSelected && isCorrect) || (isRevealed && isCorrect)) && (
                            <div className="flex items-center justify-center w-5 h-5 bg-white rounded-full text-[#34A853] shrink-0 shadow-sm ml-2 animate-in zoom-in-50 duration-200">
                              <svg className="w-3.5 h-3.5 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          {isSelected && !isCorrect && (
                            <div className="flex items-center justify-center w-5 h-5 bg-white rounded-full text-rose-500 shrink-0 shadow-sm ml-2 animate-in zoom-in-50 duration-200">
                              <svg className="w-3.5 h-3.5 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#BFF3D9]/40">
                    {/* Reset Quiz Button */}
                    <button
                      onClick={() => {
                        setSelectedAnswers(prev => {
                          const next = { ...prev };
                          delete next[qIdx];
                          return next;
                        });
                        setRevealedAnswers(prev => {
                          const next = { ...prev };
                          delete next[qIdx];
                          return next;
                        });
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs shadow-sm transition-all select-none hover:scale-[1.03] active:scale-[0.97]"
                    >
                      <span>Reset Quiz</span>
                      <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3" />
                      </svg>
                    </button>

                    {/* Show Answer Button */}
                    <button
                      onClick={() => {
                        setRevealedAnswers(prev => ({ ...prev, [qIdx]: true }));
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#E1F5FE] hover:bg-[#B3E5FC]/40 text-[#0288D1] border border-sky-100 rounded-xl font-bold text-xs transition-all shadow-sm select-none hover:scale-[1.03] active:scale-[0.97]"
                    >
                      <span>Show Answer</span>
                      <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* Navigation */}
      <div className="flex items-center justify-between pt-12 border-t border-gray-100">
         <button 
           onClick={onPrevious}
           disabled={!onPrevious}
           className="flex flex-col items-start gap-1 px-8 py-4 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 rounded-2xl transition-all group shadow-sm disabled:opacity-30 disabled:cursor-not-allowed max-w-[45%]"
         >
            <span className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] opacity-50">
               <ChevronLeft size={10} className="group-hover:-translate-x-1 transition-transform" /> Previous_Module
            </span>
            <span className="text-[10px] font-bold uppercase tracking-tight truncate w-full text-left">
               {prevUnitName || "Start_Of_Journey"}
            </span>
         </button>

         <button 
           onClick={onNext}
           disabled={!onNext}
           className="flex flex-col items-end gap-1 px-8 py-4 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 rounded-2xl transition-all group shadow-sm disabled:opacity-30 disabled:cursor-not-allowed max-w-[45%]"
         >
            <span className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] opacity-50">
               Next_Module <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-tight truncate w-full text-right">
               {nextUnitName || "End_Of_Curriculum"}
            </span>
         </button>
      </div>
    </div>
  );
}
