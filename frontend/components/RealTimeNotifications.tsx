"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase/auth";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function RealTimeNotifications() {
  const { user } = useAuth();
  const [invites, setInvites] = useState<any[]>([]);
  const [showPSModal, setShowPSModal] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [problemStatements, setProblemStatements] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('showPS') === 'true') {
      setProblemStatements([
        "THE PRESENTATION FROM HELL",
        "THE PERFECT MODEL THAT DOESN'T WORK",
        "THE PRODUCTION LINE",
        "THE THREE PATIENTS",
        "THE HACKATHON PIVOT",
        "THE WRONG DELIVERY",
        "THE JOB OFFER",
        "THE EXPERIMENT",
        "THE EXAM PAPER",
        "THE PHONE THAT HAS TO LAST",
        "THE EVENT THAT IS TOO SUCCESSFUL",
        "THE LAST TEN MINUTES",
        "THE BRIDGE",
        "THE COMPUTER LAB",
        "THE SPEAKER WHO CANNOT SPEAK",
        "THE FACTORY FIRE",
        "THE DOOR THAT SHOULD STAY CLOSED",
        "THE BOX NOBODY SHOULD OPEN"
      ]);
      setShowPSModal(true);
      // Remove query param without refreshing
      router.replace('/events/point-break/register', { scroll: false });
    }
  }, [searchParams, router]);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showPSModal) {
      setIsDecoding(true);
      timer = setTimeout(() => {
        setIsDecoding(false);
      }, 1500); // 1.5 seconds loading animation
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showPSModal]);

  useEffect(() => {
    if (!user || !user.email) return;

    // Attach Pusher to window
    (window as any).Pusher = Pusher;
    
    const emailId = user.email.replace(/[@.]/g, "-");

    const echo = new Echo({
      broadcaster: 'reverb',
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'eclipse_reverb_key',
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || '127.0.0.1',
      wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 8081,
      wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 8081,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
      authorizer: (channel: any, options: any) => {
        return {
          authorize: (socketId: any, callback: any) => {
            user.getIdToken().then(token => {
              fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/broadcasting/auth`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  socket_id: socketId,
                  channel_name: channel.name
                })
              })
              .then(response => response.json())
              .then(data => callback(false, data))
              .catch(error => callback(true, error));
            });
          }
        };
      },
    });

    const channel = echo.private(`user.invites.${emailId}`);
    
    channel.listen('.TeamInviteReceived', (e: any) => {
      setInvites(prev => {
        // Prevent duplicate toasts
        if (prev.find(i => i.id === e.invitation.id)) return prev;
        return [...prev, e.invitation];
      });
    });

    channel.listen('.TeamCompletedEvent', (e: any) => {
      if (e.problemStatements) {
        setProblemStatements(e.problemStatements);
        setShowPSModal(true);
      }
    });

    // Fetch initial pending invites
    user.getIdToken().then(token => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/point-break/invites`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.invites) {
          setInvites(data.invites);
        }
      })
      .catch(console.error);
    });

    const handleCustomEvent = () => {
      setProblemStatements([
        "THE PRESENTATION FROM HELL",
        "THE PERFECT MODEL THAT DOESN'T WORK",
        "THE PRODUCTION LINE",
        "THE THREE PATIENTS",
        "THE HACKATHON PIVOT",
        "THE WRONG DELIVERY",
        "THE JOB OFFER",
        "THE EXPERIMENT",
        "THE EXAM PAPER",
        "THE PHONE THAT HAS TO LAST",
        "THE EVENT THAT IS TOO SUCCESSFUL",
        "THE LAST TEN MINUTES",
        "THE BRIDGE",
        "THE COMPUTER LAB",
        "THE SPEAKER WHO CANNOT SPEAK",
        "THE FACTORY FIRE",
        "THE DOOR THAT SHOULD STAY CLOSED",
        "THE BOX NOBODY SHOULD OPEN"
      ]);
      setShowPSModal(true);
    };
    window.addEventListener('ShowProblemStatements', handleCustomEvent);

    return () => {
      channel.stopListening('.TeamInviteReceived');
      channel.stopListening('.TeamCompletedEvent');
      echo.disconnect();
      window.removeEventListener('ShowProblemStatements', handleCustomEvent);
    };
  }, [user]);

  const handleAction = async (inviteId: number, action: 'accept' | 'reject') => {
    if (!user) return;
    const token = await user.getIdToken();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/point-break/invites/${inviteId}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setInvites(prev => prev.filter(inv => inv.id !== inviteId));
        if (action === 'accept') {
          // Do not redirect to dashboard, just let the invite toast disappear
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to process invite.");
      }
    } catch (e) {
      console.error(e);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {invites.map((invite) => (
          <motion.div
            key={invite.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-[320px] bg-[#ffffff] border-2 border-[#0c111d] shadow-[4px_4px_0px_0px_#0c111d] p-4 pointer-events-auto"
          >
            <div className="mb-2 flex items-center gap-2 border-b border-[#0c111d] pb-2 font-mono-code text-[10px]">
              <span className="w-2 h-2 bg-[#f59e0b] animate-pulse"></span>
              <span className="font-bold tracking-wider text-[#0c111d] uppercase">TEAM INVITE</span>
            </div>
            <p className="text-sm font-bold text-[#0c111d] mb-1">
              {invite.team?.name || 'A team'}
            </p>
            <p className="text-xs font-mono-code text-[#434656] mb-4">
              You have been invited to join this team for Point Break.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(invite.id, 'accept')}
                className="flex-1 h-8 bg-[#0c111d] text-white text-[10px] font-bold font-mono-code flex items-center justify-center gap-1 hover:bg-[#f59e0b] hover:text-[#0c111d] transition-colors"
              >
                <Check className="w-3 h-3" /> ACCEPT
              </button>
              <button
                onClick={() => handleAction(invite.id, 'reject')}
                className="flex-1 h-8 bg-transparent border border-[#0c111d] text-[#0c111d] text-[10px] font-bold font-mono-code flex items-center justify-center gap-1 hover:bg-red-100 transition-colors"
              >
                <X className="w-3 h-3" /> REJECT
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Problem Statements Modal */}
      <AnimatePresence>
        {showPSModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8 pointer-events-auto"
          >
            <div className="w-full max-w-7xl mx-auto flex flex-col h-full max-h-[90vh]">
              <div className="flex justify-between items-center mb-8 shrink-0">
                <div className="font-mono-code text-[#f59e0b] tracking-widest text-xs uppercase flex items-center gap-4">
                  <span>LIVE CONTROL</span>
                  <span className="w-1 h-1 bg-[#f59e0b] rounded-full"></span>
                  <span>POINT BREAK PROBLEM STATEMENTS</span>
                </div>
                <button 
                  onClick={() => setShowPSModal(false)}
                  className="text-white hover:text-[#f59e0b] transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {isDecoding ? (
                <div className="flex-1 flex flex-col items-center justify-center font-mono-code">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1] }}
                      transition={{ duration: 0.8 }}
                      className="text-[#f59e0b] text-3xl font-bold tracking-[0.3em] animate-pulse"
                    >
                      POINT BREAK
                    </motion.div>
                  </motion.div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-8 flex-1 no-scrollbar">
                  {problemStatements.map((title, i) => [
                    i === 14 ? (
                      <div key="backup-divider" className="col-span-full flex items-center gap-4 mt-6 mb-2">
                        <span className="text-gray-500 font-mono-code text-xs uppercase tracking-widest">BACKUP</span>
                        <div className="flex-1 h-[1px] bg-gray-800/60"></div>
                      </div>
                    ) : null,
                    <motion.div 
                      key={i}
                      onClick={() => {
                        router.push(`/events/point-break/ps/${i + 1}`);
                        setShowPSModal(false);
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-[#111111] border border-gray-800 rounded-lg p-5 flex flex-col h-[180px] hover:border-[#f59e0b] transition-colors cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Top part */}
                      <div className="flex flex-col flex-1 relative z-10 mb-4">
                        <div className="flex items-center gap-4 mb-2 font-mono-code text-[13px]">
                          <span className="text-gray-500">{(i + 1).toString().padStart(2, '0')}</span>
                          {i >= 14 && (
                            <span className="text-[#f59e0b] font-bold text-[10px] tracking-wider uppercase ml-auto">BACKUP</span>
                          )}
                        </div>
                        <h3 className="text-white font-bold font-heading uppercase tracking-wide text-base group-hover:text-[#f59e0b] transition-colors leading-tight">
                          {title}
                        </h3>
                      </div>

                      {/* Bottom part */}
                      <div className="relative z-10 border-t border-gray-800 border-dashed pt-3 flex flex-col gap-2 font-mono-code text-[10px] tracking-widest uppercase mt-auto">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600">TEAM</span>
                          <span className="text-gray-300">00</span>
                          <span className="text-gray-600">TEAM NAME</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full border border-gray-500"></div>
                          <span className="text-gray-400">UNASSIGNED</span>
                        </div>
                      </div>
                    </motion.div>
                  ])}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
