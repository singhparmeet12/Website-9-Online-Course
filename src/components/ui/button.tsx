"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "indigo" | "coral" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();

    const baseStyles =
      "inline-flex items-center justify-center font-heading font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
      md: "h-11 px-5 text-sm gap-2 rounded-xl",
      lg: "h-13 px-7 text-base gap-2.5 rounded-2xl",
      icon: "h-10 w-10 p-0 rounded-xl",
    };

    const variantStyles = {
      primary:
        "bg-[#FFC94A] text-[#1E1B4B] hover:bg-[#F5B82E] shadow-sm hover:shadow-warm active:shadow-none focus-visible:ring-[#FFC94A] dark:bg-[#FFC94A] dark:text-[#181830] dark:hover:bg-[#F5B82E]",
      indigo:
        "bg-[#3B3B98] text-white hover:bg-[#2A2A72] shadow-sm hover:shadow-warm active:shadow-none focus-visible:ring-[#3B3B98] dark:bg-[#4E4EB8] dark:hover:bg-[#3B3B98]",
      coral:
        "bg-[#FF7A5C] text-white hover:bg-[#F26344] shadow-sm hover:shadow-warm active:shadow-none focus-visible:ring-[#FF7A5C]",
      secondary:
        "bg-amber-100/70 text-[#1E1B4B] hover:bg-amber-200/60 dark:bg-[#25254B] dark:text-[#F8FAFC] dark:hover:bg-[#2F2F5E]",
      outline:
        "border-2 border-indigo-200 bg-transparent text-[#1E1B4B] hover:bg-amber-50/70 dark:border-indigo-800/80 dark:text-[#F8FAFC] dark:hover:bg-[#25254B]",
      ghost:
        "bg-transparent text-foreground hover:bg-black/5 dark:hover:bg-white/10",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={shouldReduceMotion || disabled ? undefined : { scale: 0.97 }}
        whileHover={shouldReduceMotion || disabled ? undefined : { y: -1 }}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...(props as any)}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
