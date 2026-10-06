"use client";

import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Compass, MoveUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const storyBeats = [
  { label: "01 / START SOMEWHERE", lineOne: "Bring the rough", lineTwo: "draft.", description: "Ideas are welcome before they’re polished. Curiosity is enough to get started." },
  { label: "02 / MAKE IT REAL", lineOne: "Build something", lineTwo: "you can test.", description: "Pair up, try a tool, and make a first version. Learning gets clearer when there’s something real to explore." },
  { label: "03 / SHARE THE WORK", lineOne: "Let the work", lineTwo: "teach you.", description: "Show what worked and what didn’t. Each attempt gives the next one a better starting point." },
  { label: "04 / OPEN THE DOOR", lineOne: "Leave a way", lineTwo: "in.", description: "Document what you learned, invite someone along, and make the next build easier to begin." },
  { label: "05 / KEEP IT MOVING", lineOne: "Good work", lineTwo: "travels.", description: "Projects become starting points for other people. That’s how a student community gets stronger." },
];

function EclipseScrollStory({ reduceMotion }: { reduceMotion: boolean | null }) {
  const storyRef = useRef<HTMLElement>(null);
  const [storyStep, setStoryStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ["start start", "end end"] });
  const storyBackground = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], ["#0b0a09", "#15100d", "#29190f", "#21140f", "#110d0b", "#0b0a09"]);
  useMotionValueEvent(scrollYProgress, "change", (latest) => setStoryStep(Math.min(storyBeats.length - 1, Math.floor(latest * storyBeats.length))));

  if (reduceMotion) return (
    <section className="bg-[#0b0a09] px-6 py-24 text-white sm:px-10 sm:py-32" aria-label="ECLIPSE community story">
      <div className="mx-auto max-w-[1120px]">
        <p className="font-mono-code text-[10px] uppercase tracking-[.2em] text-[#ffb36c]">A story of making, together</p>
        <h2 className="mt-5 max-w-4xl font-heading text-5xl font-medium leading-[.98] tracking-[-.06em] sm:text-7xl">{storyBeats[2].lineOne}<br /><span className="text-[#ffb36c]">{storyBeats[2].lineTwo}</span></h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/70">{storyBeats[2].description}</p>
        <ol className="mt-16 grid gap-6 border-t border-white/15 pt-6 sm:grid-cols-2 lg:grid-cols-5">{storyBeats.map((beat) => <li key={beat.label}><span className="font-mono-code text-[9px] uppercase tracking-[.14em] text-white/45">{beat.label}</span><p className="mt-2 text-sm text-white/75">{beat.lineOne} {beat.lineTwo}</p></li>)}</ol>
      </div>
    </section>
  );

  return (
    <section ref={storyRef} className="relative h-[500svh] bg-[#0b0a09]" aria-label="Scroll through the ECLIPSE community story">
      <motion.div className="sticky top-0 flex h-svh min-h-[600px] items-center overflow-hidden text-white" style={{ backgroundColor: storyBackground }}>
        <motion.div className="absolute inset-x-0 top-0 h-px origin-left bg-[#ffad63] shadow-[0_0_12px_rgba(255,173,99,.65)]" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
        <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-center px-6 sm:px-10 lg:px-16">
          <div className="mb-7 flex items-center justify-between gap-4 font-mono-code text-[9px] uppercase tracking-[.18em] text-white/45 sm:text-[10px]"><span>A story of making, together</span><span>{String(storyStep + 1).padStart(2, "0")} <i className="px-1 not-italic text-white/25">/</i> 05</span></div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={storyStep} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} aria-live="polite">
              <p className="font-mono-code text-[10px] uppercase tracking-[.2em] text-[#ffb36c]">{storyBeats[storyStep].label}</p>
              <h2 className="mt-6 max-w-5xl font-heading text-[clamp(3.1rem,9vw,8.5rem)] font-medium leading-[.92] tracking-[-.07em] sm:mt-8"><span className="block">{storyBeats[storyStep].lineOne}</span><span className="block text-[#ffb36c]">{storyBeats[storyStep].lineTwo}</span></h2>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/65 sm:mt-9 sm:text-lg sm:leading-8">{storyBeats[storyStep].description}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-16 h-px w-full bg-white/10 sm:mt-20"><motion.div className="h-full origin-left bg-[#ffad63]" style={{ scaleX: scrollYProgress }} /></div>
          <p className="mt-4 font-mono-code text-[9px] uppercase tracking-[.16em] text-white/40">Keep scrolling to follow the story <ArrowDown className="ml-2 inline" size={12} /></p>
        </div>
      </motion.div>
    </section>
  );
}

