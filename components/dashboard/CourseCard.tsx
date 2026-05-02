import React from "react";
import Link from "next/link";
import { 
  Clock, 
  BookOpen, 
  PlayCircle, 
  MoreVertical,
  Star,
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
  instructor: string;
  thumbnail: string;
  progress?: number;
  lessonsCount: number;
  duration: string;
  category: string;
  rating?: number;
  href?: string;
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
  rating = 4.8,
  href
}: CourseCardProps) {
  return (
    <div className="border border-gray-200 group flex flex-col h-full overflow-hidden bg-white hover:border-black transition-all duration-300 rounded-md">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute top-4 left-4 px-3 py-1 bg-black text-white rounded-sm text-[8px] font-bold uppercase tracking-widest">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-1 text-amber-400">
              <Star size={12} fill="currentColor" />
              <span className="text-[10px] font-black text-gray-400">{rating} (Verified)</span>
           </div>
           <button className="text-gray-300 hover:text-gray-900 transition-colors"><MoreVertical size={16} /></button>
        </div>
        
        <div className="space-y-1">
           <h3 className="text-lg font-light text-black group-hover:font-medium transition-all leading-tight tracking-tight">
             {title}
           </h3>
           <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Instructor: {instructor}</p>
        </div>

        <div className="pt-4 border-t border-gray-50 mt-auto space-y-4">
           {/* Progress Bar */}
           {progress !== undefined && (
             <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                   <span className="text-[10px] font-black text-black">{progress}%</span>
                </div>
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-black rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${progress}%` }}
                   ></div>
                </div>
             </div>
           )}

           {/* Footer */}
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <span className="flex items-center gap-1"><BookOpen size={12} /> {lessonsCount}</span>
                 <span className="flex items-center gap-1"><Clock size={12} /> {duration}</span>
              </div>
              <Link 
                href={href || `/dashboard/courses/${id}`}
                className="px-4 py-2 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-800 transition-all"
              >
                {progress === undefined ? "Details" : (progress > 0 ? "Resume" : "Start")}
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
