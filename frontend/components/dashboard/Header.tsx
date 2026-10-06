"use client";

import { useAuth } from "@/lib/firebase/auth";
import { Search, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { NotificationsMenu } from "./NotificationsMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const token = await user.getIdToken();
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setProfile(data);
          }
        } catch (error) {
          console.error("Failed to fetch profile", error);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const getInitials = (name: string) => {
    if (!name) return "US";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const displayName = profile?.name || user?.displayName || "User";

  return (
    <header className="h-16 sm:h-20 bg-white border-b border-black sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
      {/* Search Input with Keyboard Shortcut */}
      <div className="relative hidden w-64 lg:block lg:w-96">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black">
          <Search className="w-4 h-4" />
        </div>
        <input 
          className="w-full pl-10 pr-14 py-2 text-xs font-mono uppercase tracking-wide bg-neutral-50 hover:bg-white focus:bg-white text-black placeholder-neutral-400 border border-black rounded-none focus:outline-none focus:ring-0 focus:border-black transition-smooth shadow-[2px_2px_0px_0px_#000000]" 
          placeholder="Search or type a command" 
          type="text" 
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-black bg-white border border-black">⌘ F</kbd>
        </div>
      </div>

      <div className="flex items-center justify-end w-full md:w-auto md:justify-end gap-5">
        {/* Notification Menu */}
        <NotificationsMenu isAdmin={profile?.role === 'admin'} />
        
        <div className="h-8 w-px bg-neutral-200 hidden sm:block"></div>
        
        {/* Profile Logo and Dropdown */}
        <div className="flex items-center gap-2 border border-black bg-white shadow-[2px_2px_0px_0px_#000000]">
          <Link href={profile?.role === 'admin' ? '/admin/dashboard' : '/profile'} className="relative group p-1 border-r border-black hover:bg-neutral-50 transition-colors">
            <div className="w-8 h-8 rounded-none bg-black text-white font-mono font-bold flex items-center justify-center text-xs border border-black group-hover:bg-[#f59e0b] group-hover:text-black transition-colors">
              {getInitials(displayName)}
            </div>
            <span className="bottom-1 right-1 absolute w-2 h-2 bg-[#f59e0b] border border-black"></span>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 pl-2 pr-2 py-1 cursor-pointer hover:bg-neutral-50 transition-colors focus:outline-none">
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-black leading-tight">{displayName}</p>
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wide">{profile?.role || "Student"}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-black" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-none border border-black bg-white p-2 shadow-[4px_4px_0px_0px_#000000]">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">My Account</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-black my-1" />
              <Link href={profile?.role === 'admin' ? '/admin/dashboard' : '/profile'}>
                <DropdownMenuItem className="cursor-pointer font-mono text-xs hover:bg-neutral-100 rounded-none focus:bg-neutral-100">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link href={profile?.role === 'admin' ? '/admin/settings' : '/settings'}>
                <DropdownMenuItem className="cursor-pointer font-mono text-xs hover:bg-neutral-100 rounded-none focus:bg-neutral-100">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className="bg-neutral-200 my-1" />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer font-mono text-xs text-red-600 focus:text-red-600 hover:bg-red-50 rounded-none focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
