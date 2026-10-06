"use client";

import { CalendarPlus, Users, Activity, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [eventCount, setEventCount] = useState(0);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api'}/events`);
      if (res.ok) {
        const eventsData = await res.json();
        setEventCount(eventsData.length);
      }
    } catch (e) {
      console.error("Failed to fetch events:", e);
    }
  };

  useEffect(() => {
    fetchEvents();

    const __poll = setInterval(fetchEvents, 10000);
    
    return () => {
      clearInterval(__poll);
    };
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto selection:bg-blue-100 selection:text-blue-900">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-[2rem] font-bold font-heading text-gray-900 tracking-tight flex items-center gap-3">
            Admin Overview
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-black rounded-none text-[11px] font-bold tracking-wide uppercase">
              <Sparkles className="w-3 h-3" /> Live
            </span>
          </h1>
          <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider font-medium mt-1 text-[15px]">Monitor platform activity and manage events.</p>
        </div>
        <Link href="/admin/events/new" className="inline-flex items-center gap-2 bg-black text-white hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-none transition-all hover:scale-105 shadow-none border border-black shadow-none border border-black-600/20 active:scale-95">
          <CalendarPlus className="w-5 h-5" />
          Create New Event
        </Link>
      </div>

      {/* Premium Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-none shadow-none border border-black border border-black relative overflow-hidden group hover:border-blue-100 transition-colors">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-50 rounded-none blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total Events</p>
              <h3 className="text-4xl font-heading uppercase tracking-tight font-bold text-gray-900 font-heading">{eventCount}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-black rounded-none flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[13px] font-medium text-amber-600 relative z-10">
            <TrendingUp className="w-4 h-4" />
            <span>Platform is active</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-none shadow-none border border-black border border-black relative overflow-hidden group hover:border-fuchsia-100 transition-colors">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-fuchsia-50 rounded-none blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-2">Registrations</p>
              <h3 className="text-4xl font-heading uppercase tracking-tight font-bold text-gray-900 font-heading">0</h3>
            </div>
            <div className="w-12 h-12 bg-fuchsia-50 text-fuchsia-600 rounded-none flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[13px] font-medium text-gray-400 relative z-10">
            <span>Awaiting users</span>
          </div>
        </div>
        
        {/* Card 3 */}
        <div className="bg-black p-6 rounded-none shadow-none border border-black relative overflow-hidden text-white border border-black">
          <div className="absolute inset-0 bg-white /20 to-transparent"></div>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-500/20 rounded-none blur-3xl"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-[13px] font-bold text-blue-400 uppercase tracking-wider mb-2">System Status</p>
              <h3 className="text-4xl font-heading uppercase tracking-tight font-bold text-white font-heading">Online</h3>
            </div>
            <div className="w-12 h-12 bg-white/10 text-white rounded-none flex items-center justify-center  border border-white/10">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[13px] font-medium text-gray-300 relative z-10">
            <span>All systems operational</span>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-none shadow-none border border-black border border-black p-12 text-center max-w-3xl mx-auto mt-12 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-50 rounded-none blur-3xl"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-50 rounded-none blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="w-24 h-24 bg-white rounded-none flex items-center justify-center mx-auto mb-8 shadow-none border border-black border-b-2 border-white">
            <CalendarPlus className="w-12 h-12 text-black" />
          </div>
          <h2 className="text-3xl font-heading uppercase tracking-tight font-bold font-heading text-gray-900 mb-4 tracking-tight">Expand the Platform</h2>
          <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider mb-10 text-[15px] max-w-md mx-auto leading-relaxed">
            Create new Workshops or Hackathons. Once published, they will instantly appear on the main dashboard for all registered users.
          </p>
          <Link href="/admin/events/new" className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-bold px-8 py-4 rounded-none transition-all hover:scale-105 active:scale-95 text-[15px]">
            <CalendarPlus className="w-5 h-5" />
            Launch New Event
          </Link>
        </div>
      </div>
    </div>
  );
}
