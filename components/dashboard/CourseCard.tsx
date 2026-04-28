import React from "react";
import Link from "next/link";
import { 
  Clock, 
  BookOpen, 
  PlayCircle, 
  MoreVertical,
  Star
} from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  lessonsCount: number;
  duration: string;
  category: string;
  rating?: number;
}

export default function CourseCard({
  id,
  title,
  instructor,
  thumbnail,
  progress,
  lessonsCount,
  duration,
  category,
  rating = 4.8
}: CourseCardProps) {
  return (
    <div className="group bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#EBBB54]/30 hover:bg-[#222222] transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
          {category}
        </div>
        <div className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors cursor-pointer">
          <MoreVertical size={20} />
        </div>
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
           <div className="w-12 h-12 rounded-full bg-[#EBBB54] flex items-center justify-center text-black shadow-2xl scale-75 group-hover:scale-100 transition-transform">
              <PlayCircle size={24} fill="currentColor" />
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-1 mb-2 text-[#EBBB54]">
           <Star size={12} fill="currentColor" />
           <span className="text-[10px] font-bold">{rating}</span>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 group-hover:text-[#EBBB54] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 italic">by {instructor}</p>

        <div className="mt-auto space-y-4">
           {/* Progress Bar */}
           <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                 <span className="text-gray-400">Progress</span>
                 <span className="font-bold text-white">{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-gradient-to-r from-[#EBBB54] to-[#f5d085] rounded-full transition-all duration-1000 ease-out" 
                   style={{ width: `${progress}%` }}
                 ></div>
              </div>
           </div>

           {/* Meta Info */}
           <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-white/5">
              <div className="flex items-center gap-3">
                 <span className="flex items-center gap-1">
                    <BookOpen size={14} /> {lessonsCount} Lessons
                 </span>
                 <span className="flex items-center gap-1">
                    <Clock size={14} /> {duration}
                 </span>
              </div>
              <Link 
                href={`/dashboard/courses/${id}`}
                className="text-[#EBBB54] font-bold hover:underline"
              >
                {progress > 0 ? "Continue" : "Start"}
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
