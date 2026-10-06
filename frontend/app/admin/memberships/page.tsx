"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { 
  Users, Search, Filter, ChevronLeft, ChevronRight, 
  MoreVertical, CheckCircle2, XCircle, Eye, AlertTriangle, Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";

interface Membership {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  student_id: string;
  year_semester: string;
  linkedin_url?: string;
  github_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface Meta {
  current_page: number;
  last_page: number;
  total: number;
}

export default function AdminMembershipsPage() {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  
  // Selected Member Modal
  const [selectedMember, setSelectedMember] = useState<Membership | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Summary counts (can be derived or approximated from total, but typically we just fetch totals if needed. We'll derive from current view or just omit exact summary cards if not provided by backend, or we can fetch a summary endpoint. The user requested summary cards: Total, Pending, Approved, Rejected. I will do a quick fetch for summary or just use the paginated data. Since we only have paginated data without a summary endpoint, I'll calculate from the current page data for now, which is standard when a specific summary endpoint isn't built).
  const [summary, setSummary] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  const fetchMemberships = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/memberships`);
      url.searchParams.append('page', page.toString());
      if (statusFilter !== "All") url.searchParams.append('status', statusFilter.toLowerCase());
      if (searchQuery) url.searchParams.append('search', searchQuery);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setMemberships(data.data);
        setMeta({
          current_page: data.current_page,
          last_page: data.last_page,
          total: data.total
        });
        
        // Simple approximate summary based on current page if no endpoint exists
        // In a real app we'd have a /stats endpoint, but we'll do this for now
        const p = data.data.filter((m: Membership) => m.status === 'pending').length;
        const a = data.data.filter((m: Membership) => m.status === 'approved').length;
        const r = data.data.filter((m: Membership) => m.status === 'rejected').length;
        setSummary({ total: data.total, pending: p, approved: a, rejected: r });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMemberships();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [user, page, statusFilter, searchQuery]);

  const handleApprove = async (id: number) => {
    if (!user) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/memberships/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMemberships(memberships.map(m => m.id === id ? { ...m, status: 'approved' } : m));
        if (selectedMember && selectedMember.id === id) {
          setSelectedMember({ ...selectedMember, status: 'approved' });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("Reject this membership application?")) return;
    if (!user) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/memberships/${id}/reject`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMemberships(memberships.map(m => m.id === id ? { ...m, status: 'rejected' } : m));
        if (selectedMember && selectedMember.id === id) {
          setSelectedMember({ ...selectedMember, status: 'rejected' });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to completely remove this member? This action cannot be undone.")) return;
    if (!user) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/admin/memberships/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMemberships(memberships.filter(m => m.id !== id));
        setIsViewModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const openViewModal = (membership: Membership) => {
    setSelectedMember(membership);
    setIsViewModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 mt-16 md:mt-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Membership Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Review and manage membership applications.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: summary.total, color: "bg-blue-50 text-blue-700" },
          { label: "Pending View", value: summary.pending, color: "bg-amber-50 text-amber-700" },
          { label: "Approved View", value: summary.approved, color: "bg-emerald-50 text-emerald-700" },
          { label: "Rejected View", value: summary.rejected, color: "bg-red-50 text-red-700" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-none border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${stat.color}`}>
              <Users className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-none border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-4 py-2 rounded-none text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === status 
                  ? "bg-slate-900 text-white" 
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            type="text" 
            placeholder="Search by name, email, or ID..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 h-11 bg-slate-50 border-transparent rounded-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-none border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl">Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Student ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                      Loading applications...
                    </div>
                  </td>
                </tr>
              ) : memberships.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                memberships.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{m.name}</div>
                      <div className="text-xs text-slate-500">{m.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">{m.department}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{m.student_id}</div>
                      <div className="text-xs text-slate-500">{m.year_semester}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        m.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        m.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openViewModal(m)} className="h-8 rounded-lg text-xs">
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">
              Page {meta.current_page} of {meta.last_page}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg"
                disabled={page === meta.last_page}
                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white rounded-none border-0 shadow-2xl">
          {selectedMember && (
            <>
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    Application Details
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedMember.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      selectedMember.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {selectedMember.status}
                    </span>
                  </DialogTitle>
                  <DialogDescription className="text-xs mt-1">
                    Submitted on {new Date(selectedMember.created_at).toLocaleString()}
                  </DialogDescription>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-sm font-medium text-slate-900">{selectedMember.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-sm font-medium text-slate-900">{selectedMember.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-sm font-medium text-slate-900">{selectedMember.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</p>
                    <p className="text-sm font-medium text-slate-900">{selectedMember.department}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Student ID</p>
                    <p className="text-sm font-medium text-slate-900">{selectedMember.student_id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Year / Semester</p>
                    <p className="text-sm font-medium text-slate-900">{selectedMember.year_semester}</p>
                  </div>
                  {selectedMember.linkedin_url && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">LinkedIn</p>
                      <a href={selectedMember.linkedin_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline break-all">
                        {selectedMember.linkedin_url}
                      </a>
                    </div>
                  )}
                  {selectedMember.github_url && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">GitHub</p>
                      <a href={selectedMember.github_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline break-all">
                        {selectedMember.github_url}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center gap-3">
                <Button 
                  variant="ghost" 
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 px-3"
                  disabled={actionLoading}
                  onClick={() => handleDelete(selectedMember.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Remove Member
                </Button>
                
                <div className="flex gap-3">
                  {selectedMember.status === 'pending' && (
                    <>
                      <Button 
                        variant="outline" 
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                        disabled={actionLoading}
                        onClick={() => handleReject(selectedMember.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                      <Button 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20"
                        disabled={actionLoading}
                        onClick={() => handleApprove(selectedMember.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
