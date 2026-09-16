import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "yellow" | "coral" | "indigo" | "outline" | "mint" | "muted";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "yellow",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-semibold",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  const variantStyles = {
    yellow: "bg-[#FFF3D6] text-[#9A6700] border border-amber-300/60 dark:bg-amber-950/60 dark:text-[#FFC94A] dark:border-amber-800/60",
    coral: "bg-[#FFEBE6] text-[#C93B1F] border border-rose-200/80 dark:bg-rose-950/60 dark:text-[#FF8A70] dark:border-rose-800/60",
    indigo: "bg-[#EEF0FB] text-[#3B3B98] border border-indigo-200/80 dark:bg-indigo-950/60 dark:text-[#A5B4FC] dark:border-indigo-850",
    mint: "bg-[#E6F9F0] text-[#065F46] border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-[#6EE7B7] dark:border-emerald-800/60",
    outline: "bg-transparent text-foreground border border-border",
    muted: "bg-muted text-muted-foreground border border-transparent",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg transition-colors select-none",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
