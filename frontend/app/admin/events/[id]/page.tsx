"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Component, Calendar, Clock, Search, Shield, Zap, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/firebase/auth";

export default function AdminEventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEventAndTeams = async () => {
    try {
      if (!params.id) return;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api';
      
      // Fetch Event Details
      const eventRes = await fetch(`${apiUrl}/events/${params.id}`);
      if (eventRes.ok) {
        const eventData = await eventRes.json();
        setEvent(eventData);
      } else {
        router.push("/admin/events");
        return;
      }

      // Fetch Teams
      let token = "";
      if (user) {
        token = await user.getIdToken();
      }

      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const teamsRes = await fetch(`${apiUrl}/teams?eventId=${params.id}`, { headers });
      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        teamsData.sort((a: any, b: any) => {
          const timeA = new Date(a.createdAt || 0).getTime();
          const timeB = new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        });
        setTeams(teamsData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventAndTeams();

    const __poll = setInterval(fetchEventAndTeams, 10000);

    return () => {
      clearInterval(__poll);
    };
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-none h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) return null;

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    team.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.leader?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalParticipants = teams.reduce((acc, team) => acc + (team.members?.length || 0), 0);
  const fillPercentage = teams.length > 0 ? Math.round((totalParticipants / (teams.length * 4)) * 100) : 0;

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-12">
      
      {/* Navigation */}
      <Link href="/admin/events" className="inline-flex items-center gap-2 text-neutral-600 font-mono text-xs uppercase tracking-wider hover:text-black font-bold mb-8 transition-colors text-[13px] bg-white px-4 py-2 rounded-none border border-black shadow-none border border-black hover:shadow-none border border-black">
        <ArrowLeft className="w-4 h-4" />
        Back to Manage Events
      </Link>

      {/* Premium Dark Header */}
      <div className="bg-black rounded-none shadow-none border border-black overflow-hidden mb-8 relative border border-black">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-none blur-[100px] -z-0 opacity-40 ${event.type === 'hackathon' ? 'bg-fuchsia-600' : 'bg-black text-white'} translate-x-1/3 -translate-y-1/3 pointer-events-none`}></div>
        <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-none blur-[100px] -z-0 opacity-20 bg-black text-white -translate-x-1/3 translate-y-1/3 pointer-events-none`}></div>
        
        <div className="p-6 md:p-12 relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`px-4 py-1.5 rounded-none text-[12px] font-black uppercase tracking-widest border ${event.type === 'hackathon' ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'} `}>
              {event.type}
            </span>
            <span className={`text-[12px] font-bold flex items-center gap-1.5 px-4 py-1.5 rounded-none border  ${event.status === 'Completed' ? 'bg-white0/20 text-gray-300 border-black/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
              <span className={`w-2 h-2 rounded-none ${event.status === 'Completed' ? 'bg-gray-400' : 'bg-amber-400 animate-pulse'}`}></span>
              {event.status}
            </span>
          </div>

          <h1 className="text-4xl font-heading uppercase tracking-tight md:text-5xl font-heading uppercase tracking-tight font-black font-heading text-white mb-8 tracking-tight drop-shadow-none border border-black">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white/90 font-medium">
            <div className="flex items-center gap-2 bg-white/10  px-5 py-3 rounded-none border border-white/10 shadow-none border border-black">
              <Calendar className="w-5 h-5 text-blue-300" />
              <span className="font-bold text-[15px]">{event.date}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10  px-5 py-3 rounded-none border border-white/10 shadow-none border border-black">
              <Clock className="w-5 h-5 text-gray-300" />
              <span className="font-bold text-[15px]">{event.time || 'TBD'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Stat 1 */}
        <div className="bg-white rounded-none border border-black p-6 md:p-8 shadow-none border border-black hover:shadow-none border border-black transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-50 rounded-none blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-start justify-between mb-6 relative z-10">
            <div className="w-14 h-14 bg-fuchsia-50 rounded-none flex items-center justify-center group-hover:scale-110 transition-transform shadow-none border border-black border border-fuchsia-100">
              <Component className="w-7 h-7 text-fuchsia-600" />
            </div>
            <span className="text-[11px] font-black text-fuchsia-600 bg-fuchsia-50 px-3 py-1.5 rounded-none border border-fuchsia-100 tracking-wider uppercase">
              Total Squads
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="text-5xl font-heading uppercase tracking-tight font-black text-gray-900 mb-2 font-heading tracking-tight">{teams.length}</h3>
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Registered Teams</p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-none border border-black p-6 md:p-8 shadow-none border border-black hover:shadow-none border border-black transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-none blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-start justify-between mb-6 relative z-10">
            <div className="w-14 h-14 bg-blue-50 rounded-none flex items-center justify-center group-hover:scale-110 transition-transform shadow-none border border-black border border-blue-100">
              <Users className="w-7 h-7 text-black" />
            </div>
            <span className="text-[11px] font-black text-black bg-blue-50 px-3 py-1.5 rounded-none border border-blue-100 tracking-wider uppercase">
              Total Users
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="text-5xl font-heading uppercase tracking-tight font-black text-gray-900 mb-2 font-heading tracking-tight">{totalParticipants}</h3>
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Individuals in Teams</p>
          </div>
        </div>

        {/* Stat 3 - Engagement */}
        <div className="bg-white   rounded-none border border-blue-500 p-6 md:p-8 shadow-none border border-black hover:shadow-none border border-black transition-all duration-300 group relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-none blur-3xl"></div>
          <div className="flex items-start justify-between mb-6 relative z-10">
            <div className="w-14 h-14 bg-white/10 rounded-none flex items-center justify-center group-hover:scale-110 transition-transform  border border-white/20">
              <Zap className="w-7 h-7 text-yellow-300" />
            </div>
            <span className="text-[11px] font-black text-blue-100 bg-white/10 px-3 py-1.5 rounded-none border border-white/20 tracking-wider uppercase ">
              Capacity
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="text-5xl font-heading uppercase tracking-tight font-black text-white mb-2 font-heading tracking-tight">{fillPercentage}%</h3>
            <p className="text-[13px] font-bold text-blue-200 uppercase tracking-wider">Overall Team Fill Rate</p>
          </div>
          
          {/* Mini Progress Bar */}
          <div className="w-full h-2 bg-white/20 rounded-none mt-6 overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-none" style={{ width: `${fillPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Premium Teams Data Table */}
      <div className="bg-white rounded-none shadow-none border border-black shadow-none border border-black-200/50 border border-black overflow-hidden relative">
        <div className="p-6 md:p-8 border-b border-black flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white /80 to-white ">
          <div>
            <h2 className="text-2xl font-heading uppercase tracking-tight font-bold text-gray-900 font-heading mb-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-black" />
              Registered Teams
            </h2>
            <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider text-[13px] font-medium">Manage and view all teams actively participating.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search by team name or code..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 h-12 bg-white border-black shadow-none border border-black rounded-none text-[14px] focus-visible:ring-0 focus-visible:ring-0-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-white/50 border-b border-black">
              <tr>
                <th className="px-5 md:px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Team Profile</th>
                <th className="px-5 md:px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Team Leader</th>
                <th className="px-5 md:px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Roster Size</th>
                <th className="px-5 md:px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 md:px-8 py-16 md:py-24 text-center">
                    <div className="w-20 h-20 bg-white rounded-none flex items-center justify-center mx-auto mb-6 border border-black shadow-none border border-black">
                      <Component className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-gray-900 font-bold text-[18px] mb-2">No teams found.</p>
                    <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider text-[14px] max-w-sm mx-auto">Wait for participants to start creating teams, or try adjusting your search filters.</p>
                  </td>
                </tr>
              ) : (
                filteredTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-blue-50/40 transition-colors group">
                    
                    {/* Team Name & Code */}
                    <td className="px-5 md:px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-none bg-white   flex items-center justify-center border border-blue-100 shadow-none border border-black text-black font-bold text-lg group-hover:scale-105 transition-transform">
                          {team.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-[15px] mb-1">{team.name}</p>
                          <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-600 font-mono text-xs uppercase tracking-wider text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-none border border-black">
                            CODE: {team.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Leader */}
                    <td className="px-5 md:px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-none bg-amber-100 text-amber-700 flex items-center justify-center text-[12px] font-bold flex-shrink-0 border border-amber-200">
                          {team.leader?.name ? team.leader.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-bold text-gray-900 truncate flex items-center gap-1">
                            {team.leader?.name}
                            <Shield className="w-3 h-3 text-amber-500" />
                          </p>
                          <p className="text-[12px] text-neutral-600 font-mono text-xs uppercase tracking-wider truncate">{team.leader?.email}</p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Members */}
                    <td className="px-5 md:px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <p className="text-[13px] font-bold text-gray-900">
                          {team.members?.length || 0} <span className="text-gray-400 font-medium">/ {team.maxMembers}</span>
                        </p>
                        <div className="flex -space-x-2 overflow-hidden p-1">
                          {team.members?.map((member: any, i: number) => (
                            <div key={member.uid || i} title={member.name} className="inline-block h-8 w-8 rounded-none ring-0 ring-0 bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-bold shadow-none border border-black hover:-translate-y-1 transition-transform">
                              {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          ))}
                          
                          {/* Empty spots placeholders */}
                          {Array.from({ length: Math.max(0, team.maxMembers - (team.members?.length || 0)) }).map((_, i) => (
                            <div key={`empty-${i}`} className="inline-block h-8 w-8 rounded-none ring-0 ring-0 bg-white border border-dashed border-black"></div>
                          ))}
                        </div>
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="px-5 md:px-8 py-6 text-right">
                       {team.members?.length >= team.maxMembers ? (
                         <span className="inline-flex items-center px-3 py-1.5 rounded-none bg-neutral-100 text-neutral-600 font-mono text-xs uppercase tracking-wider text-[11px] font-black uppercase tracking-wider border border-black shadow-none border border-black">
                           Team Full
                         </span>
                       ) : (
                         <span className="inline-flex items-center px-3 py-1.5 rounded-none bg-amber-50 text-amber-700 text-[11px] font-black uppercase tracking-wider border border-amber-200 shadow-none border border-black shadow-none border border-black-100 relative">
                           <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-none animate-ping opacity-75"></span>
                           <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-none border-2 border-white"></span>
                           Open
                         </span>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
