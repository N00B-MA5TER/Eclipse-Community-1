"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth";
import Link from "next/link";
import { CalendarPlus, Trash2, Edit, Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ManageEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api'}/events`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
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

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      try {
        const token = await user?.getIdToken();
        if (!token) throw new Error("Not authenticated");
  
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/events/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });
  
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to delete event");
        }
      } catch (err: any) {
        console.error("Error deleting event:", err);
        alert(err.message || "Failed to delete event");
      }
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[2rem] font-bold font-heading text-gray-900 tracking-tight">Manage Events</h1>
          <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider mt-1 font-medium text-[15px]">View, edit, or delete published workshops and hackathons.</p>
        </div>
        <Link href="/admin/events/new" className="inline-flex items-center gap-2 bg-black hover:bg-black text-white font-mono text-xs uppercase tracking-wider font-bold px-6 py-3 rounded-none border border-black shadow-[3px_3px_0px_0px_#f59e0b] hover:shadow-none transition-smooth active:scale-95">
          <CalendarPlus className="w-5 h-5 text-[#f59e0b]" />
          Create New Event
        </Link>
      </div>

      <div className="bg-white rounded-none border border-black overflow-hidden relative">
        
        {/* Table Toolbar */}
        <div className="p-6 border-b border-black flex items-center justify-between bg-white/50 ">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search events..." 
              className="w-full pl-9 h-10 bg-white/80 border-black rounded-none text-[13px] focus-visible:ring-0 focus-visible:ring-0-500 transition-all"
            />
          </div>
          <div className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
            {events.length} {events.length === 1 ? 'Event' : 'Events'}
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white/50 border-b border-black">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Event Name</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="w-16 h-16 bg-white rounded-none flex items-center justify-center mx-auto mb-4">
                    <CalendarPlus className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider font-medium text-[15px]">No events found.</p>
                  <p className="text-gray-400 text-[13px] mt-1">Click "Create New Event" to add your first one.</p>
                </td>
              </tr>
            ) : (
              events.map((evt) => (
                <tr key={evt.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 text-[14px]">{evt.title}</p>
                    <p className="text-[12px] text-neutral-600 font-mono text-xs uppercase tracking-wider font-medium truncate max-w-xs">{evt.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-none text-[11px] font-bold capitalize border ${evt.type === 'hackathon' ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                      {evt.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] font-medium text-gray-900">{evt.date}</p>
                    <p className="text-[11px] font-medium text-gray-400">{evt.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-none bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-100">
                      {evt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                      <Link href={`/admin/events/${evt.id}`}>
                        <button title="View Details & Teams" className="p-2 text-gray-400 hover:text-amber-600 transition-colors rounded-none hover:bg-amber-50">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-black transition-colors rounded-none hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(evt.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-none hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
