import React from "react";
import Link from "next/link";
import { 
  Clock, 
  Users,
  BarChart,
  BookOpen,
  ArrowRight
} from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  thumbnail: string;
  progress?: number;
  duration: string;
  lessonsCount?: number;
  totalLessons?: number;
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
  difficulty = "Beginner",
  enrolledCount = 0,
  price = 0,
  href
}: CourseCardProps) {
  const isFree = price === 0;

  return (
    <div className="bg-white border border-blue-50 rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative aspect-[2/1] overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
        {isFree && (
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-md shadow-sm border border-gray-100">
             <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">Free</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col space-y-2">
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
          {title}
        </h3>

        <div className="space-y-2.5">
           {/* Progress Bar */}
           {progress !== undefined && progress > 0 && (
             <div className="space-y-1">
                <div className="h-1 w-full bg-blue-50 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-blue-600 rounded-full transition-all duration-700" 
                     style={{ width: `${progress}%` }}
                   ></div>
                </div>
                <span className="text-[8px] font-black text-blue-600 uppercase">{progress}% Complete</span>
             </div>
           )}

           {/* Stats Section */}
           <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                    <Clock size={14} className="text-gray-400" /> {duration}
                 </div>
                 <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                    <BookOpen size={14} className="text-gray-400" /> {totalLessons || lessonsCount || 0}
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                    <Users size={14} className="text-gray-400" /> {enrolledCount}
                 </div>
                 <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                    <BarChart size={14} className="text-gray-400" /> {difficulty}
                 </div>
              </div>
           </div>

           {/* Action */}
           <div className="pt-1">
             <Link 
               href={href || `/dashboard/courses/${id}`}
               className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-all group/link"
             >
               <span>View Course</span>
               <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
