import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-2 border-[#0c111d] bg-[#f5f4ef] text-[#0c111d] pt-12 pb-8 px-4 sm:px-8 relative z-10" id="contact">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#0c111d]">
          {/* Brand & College Credential */}
          <div className="md:col-span-4">
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="Eclipse" className="h-[100px] w-auto object-contain" />
            </div>
            <p className="font-body-md text-xs text-[#434656] leading-relaxed max-w-sm mb-4">
              The Official Student Tech Community of Durgapur Institute of Advanced Technology and Management (DIATM). Fostering peer innovation, computing excellence, and industry integration.
            </p>
            <div className="font-mono-code text-[11px] text-[#737688]">
              <p>DEPARTMENT OF CSE &amp; IT</p>
              <p>DURGAPUR, WEST BENGAL — 713212</p>
              <p className="mt-2 text-[#0c111d] font-bold">
                <a href="mailto:eclipse@csediatm.in" className="hover:text-[#f59e0b] transition-colors">ECLIPSE@CSEDIATM.IN</a>
              </p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-3 font-mono-code text-xs">
            <p className="font-bold text-[#0c111d] uppercase tracking-wider mb-4 border-b border-[#0c111d]/20 pb-1">
              // INDEX NAVIGATION
            </p>
            <ul className="space-y-2">
              <li><Link className="hover:underline" href="/">01. Home Overview</Link></li>
              <li><Link className="hover:underline" href="/about">02. About Us &amp; Identity</Link></li>
              <li><Link className="hover:underline" href="/mission">03. Mission &amp; Vision</Link></li>
              <li><Link className="hover:underline" href="/achievements">04. Event Archives</Link></li>
              <li><Link className="hover:underline" href="/gallery">05. Visual Media Gallery</Link></li>
            </ul>
          </div>
          
          {/* Colophon & Lead Credits */}
          <div className="md:col-span-3 font-mono-code text-xs">
            <p className="font-bold text-[#0c111d] uppercase tracking-wider mb-4 border-b border-[#0c111d]/20 pb-1">
              // COLOPHON &amp; CREDITS
            </p>
            <div className="space-y-2 text-[#434656]">
              <p>DESIGN &amp; ARCHITECT BY:</p>
              <p className="font-bold text-[#0c111d]">Shubhsanket Sharma</p>
              <p className="pt-2">DEPLOY BY:</p>
              <p className="font-bold text-[#0c111d]">Rajdeep Nandy &amp; Debjit Chowdhury</p>
              <p className="text-[11px] text-[#737688] pt-2">TYPES: Playfair Display / Plus Jakarta Sans / Space Grotesk / Bodoni Moda</p>
            </div>
          </div>
          
          {/* Connect / System Status */}
          <div className="md:col-span-2 font-mono-code text-xs">
            <p className="font-bold text-[#0c111d] uppercase tracking-wider mb-4 border-b border-[#0c111d]/20 pb-1">
              // STATUS
            </p>
            <div className="bg-[#ffffff] border border-[#0c111d] p-3 text-[11px]">
              <div className="flex items-center gap-1.5 text-[#b45309] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#b45309] animate-pulse"></span>
                <span>RECRUITMENT ACTIVE</span>
              </div>
              <p className="text-[#737688] mt-1 text-[10px]">SLOTS: 28 REMAINING</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Hairline Copyright Bar */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 font-mono-code text-[11px] text-[#737688]">
          <div>
            © 2026 ECLLIPSE TECH COMMUNITY // DIATM. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <Link className="hover:text-[#0c111d]" href="/constitution">CONSTITUTION</Link>
            <span>•</span>
            <Link className="hover:text-[#0c111d]" href="/conduct">CODE OF CONDUCT</Link>
            <span>•</span>
            <a className="hover:text-[#0c111d]" href="https://github.com/designershubh1208-pixel" target="_blank" rel="noreferrer">GITHUB</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
