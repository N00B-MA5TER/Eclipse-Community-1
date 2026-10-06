"use client";

import { useAuth } from "@/lib/firebase/auth";
import { useEffect, useState } from "react";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const token = await user.getIdToken();
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setProfile(data);
          }
        } catch (error) {
          console.error("Failed to fetch profile", error);
        }
      };
      fetchProfile();
    }
  }, [user]);

  // Format today's date
  const today = new Date();
  const dateString = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).replace(/(\d+)(th|st|nd|rd)/, '$1th');

  const displayName = profile?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || "User";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Greeting and Filter Pills Section */}
      <section className="space-y-4" data-purpose="dashboard-header">
        {/* Date Eyebrow / Archive Stamp */}
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-[#f59e0b]"></span>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">
            {dateString} // VOL. 26 ARCHIVE
          </span>
        </div>
        
        {/* Hero Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2 border-b border-black">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-black text-white text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 bg-[#f59e0b] animate-pulse"></span>
              <span>DESIGN OPERATIONAL PORTAL</span>
            </div>
            <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-[1.05]">
              Good Evening! <span className="italic font-normal uppercase">{displayName},</span> <span className="inline-block text-3xl sm:text-4xl">👋</span>
            </h1>
          </div>
          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 pb-1">
            <Link href="/dashboard" className="px-6 py-3 bg-[#0f172a] hover:bg-black text-white font-mono text-xs uppercase tracking-wider font-bold rounded-none border border-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-none transition-smooth flex items-center gap-2 group" type="button">
              <svg className="w-3.5 h-3.5 text-[#f59e0b] group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Join New Event</span>
            </Link>
          </div>
        </div>
        
        {/* Status / Filter Chips (Monochrome Broadsheet Pills) */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Registered Events Pill */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-none bg-white border border-black text-xs font-mono shadow-[2px_2px_0px_0px_#000000] hover:border-black transition-smooth cursor-pointer">
            <span className="w-4 h-4 bg-[#f59e0b] text-black font-mono font-bold text-[10px] flex items-center justify-center">
              ✓
            </span>
            <span className="text-neutral-700 tracking-wide uppercase"><strong className="text-black font-bold font-mono">1</strong> Registered Events</span>
          </div>
          {/* Upcoming Workshops Pill */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-none bg-white border border-black text-xs font-mono shadow-[2px_2px_0px_0px_#000000] hover:border-black transition-smooth cursor-pointer">
            <span className="w-4 h-4 bg-black text-white font-mono font-bold text-[10px] flex items-center justify-center">
              ◷
            </span>
            <span className="text-neutral-700 tracking-wide uppercase"><strong className="text-black font-bold font-mono">2</strong> Upcoming Workshops</span>
          </div>
          {/* Active Team Badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-none bg-white border border-black text-xs font-mono shadow-[2px_2px_0px_0px_#000000] hover:border-black transition-smooth cursor-pointer">
            <span className="w-4 h-4 bg-neutral-200 text-black font-mono font-bold text-[10px] flex items-center justify-center border border-black">
              ✦
            </span>
            <span className="text-neutral-700 tracking-wide uppercase"><strong className="text-black font-bold font-mono">1</strong> Active Team</span>
          </div>
        </div>
      </section>

      <UpcomingEvents />
    </div>
  );
}
