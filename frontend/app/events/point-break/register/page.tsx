"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Clock, Trash2 } from "lucide-react";

export default function PointBreakRegistration() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [teamSize, setTeamSize] = useState<number>(2);
  const [members, setMembers] = useState<{name: string, email: string}[]>([{name: "", email: ""}]);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [allTeams, setAllTeams] = useState<any[]>([]);
  const [fetchingTeams, setFetchingTeams] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/events/point-break/register");
    } else if (user) {
      if (user.displayName && !leaderName) {
        setLeaderName(user.displayName);
      }
      fetchTeams();
    }
  }, [user, loading, router]);

  const fetchTeams = () => {
    if (!user) return;
    user.getIdToken().then(token => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/point-break/teams`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setAllTeams(data.teams || []);
      })
      .finally(() => setFetchingTeams(false));
    });
  };

  useEffect(() => {
    const numInvites = teamSize - 1;
    setMembers((prev) => {
      const newMembers = [...prev];
      while (newMembers.length < numInvites) newMembers.push({name: "", email: ""});
      return newMembers.slice(0, numInvites);
    });
  }, [teamSize]);

  const handleMemberChange = (index: number, field: 'name' | 'email', value: string) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = await user?.getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
      
      const res = await fetch(`${apiUrl}/point-break/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: teamName,
          leader_name: leaderName,
          members: members.filter(m => m.email.trim() !== "")
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to register team.");
      }

      setSuccess("INVITATION SENT.");
      setTeamName("");
      setMembers(members.map(() => ({name: "", email: ""})));
      fetchTeams(); // Refresh the list
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeam = async (teamId: number) => {
    if (!confirm("Are you sure you want to delete your team?")) return;
    
    try {
      const token = await user?.getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
      
      const res = await fetch(`${apiUrl}/point-break/teams/${teamId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchTeams();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete team");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting team");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#fcfbf9] flex items-center justify-center font-mono-code text-[#0c111d] font-bold text-xs uppercase tracking-widest">
        INITIALIZING...
      </div>
    );
  }

  const isUserInAnyTeam = allTeams.some((team: any) => 
    team.leader?.email === user?.email || 
    team.members?.some((m: any) => m.user?.email === user?.email)
  );

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#0c111d] flex flex-col font-mono selection:bg-[#f59e0b] selection:text-[#0c111d]">
      <Navbar />

      <main className="flex-1 flex flex-col items-center p-4 sm:p-8 py-12 lg:py-20 w-full max-w-4xl mx-auto gap-12">
        {/* Registration Form */}
        {!isUserInAnyTeam && (
          <div className="w-full max-w-3xl bg-[#ffffff] border-2 border-[#0c111d] shadow-[8px_8px_0px_0px_#0c111d] p-8 md:p-12 relative overflow-hidden">
            <div className="mb-8 flex items-center gap-2 border-b border-[#0c111d] pb-2 font-mono-code text-[11px]">
              <span className="w-2 h-2 bg-[#f59e0b]"></span>
            <span className="font-bold tracking-wider text-[#0c111d] uppercase">EVENT REGISTRATION</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#0c111d] mb-2 tracking-tight uppercase leading-none">
            POINT BREAK
          </h1>
          <p className="text-[#434656] font-mono-code text-xs uppercase tracking-wider mb-10 border-l-4 border-[#0c111d] pl-4 py-1">
            Create your team and invite members.
          </p>

          {error && <div className="text-[#0c111d] bg-red-100 border border-[#0c111d] p-3 text-xs font-bold font-mono-code uppercase mb-6">{error}</div>}
          {success && <div className="text-[#0c111d] bg-[#f59e0b] border border-[#0c111d] p-3 text-xs font-bold font-mono-code uppercase mb-6">{success}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#0c111d] uppercase tracking-wider font-mono-code">Team Name</label>
              <Input 
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="ENTER TEAM NAME" 
                required 
                className="h-12 rounded-none border border-[#0c111d] bg-[#f5f4ef] px-4 text-xs font-mono-code font-bold text-[#0c111d] placeholder:text-[#737688] focus-visible:ring-0 focus-visible:border-[#f59e0b] transition-all" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#0c111d] uppercase tracking-wider font-mono-code">Leader Name</label>
                <Input 
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  placeholder="ENTER LEADER NAME"
                  required
                  className="h-12 rounded-none border border-[#0c111d] bg-[#f5f4ef] px-4 text-xs font-mono-code font-bold text-[#0c111d] placeholder:text-[#737688] focus-visible:ring-0 focus-visible:border-[#f59e0b]" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#0c111d] uppercase tracking-wider font-mono-code">Leader Email</label>
                <Input 
                  value={user.email || ''}
                  disabled
                  className="h-12 rounded-none border border-[#0c111d]/20 bg-[#f5f4ef]/50 px-4 text-xs font-mono-code font-bold text-[#737688] cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#0c111d] uppercase tracking-wider font-mono-code">Team Size</label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-12 rounded-none border border-[#0c111d] bg-[#f5f4ef] px-4 text-xs font-mono-code font-bold text-[#0c111d] focus-visible:outline-none focus-visible:border-[#f59e0b]"
              >
                <option value={2}>2 Members</option>
                <option value={3}>3 Members</option>
                <option value={4}>4 Members</option>
              </select>
            </div>

            <div className="pt-4 border-t border-[#0c111d]/10 space-y-6">
              <h3 className="text-[11px] font-bold text-[#0c111d] uppercase tracking-wider font-mono-code">Invite Members</h3>
              {members.map((member, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#737688] uppercase tracking-wider font-mono-code">Member {index + 2} Name</label>
                    <Input 
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      placeholder={`MEMBER ${index + 2} NAME`} 
                      required 
                      className="h-10 rounded-none border border-[#0c111d] bg-[#ffffff] px-4 text-xs font-mono-code font-bold text-[#0c111d] placeholder:text-[#737688] focus-visible:ring-0 focus-visible:border-[#f59e0b]" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#737688] uppercase tracking-wider font-mono-code">Member {index + 2} Email</label>
                    <Input 
                      type="email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                      placeholder={`MEMBER_${index + 2}@DIATM.EDU`} 
                      required 
                      className="h-10 rounded-none border border-[#0c111d] bg-[#ffffff] px-4 text-xs font-mono-code font-bold text-[#0c111d] placeholder:text-[#737688] focus-visible:ring-0 focus-visible:border-[#f59e0b]" 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Button type="submit" disabled={submitting} className="w-full rounded-none bg-[#0c111d] hover:bg-[#f59e0b] hover:text-[#0c111d] text-[#fcfbf9] border border-[#0c111d] h-12 font-mono-code font-bold uppercase tracking-widest text-[11px] transition-all">
                {submitting ? 'REGISTERING...' : 'REGISTER TEAM'}
              </Button>
            </div>
          </form>
        </div>
        )}

        {/* Display All Registered Teams */}
        <div className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold font-heading text-[#0c111d] uppercase tracking-tight">Registered Teams</h2>
            <div className="h-[1px] flex-1 bg-[#0c111d]/20 mx-4"></div>
            <span className="font-mono-code text-xs font-bold bg-[#0c111d] text-white px-3 py-1">{allTeams.length} TEAMS</span>
          </div>
          
          {fetchingTeams ? (
            <div className="py-10 text-center font-mono-code text-sm font-bold animate-pulse">Loading Teams...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {allTeams.map(team => (
                <div key={team.id} className="bg-white border-2 border-[#0c111d] shadow-[4px_4px_0px_0px_#0c111d] p-5 relative hover:-translate-y-1 transition-transform group">
                  {team.leader?.email === user.email && (
                    <button 
                      onClick={() => handleDeleteTeam(team.id)}
                      className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                      title="Delete your team"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <h3 className="text-lg font-bold font-heading text-[#f59e0b]">{team.name}</h3>
                  <div className="mt-4 space-y-2 font-mono-code text-[11px] uppercase tracking-wider">
                    <div className="flex justify-between border-b border-[#0c111d]/10 pb-1">
                      <span className="font-bold text-[#0c111d] flex items-center gap-1"><Users className="w-3 h-3"/> Leader</span>
                      <span className="text-[#434656] text-right truncate max-w-[150px]">{team.leader?.name || team.leader?.email}</span>
                    </div>
                    {team.members.filter((m: any) => m.role !== 'leader').map((member: any, i: number) => (
                      <div key={i} className="flex justify-between border-b border-[#0c111d]/10 pb-1">
                        <span className="font-bold text-[#0c111d] flex items-center gap-1"><Users className="w-3 h-3 text-green-600"/> Member {i+2}</span>
                        <span className="text-green-700 font-bold text-right truncate max-w-[150px]">{member.user?.name || member.user?.email}</span>
                      </div>
                    ))}
                    {team.pending_invites?.map((invite: any, i: number) => (
                      <div key={`inv-${i}`} className="flex justify-between border-b border-[#0c111d]/10 pb-1">
                        <span className="font-bold text-[#f59e0b] flex items-center gap-1"><Clock className="w-3 h-3 animate-pulse"/> Pending</span>
                        <span className="text-[#f59e0b] text-right truncate max-w-[150px]">{invite.email}</span>
                      </div>
                    ))}
                    {team.members.length >= team.max_members && (
                      <div className="pt-2">
                        <button 
                          onClick={() => {
                            // Dispatch a custom event that RealTimeNotifications can pick up to show the modal
                            window.dispatchEvent(new CustomEvent('ShowProblemStatements'));
                          }}
                          className="w-full bg-[#f59e0b] hover:bg-black text-black hover:text-white font-bold py-2 px-4 transition-colors uppercase tracking-widest text-xs border-2 border-black"
                        >
                          View Problem Statements
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {allTeams.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-[#0c111d]/20 bg-gray-50">
                  <p className="font-mono-code text-sm text-[#737688] uppercase tracking-widest">No teams registered yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
