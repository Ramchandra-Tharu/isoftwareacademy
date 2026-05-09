import React from "react";
import Link from "next/link";
import { 
  Clock, 
  Users,
  BarChart,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CourseCardProps {
  id: string;
  title: string;
  thumbnail: string;
  progress?: number;
  duration: string;
  lessonsCount?: number;
  totalLessons?: number;
  totalChapters?: number;
  difficulty?: string;
  enrolledCount?: number;
  price?: number;
  href?: string;
}

export default function CourseCard({
  id,
  title,
  thumbnail,
  progress,
  duration,
  lessonsCount,
  totalLessons,
  totalChapters,
  difficulty = "Beginner",
  enrolledCount = 0,
  price = 0,
  href
}: CourseCardProps) {
  const isFree = price === 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      {/* Thumbnail */}
      <div className="relative aspect-[2/1] overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isFree && (
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-md shadow-sm border border-gray-100">
             <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">Free</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
            {title}
          </h3>

          {/* Stats Section - Statically visible */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-tight pt-1">
             <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-gray-400 shrink-0" /> {duration}
             </div>
             <div className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-gray-400 shrink-0" /> {totalChapters || 0} Ch
             </div>
             <div className="flex items-center gap-1.5">
                <Users size={14} className="text-gray-400 shrink-0" /> {enrolledCount}
             </div>
             <div className="flex items-center gap-1.5">
                <BarChart size={14} className="text-gray-400 shrink-0" /> {difficulty}
             </div>
          </div>
        </div>

        {/* Action button & progress bar */}
        <div className="space-y-3 pt-2">
          {/* Progress Bar (Visible if exists) */}
          {progress !== undefined && progress > 0 && (
             <div className="space-y-1">
                <div className="h-1 w-full bg-blue-50 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-blue-600 rounded-full transition-all duration-700" 
                     style={{ width: `${progress}%` }}
                   ></div>
                </div>
                <div className="text-[8px] font-black text-blue-600 uppercase">{progress}% Complete</div>
             </div>
          )}

          <Link 
            href={href || `/dashboard/courses/${id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm shadow-blue-600/10 transition-all select-none"
          >
            <span>View Course</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
