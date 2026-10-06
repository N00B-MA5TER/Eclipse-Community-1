"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { Check, X, Search, RefreshCw } from "lucide-react";

interface AlumniPending {
  id: string;
  photo_url: string | null;
  name: string;
  department: string;
  graduation_year: number;
  current_role: string;
  status: string;
  created_at: string;
}

export default function AdminAlumniPage() {
  const { user } = useAuth();
  const [allAlumni, setAllAlumni] = useState<AlumniPending[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const getImageUrl = (url: string | null) => {
    if (!url) return '';
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const baseUrl = apiUrl.replace(/\/api\/?$/, '');
    
    if (url.includes('/api/storage/')) {
      return `${baseUrl}${url.substring(url.indexOf('/storage/'))}`;
    }
    if (url.startsWith('/storage/')) {
      return `${baseUrl}${url}`;
    }
    if (url.startsWith('http')) {
      return url;
    }
    return `${baseUrl}/${url}`;
  };

  const fetchAllAlumni = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await user.getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
      
      const res = await fetch(`${apiUrl}/admin/alumni/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setAllAlumni(data);
      }
    } catch (error) {
      console.error("Error fetching alumni:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAlumni();
  }, [user]);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'delete') => {
    const actionText = action === 'delete' ? 'permanently delete' : action;
    if (!confirm(`Are you sure you want to ${actionText} this alumni record?`)) return;
    
    setProcessingId(id);
    try {
      if (!user) return;
      const idToken = await user.getIdToken();
      
      const method = action === 'delete' ? 'DELETE' : 'PATCH';
      const endpoint = action === 'delete' 
        ? `/admin/alumni/${id}`
        : `/admin/alumni/${id}/${action}`;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${idToken}`,
        }
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Failed to ${action} alumni`);
      }

      if (action === 'delete') {
        setAllAlumni(prev => prev.filter(a => a.id !== id));
      } else {
        setAllAlumni(prev => prev.map(a => a.id === id ? { ...a, status: action === 'approve' ? 'approved' : 'rejected' } : a));
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredAlumni = allAlumni.filter(a => 
    a.status === activeTab &&
    (a.name.toLowerCase().includes(search.toLowerCase()) || 
     a.department.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading && allAlumni.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-none h-12 w-12 border-b-2 border-[#0c111d]"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading uppercase tracking-tight font-bold text-gray-900 mb-2">Manage Alumni</h1>
          <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider">Review, approve, reject, or delete alumni directory submissions.</p>
        </div>
        <button 
          onClick={fetchAllAlumni}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-black hover:bg-neutral-50 transition-colors font-mono text-xs font-bold uppercase tracking-wider text-black"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex bg-gray-100 p-1 border border-black">
          {(['pending', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab 
                  ? 'bg-white text-black border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                  : 'text-gray-500 hover:text-black border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="relative flex-1 max-w-md ml-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or department..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-none border border-black focus:outline-none focus:ring-0 focus:border-[#f59e0b] transition-all text-sm font-mono h-full"
          />
        </div>
      </div>

      {filteredAlumni.length === 0 ? (
        <div className="bg-white rounded-none border border-dashed border-black p-12 text-center shadow-none">
          <div className="w-16 h-16 bg-white border-2 border-black rounded-none flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-[#f59e0b]" />
          </div>
          <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 uppercase">Nothing Here!</h3>
          <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider">There are no {activeTab} alumni submissions at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((person) => (
            <div key={person.id} className="bg-white border-2 border-black flex flex-col shadow-[4px_4px_0px_0px_rgba(12,17,29,0.05)] overflow-hidden">
              <div className="w-full h-48 bg-gray-100 border-b-2 border-black relative">
                {person.photo_url ? (
                  <img 
                    src={getImageUrl(person.photo_url)} 
                    alt={person.name} 
                    className="w-full h-full object-cover object-top" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="font-mono text-xs uppercase">No Photo</span>
                  </div>
                )}
                <div className={`absolute top-2 right-2 border text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 ${
                  person.status === 'approved' ? 'bg-green-100 border-green-600 text-green-800' :
                  person.status === 'rejected' ? 'bg-red-100 border-red-600 text-red-800' :
                  'bg-yellow-100 border-yellow-600 text-yellow-800'
                }`}>
                  {person.status}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-heading text-lg font-bold text-gray-900 uppercase mb-1">{person.name}</h3>
                <p className="text-[11px] font-mono font-bold text-black uppercase tracking-wider mb-2">Class of {person.graduation_year}</p>
                <div className="space-y-1 mb-4 flex-1">
                  <p className="text-xs text-neutral-600 font-mono uppercase tracking-wider"><span className="font-bold text-black">Dept:</span> {person.department}</p>
                  <p className="text-xs text-neutral-600 font-mono uppercase tracking-wider"><span className="font-bold text-black">Role:</span> {person.current_role}</p>
                </div>
                
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
                  {person.status !== 'approved' && (
                    <button 
                      onClick={() => handleAction(person.id, 'approve')}
                      disabled={processingId === person.id}
                      className="flex-1 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                    >
                      <Check className="w-3 h-3" /> Approve
                    </button>
                  )}
                  {person.status !== 'rejected' && (
                    <button 
                      onClick={() => handleAction(person.id, 'reject')}
                      disabled={processingId === person.id}
                      className="flex-1 flex items-center justify-center gap-1 bg-orange-500 hover:bg-orange-600 text-white py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                    >
                      <X className="w-3 h-3" /> Reject
                    </button>
                  )}
                  <button 
                    onClick={() => handleAction(person.id, 'delete')}
                    disabled={processingId === person.id}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                  >
                    <X className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
