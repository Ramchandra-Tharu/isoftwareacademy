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
    <div className="card-premium group flex flex-col h-full overflow-hidden bg-white hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500 border-transparent hover:border-blue-50">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black text-gray-900 uppercase tracking-widest border border-white/20 shadow-sm">
          {category}
        </div>
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600/10 backdrop-blur-[2px]">
           <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-all duration-300">
              <PlayCircle size={24} fill="currentColor" />
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex-1 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-1 text-amber-400">
              <Star size={12} fill="currentColor" />
              <span className="text-[10px] font-black text-gray-400">{rating} (Verified)</span>
           </div>
           <button className="text-gray-300 hover:text-gray-900 transition-colors"><MoreVertical size={16} /></button>
        </div>
        
        <div className="space-y-1">
           <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight uppercase tracking-tighter">
             {title}
           </h3>
           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Instructor: {instructor}</p>
        </div>

        <div className="pt-6 border-t border-gray-50 mt-auto space-y-6">
           {/* Progress Bar */}
           <div className="space-y-2">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                 <span className="text-[10px] font-black text-blue-600">{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" 
                   style={{ width: `${progress}%` }}
                 ></div>
              </div>
           </div>

           {/* Footer */}
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                 <span className="flex items-center gap-1.5"><BookOpen size={14} /> {lessonsCount}</span>
                 <span className="flex items-center gap-1.5"><Clock size={14} /> {duration}</span>
              </div>
              <Link 
                href={`/dashboard/courses/${id}`}
                className="px-6 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all"
              >
                {progress > 0 ? "Resume" : "Start"}
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
