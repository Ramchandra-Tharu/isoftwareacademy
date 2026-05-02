"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart2, 
  HelpCircle, 
  Award, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { useSession } from "next-auth/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: BookOpen, label: "My Courses", href: "/dashboard/my-courses" },
  { icon: BarChart2, label: "Analytics", href: "/dashboard/progress" },
  { icon: HelpCircle, label: "Assessments", href: "/dashboard/quiz" },
  { icon: Award, label: "Certificates", href: "/dashboard/certificates" },
  { icon: MessageSquare, label: "Community", href: "/dashboard/comments" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside 
      className={cn(
        "relative flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Sidebar Header */}
      <div className={cn(
        "flex items-center h-20 px-6 border-b border-gray-50 bg-gray-50/30",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center text-white group-hover:bg-gray-800 transition-colors">
               <Cpu size={18} />
            </div>
            <span className="text-xs font-bold tracking-tight text-gray-900">
               ORACLE_<span className="font-light">CLOUD</span>
            </span>
          </Link>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm",
            isCollapsed && "mt-2"
          )}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
        {session?.user?.role === "admin" && (
          <>
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all group mb-2",
                isCollapsed && "justify-center"
              )}
            >
              <ShieldCheck size={20} className="group-hover:scale-110 transition-transform shrink-0" />
              {!isCollapsed && <span className="text-xs font-black uppercase tracking-widest">Admin Control</span>}
            </Link>
            <Link
              href="/admin/comments"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100 transition-all group mb-6",
                isCollapsed && "justify-center",
                pathname === "/admin/comments" && "bg-black text-white border-black"
              )}
            >
              <MessageSquare size={20} className={cn("shrink-0", pathname === "/admin/comments" ? "text-white" : "group-hover:scale-110")} />
              {!isCollapsed && <span className="text-xs font-black uppercase tracking-widest">Moderation Hub</span>}
            </Link>
          </>
        )}

        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-black text-white font-medium" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              )}
            >
              <item.icon size={18} className={cn(
                "transition-colors shrink-0",
                isActive ? "text-white" : "text-gray-400 group-hover:text-black"
              )} />
              {!isCollapsed && <span className="text-sm tracking-tight">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-50">
        <Link 
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group mb-1",
            pathname === "/dashboard/settings" && "bg-gray-50 text-gray-900 font-bold",
            isCollapsed && "justify-center"
          )}
        >
          <Settings size={20} className="group-hover:text-blue-600" />
          {!isCollapsed && <span className="text-sm">Account Settings</span>}
        </Link>
        <button 
          onClick={() => {}}
          className={cn(
            "flex items-center w-full gap-3 px-4 py-3 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut size={20} className="group-hover:text-red-600" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
