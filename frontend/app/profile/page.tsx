"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { Save } from "lucide-react";
import { MembershipCard } from "@/components/MembershipCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [interest, setInterest] = useState("");
  const [linkedin, setLinkedin] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const idToken = await user.getIdToken();
        const headers = { Authorization: `Bearer ${idToken}` };
        
        // Fetch profile
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/me`, { headers });
        const data = await res.json();
        
        // Fetch membership for memberId
        let membershipData = null;
        try {
          const mRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/memberships/me`, { headers });
          if (mRes.ok) {
            membershipData = await mRes.json();
          }
        } catch (e) {
          console.error("Failed to fetch membership", e);
        }
        
        if (res.ok) {
          setProfile({ ...data, membership_id: membershipData?.membership_id });
          setName(data.name || user.displayName || "");
          setEmail(user.email || data.email || "");
          setPhone(data.phone || "");
          setBio(data.bio || "");
          setDepartment(data.department || data.course || "");
          setYear(data.year || "");
          setInterest(data.interest || data.techSkills || "");
          setLinkedin(data.linkedin || "");
        } else {
          setError(data.error || "Failed to load profile");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const idToken = await user.getIdToken();
      // Notice we are sending department mapped to course and interest mapped to techSkills 
      // or directly if the backend supports it, but I'll send everything so backend can save it.
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ 
          name, 
          phone, 
          bio, 
          department, 
          course: department, // legacy fallback
          year, 
          interest,
          techSkills: interest, // legacy fallback
          linkedin 
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-none h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  // Use the actual membership ID if available, otherwise format the user ID as a fallback mock ID
  const memberId = profile?.membership_id || (user?.uid ? `ECL-${new Date().getFullYear()}-${String(user.uid).padStart(4, '0')}` : "PENDING");

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9] text-[#0c111d] selection:bg-[#0c111d] selection:text-[#fcfbf9]">
      <Navbar />
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-8 animate-in fade-in duration-500 py-12">
        <div className="mb-8">
        <h1 className="text-3xl font-heading uppercase tracking-tight font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-neutral-600 font-mono text-xs uppercase tracking-wider text-[14px]">Manage your personal information and view your membership card.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Profile Form */}
        <div className="bg-white rounded-[2rem] border border-black shadow-none p-6 md:p-10 relative overflow-hidden flex-1 w-full">
          
          <form onSubmit={handleSave} className="relative z-10 max-w-2xl">
            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-none text-sm font-medium border border-red-100">{error}</div>}
            {success && <div className="mb-6 p-4 bg-amber-50 text-amber-600 rounded-none text-sm font-medium border border-amber-100">{success}</div>}

            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-none border border-black focus:outline-none focus:ring-0 focus:border-[#f59e0b] transition-all font-medium text-[15px]"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Email Address (Read-only)</label>
                  <input 
                    type="email" 
                    value={email}
                    readOnly
                    className="w-full px-4 py-3.5 rounded-none border border-gray-300 bg-gray-50 text-gray-500 transition-all font-medium text-[15px] cursor-not-allowed"
                    title="Email cannot be changed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Mobile Number</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-none border border-black focus:outline-none focus:ring-0 focus:border-[#f59e0b] transition-all font-medium text-[15px]"
                    placeholder="Mobile number"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">LinkedIn Profile</label>
                  <input 
                    type="url" 
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-none border border-black focus:outline-none focus:ring-0 focus:border-[#f59e0b] transition-all font-medium text-[15px]"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Bio</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-none border border-black focus:outline-none focus:ring-0 focus:border-[#f59e0b] transition-all font-medium text-[15px] resize-none h-24"
                  placeholder="Tell us a little bit about yourself"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Department</label>
                  <input 
                    type="text" 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-none border border-black focus:outline-none focus:ring-0 focus:border-[#f59e0b] transition-all font-medium text-[15px]"
                    placeholder="e.g. Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Year of Study</label>
                  <select 
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-none border border-black focus:outline-none focus:ring-0 focus:border-[#f59e0b] transition-all font-medium text-[15px] bg-white"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Alumni / Professional">Alumni / Professional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Interests</label>
                <input 
                  type="text" 
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-none border border-black focus:outline-none focus:ring-0 focus:border-[#f59e0b] transition-all font-medium text-[15px]"
                  placeholder="e.g. Web Dev, AI, Design (comma separated)"
                />
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-black">
              <button 
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-black text-white hover:bg-neutral-800 disabled:opacity-50 text-white font-bold py-3.5 px-8 rounded-none transition-all shadow-none border border-black active:scale-95 text-[15px]"
              >
                <Save className="w-5 h-5" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Membership Card Display */}
        {profile?.membership_id && (
          <div className="w-full lg:w-[350px] shrink-0">
            <h2 className="text-xl font-heading font-bold uppercase tracking-tight text-gray-900 mb-4">Membership Card</h2>
            <div className="relative h-[500px]">
              <MembershipCard member={{ name: name || "ECLIPSE MEMBER", memberId: memberId, membershipType: profile?.role }} />
            </div>
          </div>
        )}

      </div>
      </main>
      <Footer />
    </div>
  );
}
