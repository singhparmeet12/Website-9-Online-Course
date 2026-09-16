"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showText?: boolean;
  label?: string;
  accentColor?: "yellow" | "coral" | "indigo" | "mint";
}

export function ProgressRing({
  percentage = 0,
  size = 64,
  strokeWidth = 6,
  className,
  showText = true,
  label = "Course completion progress",
  accentColor = "yellow",
}: ProgressRingProps) {
  const shouldReduceMotion = useReducedMotion();
  const [animatedPercent, setAnimatedPercent] = useState(shouldReduceMotion ? percentage : 0);

  const safePercent = Math.min(100, Math.max(0, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPercent / 100) * circumference;

  useEffect(() => {
    if (shouldReduceMotion) {
      setAnimatedPercent(safePercent);
      return;
    }
    const timer = setTimeout(() => {
      setAnimatedPercent(safePercent);
    }, 150);
    return () => clearTimeout(timer);
  }, [safePercent, shouldReduceMotion]);

  const colorMap = {
    yellow: "text-[#FFC94A] dark:text-[#FFC94A]",
    coral: "text-[#FF7A5C] dark:text-[#FF7A5C]",
    indigo: "text-[#3B3B98] dark:text-[#818CF8]",
    mint: "text-[#10B981] dark:text-[#34D399]",
  };

  const ringStroke = safePercent >= 100 ? "text-[#10B981] dark:text-[#34D399]" : colorMap[accentColor];

  return (
    <div
      className={cn("relative inline-flex items-center justify-center select-none", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={safePercent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 transform"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          className="text-amber-100/70 dark:text-indigo-950/80 transition-colors"
          fill="transparent"
        />
        {/* Animated fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-700 ease-out", ringStroke)}
          fill="transparent"
        />
      </svg>
      {showText && (
        <span className="absolute text-center font-heading font-bold text-xs sm:text-sm text-foreground">
          {Math.round(animatedPercent)}%
        </span>
      )}
    </div>
  );
}