export default function Home() {
  const { user } = useAuth();
  const reduceMotion = useReducedMotion();
  return (
    <div className="home-experience min-h-screen bg-[#fff8f2] text-[#32231d] antialiased selection:bg-[#ffb36c] selection:text-[#32231d]">
      <Navbar />
      <>
        <section className="zero-hero relative isolate min-h-svh overflow-hidden bg-[#0b0a09] text-white" aria-labelledby="hero-title">
          <div className="zero-water" aria-hidden="true" /><div className="zero-grain" aria-hidden="true" />
          <div className="relative z-10 mx-auto flex min-h-svh max-w-[1600px] flex-col justify-between px-5 pb-6 pt-28 sm:px-10 sm:pb-9 sm:pt-32 lg:px-16">
            <div className="flex items-start justify-between gap-4 font-mono-code text-[10px] font-medium uppercase tracking-[.2em] text-white/75 sm:text-xs"><div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#ffb36c] shadow-[0_0_14px_#ffb36c]" /> DIATM · STUDENT BUILDER COMMUNITY</div><div className="hidden text-right sm:block">DURGAPUR, INDIA <span className="mx-2 text-white/35">/</span> SINCE 2022</div></div>
            <div className="grid items-end gap-8 pb-10 pt-16 md:grid-cols-[minmax(0,1fr)_minmax(220px,310px)] md:pb-12 lg:gap-16">
              <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .8, ease: [0.22, 1, .36, 1] }}>
                <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.04] px-3.5 py-2 font-mono-code text-[9px] uppercase tracking-[.16em] text-white/75 sm:text-[10px]"><Compass size={13} className="text-[#ffb36c]" /> A place to find your next thing</p>
                <h1 id="hero-title" className="max-w-5xl font-heading text-[clamp(3.7rem,10vw,9.5rem)] font-semibold leading-[.83] tracking-[-.085em]">Make room<br /><span className="text-[#ffb36c]">for what’s</span><br />possible.</h1>
                <p className="mt-7 max-w-2xl text-base leading-7 text-white/70 sm:mt-9 sm:text-lg sm:leading-8">ECLIPSE is where curious students learn by making, turn rough ideas into real projects, and find people to build the next thing with.</p>
                <p className="mt-5 font-heading text-sm font-semibold tracking-[.08em] text-white sm:text-base">LEARN. BUILD. BREAK. REPEAT.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/events/point-break/register" className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#f59e0b] px-6 text-sm font-bold text-[#0c111d] transition-transform hover:-translate-y-0.5 ring-2 ring-offset-2 ring-offset-[#0b0a09] ring-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.5)]">🔥 POINT BREAK REGISTRATION <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
                  <Link href={user ? "/dashboard" : "/register"} className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#ffb36c] px-6 text-sm font-semibold text-[#2c1c13] transition-transform hover:-translate-y-0.5">Find your people <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
                  <Link href="/projects" className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:border-white/70 hover:bg-white/[.06]">See what we make <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
                </div>
              </motion.div>
              <motion.div className="hidden justify-self-end text-right md:block" initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .7, delay: reduceMotion ? 0 : .2 }}><p className="font-mono-code text-[9px] uppercase tracking-[.19em] text-white/40">A community in motion</p><p className="mt-3 font-heading text-lg font-medium text-white/85">Ideas become things<br />worth sharing.</p><Link href="/about" className="mt-5 inline-flex items-center gap-2 font-mono-code text-[9px] uppercase tracking-[.15em] text-[#ffb36c] hover:text-white">Discover ECLIPSE <MoveUpRight size={13} /></Link></motion.div>
            </div>
            <div className="flex items-center justify-between border-t border-white/20 pt-4 font-mono-code text-[9px] uppercase tracking-[.15em] text-white/50"><span>There’s more beneath the surface</span><span className="inline-flex items-center gap-2">Scroll to explore <ArrowDown size={13} /></span></div>
          </div>
        </section>
        <EclipseScrollStory reduceMotion={reduceMotion} />
        <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:py-12">
        {/* SECTION 01: OUR IDENTITY */}
        <section className="border-b border-[#eadbd1] py-20 sm:py-28" id="about">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-[#eadbd1] pb-7 sm:mb-12">
            <div>
              <p className="font-mono-code text-[10px] uppercase tracking-[.2em] text-[#b85a2b]">01 / What brings us together</p>
              <h2 className="mt-4 max-w-3xl font-heading text-4xl font-medium leading-[1.02] tracking-[-.06em] text-[#32231d] sm:text-6xl">Curiosity is a good place<br className="hidden sm:block" /> to start.</h2>
            </div>
            <span className="pb-1 font-mono-code text-[10px] uppercase tracking-[.14em] text-[#78685e]">ECLIPSE · DIATM</span>
          </div>
          <p className="mb-9 max-w-3xl text-base leading-7 text-[#78685e] sm:text-lg sm:leading-8">A student-led tech community at DIATM, built around peer mentorship, hands-on practice, and the belief that you learn a lot by making something real.</p>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="group flex min-h-[275px] flex-col rounded-[20px] border border-[#eadbd1] bg-[#fffdfb] p-6 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#e9b99d] hover:shadow-[0_18px_40px_rgba(66,39,25,.07)] sm:p-8">
              <div className="flex items-center justify-between font-mono-code text-[10px] uppercase tracking-[.16em] text-[#a38e80]"><span>01 / Foundational</span><span className="text-[#b85a2b]">↗</span></div>
              <h3 className="mt-10 font-heading text-2xl font-medium tracking-[-.04em] text-[#32231d]">Who We Are</h3>
              <p className="mt-3 text-sm leading-6 text-[#78685e]">A collegiate community where students explore technology, share what they know, and learn by making together.</p>
              <p className="mt-5 border-t border-[#f0e6df] pt-4 text-xs italic text-[#9a8577]">“Autonomous learning through collective execution.”</p>
              <Link className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-[#a94d25] transition-colors hover:text-[#68351f]" href="/about">Discover who we are <ArrowUpRight size={15} /></Link>
            </article>
            <article className="group flex min-h-[275px] flex-col rounded-[20px] border border-[#eadbd1] bg-[#fffdfb] p-6 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#e9b99d] hover:shadow-[0_18px_40px_rgba(66,39,25,.07)] sm:p-8" id="mission">
              <div className="flex items-center justify-between font-mono-code text-[10px] uppercase tracking-[.16em] text-[#a38e80]"><span>02 / Practice</span><span className="text-[#b85a2b]">↗</span></div>
              <h3 className="mt-10 font-heading text-2xl font-medium tracking-[-.04em] text-[#32231d]">Our Mission</h3>
              <p className="mt-3 text-sm leading-6 text-[#78685e]">Turn classroom ideas into useful software and hardware through student sprints, hackathons, and technical bootcamps.</p>
              <p className="mt-5 border-t border-[#f0e6df] pt-4 text-xs italic text-[#9a8577]">“Bridging academia and modern engineering.”</p>
              <Link className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-[#a94d25] transition-colors hover:text-[#68351f]" href="/about">Explore our mission <ArrowUpRight size={15} /></Link>
            </article>
            <article className="group flex min-h-[275px] flex-col rounded-[20px] border border-[#eadbd1] bg-[#fffdfb] p-6 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#e9b99d] hover:shadow-[0_18px_40px_rgba(66,39,25,.07)] sm:p-8" id="vision">
              <div className="flex items-center justify-between font-mono-code text-[10px] uppercase tracking-[.16em] text-[#a38e80]"><span>03 / Horizon</span><span className="text-[#b85a2b]">↗</span></div>
              <h3 className="mt-10 font-heading text-2xl font-medium tracking-[-.04em] text-[#32231d]">Our Vision</h3>
              <p className="mt-3 text-sm leading-6 text-[#78685e]">Grow DIATM into a hub for student innovation, competitive programming, and open-source work with real-world value.</p>
              <p className="mt-5 border-t border-[#f0e6df] pt-4 text-xs italic text-[#9a8577]">“Building institutions that outlast four-year degrees.”</p>
              <Link className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-[#a94d25] transition-colors hover:text-[#68351f]" href="/about">Read our vision <ArrowUpRight size={15} /></Link>
            </article>
          </div>
        </section>

        {/* SECTION 02: SUCCESSFUL EVENTS */}
        <section className="border-b border-[#eadbd1] py-20 sm:py-28" id="achievements">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-[#eadbd1] pb-7 sm:mb-12">
            <div><p className="font-mono-code text-[10px] uppercase tracking-[.2em] text-[#b85a2b]">02 / Work in the world</p><h2 className="mt-4 max-w-3xl font-heading text-4xl font-medium leading-[1.02] tracking-[-.06em] text-[#32231d] sm:text-6xl">Good ideas deserve<br className="hidden sm:block" /> a real first build.</h2></div>
            <span className="pb-1 font-mono-code text-[10px] uppercase tracking-[.14em] text-[#78685e]">Selected community work</span>
          </div>

          <article className="grid overflow-hidden rounded-[22px] border border-[#eadbd1] bg-[#fffdfb] lg:grid-cols-[1.08fr_.92fr]">
            <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2 font-mono-code text-[10px] uppercase tracking-[.14em]">
                  <span className="text-[#b85a2b]">Annual flagship sprint</span><span className="text-[#c9b7aa]">·</span><span className="text-[#927f72]">Concluded Feb 2026</span>
                </div>
                <h3 className="mb-4 font-heading text-3xl font-medium leading-tight tracking-[-.045em] text-[#32231d] sm:text-4xl">
                  Zero to Hackathon: Build and Break
                </h3>
                <p className="mb-8 max-w-2xl text-sm leading-7 text-[#78685e] sm:text-base sm:leading-8">
                  A 24-hour sprint that immersed students from first-year basics through building fully operational full-stack web and IoT prototypes. 36 projects were judged by industry alumni from leading tech giants.
                </p>
                <div className="grid grid-cols-3 border-y border-[#eadbd1] py-5">
                  <div className="text-left">
                    <p className="font-heading text-2xl font-medium text-[#32231d]">120+</p>
                    <p className="mt-1 font-mono-code text-[9px] uppercase tracking-[.12em] text-[#927f72]">Builders</p>
                  </div>
                  <div className="border-l border-[#eadbd1] pl-5">
                    <p className="font-heading text-2xl font-medium text-[#32231d]">36</p>
                    <p className="mt-1 font-mono-code text-[9px] uppercase tracking-[.12em] text-[#927f72]">Projects</p>
                  </div>
                  <div className="border-l border-[#eadbd1] pl-5">
                    <p className="font-heading text-2xl font-medium text-[#32231d]">24h</p>
                    <p className="mt-1 font-mono-code text-[9px] uppercase tracking-[.12em] text-[#927f72]">Continuous</p>
                  </div>
                </div>
              </div>
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <span className="font-mono-code text-[10px] uppercase tracking-[.1em] text-[#927f72]">Winner · Team Cyber-Synthesis</span>
                <Link className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#41271c] px-5 text-sm font-medium text-white transition-colors hover:bg-[#b85a2b]" href="/gallery/events">
                  View event recap <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
            <div className="relative min-h-[300px] overflow-hidden bg-[#f0e6df] lg:min-h-[500px]">
              <div className="absolute inset-0 bg-cover bg-center grayscale transition-[filter,transform] duration-700 hover:scale-[1.02] hover:grayscale-0" style={{ backgroundImage: "url('/zero-to-hackathon/photos/20260825_151418.jpg')" }} role="img" aria-label="ECLIPSE students presenting at the Zero to Hackathon event" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1b120e]/65 to-transparent px-6 pb-6 pt-20 font-mono-code text-[9px] uppercase tracking-[.14em] text-white/80 sm:px-8 sm:pb-8">Zero to Hackathon · Event 04</div>
            </div>
          </article>
        </section>


        {/* SECTION 05: COMPACT CENTERED COLLEGIATE ANNOUNCEMENT BLOCK */}
        <section className="py-14" id="register">
          <div className="bg-[#0c111d] text-[#fcfbf9] border-2 border-[#0c111d] p-8 sm:p-12 text-center relative overflow-hidden shadow-[8px_8px_0px_0px_#f59e0b] max-w-4xl mx-auto">
            <div className="absolute -right-10 -top-10 opacity-10 z-0">
              <span className="text-[120px] font-mono-code leading-none">[]</span>
            </div>

            <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-[#fcfbf9] leading-tight mb-4">
              Ready to outshine the ordinary?
            </h2>
            <p className="font-body-lg text-[#e6ebf4] text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Join the collective. Whether you build compilers, design systems, configure circuits, or craft communities, Ecllipse is where DIATM builds the future.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link 
                className="h-12 px-8 bg-[#f59e0b] text-[#0c111d] font-mono-code text-xs font-black uppercase tracking-wider flex items-center justify-center hover:bg-[#fbbf24] transition-colors border border-[#f59e0b]" 
                href={user ? "/dashboard" : "/register"}
              >
                {user ? "GO TO DASHBOARD" : "REGISTER NOW"}
              </Link>
              <Link 
                className="h-12 px-6 border border-[#fcfbf9] text-[#fcfbf9] font-mono-code text-xs font-bold uppercase tracking-wider flex items-center justify-center hover:bg-[#ffffff]/10 transition-colors" 
                href="/about"
              >
                READ CLUB CONSTITUTION
              </Link>
            </div>
          </div>
        </section>
      </main>

      </>
      <Footer />
    </div>
  );
}
