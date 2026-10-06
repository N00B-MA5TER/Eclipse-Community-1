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
              <li><Link className="hover:underline" href="/gallery">03. Visual Media Gallery</Link></li>
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
              <p className="pt-2">DEPLOYED BY:</p>
              <p className="font-bold text-[#0c111d]">Rajdeep Nandy &amp; Debjit Chowdhury</p>
              <p className="text-[11px] text-[#737688] pt-2">TYPES: Playfair Display / Plus Jakarta Sans / Space Grotesk / Bodoni Moda</p>
            </div>
          </div>
          
        </div>
        
        {/* Bottom Hairline Copyright Bar */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 font-mono-code text-[11px] text-[#737688]">
          <div>
            © 2026 ECLLIPSE TECH COMMUNITY // DIATM. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <a className="hover:text-[#0c111d]" href="https://github.com/designershubh1208-pixel" target="_blank" rel="noreferrer">GITHUB</a>
          </div>
        </div>
        </div>

        {/* BIG 3D ECLIPSE TEXT */}
        <div className="mt-16 sm:mt-24 w-full flex justify-center overflow-hidden pb-4">
          <h1 
            className="font-serif-display font-black text-[#0c111d] leading-none tracking-tighter select-none"
            style={{ 
              fontSize: 'clamp(5rem, 18vw, 25rem)',
              textShadow: `
                1px 1px 0px #303443,
                2px 2px 0px #303443,
                3px 3px 0px #303443,
                4px 4px 0px #303443,
                5px 5px 0px #303443,
                6px 6px 0px #303443,
                7px 7px 0px #303443,
                8px 8px 0px #303443,
                9px 9px 0px #303443,
                10px 10px 0px #303443,
                11px 11px 15px rgba(0,0,0,0.3)
              `
            }}
          >
            ECLIPSE
          </h1>
        </div>
    </footer>
  );
}
