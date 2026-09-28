"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState, useRef } from "react";
import { Upload, X, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AlumniRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    graduation_year: new Date().getFullYear().toString(),
    current_role: "",
    linkedin_url: "",
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Basic client-side validation
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError("Only image files are allowed");
        return;
      }

      setSelectedFile(file);
      setError(null);
      
      // Create local preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError("Please upload a profile photo.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const data = new FormData();
    data.append("photo", selectedFile);
    data.append("name", formData.name);
    data.append("department", formData.department);
    data.append("graduation_year", formData.graduation_year);
    data.append("current_role", formData.current_role);
    data.append("linkedin_url", formData.linkedin_url);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/alumni`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: data,
      });
      
      const text = await res.text();
      let resData;
      
      try {
        // Find the start of the JSON object to bypass any prepended PHP HTML warnings
        const jsonStartIndex = text.indexOf('{');
        if (jsonStartIndex >= 0) {
          resData = JSON.parse(text.substring(jsonStartIndex));
        } else {
          throw new Error("No JSON found");
        }
      } catch (e) {
        console.error("Failed to parse JSON response. Raw text:", text);
        throw new Error("Unable to submit your alumni profile. Please try again.");
      }
      
      if (!res.ok) {
        throw new Error(resData.error || "Failed to submit registration");
      }
      
      setSuccess(true);
    } catch (err: any) {
      console.error("Submission error:", err.message);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#fcfbf9] font-sans text-[#0c111d] flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-12 px-4">
          <div className="max-w-md w-full bg-white border-2 border-[#0c111d] p-10 text-center shadow-[8px_8px_0px_0px_rgba(12,17,29,0.05)]">
            <div className="w-16 h-16 bg-green-100 border-2 border-green-600 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif-display text-3xl font-black text-[#0c111d] mb-4">Submission Successful</h2>
            <p className="font-mono-code text-[#434656] text-sm leading-relaxed mb-8">
              Your alumni profile has been submitted and is pending approval. It will appear in the public directory once reviewed by our team.
            </p>
            <Link 
              href="/alumni"
              className="inline-flex items-center justify-center w-full bg-[#0c111d] text-[#fcfbf9] px-6 py-3 font-mono-code font-bold uppercase tracking-widest hover:bg-[#2a2f3a] transition-colors"
            >
              Return to Directory
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf9] font-sans text-[#0c111d] selection:bg-[#f59e0b] selection:text-[#0c111d]">
      <Navbar />

      <main className="pt-32 pb-24 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          
          <Link href="/alumni" className="inline-flex items-center text-[#434656] hover:text-[#0c111d] font-mono-code text-xs uppercase tracking-widest mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </Link>
          
          <div className="mb-10 border-b-2 border-[#0c111d] pb-6">
            <h1 className="font-serif-display text-4xl sm:text-5xl font-black tracking-tight text-[#0c111d] uppercase">
              Join the Network
            </h1>
            <p className="mt-2 font-mono-code text-[#434656] text-sm uppercase tracking-widest">
              Add your profile to the official ECLIPSE Tech Community alumni directory.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 text-red-700 font-mono-code text-sm">
              <span className="font-bold uppercase mr-2">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white border-2 border-[#0c111d] p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(12,17,29,0.05)]">
            
            <div className="space-y-8">
              
              {/* Photo Upload Section */}
              <div className="border-b border-[#0c111d]/10 pb-8">
                <label className="block font-mono-code text-xs font-bold uppercase tracking-widest text-[#0c111d] mb-4">
                  Profile Photo *
                </label>
                
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {/* Avatar Preview */}
                  <div className="w-32 h-40 bg-[#f5f4ef] border-2 border-[#0c111d] relative shrink-0 overflow-hidden group">
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover object-top" />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#737688]">
                        <UserIcon className="w-12 h-12 mb-2 opacity-50" />
                        <span className="font-mono-code text-[10px] uppercase tracking-widest">No Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Instructions */}
                  <div className="flex-1">
                    <p className="font-mono-code text-sm text-[#434656] mb-4 leading-relaxed">
                      Please upload a clear, professional photo of yourself. This will be displayed on your public alumni card.
                      <br /><br />
                      <span className="font-bold text-[#0c111d]">Requirements:</span> JPG, PNG or WEBP format. Maximum 5MB.
                    </p>
                    
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center px-4 py-2 bg-white border border-[#0c111d] text-[#0c111d] font-mono-code text-xs font-bold uppercase tracking-widest hover:bg-[#f5f4ef] transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {previewUrl ? 'Change Photo' : 'Select Photo'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block font-mono-code text-xs font-bold uppercase tracking-widest text-[#0c111d] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-[#fcfbf9] border border-[#0c111d]/20 focus:border-[#0c111d] focus:outline-none focus:ring-0 font-mono-code text-sm transition-colors"
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="graduation_year" className="block font-mono-code text-xs font-bold uppercase tracking-widest text-[#0c111d] mb-2">
                    Graduation Year *
                  </label>
                  <select
                    id="graduation_year"
                    required
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({...formData, graduation_year: e.target.value})}
                    className="w-full px-4 py-3 bg-[#fcfbf9] border border-[#0c111d]/20 focus:border-[#0c111d] focus:outline-none focus:ring-0 font-mono-code text-sm transition-colors"
                  >
                    {Array.from({length: new Date().getFullYear() + 4 - 2002 + 1}, (_, i) => new Date().getFullYear() - i + 4).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="department" className="block font-mono-code text-xs font-bold uppercase tracking-widest text-[#0c111d] mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    id="department"
                    required
                    maxLength={150}
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-3 bg-[#fcfbf9] border border-[#0c111d]/20 focus:border-[#0c111d] focus:outline-none focus:ring-0 font-mono-code text-sm transition-colors"
                    placeholder="e.g. Computer Science & Engineering"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="current_role" className="block font-mono-code text-xs font-bold uppercase tracking-widest text-[#0c111d] mb-2">
                    Current Working Role *
                  </label>
                  <input
                    type="text"
                    id="current_role"
                    required
                    maxLength={150}
                    value={formData.current_role}
                    onChange={(e) => setFormData({...formData, current_role: e.target.value})}
                    className="w-full px-4 py-3 bg-[#fcfbf9] border border-[#0c111d]/20 focus:border-[#0c111d] focus:outline-none focus:ring-0 font-mono-code text-sm transition-colors"
                    placeholder="e.g. Software Engineer at Google"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="linkedin_url" className="block font-mono-code text-xs font-bold uppercase tracking-widest text-[#0c111d] mb-2">
                    LinkedIn URL *
                  </label>
                  <input
                    type="url"
                    id="linkedin_url"
                    required
                    maxLength={255}
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                    className="w-full px-4 py-3 bg-[#fcfbf9] border border-[#0c111d]/20 focus:border-[#0c111d] focus:outline-none focus:ring-0 font-mono-code text-sm transition-colors"
                    placeholder="e.g. https://linkedin.com/in/janedoe"
                  />
                </div>
              </div>
              
              <div className="pt-6 border-t border-[#0c111d]/10">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center bg-[#f59e0b] text-[#0c111d] px-8 py-4 font-mono-code font-bold uppercase tracking-widest hover:bg-[#d97706] transition-colors border-2 border-[#0c111d] shadow-[4px_4px_0px_0px_#0c111d] disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0c111d]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </button>
              </div>

            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Simple fallback icon
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
