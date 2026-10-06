"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { Users, Trash2, Search, Component, AlertTriangle, ExternalLink, ChevronDown } from "lucide-react";

export default function AdminTeamsPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<any[]>([]);
  const [eventsMap, setEventsMap] = useState<Record<string, string>>({});
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api'}/events`);
      if (res.ok) {
        const eventsData = await res.json();
        const eMap: Record<string, string> = {};
        eventsData.forEach((doc: any) => {
          eMap[doc.id] = doc.title || `Event ${doc.id}`;
        });
        if (!eMap["1"]) eMap["1"] = "Intro to React Native";
        if (!eMap["2"]) eMap["2"] = "Global AI Hackathon 2026";
        setEventsMap(eMap);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchTeams = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api';
      
      // Since it's admin, we can reuse the admin/teams endpoint or generic teams endpoint depending on how it's implemented.
      // But we have an admin endpoint now for users, wait - there's no `/api/admin/teams` endpoint yet. Let's just use the regular `/api/teams` but maybe it restricts to joined teams? Wait, `/api/teams` without ID gets ALL teams or JUST user's?
      // In teams.ts: router.get('/', ... returns all teams. It's not filtered by user.
      const res = await fetch(`${apiUrl}/teams`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        data.sort((a: any, b: any) => {
          const timeA = new Date(a.createdAt || 0).getTime();
          const timeB = new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        });
        setTeams(data);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchTeams();

    const __poll = setInterval(fetchTeams, 10000);
    
    return () => {
      clearInterval(__poll);
    };
  }, [user]);

  const handleDelete = async (teamId: string) => {
    if (!confirm("Are you sure you want to delete this team? This action cannot be undone.")) return;
    
    setDeletingId(teamId);
    try {
      if (!user) return;
      const idToken = await user.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/teams/${teamId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        }
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete team");
      }

      setTeams(prev => prev.filter(t => t.id !== teamId));
      alert("Team deleted successfully");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.eventId.includes(search));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-none h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading uppercase tracking-tight font-heading font-bold text-gray-900 mb-2">Manage Teams</h1>
          <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider text-[14px]">View all teams across all events and manage their existence.</p>
        </div>
      </div>

      <div className="bg-white rounded-none border border-black shadow-none p-6 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search teams by name or event ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-none border border-black focus:outline-none focus:ring-0 focus:ring-0-500/20 focus:border-[#f59e0b] transition-all text-sm"
          />
        </div>
      </div>

      {filteredTeams.length === 0 ? (
        <div className="bg-white rounded-none border border-dashed border-black p-12 text-center shadow-none">
          <div className="w-16 h-16 bg-white rounded-none flex items-center justify-center mx-auto mb-4">
            <Component className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Teams Found</h3>
          <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider">There are no teams matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(
            filteredTeams.reduce((acc: any, team) => {
              const eId = team.eventId || "unknown";
              if (!acc[eId]) acc[eId] = [];
              acc[eId].push(team);
              return acc;
            }, {})
          ).map(([eventId, eventTeams]: [string, any]) => {
            const eventName = eventsMap[eventId] || eventId;
            const isExpanded = expandedEvents[eventId] !== false; // Default true

            return (
              <div key={eventId} className="bg-white rounded-none border border-black shadow-none overflow-hidden">
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors"
                  onClick={() => setExpandedEvents(prev => ({ ...prev, [eventId]: !isExpanded }))}
                >
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-heading uppercase tracking-tight font-bold text-gray-900">{eventName}</h2>
                    <span className="bg-neutral-100 text-neutral-600 font-mono text-xs uppercase tracking-wider text-xs font-bold px-3 py-1 rounded-none">{eventTeams.length} Teams</span>
                  </div>
                  <button className="w-8 h-8 rounded-none bg-white flex items-center justify-center text-neutral-600 font-mono text-xs uppercase tracking-wider group-hover:bg-neutral-100 transition-all">
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {isExpanded && (
                  <div className="overflow-x-auto border-t border-black">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white border-b border-black text-neutral-600 font-mono text-xs uppercase tracking-wider uppercase tracking-wider text-[11px] font-bold">
                        <tr>
                          <th className="px-6 py-4">Team Name</th>
                          <th className="px-6 py-4">Event ID</th>
                          <th className="px-6 py-4">Leader</th>
                          <th className="px-6 py-4">Members</th>
                          <th className="px-6 py-4">Project</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {eventTeams.map((team: any) => (
                          <tr key={team.id} className="hover:bg-white/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-gray-900">{team.name}</td>
                            <td className="px-6 py-4 font-mono text-xs text-neutral-600 font-mono text-xs uppercase tracking-wider">{team.eventId}</td>
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900">{team.leader?.name}</div>
                              <div className="text-xs text-neutral-600 font-mono text-xs uppercase tracking-wider">{team.leader?.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-none text-[11px] font-bold ${team.members?.length >= team.maxMembers ? 'bg-neutral-100 text-neutral-600 font-mono text-xs uppercase tracking-wider' : 'bg-blue-50 text-black'}`}>
                                {team.members?.length || 0} / {team.maxMembers}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {team.projectLink ? (
                                <a 
                                  href={team.projectLink.startsWith('http') ? team.projectLink : `https://${team.projectLink}`} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-[12px] font-bold border border-indigo-100"
                                >
                                  View <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              ) : (
                                <span className="text-[12px] text-gray-400 font-medium">None</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleDelete(team.id)}
                                disabled={deletingId === team.id}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-none transition-colors disabled:opacity-50"
                                title="Delete Team"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
