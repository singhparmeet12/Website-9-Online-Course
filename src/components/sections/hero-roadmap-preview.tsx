"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Sparkles, Trophy, Play, Star } from "lucide-react";
import { StickyNote } from "@/components/ui/sticky-note";

export function HeroRoadmapPreview() {
  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 2400);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  const nodes = [
    {
      step: 0,
      title: "Foundations & Mental Model",
      badge: "Completed",
      type: "video",
      time: "18 mins",
    },
    {
      step: 1,
      title: "Streaming SSR & Suspense",
      badge: "In Progress",
      type: "reading",
      time: "24 mins",
    },
    {
      step: 2,
      title: "Optimistic Mutations & Actions",
      badge: "Unlocked",
      type: "quiz",
      time: "20 mins",
    },
    {
      step: 3,
      title: "Production Architecture Capstone",
      badge: "Final Goal",
      type: "project",
      time: "45 mins",
    },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Background ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#FFC94A]/20 via-[#3B3B98]/10 to-[#FF7A5C]/20 rounded-3xl blur-2xl -z-10 pointer-events-none" />

      {/* Main Roadmap Simulation Card */}
      <div className="rounded-3xl bg-card/95 border border-border p-6 sm:p-7 shadow-warm-lg backdrop-blur-sm space-y-6 relative overflow-hidden">
        {/* Header of Simulated Roadmap */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-indigo-950 flex items-center justify-center text-brand-indigo dark:text-brand-yellow font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-foreground">
                Next.js 14 Architecture
              </p>
              <p className="text-[11px] text-muted-foreground">Interactive Learning Trail</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/50">
            <span>65% Progress</span>
          </div>
        </div>

        {/* Stepper Nodes Path */}
        <div className="relative pl-6 space-y-5">
          {/* Vertical Dashed Trail Line */}
          <div
            className="absolute left-10 top-5 bottom-5 w-0.5 border-l-2 border-dashed border-border -z-0"
            aria-hidden="true"
          />

          {nodes.map((node, index) => {
            const isCompleted = index <= activeStep;
            const isCurrent = index === activeStep;

            return (
              <motion.div
                key={node.step}
                animate={{
                  scale: isCurrent ? 1.02 : 1,
                  opacity: isCompleted || isCurrent ? 1 : 0.65,
                }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex items-center gap-4 cursor-pointer"
                onClick={() => setActiveStep(index)}
              >
                {/* Milestone Node */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-heading font-bold text-xs transition-all duration-300 shadow-sm flex-shrink-0 ${
                    isCompleted
                      ? "bg-[#FFC94A] text-[#1C1C3A] ring-4 ring-[#FFC94A]/30"
                      : isCurrent
                      ? "bg-[#3B3B98] text-white ring-4 ring-brand-yellow ring-offset-2 ring-offset-background"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Node Detail Capsule */}
                <div
                  className={`flex-1 p-3 rounded-xl border transition-all text-xs ${
                    isCurrent
                      ? "bg-amber-50/80 dark:bg-indigo-950/50 border-[#FFC94A] shadow-sm font-semibold text-foreground"
                      : "bg-background/60 border-border text-foreground/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-foreground">
                      {node.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">{node.time}</span>
                  </div>
                  {isCurrent && (
                    <p className="text-[11px] text-brand-indigo dark:text-brand-yellow mt-0.5 font-medium flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current inline" /> Click to simulate next unlock
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Milestone Pop Celebration Banner */}
        <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-[#FFC94A]" />
            Milestone 2 Unlocked! +100 XP
          </span>
          <span className="font-handwriting text-base text-brand-coral font-bold">
            Almost to Certificate! 🎓
          </span>
        </div>
      </div>

      {/* Overlapping Sticky Note Accent */}
      <div className="absolute -bottom-6 -left-4 hidden sm:block">
        <StickyNote
          color="yellow"
          tilt={-3}
          pinColor="gold"
          className="text-xs py-2.5 px-3.5 shadow-md"
        >
          "15 mins a day builds real skills 🚀"
        </StickyNote>
      </div>
    </div>
  );
}
