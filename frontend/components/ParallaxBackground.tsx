"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function ParallaxBackground() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 768 ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) return null;

  if (isMobile) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[48%] aspect-square rounded-full bg-orange-500/[0.035] dark:bg-orange-400/[0.045] blur-[80px]" />
        <div className="absolute top-[38%] right-[-15%] w-[42%] aspect-square rounded-full bg-amber-600/[0.035] dark:bg-amber-500/[0.045] blur-[80px]" />
      </div>
    );
  }

  return <DesktopParallaxBackground />;
}

function DesktopParallaxBackground() {
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 50, damping: 20, restDelta: 0.001 });
  const y1 = useTransform(smoothScrollY, [0, 3000], [0, 180]);
  const y2 = useTransform(smoothScrollY, [0, 3000], [0, -140]);
  const y3 = useTransform(smoothScrollY, [0, 3000], [0, 100]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] opacity-45">
      {/* Orb 1: Top Left */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-orange-500/[0.035] dark:bg-orange-400/[0.045] blur-[120px]"
      />
      
      {/* Orb 2: Middle Right */}
      <motion.div 
        style={{ y: y2 }}
        className="absolute top-[30%] right-[-15%] w-[45%] aspect-square rounded-full bg-amber-600/[0.035] dark:bg-amber-500/[0.045] blur-[120px]"
      />
      
      {/* Orb 3: Bottom Left */}
      <motion.div 
        style={{ y: y3 }}
        className="absolute top-[70%] left-[10%] w-[60%] aspect-square rounded-full bg-orange-600/[0.03] dark:bg-orange-500/[0.04] blur-[150px]"
      />
    </div>
  );
}
