"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/lib/firebase/auth";
import { Search, Users, Shield, Link as LinkIcon, Phone, Mail, X, UserCircle } from "lucide-react";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  const fetchUsers = async () => {
    try {
      if (!user) return;
      const idToken = await user.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/users`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchUsers();
  }, [user]);

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-none h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="animate-in fade-in duration-500 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading uppercase tracking-tight font-heading font-bold text-gray-900 mb-2">Manage Users</h1>
          <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider text-[14px]">View all registered users on the platform.</p>
        </div>
      </div>

      <div className="bg-white rounded-none border border-black shadow-none border border-black p-6 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-none border border-black focus:outline-none focus:ring-0 focus:ring-0-500/20 focus:border-[#f59e0b] transition-all text-sm"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-none border border-dashed border-black p-12 text-center shadow-none border border-black">
          <div className="w-16 h-16 bg-white rounded-none flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Users Found</h3>
          <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider">There are no users matching your search criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-none border border-black shadow-none border border-black overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white border-b border-black text-neutral-600 font-mono text-xs uppercase tracking-wider uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">GitHub</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-none bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        {u.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs text-neutral-600 font-mono text-xs uppercase tracking-wider">
                        <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {u.email}</div>
                        {u.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {u.phone}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {u.githubUrl ? (
                        <a 
                          href={u.githubUrl.startsWith('http') ? u.githubUrl : `https://${u.githubUrl}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-neutral-600 font-mono text-xs uppercase tracking-wider hover:text-gray-900 transition-colors text-[12px] font-medium"
                        >
                          <LinkIcon className="w-4 h-4" /> View
                        </a>
                      ) : (
                        <span className="text-[12px] text-gray-400 font-medium">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                          <Shield className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none text-[11px] font-bold bg-neutral-100 text-neutral-600 font-mono text-xs uppercase tracking-wider">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-neutral-600 font-mono text-xs uppercase tracking-wider text-xs">
                      {u.createdAt ? new Date(u.createdAt._seconds ? u.createdAt._seconds * 1000 : u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedUser(u)}
                        className="bg-blue-50 hover:bg-blue-100 text-black font-bold px-4 py-2 rounded-none transition-colors text-[12px]"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      </div>

      {/* Profile Modal */}
      {mounted && selectedUser && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 animate-in fade-in" style={{ position: 'fixed' }}>
          <div className="bg-white rounded-none w-full max-w-2xl shadow-2xl border border-black overflow-hidden flex flex-col max-h-[90vh] relative z-[10000]">
            
            <div className="p-6 border-b border-black relative flex-shrink-0 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
              <button onClick={() => setSelectedUser(null)} className="w-8 h-8 flex items-center justify-center rounded-none hover:bg-neutral-100 text-neutral-600 font-mono text-xs uppercase tracking-wider transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-white/30">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-blue-100 text-blue-700 rounded-none flex items-center justify-center text-3xl font-heading uppercase tracking-tight font-bold border-4 border-white shadow-none border border-black uppercase">
                  {selectedUser.name ? selectedUser.name.charAt(0) : (selectedUser.email?.charAt(0) || "U")}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedUser.name || "Unknown"}</h2>
                  <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider text-sm">{selectedUser.role === 'admin' ? 'Administrator' : 'Participant'}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13px] font-bold text-neutral-600 font-mono text-xs uppercase tracking-wider mb-1">Email Address</label>
                    <p className="font-medium text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-neutral-600 font-mono text-xs uppercase tracking-wider mb-1">Phone Number</label>
                    <p className="font-medium text-gray-900">{selectedUser.phone || "Not provided"}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-neutral-600 font-mono text-xs uppercase tracking-wider mb-1">Bio</label>
                  <p className="font-medium text-gray-900 whitespace-pre-wrap bg-white p-4 rounded-none border border-black text-[14px]">{selectedUser.bio || "No bio provided."}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13px] font-bold text-neutral-600 font-mono text-xs uppercase tracking-wider mb-1">Course / Degree</label>
                    <p className="font-medium text-gray-900 bg-white p-3 rounded-none border border-black text-[14px]">{selectedUser.course || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-neutral-600 font-mono text-xs uppercase tracking-wider mb-1">Year of Study</label>
                    <p className="font-medium text-gray-900 bg-white p-3 rounded-none border border-black text-[14px]">{selectedUser.year || "Not provided"}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-neutral-600 font-mono text-xs uppercase tracking-wider mb-1">Tech Skills</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUser.techSkills && typeof selectedUser.techSkills === 'string' ? (
                      selectedUser.techSkills.split(',').map((skill: string, idx: number) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-none text-[12px] font-bold border border-blue-100">
                          {skill.trim()}
                        </span>
                      ))
                    ) : selectedUser.techSkills && Array.isArray(selectedUser.techSkills) ? (
                      selectedUser.techSkills.map((skill: string, idx: number) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-none text-[12px] font-bold border border-blue-100">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="font-medium text-neutral-600 font-mono text-xs uppercase tracking-wider italic text-[14px]">No skills listed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
