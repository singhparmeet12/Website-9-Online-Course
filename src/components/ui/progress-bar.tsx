"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percentage: number;
  height?: number;
  className?: string;
  showText?: boolean;
  color?: "yellow" | "coral" | "indigo" | "mint";
}

export function ProgressBar({
  percentage = 0,
  height = 8,
  className,
  showText = false,
  color = "yellow",
}: ProgressBarProps) {
  const shouldReduceMotion = useReducedMotion();
  const safePercent = Math.min(100, Math.max(0, percentage));
  const [animatedPercent, setAnimatedPercent] = useState(shouldReduceMotion ? safePercent : 0);

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

  const colorVariants = {
    yellow: "bg-gradient-to-r from-amber-400 to-[#FFC94A]",
    coral: "bg-gradient-to-r from-orange-400 to-[#FF7A5C]",
    indigo: "bg-gradient-to-r from-[#3B3B98] to-indigo-500",
    mint: "bg-gradient-to-r from-emerald-500 to-[#10B981]",
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className="w-full overflow-hidden rounded-full bg-amber-100/60 dark:bg-indigo-950/60"
        style={{ height }}
        role="progressbar"
        aria-valuenow={safePercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            colorVariants[color]
          )}
          style={{ width: `${animatedPercent}%` }}
        />
      </div>
      {showText && (
        <div className="mt-1 flex justify-between text-xs text-muted-foreground font-medium">
          <span>Progress</span>
          <span>{Math.round(animatedPercent)}%</span>
        </div>
      )}
    </div>
  );
}
