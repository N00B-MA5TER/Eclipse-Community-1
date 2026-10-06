"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SPLASH_DURATION = 1350;

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem("hasSeenSplashV2") || reduceMotion) setIsVisible(false);
    } catch {
      if (reduceMotion) setIsVisible(false);
    }
    setIsClient(true);
  }, [reduceMotion]);

  useEffect(() => {
    if (!isVisible) return;

    let frame = 0;
    const startedAt = performance.now();
    const updateProgress = (now: number) => {
      const next = Math.min(100, Math.round(((now - startedAt) / SPLASH_DURATION) * 100));
      setProgress(next);
      if (next >= 100) {
        try {
          sessionStorage.setItem("hasSeenSplashV2", "true");
        } catch {
          // The splash still completes when browser storage is unavailable.
        }
        window.setTimeout(() => setIsVisible(false), 100);
        return;
      }
      frame = window.requestAnimationFrame(updateProgress);
    };

    frame = window.requestAnimationFrame(updateProgress);
    return () => window.cancelAnimationFrame(frame);
  }, [isVisible]);

  if (!isClient) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="eclipse-splash"
          className="fixed inset-0 z-[99999] grid place-items-center overflow-hidden bg-[#090908] text-[#f7f2ed]"
          role="status"
          aria-label={`Loading Eclipse Community, ${progress}%`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="flex flex-col items-center"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-heading text-4xl font-medium tracking-[.28em] sm:text-6xl sm:tracking-[.32em]">ECLIPSE</p>
            <motion.span
              className="mt-5 h-px w-[clamp(52px,7vw,92px)] origin-left bg-[#ffad63]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: SPLASH_DURATION / 1000, ease: "linear" }}
              aria-hidden="true"
            />
          </motion.div>

          <span className="absolute bottom-6 right-6 font-mono-code text-2xl tabular-nums tracking-[.12em] text-white opacity-40 sm:bottom-10 sm:right-12 sm:text-3xl" aria-hidden="true">
            {String(progress).padStart(2, "0")} <span className="text-sm sm:text-base">%</span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
