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
  Bookmark
} from "lucide-react";

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
    <div className="bg-[#1a1a1a]/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Lesson Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
        <div className="space-y-2">
           <div className="flex items-center gap-2 text-[#EBBB54] text-xs font-bold uppercase tracking-widest">
              <FileText size={14} /> Lesson Content
           </div>
           <h1 className="text-3xl font-bold font-serif text-white">{title}</h1>
           <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Clock size={16} /> {duration}</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className={isCompleted ? "text-green-500" : "text-gray-600"} /> {isCompleted ? "Completed" : "In Progress"}</span>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/10 transition-all">
              <Bookmark size={20} />
           </button>
           <button className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/10 transition-all">
              <Share2 size={20} />
           </button>
           <button 
             onClick={handleComplete}
             disabled={loading}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(235,187,84,0.2)] ${
               isCompleted 
                 ? "bg-green-500/20 text-green-500 border border-green-500/30" 
                 : "bg-[#EBBB54] text-black"
             }`}
           >
              {loading ? "Saving..." : isCompleted ? "Completed" : "Mark Completed"}
           </button>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="space-y-12">
        {blocks.map((block, i) => {
          switch (block.type) {
            case "text":
              return (
                <div key={i} className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {block.content}
                  </p>
                </div>
              );
            case "code":
              return (
                <div key={i} className="space-y-4">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#2a2a2a] rounded-t-xl border-b border-white/5 border-x border-white/5">
                     <div className="flex items-center gap-2">
                        <Code size={16} className="text-[#EBBB54]" />
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">{block.language || "code"}</span>
                     </div>
                     <button className="text-[10px] text-gray-500 hover:text-white font-bold uppercase tracking-wider transition-colors">Copy Code</button>
                  </div>
                  <pre className="p-6 bg-[#0c0c0c] border border-white/5 rounded-b-xl overflow-x-auto custom-scrollbar">
                    <code className="text-sm font-mono text-[#EBBB54]/90 whitespace-pre">
                      {block.content}
                    </code>
                  </pre>
                </div>
              );
            case "image":
              return (
                <div key={i} className="space-y-4">
                   <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5 aspect-video flex items-center justify-center">
                      <img 
                        src={block.content} 
                        alt={block.caption || "Lesson Illustration"} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                         <div className="flex items-center gap-2 p-2 bg-black/40 backdrop-blur-md rounded-xl text-white/70 hover:text-white transition-all cursor-pointer">
                            <ImageIcon size={20} />
                            <span className="text-xs font-medium">Click to Enlarge</span>
                         </div>
                      </div>
                   </div>
                   {block.caption && (
                     <p className="text-center text-sm text-gray-500 italic">
                       {block.caption}
                     </p>
                   )}
                </div>
              );
            case "video":
              return (
                <div key={i} className="relative aspect-video rounded-3xl overflow-hidden group border border-white/10 shadow-2xl">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#EBBB54]/20 via-transparent to-black/60 z-0"></div>
                   <img src={block.content} className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" alt="Video Placeholder" />
                   <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 z-10">
                      <div className="w-20 h-20 bg-[#EBBB54] rounded-full flex items-center justify-center text-black shadow-[0_0_50px_rgba(235,187,84,0.5)] scale-90 group-hover:scale-100 transition-all duration-300 cursor-pointer">
                         <Play size={32} fill="currentColor" className="ml-1" />
                      </div>
                      <p className="text-sm font-bold text-white uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">Play Lesson Video</p>
                   </div>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-10 border-t border-white/5">
         <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all group">
            <span className="opacity-50 group-hover:-translate-x-1 transition-transform">←</span> Previous Lesson
         </button>
         <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all group">
            Next Lesson <span className="opacity-50 group-hover:translate-x-1 transition-transform">→</span>
         </button>
      </div>
      
      {/* Resources Widget */}
      <div className="bg-[#EBBB54]/5 rounded-3xl p-8 border border-[#EBBB54]/10 space-y-4">
         <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Download size={20} className="text-[#EBBB54]" /> Downloadable Resources
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Lecture Slides (PDF)",
              "Source Code (.zip)",
              "Course Cheatsheet",
              "Reference Documentation"
            ].map((res) => (
              <div key={res} className="p-4 bg-black/40 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-black/60 transition-colors border border-white/5">
                 <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{res}</span>
                 <Download size={16} className="text-gray-600 group-hover:text-[#EBBB54] transition-colors" />
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
