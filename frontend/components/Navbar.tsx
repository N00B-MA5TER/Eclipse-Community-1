"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, ChevronDown, MonitorPlay, User, LogOut } from "lucide-react";

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [desktopDropdown, setDesktopDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const searchData = [
    { title: "Home", href: "/", category: "General", description: "The landing page and general overview." },
    { title: "About Us", href: "/about", category: "General", description: "Learn about ECLIPSE club and what we do." },
    { title: "Dashboard", href: "/dashboard", category: "App", description: "Admin/Member Dashboard" },
    { title: "Core Team", href: "/gallery/teams", category: "People", description: "Meet the passionate individuals behind ECLIPSE." },
    { title: "Faculty Members", href: "/gallery/faculty", category: "People", description: "Our guiding faculty and mentors." },
    { title: "Projects", href: "/gallery/projects", category: "Showcase", description: "Projects built by our members." },
    { title: "Membership", href: "/contact/membership", category: "Join", description: "Step into something greater. Join our club." },
    { title: "Dashboard", href: "/dashboard", category: "App", description: "Your personalized student dashboard." },
  ];

  const filteredSearch = searchData.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const updateScrolled = () => setIsScrolled(window.scrollY > 28);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, [pathname]);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const NavLink = ({ href, children, exact = true }: { href: string; children: React.ReactNode; exact?: boolean }) => {
    const active = exact ? pathname === href : isActive(href);
    
    return (
      <Link 
        href={href} 
        aria-current={active ? "page" : undefined}
        className={`nav-item px-2.5 py-2 rounded-md transition-colors text-xs font-semibold whitespace-nowrap ${
          active 
            ? "bg-black text-white" 
            : "text-gray-700 hover:bg-gray-100 hover:text-black"
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <>
      {/* Sticky Navbar Container */}
      <header data-scrolled={isScrolled ? "true" : "false"} className="site-header sticky top-0 z-50 w-full py-3 px-5 sm:px-8 flex items-center justify-between bg-[#fcfbf9] transition-all duration-300">
        
        {/* LEFT: Logo Section (Separated from the pill) */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center justify-center transition-transform duration-300 hover:scale-105">
            <img src="/logo.png" alt="Eclipse" className="h-16 md:h-20 w-auto object-contain" />
          </Link>
        </div>

        {/* MIDDLE: Navigation Links Pill */}
        <nav aria-label="Main navigation" className="site-nav hidden xl:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-0.5 px-2 h-11 bg-white border border-gray-200 shadow-sm rounded-lg">
          <NavLink href="/" exact={true}>Home</NavLink>
          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/alumni">Alumni</NavLink>
          <NavLink href="/calendar">Calendar</NavLink>

          
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setDesktopDropdown('gallery')}
            onMouseLeave={() => setDesktopDropdown(null)}
          >
            <button 
              type="button" 
              className="nav-item inline-flex items-center px-2.5 py-2 rounded-md transition-colors text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-black whitespace-nowrap"
            >
              <span>Gallery</span>
              <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${desktopDropdown === 'gallery' ? 'rotate-180' : ''}`} />
            </button>
            {desktopDropdown === 'gallery' && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-48 z-50">
                <div className="bg-white border border-gray-200 rounded-2xl py-2 shadow-xl">
                  <Link href="/gallery/events" onClick={() => setDesktopDropdown(null)} className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black">Events</Link>
                  <Link href="/gallery/teams" onClick={() => setDesktopDropdown(null)} className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black">Core Team</Link>
                  <Link href="/gallery/faculty" onClick={() => setDesktopDropdown(null)} className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black">Faculty Members</Link>
                  <Link href="/gallery/projects" onClick={() => setDesktopDropdown(null)} className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black">Projects</Link>
                </div>
              </div>
            )}
          </div>
          
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setDesktopDropdown('contact')}
            onMouseLeave={() => setDesktopDropdown(null)}
          >
            <button 
              type="button" 
              className="nav-item inline-flex items-center px-2.5 py-2 rounded-md transition-colors text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-black whitespace-nowrap"
            >
              <span>Contact</span>
              <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${desktopDropdown === 'contact' ? 'rotate-180' : ''}`} />
            </button>
            {desktopDropdown === 'contact' && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-48 z-50">
                <div className="bg-white border border-gray-200 rounded-2xl py-2 shadow-xl">
                  <Link href="/contact" onClick={() => setDesktopDropdown(null)} className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black">General Inquiries</Link>
                  <Link href="/contact/membership" onClick={() => setDesktopDropdown(null)} className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black">Join Chapter</Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT: Action Section */}
        <div className="flex items-center gap-2">
          <button 
            aria-label="Search" 
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-colors shrink-0"
          >
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          {!loading && user ? (
            <div className="nav-account-actions hidden sm:flex items-center gap-2">
              <Link 
                href="/profile"
                className="nav-profile-button"
                title="Profile"
              >
                <User className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
              <Link 
                href="/dashboard"
                className="nav-dashboard-link"
              >
                Dashboard
              </Link>
              <button
                onClick={() => logout().then(() => router.push("/"))}
                className="nav-signout-button"
                type="button"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          ) : !loading ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link 
                href="/login"
                className="bg-[#f5f4ef] text-black text-xs font-semibold px-4 h-10 rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm"
              >
                Login
              </Link>
              <Link 
                href="/register"
                className="bg-black text-white text-xs font-semibold px-4 h-10 rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm"
              >
                Register
              </Link>
            </div>
          ) : null}

          <button 
            aria-label="Toggle Menu" 
            onClick={() => setIsMobileMenuOpen(true)}
            className="xl:hidden w-10 h-10 flex items-center justify-center rounded-md bg-black text-white hover:bg-gray-800 transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Fullscreen Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-[#fcfbf9]/90 backdrop-blur-md"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div 
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -10, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-[#ffffff] border-2 border-[#0c111d] shadow-[6px_6px_0px_0px_#0c111d] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center border-b-2 border-[#0c111d] p-4 bg-[#fcfbf9]">
                <Search className="w-5 h-5 text-[#0c111d] mr-3" />
                <input
                  type="text"
                  placeholder="Search pages, events, or features..."
                  className="flex-1 bg-transparent border-none outline-none text-lg text-[#0c111d] placeholder:text-[#737688] font-mono-code"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 hover:bg-[#0c111d]/5 text-[#0c111d] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredSearch.length === 0 ? (
                  <div className="p-8 text-center text-[#737688] font-mono-code">
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="grid gap-1">
                    {filteredSearch.map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-4 p-3 hover:bg-[#0c111d]/5 transition-colors group border border-transparent hover:border-[#0c111d]/20"
                      >
                        <div className="w-10 h-10 bg-[#f5f4ef] border border-[#0c111d] flex items-center justify-center text-[#0c111d] group-hover:bg-[#0c111d] group-hover:text-[#fcfbf9] transition-colors">
                          <MonitorPlay className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#0c111d] mb-0.5">{item.title}</h4>
                          <p className="text-xs text-[#434656]">{item.description}</p>
                        </div>
                        <div className="ml-auto">
                          <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider px-2 py-1 bg-[#f5f4ef] text-[#737688] border border-[#0c111d]/20">
                            {item.category}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t-2 border-[#0c111d] bg-[#f5f4ef] p-3 flex justify-between items-center text-xs text-[#434656] font-mono-code">
                <span><kbd className="px-1.5 py-0.5 bg-[#ffffff] border border-[#0c111d] text-[#0c111d] mr-1">ESC</kbd> to close</span>
                <span><kbd className="px-1.5 py-0.5 bg-[#ffffff] border border-[#0c111d] text-[#0c111d] mr-1">↑↓</kbd> to navigate</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#fcfbf9] xl:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b-2 border-[#0c111d] bg-[#fcfbf9]">
              <Link href="/" className="flex items-center group">
                <img src="/logo.png" alt="Eclipse" className="h-[75px] w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center border border-[#0c111d] text-[#0c111d] hover:bg-[#0c111d] hover:text-[#fcfbf9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/alumni", label: "Alumni" },
                { href: "/calendar", label: "Calendar" },

                { 
                  label: "Gallery", 
                  subItems: [
                    { href: "/gallery/teams", label: "Core Team" },
                    { href: "/gallery/faculty", label: "Faculty Members" },
                    { href: "/gallery/projects", label: "Projects" },
                    { href: "/gallery/events", label: "Events Gallery" },
                  ]
                },
                { 
                  label: "Contact",
                  subItems: [
                    { href: "/contact", label: "General Inquiries" },
                    { href: "/contact/membership", label: "Join Chapter" },
                  ]
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-[#0c111d]/20"
                >
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                        className="w-full flex items-center justify-between text-2xl font-serif-display font-bold text-[#0c111d] py-4"
                      >
                        {item.label}
                        <ChevronDown className={`w-5 h-5 transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden flex flex-col space-y-3 pb-4 pl-4 border-l-2 border-[#0c111d] ml-2"
                          >
                            {item.subItems.map(sub => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg font-mono-code text-[#434656] hover:text-[#0c111d]"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href as string}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-2xl font-serif-display font-bold text-[#0c111d] py-4"
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            <div className={`mobile-account-actions${user ? " is-authenticated" : ""}`}>
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="mobile-dashboard-link">Profile</Link>
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="mobile-dashboard-link">Dashboard</Link>
                  <button type="button" className="mobile-signout-button col-span-2" onClick={() => logout().then(() => { setIsMobileMenuOpen(false); router.push("/"); })}>
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="mobile-dashboard-link">Login to Portal</Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="mobile-dashboard-link">Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
