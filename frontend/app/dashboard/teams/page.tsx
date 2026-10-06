"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase/auth";

import { Component, Users, Plus, Shield, X, Copy, Edit2, LogOut, Check, XCircle, Trash2, Link as LinkIcon, Send, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function AllTeamsPage() {
  const { user, loading: authLoading } = useAuth();
  const [teams, setTeams] = useState<any[]>([]);
  const [eventsMap, setEventsMap] = useState<Record<string, string>>({});
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // to force reload
  
  // Modal state
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editMax, setEditMax] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Project submission state
  const [projectLink, setProjectLink] = useState("");
  const [projectLoading, setProjectLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api'}/events`);
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          const eMap: Record<string, string> = {};
          eventsData.forEach((doc: any) => {
            eMap[doc.id] = doc.title || "Unknown Event";
          });
          if (!eMap["1"]) eMap["1"] = "Intro to React Native";
          if (!eMap["2"]) eMap["2"] = "Global AI Hackathon 2026";
          
          setEventsMap(eMap);
        }
      } catch (e) {
        console.error("Error fetching events for mapping:", e);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    let isMounted = true;
    let pollInterval: NodeJS.Timeout;

    const fetchTeams = async () => {
      if (!user) return;
      try {
        const idToken = await user.getIdToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api'}/teams`, {
          headers: { Authorization: `Bearer ${idToken}` }
        });

        if (!res.ok) throw new Error("Failed to fetch teams");
        if (isMounted) setLoading(false);

        const data = await res.json();
        
        if (isMounted) {
          // Sort by creation date
          data.sort((a: any, b: any) => {
            if (!a.createdAt || !b.createdAt) return 0;
            const timeA = a.createdAt?._seconds ? a.createdAt._seconds * 1000 : new Date(a.createdAt || 0).getTime();
            const timeB = b.createdAt?._seconds ? b.createdAt._seconds * 1000 : new Date(b.createdAt || 0).getTime();
            return timeB - timeA;
          });

          setTeams(data);
          setSelectedTeam((prevSelected: any) => {
            if (prevSelected) {
              return data.find((t: any) => t.id === prevSelected.id) || null;
            }
            return prevSelected;
          });
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    if (!authLoading && user) {
       fetchTeams();
       pollInterval = setInterval(fetchTeams, 5000);
    }

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [user, authLoading, refreshKey]);

  const handleAction = async (actionUrl: string, method: string, body?: any) => {
    setActionLoading(true);
    try {
      const idToken = await user?.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/teams/${selectedTeam.id}${actionUrl}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Action failed");
      }

      if (method === "DELETE") {
        setSelectedTeam(null);
      }
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectLink) return;
    setProjectLoading(true);
    try {
      const idToken = await user?.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/teams/${selectedTeam.id}/project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ projectLink })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit project");
      }

      alert("Project submitted successfully!");
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setProjectLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    await handleAction("", "PUT", { name: editName, maxMembers: editMax });
    setIsEditing(false);
  };

  const toggleEvent = (eventId: string) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-none h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500 relative pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading uppercase tracking-tight font-heading font-bold text-gray-900 mb-2">All Teams</h1>
          <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider text-[14px]">Discover and join hackathon squads and workshop groups.</p>
        </div>
        <Link href="/dashboard" className="inline-flex items-center gap-2 bg-[#0f172a] hover:bg-black text-white font-bold py-2.5 px-5 rounded-none transition-all shadow-none border border-black text-[14px]">
          <Plus className="w-4 h-4" />
          Join New Event
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-dashed border-black p-8 md:p-16 text-center shadow-none border border-black">
          <div className="w-20 h-20 bg-white rounded-none flex items-center justify-center mx-auto mb-6">
            <Component className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No teams have been registered yet</h3>
          <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider max-w-md mx-auto mb-8">Be the first to create a squad by joining an upcoming event from your dashboard!</p>
          <Link href="/dashboard">
             <button className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-none transition-all shadow-none border border-black">
               Browse Upcoming Events
             </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(
            teams.reduce((acc: any, team) => {
              const eId = team.eventId || "unknown";
              if (!acc[eId]) acc[eId] = [];
              acc[eId].push(team);
              return acc;
            }, {})
          ).map(([eventId, eventTeams]: [string, any]) => {
            const eventName = eventsMap[eventId] || "Event";
            const isExpanded = !!expandedEvents[eventId];
            
            return (
              <div key={eventId} className="animate-in fade-in slide-in- duration-500 bg-white p-6 rounded-[2rem] border border-black shadow-none border border-black">
                <div 
                  className="flex items-center justify-between cursor-pointer group select-none"
                  onClick={() => toggleEvent(eventId)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-2 bg-black text-white rounded-none group-hover:bg-blue-500 transition-colors"></div>
                    <h2 className="text-2xl font-heading uppercase tracking-tight font-bold text-gray-900 uppercase tracking-tight">{eventName}</h2>
                    <span className="bg-neutral-100 text-neutral-600 font-mono text-xs uppercase tracking-wider text-xs font-bold px-3 py-1 rounded-none">{eventTeams.length} Teams</span>
                  </div>
                  <button className="w-10 h-10 rounded-none bg-white flex items-center justify-center text-neutral-600 font-mono text-xs uppercase tracking-wider group-hover:bg-neutral-100 group-hover:text-gray-900 transition-all">
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 animate-in fade-in slide-in- duration-300">
                    {eventTeams.map((team: any) => {
                    const isMyTeam = team.memberIds?.includes(user?.uid) || team.members?.some((m: any) => m.uid === user?.uid);
                    const isLeader = team.leader?.uid === user?.uid;
                    const isFull = team.members?.length >= team.maxMembers;
                    
                    return (
                      <div key={team.id} className="bg-white rounded-[1.5rem] border border-black shadow-none border border-black hover:shadow-none border border-black transition-all duration-300 overflow-hidden group flex flex-col p-5 md:p-6 relative">
                        <div className={`absolute top-0 right-0 w-24 h-24 rounded-none blur-2xl -z-10 transition-colors ${isMyTeam ? 'bg-blue-500/20' : 'bg-gray-200/50'}`}></div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-none border ${isMyTeam ? 'bg-blue-50 text-black border-blue-100' : (isFull ? 'bg-white text-neutral-600 font-mono text-xs uppercase tracking-wider border-black' : 'bg-amber-50 text-amber-600 border-amber-100')}`}>
                            {isMyTeam ? 'My Team' : (isFull ? 'Full' : 'Open')}
                          </span>
                          {isLeader && <Shield className="w-4 h-4 text-amber-500" />}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{team.name}</h3>
                        <p className="text-[13px] text-neutral-600 font-mono text-xs uppercase tracking-wider mb-6 flex items-center gap-1.5 font-medium">
                          <Users className="w-4 h-4" />
                          {team.members?.length || 0} / {team.maxMembers} Participants
                        </p>

                        <div className="mt-auto">
                          <button 
                            onClick={() => setSelectedTeam(team)}
                            className={`w-full font-bold py-2.5 rounded-none transition-colors text-[13px] border ${
                              isMyTeam 
                                ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-100'
                                : 'bg-white hover:bg-neutral-100 text-gray-700 border-black'
                            }`}
                          >
                            {isMyTeam ? "Manage My Team" : (isFull ? "View Team" : "View Team")}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL FOR TEAM DETAILS */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40  animate-in fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-none border border-black overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-black relative flex-shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-none blur-2xl -z-10"></div>
              <button onClick={() => { setSelectedTeam(null); setIsEditing(false); setProjectLink(""); }} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-none hover:bg-neutral-100 text-neutral-600 font-mono text-xs uppercase tracking-wider transition-colors">
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center justify-between mb-4 pr-10">
                {selectedTeam.code ? (
                  <span className="bg-blue-50 text-black text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-none border border-blue-100">
                    Code: {selectedTeam.code}
                  </span>
                ) : (
                  <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-none border ${selectedTeam.members?.length >= selectedTeam.maxMembers ? 'bg-white text-neutral-600 font-mono text-xs uppercase tracking-wider border-black' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {selectedTeam.members?.length >= selectedTeam.maxMembers ? 'Full' : 'Open to join'}
                  </span>
                )}

                {selectedTeam.leader?.uid === user?.uid && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-none">
                    <Shield className="w-3 h-3" />
                    Leader
                  </span>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-3 mb-2">
                  <input 
                    className="w-full border border-black rounded-none p-2 text-sm" 
                    value={editName} 
                    onChange={e => setEditName(e.target.value)} 
                    placeholder="Team Name" 
                  />
                  <input 
                    className="w-full border border-black rounded-none p-2 text-sm" 
                    type="number" 
                    value={editMax} 
                    onChange={e => setEditMax(e.target.value)} 
                    placeholder="Max Capacity" 
                    min={selectedTeam.members.length}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveEdit} disabled={actionLoading} className="bg-amber-600 text-white px-3 py-1 rounded-none text-xs font-bold">Save</button>
                    <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-none text-xs font-bold">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pr-8">
                  <h3 className="text-2xl font-heading uppercase tracking-tight font-bold font-heading text-gray-900 mb-1">{selectedTeam.name}</h3>
                  {selectedTeam.leader?.uid === user?.uid && (
                    <button onClick={() => { setIsEditing(true); setEditName(selectedTeam.name); setEditMax(selectedTeam.maxMembers.toString()); }} className="text-gray-400 hover:text-black">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
              
              {!isEditing && <p className="text-[13px] text-neutral-600 font-mono text-xs uppercase tracking-wider">Event Squad</p>}
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto max-h-[50vh] bg-white/30">
              
              {/* PROJECT SUBMISSION (Members Only) */}
              {selectedTeam.memberIds?.includes(user?.uid) && (
                <div className="mb-8">
                  <h4 className="text-[12px] font-bold text-neutral-600 font-mono text-xs uppercase tracking-wider uppercase tracking-wider flex items-center gap-2 mb-3">
                    <LinkIcon className="w-4 h-4" />
                    Project Submission
                  </h4>
                  <form onSubmit={handleProjectSubmit} className="bg-white p-4 rounded-none border border-black shadow-none border border-black">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        required
                        disabled={!!selectedTeam.projectLink || selectedTeam.leader?.uid !== user?.uid}
                        value={selectedTeam.projectLink || projectLink}
                        onChange={(e) => setProjectLink(e.target.value)}
                        placeholder={selectedTeam.leader?.uid === user?.uid ? "https://github.com/... or Figma link" : "Only the team leader can submit the project."}
                        className="flex-1 border border-black rounded-none px-3 py-2 text-[13px] focus:outline-none focus:ring-0 focus:ring-0-500/20 focus:border-[#f59e0b] disabled:bg-white disabled:text-neutral-600 font-mono text-xs uppercase tracking-wider"
                      />
                      <button 
                        type="submit" 
                        disabled={projectLoading || !projectLink || !!selectedTeam.projectLink || selectedTeam.leader?.uid !== user?.uid}
                        className="bg-black text-white hover:bg-blue-700 text-white px-4 py-2 rounded-none text-[13px] font-bold flex items-center gap-2 transition-colors disabled:bg-gray-300 disabled:text-neutral-600 font-mono text-xs uppercase tracking-wider disabled:cursor-not-allowed"
                      >
                        {projectLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-none animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            {selectedTeam.projectLink ? "Submitted" : "Submit"}
                          </>
                        )}
                      </button>
                    </div>
                    {selectedTeam.projectLink ? (
                      <p className="text-[11px] text-amber-600 font-medium mt-2 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Project successfully submitted and locked.
                      </p>
                    ) : (
                      selectedTeam.leader?.uid !== user?.uid && (
                        <p className="text-[11px] text-neutral-600 font-mono text-xs uppercase tracking-wider font-medium mt-2">
                          Waiting for the team leader to submit the project.
                        </p>
                      )
                    )}
                  </form>
                </div>
              )}

              {/* PENDING REQUESTS (Leader Only) */}
              {selectedTeam.leader?.uid === user?.uid && selectedTeam.pendingMembers?.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-[12px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4" />
                    Pending Requests ({selectedTeam.pendingMembers.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedTeam.pendingMembers.map((reqUser: any) => (
                      <div key={reqUser.uid} className="flex items-center gap-3 bg-amber-50/50 p-3 rounded-none border border-amber-100 shadow-none border border-black">
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-bold text-gray-900 truncate">{reqUser.name}</p>
                          <p className="text-[12px] text-neutral-600 font-mono text-xs uppercase tracking-wider truncate">{reqUser.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleAction("/approve", "POST", { targetUid: reqUser.uid })} disabled={actionLoading} className="text-amber-600 hover:bg-amber-100 p-1.5 rounded-none">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleAction("/reject", "POST", { targetUid: reqUser.uid })} disabled={actionLoading} className="text-red-600 hover:bg-red-100 p-1.5 rounded-none">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MEMBERS LIST */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[12px] font-bold text-neutral-600 font-mono text-xs uppercase tracking-wider uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Members
                </h4>
                <span className="text-[12px] font-bold text-gray-900">
                  {selectedTeam.members?.length || 0} / {selectedTeam.maxMembers}
                </span>
              </div>

              <div className="space-y-3">
                {selectedTeam.members?.map((member: any) => (
                  <div key={member.uid} className="flex items-center gap-3 bg-white p-3 rounded-none border border-black shadow-none border border-black">
                    <div className="w-10 h-10 rounded-none bg-blue-100 text-blue-700 flex items-center justify-center text-[14px] font-bold">
                      {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-gray-900 truncate">
                        {member.name} {member.uid === user?.uid ? "(You)" : ""}
                      </p>
                      {selectedTeam.memberIds?.includes(user?.uid) && (
                        <p className="text-[12px] text-neutral-600 font-mono text-xs uppercase tracking-wider truncate">{member.email}</p>
                      )}
                    </div>
                    {selectedTeam.leader?.uid === member.uid && (
                       <Shield className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              {selectedTeam.members?.length < selectedTeam.maxMembers && (
                <div className="mt-4 p-4 border-2 border-dashed border-black rounded-none flex items-center justify-center text-[13px] font-medium text-gray-400">
                  + {selectedTeam.maxMembers - selectedTeam.members.length} spot(s) remaining
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {selectedTeam.memberIds?.includes(user?.uid) || selectedTeam.members?.some((m: any) => m.uid === user?.uid) ? (
              <div className="p-6 bg-white border-t border-black flex-shrink-0 flex gap-3">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${selectedTeam.code}`);
                    alert("Join code copied to clipboard!");
                  }}
                  className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-none transition-all shadow-none border border-black active:scale-95 text-[14px] flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Code
                </button>
                {selectedTeam.leader?.uid === user?.uid ? (
                  <button 
                    onClick={() => {
                      if(confirm("Are you sure you want to delete this team?")) {
                        handleAction("", "DELETE");
                      }
                    }}
                    disabled={actionLoading}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 rounded-none transition-all border border-red-100 flex items-center justify-center"
                    title="Delete Team"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      if(confirm("Are you sure you want to leave this team?")) {
                        handleAction("/leave", "POST");
                      }
                    }}
                    disabled={actionLoading}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 rounded-none transition-all border border-red-100 flex items-center justify-center"
                    title="Leave Team"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="p-6 bg-white border-t border-black flex-shrink-0">
                {selectedTeam.members?.length >= selectedTeam.maxMembers ? (
                  <button disabled className="w-full bg-gray-200 text-neutral-600 font-mono text-xs uppercase tracking-wider font-bold py-3.5 rounded-none text-[14px] cursor-not-allowed">
                    Team is Full
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                       const userAlreadyInEvent = teams.some(t => t.eventId === selectedTeam.eventId && (t.memberIds?.includes(user?.uid) || t.members?.some((m:any) => m.uid === user?.uid)));
                       if (userAlreadyInEvent) {
                         alert("Leave your existing team to join this team.");
                       } else {
                         window.location.href = `/dashboard/events/${selectedTeam.eventId}?joinTeam=${selectedTeam.code || selectedTeam.id}`;
                       }
                    }}
                    className="w-full bg-black text-white hover:bg-blue-700 text-white font-bold py-3.5 rounded-none transition-all shadow-none border border-black active:scale-95 text-[14px]"
                  >
                    Go to Join Team
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
