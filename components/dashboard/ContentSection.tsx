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
}

export default function ContentSection({ 
  title, 
  blocks, 
  duration, 
  isCompleted = false,
  onToggleComplete 
}: ContentSectionProps) {
  const [loading, setLoading] = React.useState(false);

  const handleComplete = async () => {
    if (!onToggleComplete || loading) return;
    setLoading(true);
    await onToggleComplete();
    setLoading(false);
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
                   <div className="relative group rounded-[2.5rem] overflow-hidden border border-gray-100 bg-gray-50 aspect-video flex items-center justify-center shadow-lg">
                      <img 
                        src={block.content} 
                        alt={block.caption || "Asset"} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-xl">
                            Expand_View
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
                <div key={i} className="relative aspect-video rounded-[3rem] overflow-hidden group shadow-2xl shadow-blue-600/10 border border-gray-100">
                   <div className="absolute inset-0 bg-blue-600/5 z-0"></div>
                   <img src={block.content} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Stream" />
                   <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 z-10">
                      <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40 scale-90 group-hover:scale-100 transition-all duration-300 cursor-pointer">
                         <Play size={32} fill="currentColor" className="ml-1" />
                      </div>
                      <div className="px-6 py-2 bg-white/90 backdrop-blur-md rounded-full border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-xl">
                         Initialize_Stream
                      </div>
                   </div>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>

      {/* Resources Widget */}
      <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100 space-y-8">
         <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
               <Download size={22} className="text-blue-600" /> Resource_Vault
            </h3>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">4 Assets Available</span>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Lecture Slides", type: "PDF", size: "2.4 MB" },
              { label: "Asset Manifest", type: "JSON", size: "12 KB" },
              { label: "Source Protocol", type: "ZIP", size: "45.8 MB" },
              { label: "Reference Manual", type: "MD", size: "120 KB" }
            ].map((res) => (
              <div key={res.label} className="p-6 bg-white rounded-2xl flex items-center justify-between group cursor-pointer hover:border-blue-100 border border-gray-100 transition-all shadow-sm">
                 <div className="space-y-1">
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{res.label}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{res.type} // {res.size}</p>
                 </div>
                 <Download size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
              </div>
            ))}
         </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-12 border-t border-gray-100">
         <button className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all group shadow-sm">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Previous_Unit
         </button>
         <button className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all group shadow-sm">
            Next_Unit <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
}
