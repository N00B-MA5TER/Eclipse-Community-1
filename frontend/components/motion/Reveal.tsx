"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type RevealProps = Omit<
  HTMLMotionProps<"div">,
  "initial" | "animate" | "whileInView" | "viewport" | "transition"
> & {
  delay?: number;
  distance?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
};

/** A small, accessible viewport reveal for content that should enter as it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  distance = 28,
  duration = 0.65,
  amount = 0.16,
  once = true,
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      {...props}
      initial={reduceMotion ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: reduceMotion ? 0 : duration, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}