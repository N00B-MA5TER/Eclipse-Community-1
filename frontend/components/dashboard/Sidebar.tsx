"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { 
  Layout, 
  Users, 
  Calendar, 
  User, 
  HelpCircle, 
  LogOut 
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Layout },
    { name: "All Teams", href: "/dashboard/teams", icon: Users, badge: "01" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-black flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30" data-purpose="sidebar-navigation">
      {/* Top Section: Brand & Main Navigation */}
      <div>
        {/* Top Metadata Eyebrow Rail */}
        <div className="border-b border-black px-5 py-2.5 flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-500 uppercase bg-neutral-50/50">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-[#f59e0b]"></span>
            <span className="font-bold text-black tracking-wider">CREO.SYS // V26</span>
          </div>
          <span className="font-semibold text-black">DESK</span>
        </div>

        <Link href="/" className="h-[120px] py-2 px-4 border-b border-black flex items-center justify-center hover:bg-neutral-50 transition-colors">
          <img src="/logo.png" alt="Eclipse Logo" className="w-auto h-full object-contain scale-[1.3]" />
        </Link>

        {/* Navigation Menu Items */}
        <nav aria-label="Sidebar" className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-none font-mono text-xs uppercase tracking-wider transition-smooth group ${
                  isActive 
                    ? "bg-black text-white font-bold shadow-[2px_2px_0px_0px_#f59e0b]" 
                    : "text-neutral-700 hover:text-black hover:bg-neutral-100 font-medium border border-transparent hover:border-black"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${isActive ? "text-[#f59e0b]" : "text-neutral-500 group-hover:text-black"}`} />
                  <span>{item.name}</span>
                </div>
                {isActive ? (
                  <span className="w-1.5 h-1.5 bg-[#f59e0b]"></span>
                ) : item.badge ? (
                  <span className="text-[10px] text-neutral-400 font-mono">{item.badge}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Logout */}
      <div className="p-4 border-t border-black space-y-1 bg-white">
        <button onClick={logout} className="w-full flex items-center justify-between px-3.5 py-2 rounded-none text-neutral-500 hover:text-black hover:bg-neutral-100 font-mono text-xs uppercase tracking-wider font-medium border border-transparent hover:border-black transition-smooth group" type="button">
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-neutral-400 group-hover:text-black" />
            <span>Log Out</span>
          </div>
          <span className="text-neutral-400 font-mono">→</span>
        </button>
      </div>
    </aside>
  );
}
