"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowRight,
  Code,
  Users,
  Target,
  TrendingUp,
  Globe,
  Lightbulb,
} from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const [stats, setStats] = useState({ builders: 120, corePillars: 5, openSource: 100 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api'}/stats/public`);
        if (res.ok) {
          const data = await res.json();
          setStats({
            builders: data.builders > 120 ? data.builders : 120,
            corePillars: data.corePillars || 5,
            openSource: data.openSource || 100
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#fff8f2] text-[#30231e] font-sans selection:bg-[#f4a261] selection:text-[#30231e] relative">
      <Navbar />
      <main className="w-full pt-0 bg-[#fff8f2] min-h-screen">
        <div className="flex flex-col w-full">
          {/* About masthead and manifesto */}
          <section
            className="border-b border-[#eadbd1] bg-[#fff8f2] px-4 sm:px-8 lg:px-12 py-10 lg:py-16 relative overflow-hidden"
            data-purpose="editorial-headline-banner"
          >
            <div className="max-w-[80rem] mx-auto flex flex-col gap-8 lg:gap-10">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#eadbd1]">
                <span className="inline-flex items-center gap-2 text-[#a9562d] font-mono text-[11px] uppercase tracking-[0.2em] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#f4a261]"></span>
                  WHO WE ARE
                </span>
                <span className="font-mono text-[11px] text-[#8d7770] uppercase tracking-[0.12em]">
                  DIATM · DURGAPUR, INDIA
                </span>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-1">
                <div>
                  <div className="font-mono text-[11px] text-[#a9562d] tracking-[0.18em] uppercase mb-3">
                    A STUDENT-LED TECHNOLOGY COMMUNITY
                  </div>
                  <h1 className="font-heading text-5xl sm:text-7xl xl:text-[5.5rem] font-semibold tracking-[-0.055em] text-[#30231e] leading-[0.98]">
                    About{" "}
                    <span className="font-normal text-[#a9562d]">
                      ECLIPSE
                    </span>
                  </h1>
                </div>
                <div className="lg:text-right font-mono text-[11px] text-[#8d7770] space-y-1.5 leading-relaxed">
                  <p className="font-semibold text-[#30231e] uppercase tracking-[0.08em]">
                    DURGAPUR INSTITUTE OF ADVANCED TECHNOLOGY &amp; MANAGEMENT
                  </p>
                  <p>
                    DEPARTMENT OF COMPUTER SCIENCE &amp; ENGINEERING / IT
                  </p>
                  <div className="mt-2 text-[#a9562d] tracking-[0.12em] uppercase">
                    CHAPTER ID: 155 · EST. 2026
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 border-t border-[#eadbd1] pt-8 lg:pt-10">
                <div className="lg:col-span-8 flex flex-col justify-between gap-9">
                  <div>
                    <div className="font-mono text-[10px] text-[#a9562d] uppercase tracking-[0.18em] mb-4">
                      OFFICIAL MANDATE &amp; MANIFESTO
                    </div>
                    <blockquote className="font-heading text-2xl sm:text-3xl lg:text-[2.6rem] text-[#30231e] leading-[1.18] font-medium tracking-[-0.035em] max-w-4xl mb-8">
                      “ECLIPSE is the Official Tech Community of DIATM — a
                      multidisciplinary ecosystem where technology,
                      creativity, research, and culture converge.”
                    </blockquote>

                    {/* Mission & Vision Added Content */}
                    <div className="space-y-4 font-sans text-[#715e55] text-sm md:text-base leading-relaxed max-w-3xl mb-8">
                      <p>
                        <strong className="text-[#30231e] font-semibold">
                          ECLIPSE
                        </strong>{" "}
                        empowers{" "}
                        <em className="font-serif italic font-medium text-[#30231e]">
                          thinkers, builders, researchers, and creators
                        </em>{" "}
                        through hands-on innovation, interdisciplinary
                        collaboration, experimentation, and real-world problem
                        solving.
                      </p>
                      <p>
                        We strive to{" "}
                        <em className="font-serif italic text-[#30231e]">
                          learn without limits, build without boundaries, and
                          challenge what already exists
                        </em>{" "}
                        — creating an ecosystem where every member has the freedom
                        to explore, fail, evolve, and create what comes next.
                      </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-[#eadbd1]">
                      <div className="font-mono text-[10px] text-[#a9562d] uppercase tracking-[0.18em] mb-4">
                        VISION STATEMENT
                      </div>
                      <blockquote className="font-heading text-xl sm:text-2xl font-bold leading-snug text-[#30231e] mb-6">
                        “ECLIPSE exists to build the future, not simply follow it.”
                      </blockquote>
                      <ul className="space-y-4 font-sans text-[#715e55] text-sm md:text-base leading-relaxed max-w-3xl list-none">
                        <li className="flex items-start">
                          <span className="mr-3 mt-1 text-[#f4a261]">■</span>
                          <span>
                            <strong className="text-[#30231e] font-bold uppercase tracking-wider text-xs">Converge & Speculate:</strong> 
                            <br/>Uniting computing, design, and hardware to architect speculative systems before industry demand materializes.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-3 mt-1 text-[#f4a261]">■</span>
                          <span>
                            <strong className="text-[#30231e] font-bold uppercase tracking-wider text-xs">Fearless Experimentation:</strong> 
                            <br/>Empowering builders to take high-stakes technical risks in autonomous sandboxes without fear of failure.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-3 mt-1 text-[#f4a261]">■</span>
                          <span>
                            <strong className="text-[#30231e] font-bold uppercase tracking-wider text-xs">Beyond Convention:</strong> 
                            <br/>Rejecting standard collegiate limitations to ship production-grade systems and published research globally.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="pt-5 border-t border-[#eadbd1] grid grid-cols-1 sm:grid-cols-3 gap-5 font-mono text-[11px] text-[#8d7770]">
                    <div>
                      <span className="block text-[#b49c90] uppercase tracking-[0.14em] mb-1">LOCATION</span>
                      <span className="font-semibold text-[#30231e]">Durgapur, WB</span>
                    </div>
                    <div>
                      <span className="block text-[#b49c90] uppercase tracking-[0.14em] mb-1">AFFILIATION</span>
                      <span className="font-semibold text-[#30231e]">Dept. of CSE &amp; IT</span>
                    </div>
                    <div>
                      <span className="block text-[#b49c90] uppercase tracking-[0.14em] mb-1">CHAPTER</span>
                      <span className="font-semibold text-[#30231e]">Chapter ID: 155</span>
                    </div>
                  </div>
                </div>
                <aside className="lg:col-span-4 lg:border-l lg:border-[#eadbd1] lg:pl-8 flex flex-col justify-between gap-6">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[#a9562d] uppercase tracking-[0.16em]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f4a261]"></span>
                    ACTIVE CHAPTER
                  </div>
                  <p className="font-sans text-sm sm:text-base text-[#715e55] leading-relaxed">
                    Centralized campus operating engine orchestrating
                    technological symposia, research clusters, and design
                    incubators.
                  </p>
                  <div className="pt-4 border-t border-[#eadbd1] flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-[#9b8478]">
                    <span>LAT: 23.5204° N</span>
                    <span>LONG: 87.3119° E</span>
                  </div>
                </aside>
              </div>
            </div>
          </section>
          {/*  Section 2: Lab & Cognition Showcase (Broadaheet Event-Style Framing)  */}
          <section className="w-full py-16 lg:py-20 bg-white border-b border-black">
            <div className="px-4 sm:px-8 lg:px-12 max-w-[80rem] mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3 pb-4 border-b border-black">
                <div>
                  <span className="font-mono text-xs text-black font-bold tracking-widest uppercase block mb-1">
                    ■ RESEARCH &amp; COMPUTATION
                  </span>
                  <h2 className="font-editorial-serif text-[32px] sm:text-[44px] font-bold tracking-tight text-black uppercase">
                    Collaborative Cognition
                  </h2>
                </div>
                <span className="font-mono text-xs uppercase font-bold text-neutral-500">
                  CAMPUS CENTRAL LAB // SPRINT ARCHIVE #04
                </span>
              </div>
              {/*  Sharp Black-Bordered Broadsheet Container  */}
              <div className="bg-white border border-black rounded-none p-6 lg:p-8 shadow-[6px_6px_0px_0px_#000000]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  {/*  Primary Photographic Plate  */}
                  <div className="lg:col-span-7 flex flex-col justify-between border border-black bg-black overflow-hidden relative group">
                    <div className="relative w-full aspect-video sm:aspect-[16/10] bg-black">
                      <img
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-500"
                        data-alt="DIATM Hack Lab Live Telemetry"
                        src="/zero-to-hackathon/photos/20260825_151418.jpg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                      <div className="absolute top-3 left-3 bg-white text-black font-mono text-[11px] font-bold uppercase tracking-wider px-3 py-1 border border-black flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
                        DIATM HACK-LAB // LIVE TELEMETRY
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/85 border border-white/20 text-white font-mono text-xs flex justify-between items-center">
                        <span>FIG 01.1 — SPRINT ARCHIVE #04</span>
                        <span className="text-[#f59e0b] font-bold">
                          CAMPUS CENTRAL LAB
                        </span>
                      </div>
                    </div>
                  </div>
                  {/*  Secondary Telemetry & Index Metrics  */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                    {/*  Secondary Photo Box  */}
                    <div className="border border-black overflow-hidden relative group bg-black">
                      <div className="relative w-full h-44 bg-neutral-900">
                        <img
                          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-all duration-500"
                          data-alt="Station 09 Telemetry"
                          src="/zero-to-hackathon/photos/20260825_154812.jpg"
                        />
                        <div className="absolute top-2 right-2 bg-white text-black border border-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                          STATION 09
                        </div>
                      </div>
                      <div className="p-2.5 bg-white border-t border-black flex items-center justify-between font-mono text-[11px] text-neutral-600">
                        <span>FIG 01.2 — ADVANCED RESEARCH SPACES</span>
                        <span className="font-bold text-black">
                          RUNTIME: 99.8%
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </section>
          {/*  Section 3: The 5 Foundational Pillars (Matching Screen 5's "Our Identity" Cards)  */}
          <section className="w-full py-16 lg:py-24 bg-white border-b border-black">
            <div className="px-4 sm:px-8 lg:px-12 max-w-[80rem] mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 pb-6 border-b border-black">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white rounded-none font-mono text-[11px] uppercase tracking-widest font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                    ■ CORE CONSTITUTION
                  </div>
                  <h2 className="font-editorial-serif text-[36px] sm:text-[48px] leading-tight font-bold tracking-tight text-black uppercase mt-3">
                    The Five Foundational Pillars
                  </h2>
                </div>
                <div className="text-left md:text-right max-w-md">
                  <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider block">
                    SYSTEMIC DIRECTIVES
                  </span>
                  <p className="font-sans text-xs text-neutral-600 mt-1">
                    A blueprint guiding club engineering, intellectual
                    exploration, and multidisciplinary culture across all
                    student cohorts.
                  </p>
                </div>
              </div>
              {/*  Cards Grid Styled with Sharp 1px Black Borders & Broadsheet Typography  */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/*  Pillar 01  */}
                <div className="group bg-white rounded-none p-7 border border-black shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all relative">
                  <span className="absolute top-3 right-3 font-mono text-[11px] text-neutral-400 font-bold">
                    01 / ARCHITECTURE
                  </span>
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-none bg-black text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">
                        layers
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] text-[#f59e0b] uppercase font-bold tracking-widest">
                        ECOSYSTEM
                      </span>
                      <h3 className="font-editorial-serif text-2xl font-bold text-black uppercase">
                        MULTIDISCIPLINARY BY DESIGN
                      </h3>
                    </div>
                    <p className="text-neutral-700 leading-relaxed pt-2 border-l-2 border-black pl-3 text-sm font-sans">
                      ECLIPSE unites technology, creativity, research, and
                      culture within a singular ecosystem—where disciplines
                      converge to shape ideas of greater depth and consequence.
                    </p>
                  </div>
                  <div className="pt-8 border-t border-neutral-200 mt-6 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-black group-hover:text-[#f59e0b] transition-colors">
                    <span>TRACK: CORE ECOSYSTEM</span>

                  </div>
                </div>
                {/*  Pillar 02  */}
                <div className="group bg-white rounded-none p-7 border border-black shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all relative">
                  <span className="absolute top-3 right-3 font-mono text-[11px] text-neutral-400 font-bold">
                    02 / EXECUTION
                  </span>
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-none bg-black text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">
                        terminal
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] text-[#f59e0b] uppercase font-bold tracking-widest">
                        PRACTICE
                      </span>
                      <h3 className="font-editorial-serif text-2xl font-bold text-black uppercase">
                        DRIVEN BY CREATION
                      </h3>
                    </div>
                    <p className="text-neutral-700 leading-relaxed pt-2 border-l-2 border-black pl-3 text-sm font-sans">
                      We transform curiosity into capability and knowledge into
                      execution—cultivating a culture of building,
                      experimentation, and meaningful innovation.
                    </p>
                  </div>
                  <div className="pt-8 border-t border-neutral-200 mt-6 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-black group-hover:text-[#f59e0b] transition-colors">
                    <span>TRACK: LAB PRACTICE</span>

                  </div>
                </div>
                {/*  Pillar 03  */}
                <div className="group bg-white rounded-none p-7 border border-black shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all relative">
                  <span className="absolute top-3 right-3 font-mono text-[11px] text-neutral-400 font-bold">
                    03 / COLLABORATION
                  </span>
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-none bg-black text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">
                        hub
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] text-[#f59e0b] uppercase font-bold tracking-widest">
                        SYNERGY
                      </span>
                      <h3 className="font-editorial-serif text-2xl font-bold text-black uppercase">
                        CONVERGENCE OF EXPERTISE
                      </h3>
                    </div>
                    <p className="text-neutral-700 leading-relaxed pt-2 border-l-2 border-black pl-3 text-sm font-sans">
                      Engineers, researchers, designers, creators, and
                      entrepreneurs collaborate across boundaries—bringing
                      distinct perspectives together to produce exceptional
                      work.
                    </p>
                  </div>
                  <div className="pt-8 border-t border-neutral-200 mt-6 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-black group-hover:text-[#f59e0b] transition-colors">
                    <span>TRACK: SYNERGISTIC FLOW</span>

                  </div>
                </div>
                {/*  Pillar 04 (Spans 2 cols on lg)  */}
                <div className="group bg-white rounded-none p-7 border border-black shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all relative md:col-span-2 lg:col-span-2">
                  <span className="absolute top-3 right-3 font-mono text-[11px] text-neutral-400 font-bold">
                    04 / INITIATIVES
                  </span>
                  <div className="space-y-4 max-w-2xl">
                    <div className="w-10 h-10 rounded-none bg-black text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">
                        rocket_launch
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] text-[#f59e0b] uppercase font-bold tracking-widest">
                        EXTENSION
                      </span>
                      <h3 className="font-editorial-serif text-2xl font-bold text-black uppercase">
                        BEYOND THE ACADEMIC FRAMEWORK
                      </h3>
                    </div>
                    <p className="text-neutral-700 leading-relaxed pt-2 border-l-2 border-black pl-3 text-base font-sans">
                      Through research, projects, hackathons, showcases,
                      creative initiatives, and industry engagement, ECLIPSE
                      extends learning into experience, application, and impact.
                    </p>
                  </div>
                  <div className="pt-8 border-t border-neutral-200 mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="px-2 py-0.5 border border-black bg-neutral-100 text-black font-bold">
                        HACKATHONS
                      </span>
                      <span className="px-2 py-0.5 border border-black bg-neutral-100 text-black font-bold">
                        PAPER WRITING
                      </span>
                      <span className="px-2 py-0.5 border border-black bg-neutral-100 text-black font-bold">
                        PRODUCT LABS
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-black group-hover:text-[#f59e0b] transition-colors">
                      <span>DISCOVER INITIATIVES</span>
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </div>
                {/*  Pillar 05  */}
                <div className="group bg-white rounded-none p-7 border border-black shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all relative">
                  <span className="absolute top-3 right-3 font-mono text-[11px] text-neutral-400 font-bold">
                    05 / HORIZON
                  </span>
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-none bg-black text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">
                        visibility
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] text-[#f59e0b] uppercase font-bold tracking-widest">
                        PERSPECTIVE
                      </span>
                      <h3 className="font-editorial-serif text-2xl font-bold text-black uppercase">
                        SHAPING WHAT COMES NEXT
                      </h3>
                    </div>
                    <p className="text-neutral-700 leading-relaxed pt-2 border-l-2 border-black pl-3 text-sm font-sans">
                      We challenge convention, embrace emerging possibilities,
                      and empower students to create with ambition, originality,
                      and purpose—preparing not merely for the future, but to
                      influence it.
                    </p>
                  </div>
                  <div className="pt-8 border-t border-neutral-200 mt-6 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-black group-hover:text-[#f59e0b] transition-colors">
                    <span>TRACK: FUTURE PROTOCOLS</span>

                  </div>
                </div>
              </div>
            </div>
          </section>
          {/*  Section 4: Operational Radar & Telemetry Matrix (Crisp Broadsheet Grid)  */}
          <section className="w-full py-16 lg:py-20 bg-white border-b border-black">
            <div className="px-4 sm:px-8 lg:px-12 max-w-[80rem] mx-auto space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-black"></div>
                  <h2 className="font-editorial-serif text-2xl sm:text-3xl font-bold tracking-tight text-black uppercase">
                    Operational Radar &amp; Telemetry Matrix
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-black bg-neutral-100 font-mono text-xs font-bold text-black">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping"></span>
                  <span>CAMPUS STATUS: ACTIVE</span>
                </div>
              </div>
              {/*  3 Sharp Black-Bordered Cards  */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/*  Tile 1: Member Roster  */}
                <div className="bg-white border border-black rounded-none p-6 shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-neutral-500 font-mono text-[11px] uppercase font-bold mb-4 pb-2 border-b border-neutral-200">
                      <span className="flex items-center gap-1.5 text-black">
                        <span className="w-1.5 h-1.5 bg-[#f59e0b]"></span>{" "}
                        MEMBER ROSTER
                      </span>
                      <span className="material-symbols-outlined text-[18px] text-black">
                        group
                      </span>
                    </div>
                    <div className="font-editorial-serif text-3xl font-bold text-black">
                      14+ Members
                    </div>
                    <p className="font-sans text-xs text-neutral-600 mt-2 leading-relaxed">
                      Cross-disciplinary engineers, UI/UX architects, ML
                      practitioners, and systems enthusiasts representing DIATM
                      batch cohorts.
                    </p>
                  </div>
                </div>
                {/*  Tile 2: Primary Vectors  */}
                <div className="bg-white border border-black rounded-none p-6 shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-neutral-500 font-mono text-[11px] uppercase font-bold mb-4 pb-2 border-b border-neutral-200">
                      <span className="flex items-center gap-1.5 text-black">
                        <span className="w-1.5 h-1.5 bg-[#f59e0b]"></span>{" "}
                        PRIMARY VECTORS
                      </span>
                      <span className="material-symbols-outlined text-[18px] text-black">
                        category
                      </span>
                    </div>
                    <span className="font-editorial-serif text-3xl font-bold text-black block">
                      5 Dedicated Tracks
                    </span>
                    <div className="flex flex-wrap gap-2 mt-4 font-mono text-[10px]">
                      <span className="px-2 py-1 border border-black bg-white font-bold text-black">
                        SYSTEMS
                      </span>
                      <span className="px-2 py-1 border border-black bg-white font-bold text-black">
                        AI / ML
                      </span>
                      <span className="px-2 py-1 border border-black bg-white font-bold text-black">
                        HARDWARE &amp; IOT
                      </span>
                      <span className="px-2 py-1 border border-black bg-white font-bold text-black">
                        DESIGN &amp; UI
                      </span>
                      <span className="px-2 py-1 border border-black bg-white font-bold text-black">
                        WEB3 &amp; DISTRIBUTED
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-neutral-200 mt-6 font-mono text-xs text-neutral-600 flex items-center justify-between">
                    <span>SPECIALIZED LABS</span>
                    <span className="text-black font-bold bg-[#f59e0b] px-1.5 py-0.5">
                      ALL ONLINE
                    </span>
                  </div>
                </div>
                {/*  Tile 3: Admissions Telemetry  */}
                <div className="bg-white border border-black rounded-none p-6 shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-neutral-500 font-mono text-[11px] uppercase font-bold mb-4 pb-2 border-b border-neutral-200">
                      <span className="flex items-center gap-1.5 text-black">
                        <span className="w-1.5 h-1.5 bg-[#f59e0b]"></span>{" "}
                        COMMUNITY EVENTS
                      </span>
                      <span className="material-symbols-outlined text-[18px] text-black">
                        event
                      </span>
                    </div>
                    <span className="font-editorial-serif text-3xl font-bold text-black block">
                      Build & Innovate
                    </span>
                    <p className="font-sans text-xs text-neutral-600 mt-2 leading-relaxed">
                      Engage in high-octane hackathons, technical workshops, and weekly meetups designed to push your boundaries.
                    </p>
                  </div>
                  <div className="pt-6 border-t border-neutral-200 mt-6">
                    <a
                      href="/gallery/events"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 border border-black bg-black text-white hover:bg-[#f59e0b] hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-[2px_2px_0px_0px_#000000] hover:shadow-none"
                    >
                      <span>EVENT GALLERY</span>
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_outward
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/*  Section 5: Callout Admission Banner (Exact Screen 5 Architectural Broadsheet Match)  */}
          <section className="w-full py-16 bg-white border-b border-black">
            <div className="px-4 sm:px-8 lg:px-12 max-w-[80rem] mx-auto">
              <div className="bg-[#0c111d] text-white rounded-none p-8 sm:p-12 lg:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-[#0c111d] shadow-[8px_8px_0px_0px_#f59e0b]">
                <div className="space-y-4 max-w-xl relative z-10">
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 text-[#f59e0b] font-mono text-[11px] font-bold uppercase tracking-widest border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-ping"></span>
                    ■ ADMISSIONS OPEN // COHORT 2026
                  </span>
                  <h2 className="font-editorial-serif text-[30px] sm:text-[44px] leading-tight font-bold tracking-tight uppercase text-white">
                    Ready to Outshine the Ordinary?
                  </h2>
                  <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                    Join DIATM’s premier tech society. Gain direct access to
                    hackathon teams, industry mentoring, research pipelines, and
                    high-velocity project collabs.
                  </p>
                  <div className="pt-4 flex flex-wrap items-center gap-4 text-neutral-400 font-mono text-[10px] uppercase tracking-widest">
                    <span>COHORT CYCLE: 2026.01</span>
                    <span>•</span>
                    <span>LOCATION: DIATM CAMPUS, RAJBANDH</span>
                    <span>•</span>
                    <span>STATUS: ACCEPTING DOSSIERS</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full md:w-auto">
                  <a
                    className="w-full sm:w-auto text-center px-8 py-4 bg-[#f59e0b] text-black font-mono text-xs font-bold uppercase tracking-wider rounded-none hover:bg-white transition-all shadow-[3px_3px_0px_0px_#ffffff] hover:shadow-none"
                    data-path="membership"
                    href="#"
                  >
                    REGISTER NOW
                  </a>
                  <a
                    className="w-full sm:w-auto text-center px-7 py-4 bg-transparent hover:bg-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-none transition-all border border-white"
                    data-path="contact"
                    href="#"
                  >
                    CONTACT US
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
