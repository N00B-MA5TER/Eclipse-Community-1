"use client";

import { useAuth } from "@/lib/firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, CalendarPlus, Users, Settings, LogOut, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AdminMobileBottomNav } from "@/components/admin/AdminMobileBottomNav";
import { NotificationsMenu } from "@/components/dashboard/NotificationsMenu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setCheckingRole(false);
      return;
    }

    if (!loading && !user) {
      router.push("/admin/login");
      return;
    }

    if (user) {
      const verifyAdmin = async () => {
        try {
          const token = await user.getIdToken();
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.role === "admin") {
              setIsAdmin(true);
            } else {
              router.push("/dashboard");
            }
          } else {
            router.push("/admin/login");
          }
        } catch (error) {
          router.push("/admin/login");
        } finally {
          setCheckingRole(false);
        }
      };
      verifyAdmin();
    }
  }, [user, loading, router, pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading || checkingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-none h-12 w-12 border-b-4 border-black"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-white flex font-sans selection:bg-[#f59e0b] selection:text-black pb-16 md:pb-0">
      
      {/* Admin Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-black flex-col fixed inset-y-0 left-0 z-30 select-none">
        
        {/* Top Metadata Eyebrow Rail */}
        <div className="border-b border-black px-5 py-2.5 flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-500 uppercase bg-neutral-50/50">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-black"></span>
            <span className="font-bold text-black tracking-wider">CREO.SYS // ADMIN</span>
          </div>
          <span className="font-semibold text-black">CTRL</span>
        </div>

        <Link href="/" className="h-[120px] py-2 px-4 border-b border-black flex items-center justify-center hover:bg-neutral-50 transition-colors">
          <img src="/logo.png" alt="Eclipse Logo" className="w-auto h-full object-contain scale-[1.3]" />
        </Link>
        
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          
          <Link href="/admin/events" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-none font-mono text-xs uppercase tracking-wider transition-smooth group ${pathname.includes('/admin/events') ? 'bg-black text-white font-bold shadow-[2px_2px_0px_0px_#f59e0b]' : 'text-neutral-700 hover:text-black hover:bg-neutral-100 font-medium border border-transparent hover:border-black'}`}>
            <CalendarPlus className={`w-4 h-4 ${pathname.includes('/admin/events') ? 'text-[#f59e0b]' : 'text-neutral-500 group-hover:text-black'}`} />
            <span>Manage Events</span>
          </Link>
          <Link href="/admin/calendar" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-none font-mono text-xs uppercase tracking-wider transition-smooth group ${pathname.includes('/admin/calendar') ? 'bg-black text-white font-bold shadow-[2px_2px_0px_0px_#f59e0b]' : 'text-neutral-700 hover:text-black hover:bg-neutral-100 font-medium border border-transparent hover:border-black'}`}>
            <CalendarPlus className={`w-4 h-4 ${pathname.includes('/admin/calendar') ? 'text-[#f59e0b]' : 'text-neutral-500 group-hover:text-black'}`} />
            <span>Calendar Events</span>
          </Link>
          <Link href="/admin/point-break" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-none font-mono text-xs uppercase tracking-wider transition-smooth group ${pathname.includes('/admin/point-break') ? 'bg-black text-white font-bold shadow-[2px_2px_0px_0px_#f59e0b]' : 'text-neutral-700 hover:text-black hover:bg-neutral-100 font-medium border border-transparent hover:border-black'}`}>
            <Users className={`w-4 h-4 ${pathname.includes('/admin/point-break') ? 'text-[#f59e0b]' : 'text-neutral-500 group-hover:text-black'}`} />
            <span>Point Break</span>
          </Link>
          <Link href="/admin/teams" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-none font-mono text-xs uppercase tracking-wider transition-smooth group ${pathname.includes('/admin/teams') ? 'bg-black text-white font-bold shadow-[2px_2px_0px_0px_#f59e0b]' : 'text-neutral-700 hover:text-black hover:bg-neutral-100 font-medium border border-transparent hover:border-black'}`}>
            <Users className={`w-4 h-4 ${pathname.includes('/admin/teams') ? 'text-[#f59e0b]' : 'text-neutral-500 group-hover:text-black'}`} />
            <span>All Teams</span>
          </Link>
          <Link href="/admin/users" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-none font-mono text-xs uppercase tracking-wider transition-smooth group ${pathname.includes('/admin/users') ? 'bg-black text-white font-bold shadow-[2px_2px_0px_0px_#f59e0b]' : 'text-neutral-700 hover:text-black hover:bg-neutral-100 font-medium border border-transparent hover:border-black'}`}>
            <Users className={`w-4 h-4 ${pathname.includes('/admin/users') ? 'text-[#f59e0b]' : 'text-neutral-500 group-hover:text-black'}`} />
            <span>All Users</span>
          </Link>
          <Link href="/admin/notifications" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-none font-mono text-xs uppercase tracking-wider transition-smooth group ${pathname.includes('/admin/notifications') ? 'bg-black text-white font-bold shadow-[2px_2px_0px_0px_#f59e0b]' : 'text-neutral-700 hover:text-black hover:bg-neutral-100 font-medium border border-transparent hover:border-black'}`}>
            <Bell className={`w-4 h-4 ${pathname.includes('/admin/notifications') ? 'text-[#f59e0b]' : 'text-neutral-500 group-hover:text-black'}`} />
            <span>Broadcasts</span>
          </Link>
          <Link href="/admin/alumni" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-none font-mono text-xs uppercase tracking-wider transition-smooth group ${pathname.includes('/admin/alumni') ? 'bg-black text-white font-bold shadow-[2px_2px_0px_0px_#f59e0b]' : 'text-neutral-700 hover:text-black hover:bg-neutral-100 font-medium border border-transparent hover:border-black'}`}>
            <Users className={`w-4 h-4 ${pathname.includes('/admin/alumni') ? 'text-[#f59e0b]' : 'text-neutral-500 group-hover:text-black'}`} />
            <span>Alumni Directory</span>
          </Link>
          <Link href="/admin/memberships" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-none font-mono text-xs uppercase tracking-wider transition-smooth group ${pathname.includes('/admin/memberships') ? 'bg-black text-white font-bold shadow-[2px_2px_0px_0px_#f59e0b]' : 'text-neutral-700 hover:text-black hover:bg-neutral-100 font-medium border border-transparent hover:border-black'}`}>
            <Users className={`w-4 h-4 ${pathname.includes('/admin/memberships') ? 'text-[#f59e0b]' : 'text-neutral-500 group-hover:text-black'}`} />
            <span>Memberships</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-black bg-white">
          <button onClick={() => { logout(); router.push('/admin/login'); }} className="w-full flex items-center justify-between px-3.5 py-2 rounded-none text-neutral-500 hover:text-black hover:bg-neutral-100 font-mono text-xs uppercase tracking-wider font-medium border border-transparent hover:border-black transition-smooth group">
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 text-neutral-400 group-hover:text-black" />
              <span>Log Out</span>
            </div>
            <span className="text-neutral-400 font-mono">→</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full bg-white">
        
        {/* Top Header */}
        <header className="h-[72px] border-b border-black bg-white sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between">
          
          {/* Search */}
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <Input 
              type="text" 
              placeholder="SEARCH EVENTS, USERS..." 
              className="w-full pl-9 h-10 bg-white border-black rounded-none font-mono text-xs uppercase tracking-wider focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#f59e0b]"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6 ml-auto h-full">
            <div className="h-full flex items-center border-l border-black pl-6">
              <NotificationsMenu isAdmin={true} />
            </div>
            
            <div className="relative h-full flex items-center border-l border-black pl-6">
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="w-9 h-9 bg-black hover:bg-[#f59e0b] text-white hover:text-black transition-colors rounded-none flex items-center justify-center border border-black shadow-[2px_2px_0px_0px_#000000] group-hover:shadow-none overflow-hidden">
                  <span className="font-bold text-sm font-mono">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'AD'}
                  </span>
                </div>
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 top-16 w-64 bg-white border border-black shadow-[4px_4px_0px_0px_#000000] rounded-none overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-black bg-neutral-50/50">
                    <p className="text-[14px] font-bold text-black font-mono uppercase tracking-wider truncate">
                      {user?.displayName || "Admin User"}
                    </p>
                    <p className="text-[10px] font-medium text-neutral-500 font-mono tracking-wider truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <Link href="/admin/settings" className="flex items-center gap-2 px-3 py-2.5 hover:bg-neutral-100 rounded-none text-xs font-mono uppercase tracking-wider text-black transition-colors w-full border border-transparent hover:border-black mb-1">
                      <Settings className="w-4 h-4 text-neutral-500" />
                      Account Settings
                    </Link>
                    <button 
                      onClick={() => { logout(); router.push('/admin/login'); }}
                      className="flex items-center gap-2 px-3 py-2.5 hover:bg-neutral-100 rounded-none text-xs font-mono uppercase tracking-wider text-black transition-colors w-full text-left border border-transparent hover:border-black"
                    >
                      <LogOut className="w-4 h-4 text-neutral-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 w-full bg-white">
          {children}
        </main>
      </div>

      <AdminMobileBottomNav />
    </div>
  );
}
