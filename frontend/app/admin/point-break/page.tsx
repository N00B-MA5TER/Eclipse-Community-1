"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { Users, Mail, Clock } from "lucide-react";

export default function AdminPointBreakPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = () => {
    if (!user) return;
    user.getIdToken().then(token => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api'}/admin/point-break/teams`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setTeams(data.teams || []);
      })
      .finally(() => setLoading(false));
    });
  };

  useEffect(() => {
    fetchTeams();
    // Real-time update fallback via polling
    const _p = setInterval(fetchTeams, 5000);
    return () => clearInterval(_p);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto selection:bg-blue-100 selection:text-blue-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-[2rem] font-bold font-heading text-gray-900 tracking-tight flex items-center gap-3">
            Point Break Teams
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f59e0b]/20 text-[#0c111d] border border-[#0c111d] rounded-none text-[11px] font-bold tracking-wide uppercase">
              <Users className="w-3 h-3" /> {teams.length} Registered
            </span>
          </h1>
          <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider font-medium mt-1 text-[15px]">Monitor Point Break event registrations in real-time.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map(team => (
          <div key={team.id} className="bg-white border-2 border-[#0c111d] shadow-[4px_4px_0px_0px_#0c111d] p-6 hover:-translate-y-1 transition-transform">
            <h2 className="text-xl font-bold font-heading text-[#0c111d] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#f59e0b]"></span>
              {team.name}
            </h2>
            <div className="mt-6 space-y-3 font-mono-code text-xs uppercase tracking-wider">
              
              <div className="flex items-start justify-between border-b border-[#0c111d]/10 pb-2">
                <span className="font-bold text-[#0c111d] flex items-center gap-2">
                  <Users className="w-3 h-3" /> Leader
                </span>
                <span className="text-[#434656] text-right break-all max-w-[180px]">{team.leader?.email}</span>
              </div>

              {team.members.filter((m: any) => m.role !== 'leader').map((member: any, i: number) => (
                <div key={i} className="flex items-start justify-between border-b border-[#0c111d]/10 pb-2">
                  <span className="font-bold text-[#0c111d] flex items-center gap-2">
                    <Users className="w-3 h-3 text-green-600" /> Member {i+2}
                  </span>
                  <span className="text-green-700 font-bold text-right break-all max-w-[180px]">{member.user?.email}</span>
                </div>
              ))}

              {team.pending_invites?.map((invite: any, i: number) => (
                <div key={`inv-${i}`} className="flex items-start justify-between border-b border-[#0c111d]/10 pb-2">
                  <span className="font-bold text-[#f59e0b] flex items-center gap-2">
                    <Clock className="w-3 h-3 animate-pulse" /> Pending
                  </span>
                  <span className="text-[#f59e0b] text-right break-all max-w-[180px]">{invite.email}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {teams.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-[#0c111d]/20 bg-gray-50">
            <p className="font-mono-code text-sm text-[#737688] uppercase tracking-widest">No teams registered yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
