"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StickyNoteProps {
  children: React.ReactNode;
  color?: "yellow" | "coral" | "cream" | "mint";
  tilt?: number; // degrees e.g. -2, 1.5, -3
  className?: string;
  pinColor?: "red" | "gold" | "blue" | "tape";
  badge?: string;
}

export function StickyNote({
  children,
  color = "yellow",
  tilt = -2,
  className,
  pinColor = "gold",
  badge,
}: StickyNoteProps) {
  const shouldReduceMotion = useReducedMotion();

  const colorStyles = {
    yellow: "bg-[#FFF6B0] text-[#1E1B4B] border-amber-200/70 dark:bg-[#FBE46D] dark:text-[#181830] dark:border-amber-400/50",
    coral: "bg-[#FFE7E1] text-[#7C200C] border-rose-200/70 dark:bg-[#FFC9BD] dark:text-[#5E1404] dark:border-rose-400/50",
    cream: "bg-[#FFF8EC] text-[#2A2A72] border-amber-100 dark:bg-[#25254B] dark:text-[#FFC94A] dark:border-indigo-900/60",
    mint: "bg-[#E6F9F0] text-[#065F46] border-emerald-200/70 dark:bg-[#A7F3D0] dark:text-[#064E3B] dark:border-emerald-400/50",
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.85, rotate: tilt * 2, opacity: 0 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { scale: 1, rotate: tilt, opacity: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.03, rotate: tilt * 0.7, y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={cn(
        "relative rounded-xl p-4 shadow-sticky border select-none transition-shadow hover:shadow-warm-lg",
        colorStyles[color],
        className
      )}
    >
      {/* Visual Tape or Pushpin Accent */}
      {pinColor === "tape" ? (
        <div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-5 bg-white/40 dark:bg-white/20 backdrop-blur-[1px] border border-white/50 rotate-[2deg] shadow-sm pointer-events-none rounded-[1px]"
          aria-hidden="true"
        />
      ) : (
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            className={cn(
              "w-3.5 h-3.5 rounded-full shadow-sm ring-1 ring-black/15",
              pinColor === "gold" && "bg-gradient-to-tr from-amber-500 to-yellow-300",
              pinColor === "red" && "bg-gradient-to-tr from-rose-600 to-coral-400",
              pinColor === "blue" && "bg-gradient-to-tr from-indigo-700 to-sky-400"
            )}
          />
        </div>
      )}

      {badge && (
        <span className="inline-block px-2 py-0.5 mb-1.5 text-[11px] font-bold uppercase tracking-wider bg-black/10 dark:bg-black/20 rounded-md font-sans">
          {badge}
        </span>
      )}

      <div className="font-handwriting text-lg sm:text-xl font-medium leading-snug">
        {children}
      </div>
    </motion.div>
  );
}
