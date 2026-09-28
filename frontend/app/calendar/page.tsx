"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";

interface CalendarEvent {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  type: string;
  color: string;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api'}/calendar-events`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    // Padding for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = getDaysInMonth(currentDate);

  const getEventsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return events.filter(e => e.date === dateString);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#0c111d] font-sans selection:bg-[#f59e0b] selection:text-[#0c111d] transition-colors duration-300">
      <Navbar />

      <main className="pt-32 pb-24 min-h-screen relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          
          {/* Header */}
          <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-4 border-[#0c111d] pb-8">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#f59e0b] text-[#0c111d] font-mono-code font-black text-sm uppercase tracking-widest border-4 border-[#0c111d] shadow-[4px_4px_0px_0px_#0c111d] mb-6"
              >
                <CalendarIcon className="w-4 h-4" />
                Schedule
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-serif-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-[#0c111d] uppercase leading-[0.9]"
              >
                EVENT<br className="hidden md:block" />
                CALENDAR.
              </motion.h1>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col md:flex-row items-center gap-4"
            >
              <div className="flex gap-4">
                <button onClick={prevMonth} className="w-12 h-12 bg-white text-[#0c111d] border-4 border-[#0c111d] flex items-center justify-center hover:bg-[#f59e0b] transition-colors shadow-[4px_4px_0px_0px_#0c111d] hover:shadow-[2px_2px_0px_0px_#0c111d] hover:translate-x-[2px] hover:translate-y-[2px]">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={nextMonth} className="w-12 h-12 bg-white text-[#0c111d] border-4 border-[#0c111d] flex items-center justify-center hover:bg-[#f59e0b] transition-colors shadow-[4px_4px_0px_0px_#0c111d] hover:shadow-[2px_2px_0px_0px_#0c111d] hover:translate-x-[2px] hover:translate-y-[2px]">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              <div className="font-serif-display text-3xl font-black uppercase tracking-tight text-center md:text-right min-w-[200px]">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
            </motion.div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-[#0c111d] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            /* Calendar Grid */
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white border-4 border-[#0c111d] shadow-[12px_12px_0px_0px_#0c111d]"
            >
              {/* Days of week header */}
              <div className="grid grid-cols-7 border-b-4 border-[#0c111d] bg-[#f5f4ef]">
                {DAYS_OF_WEEK.map(day => (
                  <div key={day} className="py-4 text-center font-mono-code font-black uppercase tracking-widest text-xs md:text-sm border-r-4 border-[#0c111d] last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7">
                {days.map((date, i) => {
                  const isToday = date && date.getTime() === today.getTime();
                  const eventsForDay = date ? getEventsForDate(date) : [];
                  
                  return (
                    <div 
                      key={i} 
                      onClick={() => date && setSelectedDate(date)}
                      className={`
                        min-h-[120px] md:min-h-[160px] border-r-4 border-b-4 border-[#0c111d] p-1.5 md:p-2 transition-colors
                        ${(i + 1) % 7 === 0 ? 'border-r-0' : ''}
                        ${!date ? 'bg-[#fcfbf9]/50' : 'bg-white hover:bg-[#f5f4ef] cursor-pointer'}
                        ${isToday ? 'bg-[#f59e0b]/10' : ''}
                      `}
                    >
                      {date && (
                        <div className="h-full flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <span className={`font-mono-code font-bold text-base md:text-lg ${isToday ? 'bg-[#f59e0b] text-[#0c111d] px-2 py-0.5 border-2 border-[#0c111d]' : 'text-[#0c111d]'}`}>
                              {date.getDate()}
                            </span>
                          </div>
                          <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden">
                            {eventsForDay.map(evt => (
                              <div 
                                key={evt.id} 
                                className={`text-[10px] md:text-xs font-mono-code font-bold uppercase truncate px-1.5 py-1 border-2 border-[#0c111d] ${evt.color}`}
                                title={evt.title}
                              >
                                <span className="mr-1 opacity-80">{evt.time}</span>
                                {evt.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedDate && getEventsForDate(selectedDate).length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0c111d]/80 backdrop-blur-sm"
            onClick={() => setSelectedDate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white border-4 border-[#0c111d] shadow-[16px_16px_0px_0px_#f59e0b] w-full max-w-lg overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-5 md:p-6 border-b-4 border-[#0c111d] bg-[#fcfbf9] flex justify-between items-center">
                <h2 className="font-serif-display font-black text-2xl md:text-3xl uppercase tracking-tight text-[#0c111d]">
                  {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="w-10 h-10 border-2 border-[#0c111d] flex items-center justify-center hover:bg-[#0c111d] hover:text-white transition-colors shrink-0"
                >
                  X
                </button>
              </div>
              <div className="p-5 md:p-6 flex flex-col gap-6 max-h-[60vh] overflow-y-auto">
                {getEventsForDate(selectedDate).map(evt => (
                  <div key={evt.id} className="border-4 border-[#0c111d] p-5 shadow-[4px_4px_0px_0px_#0c111d] relative overflow-hidden group bg-white">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#f5f4ef] rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className={`inline-flex items-center px-2 py-1 mb-3 text-white font-mono-code font-black text-[10px] uppercase tracking-widest border-2 border-[#0c111d] ${evt.color}`}>
                      {evt.type}
                    </div>
                    <h3 className="font-serif-display text-2xl font-black uppercase tracking-tight text-[#0c111d] mb-4">
                      {evt.title}
                    </h3>
                    <div className="flex flex-col gap-2 font-mono-code text-xs uppercase tracking-wider font-bold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#f59e0b]" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#f59e0b]" />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
