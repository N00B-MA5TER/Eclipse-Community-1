"use client";

import { useAuth } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { CheckSquare } from "lucide-react";

export default function TasksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900 flex pb-16 md:pb-0">
      <div className="hidden md:block shrink-0"><Sidebar /></div>
      <div className="min-w-0 flex-1 flex flex-col min-h-screen w-full">
        <Header />
        <main className="flex-1 p-4 sm:p-8 max-w-[1200px] w-full mx-auto flex items-center justify-center">
          <div className="text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 text-black rounded-none flex items-center justify-center mb-6">
              <CheckSquare className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-heading uppercase tracking-tight font-bold text-gray-900 mb-2">My Tasks</h1>
            <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider font-medium">This feature is coming soon!</p>
          </div>
        </main>
      </div>
    </div>
  );
}
