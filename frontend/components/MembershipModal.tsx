"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/firebase/auth";
import { MembershipCard } from "./MembershipCard";

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MembershipModal({ isOpen, onClose }: MembershipModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdMembership, setCreatedMembership] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    student_id: "",
    year_semester: "",
    linkedin_url: "",
    github_url: "",
    agreement: false
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user && isOpen) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreement) {
      setError("You must agree to the membership terms.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await user?.getIdToken();
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/memberships`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 422) {
          setError("Please check the highlighted fields and ensure all required information is provided.");
        } else if (res.status === 409) {
          setError(data?.message || "A membership application already exists for this email address.");
        } else if (res.status === 429) {
          setError("Too many attempts. Please try again later.");
        } else {
          setError(data?.message || "Unable to submit your application right now. Please try again later.");
        }
        return;
      }

      setCreatedMembership(data?.membership);
      setSuccess(true);
    } catch (err) {
      setError("Unable to submit your application right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        if (success) {
          setTimeout(() => {
            setSuccess(false);
            setFormData({ name: "", email: "", phone: "", department: "", student_id: "", year_semester: "", linkedin_url: "", github_url: "", agreement: false });
          }, 300);
        }
      }
    }}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-[#fcfbf9] border-4 border-[#0c111d] shadow-[8px_8px_0px_0px_#0c111d] rounded-none">
        
        {success ? (
          <div className="flex flex-col h-full bg-[#0c111d] relative overflow-hidden text-center min-h-[700px]">
            {/* Dark Eclipse-themed background animation overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0c111d] to-black z-0 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col h-full items-center justify-center p-8">
              <MembershipCard 
                animateEntrance={true}
                member={{
                  name: createdMembership?.name || formData.name,
                  profilePhoto: user?.photoURL || null,
                  memberId: createdMembership?.membership_id || "PENDING",
                  membershipType: "MEMBER"
                }} 
              />
              
              <div className="mt-8 animate-[fade-in_1s_ease-out_1s_forwards] opacity-0">
                <h2 className="font-serif-display text-3xl font-black text-white uppercase tracking-tighter mb-2">Welcome to Eclipse</h2>
                <p className="font-mono-code text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">
                  Your identity has been registered.
                </p>
                <Button 
                  onClick={onClose}
                  className="px-8 h-12 bg-[#f59e0b] text-[#0c111d] font-mono-code font-black uppercase tracking-widest hover:bg-[#d97706] rounded-none transition-all"
                >
                  Enter Dashboard
                </Button>
              </div>
            </div>
            
            <style>{`
              @keyframes fade-in {
                0% { opacity: 0; transform: translateY(10px); }
                100% { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        ) : (
          <>
            <div className="p-8 border-b-4 border-[#0c111d] bg-[#f59e0b]">
              <DialogTitle className="font-serif-display text-4xl font-black text-[#0c111d] uppercase tracking-tighter leading-none mb-2">
                Become a Member
              </DialogTitle>
              <DialogDescription className="font-mono-code text-[#0c111d] font-bold uppercase tracking-widest text-xs">
                Join Eclipse Tech Community and be part of our growing technology community.
              </DialogDescription>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-4 border-red-500 text-red-700 font-mono-code font-bold uppercase tracking-wider text-xs shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-mono-code text-xs font-black uppercase tracking-widest text-[#0c111d]">Full Name *</label>
                    <Input 
                      required name="name" value={formData.name} onChange={handleChange}
                      className="rounded-none border-2 border-[#0c111d] h-12 font-mono-code text-sm focus-visible:ring-0 focus-visible:border-[#f59e0b] focus-visible:border-4 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono-code text-xs font-black uppercase tracking-widest text-[#0c111d]">Email Address *</label>
                    <Input 
                      required type="email" name="email" value={formData.email} onChange={handleChange}
                      className="rounded-none border-2 border-[#0c111d] h-12 font-mono-code text-sm focus-visible:ring-0 focus-visible:border-[#f59e0b] focus-visible:border-4 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono-code text-xs font-black uppercase tracking-widest text-[#0c111d]">Phone Number *</label>
                    <Input 
                      required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      className="rounded-none border-2 border-[#0c111d] h-12 font-mono-code text-sm focus-visible:ring-0 focus-visible:border-[#f59e0b] focus-visible:border-4 transition-all"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono-code text-xs font-black uppercase tracking-widest text-[#0c111d]">Department *</label>
                    <Input 
                      required name="department" value={formData.department} onChange={handleChange}
                      className="rounded-none border-2 border-[#0c111d] h-12 font-mono-code text-sm focus-visible:ring-0 focus-visible:border-[#f59e0b] focus-visible:border-4 transition-all"
                      placeholder="Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono-code text-xs font-black uppercase tracking-widest text-[#0c111d]">Roll Number / Student ID *</label>
                    <Input 
                      required name="student_id" value={formData.student_id} onChange={handleChange}
                      className="rounded-none border-2 border-[#0c111d] h-12 font-mono-code text-sm focus-visible:ring-0 focus-visible:border-[#f59e0b] focus-visible:border-4 transition-all"
                      placeholder="CSE001"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono-code text-xs font-black uppercase tracking-widest text-[#0c111d]">Current Year / Semester *</label>
                    <Input 
                      required name="year_semester" value={formData.year_semester} onChange={handleChange}
                      className="rounded-none border-2 border-[#0c111d] h-12 font-mono-code text-sm focus-visible:ring-0 focus-visible:border-[#f59e0b] focus-visible:border-4 transition-all"
                      placeholder="4th Semester"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono-code text-xs font-black uppercase tracking-widest text-[#0c111d]">LinkedIn Profile *</label>
                    <Input 
                      required type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange}
                      className="rounded-none border-2 border-[#0c111d] h-12 font-mono-code text-sm focus-visible:ring-0 focus-visible:border-[#f59e0b] focus-visible:border-4 transition-all"
                      placeholder="https://linkedin.com/in/johndoe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono-code text-xs font-black uppercase tracking-widest text-[#0c111d]">GitHub Profile <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <Input 
                      type="url" name="github_url" value={formData.github_url} onChange={handleChange}
                      className="rounded-none border-2 border-[#0c111d] h-12 font-mono-code text-sm focus-visible:ring-0 focus-visible:border-[#f59e0b] focus-visible:border-4 transition-all"
                      placeholder="https://github.com/johndoe"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-100 border-2 border-gray-300">
                  <input 
                    type="checkbox" 
                    id="agreement" 
                    name="agreement"
                    checked={formData.agreement}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 rounded-none border-2 border-[#0c111d] text-[#f59e0b] focus:ring-0 focus:ring-offset-0"
                  />
                  <label htmlFor="agreement" className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#0c111d] leading-relaxed cursor-pointer select-none">
                    I agree to the Eclipse Tech Community membership terms. *
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 h-14 rounded-none border-4 border-[#0c111d] text-[#0c111d] font-mono-code font-black uppercase tracking-widest hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 h-14 rounded-none border-4 border-[#0c111d] bg-[#f59e0b] text-[#0c111d] font-mono-code font-black uppercase tracking-widest hover:bg-[#d97706] shadow-[4px_4px_0px_0px_#0c111d] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#0c111d] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
