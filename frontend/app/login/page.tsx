"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/firebase/auth";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

function LoginContent() {
  const { loginWithEmail, verifyOtp, resendOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [step, setStep] = useState<"login" | "otp">("login");
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await loginWithEmail(email, password);
      if (result && result.requires_otp) {
        setStep("otp");
        setSuccess("Email not verified. OTP sent to your email.");
        setResendCooldown(60);
      } else {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await verifyOtp(email, otp);
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await resendOtp(email);
      setSuccess(result.message || "OTP resent successfully.");
      setResendCooldown(60);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#0c111d] flex flex-col font-mono selection:bg-[#f59e0b] selection:text-[#0c111d]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 py-12 lg:py-20 w-full max-w-2xl mx-auto">
        <div className="w-full bg-[#ffffff] border-2 border-[#0c111d] shadow-[8px_8px_0px_0px_#0c111d] p-8 md:p-12 relative overflow-hidden">
          
          <div className="mb-8 flex items-center gap-2 border-b border-[#0c111d] pb-2 font-mono-code text-[11px]">
            <span className="w-2 h-2 bg-[#0c111d]"></span>
            <span className="font-bold tracking-wider text-[#0c111d] uppercase">ACCOUNT ACCESS</span>
          </div>
          
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#0c111d] mb-2 tracking-tight uppercase leading-none">
            Login
          </h1>
          <p className="text-[#434656] font-mono-code text-xs uppercase tracking-wider mb-10 border-l-4 border-[#0c111d] pl-4 py-1">Enter your details to access your account.</p>

          {error && <div className="text-[#0c111d] bg-red-100 border border-[#0c111d] p-3 text-xs font-bold font-mono-code uppercase mb-6">{error}</div>}
          {success && <div className="text-[#0c111d] bg-[#f59e0b] border border-[#0c111d] p-3 text-xs font-bold font-mono-code uppercase mb-6">{success}</div>}

          {step === "login" ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#0c111d] uppercase tracking-wider font-mono-code" htmlFor="email">Email Address</label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="STUDENT@DIATM.EDU" 
                  required 
                  className="h-12 rounded-none border border-[#0c111d] bg-[#f5f4ef] px-4 text-xs font-mono-code font-bold text-[#0c111d] placeholder:text-[#737688] focus-visible:ring-0 focus-visible:border-[#f59e0b] focus-visible:bg-[#ffffff] focus-visible:shadow-[3px_3px_0px_0px_#0c111d] transition-all" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-[#0c111d] uppercase tracking-wider font-mono-code" htmlFor="password">Password</label>
                  <Link href="/forgot-password" className="text-[10px] font-bold text-[#434656] hover:text-[#0c111d] uppercase underline font-mono-code">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    required 
                    className="h-12 rounded-none border border-[#0c111d] bg-[#f5f4ef] px-4 pr-12 text-xs font-mono-code font-bold text-[#0c111d] placeholder:text-[#737688] focus-visible:ring-0 focus-visible:border-[#f59e0b] focus-visible:bg-[#ffffff] focus-visible:shadow-[3px_3px_0px_0px_#0c111d] transition-all" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737688] hover:text-[#0c111d] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-4">
                <Button type="submit" disabled={loading} className="flex-1 rounded-none bg-[#0c111d] hover:bg-[#f59e0b] hover:text-[#0c111d] hover:shadow-[3px_3px_0px_0px_#0c111d] text-[#fcfbf9] border border-[#0c111d] h-12 font-mono-code font-bold uppercase tracking-widest text-[11px] transition-all">
                  {loading ? 'LOGGING IN...' : 'LOGIN'}
                </Button>
                <Link href="/register" className="h-12 px-6 flex items-center justify-center rounded-none bg-[#ffffff] hover:bg-[#f5f4ef] hover:shadow-[3px_3px_0px_0px_#0c111d] text-[#0c111d] border border-[#0c111d] font-mono-code font-bold uppercase tracking-widest text-[11px] transition-all">
                  REGISTER
                </Link>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#0c111d] uppercase tracking-wider font-mono-code" htmlFor="otp">6-Digit Access Code</label>
                <Input 
                  id="otp" 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                  placeholder="000000" 
                  required
                  maxLength={6}
                  className="h-16 rounded-none border border-[#0c111d] bg-[#f5f4ef] px-4 text-center text-2xl tracking-[0.5em] font-mono-code font-black text-[#0c111d] placeholder:text-[#737688] focus-visible:ring-0 focus-visible:border-[#f59e0b] focus-visible:bg-[#ffffff] focus-visible:shadow-[3px_3px_0px_0px_#0c111d] transition-all" 
                />
              </div>

              <div className="pt-4 flex flex-col gap-4">
                <Button type="submit" disabled={loading || otp.length !== 6} className="w-full rounded-none bg-[#0c111d] hover:bg-[#f59e0b] hover:text-[#0c111d] hover:shadow-[3px_3px_0px_0px_#0c111d] text-[#fcfbf9] border border-[#0c111d] h-12 font-mono-code font-bold uppercase tracking-widest text-[11px] transition-all">
                  {loading ? 'VERIFYING...' : 'VERIFY OTP'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  disabled={loading || resendCooldown > 0} 
                  onClick={handleResendOtp}
                  className="w-full rounded-none bg-[#ffffff] hover:bg-[#f5f4ef] hover:shadow-[3px_3px_0px_0px_#0c111d] text-[#0c111d] border border-[#0c111d] h-12 font-mono-code font-bold uppercase tracking-widest text-[11px] transition-all"
                >
                  {resendCooldown > 0 ? `RESEND CODE (${resendCooldown}S)` : 'RESEND CODE'}
                </Button>
              </div>
            </form>
          )}

        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfbf9] flex items-center justify-center font-mono-code text-[#0c111d] font-bold text-xs uppercase tracking-widest">INITIALIZING...</div>}>
      <LoginContent />
    </Suspense>
  );
}
