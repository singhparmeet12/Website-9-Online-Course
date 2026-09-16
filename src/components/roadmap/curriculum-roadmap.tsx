"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  Lock,
  Play,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Compass,
  Code,
  Layout,
  Database,
  Rocket,
  Award,
  Clock,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LessonModal, LessonData } from "./lesson-modal";
import { triggerMilestoneCelebration } from "./confetti-celebration";

export interface RoadmapLesson extends LessonData {}

export interface RoadmapModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  description: string;
  icon: string;
  lessons: RoadmapLesson[];
}

interface CurriculumRoadmapProps {
  courseId: string;
  courseTitle: string;
  modules: RoadmapModule[];
  isEnrolled: boolean;
  onEnroll?: () => Promise<void>;
  onLessonUpdate?: () => void;
  className?: string;
}

export function CurriculumRoadmap({
  courseId,
  courseTitle,
  modules = [],
  isEnrolled,
  onEnroll,
  onLessonUpdate,
  className,
}: CurriculumRoadmapProps) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedLesson, setSelectedLesson] = useState<RoadmapLesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(
    modules[0]?.id || null
  );
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Compute overall stats
  const allLessons = modules.flatMap((m) => m.lessons);
  const completedLessons = allLessons.filter((l) => l.isCompleted);
  const totalLessons = allLessons.length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  // Compute status for each module
  const moduleStatuses = modules.map((module, index) => {
    const totalInMod = module.lessons.length;
    const completedInMod = module.lessons.filter((l) => l.isCompleted).length;
    const isCompleted = totalInMod > 0 && completedInMod === totalInMod;

    // A module is unlocked if it's the first module or if the previous module has at least 1 lesson completed
    const prevModule = index > 0 ? modules[index - 1] : null;
    const isUnlocked =
      index === 0 ||
      (prevModule && prevModule.lessons.some((l) => l.isCompleted)) ||
      completedInMod > 0;

    const isCurrent = !isCompleted && isUnlocked;
    const isLocked = !isUnlocked;

    return {
      ...module,
      totalInMod,
      completedInMod,
      isCompleted,
      isCurrent,
      isLocked,
    };
  });

  const handleOpenLesson = (lesson: RoadmapLesson, moduleTitle: string) => {
    setSelectedLesson({ ...lesson, moduleTitle });
    setIsModalOpen(true);
  };

  const handleToggleLessonComplete = async (lessonId: string, targetState: boolean) => {
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          courseId,
          completed: targetState,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update progress");
      }

      const data = await res.json();

      // Update local lesson state
      if (selectedLesson && selectedLesson.id === lessonId) {
        setSelectedLesson({
          ...selectedLesson,
          isCompleted: targetState,
        });
      }

      if (data.milestoneUnlocked) {
        triggerMilestoneCelebration();
      }

      if (onLessonUpdate) {
        onLessonUpdate();
      }

      return { milestoneUnlocked: data.milestoneUnlocked };
    } catch (err) {
      console.error(err);
      return {};
    }
  };

  const handleEnrollClick = async () => {
    if (!onEnroll) return;
    setIsEnrolling(true);
    try {
      await onEnroll();
    } finally {
      setIsEnrolling(false);
    }
  };

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case "compass":
        return Compass;
      case "code":
        return Code;
      case "layout":
        return Layout;
      case "database":
        return Database;
      case "rocket":
        return Rocket;
      case "award":
        return Award;
      default:
        return Compass;
    }
  };

  return (
    <div className={cn("w-full space-y-8", className)}>
      {/* Top Roadmap Summary Bar */}
      <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 bg-card border border-border shadow-warm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <ProgressRing
            percentage={isEnrolled ? progressPercent : 0}
            size={72}
            strokeWidth={7}
            accentColor={progressPercent === 100 ? "coral" : "yellow"}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-indigo dark:text-brand-yellow font-sans">
                Learning Journey Map
              </span>
              {progressPercent === 100 && (
                <Badge variant="coral" size="sm">
                  🎉 Certified!
                </Badge>
              )}
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {courseTitle}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {isEnrolled ? (
                <>
                  <span className="font-semibold text-foreground">
                    {completedLessons.length} of {totalLessons}
                  </span>{" "}
                  milestones completed ({progressPercent}%)
                </>
              ) : (
                <span>{modules.length} modules • {totalLessons} interactive lessons</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {!isEnrolled ? (
            <Button
              variant="primary"
              size="md"
              isLoading={isEnrolling}
              onClick={handleEnrollClick}
              className="w-full md:w-auto"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Enroll Free to Track Progress
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Enrolled & Tracking Active</span>
            </div>
          )}
        </div>
      </div>

      {/* The Visual Roadmap Path Container */}
      <div className="relative py-4">
        {/* Desktop and Mobile Roadmap Trail */}
        <div className="space-y-12 sm:space-y-16 relative">
          {moduleStatuses.map((module, index) => {
            const isEven = index % 2 === 0;
            const IconComponent = getModuleIcon(module.icon);
            const isExpanded = expandedModuleId === module.id;

            return (
              <div
                key={module.id}
                className={cn(
                  "relative flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8",
                  // Alternating desktop alignment for winding S-curve visual feel
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Connecting Trail Line between nodes (rendered except on the last item) */}
                {index < moduleStatuses.length - 1 && (
                  <div
                    className={cn(
                      "absolute z-0 transition-colors duration-500",
                      // Mobile: straight vertical line on left
                      "left-6 top-14 w-1 h-full -ml-0.5 border-l-2 border-dashed",
                      module.isCompleted
                        ? "border-[#FFC94A] dark:border-[#FFC94A]"
                        : "border-border",
                      // Desktop: vertical center alignment
                      "md:left-1/2 md:-ml-0.5 md:h-[calc(100%+4rem)]"
                    )}
                    aria-hidden="true"
                  />
                )}

                {/* Milestone Node (The Circular Trail Marker) */}
                <div className="relative z-10 flex-shrink-0 flex items-center justify-center">
                  <motion.button
                    initial={shouldReduceMotion ? undefined : { scale: 0.7, opacity: 0 }}
                    whileInView={shouldReduceMotion ? undefined : { scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 20,
                      delay: index * 0.1,
                    }}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                    onClick={() =>
                      setExpandedModuleId(isExpanded ? null : module.id)
                    }
                    className={cn(
                      "w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-md focus-visible:outline-none focus-visible:ring-4 select-none cursor-pointer",
                      // Completed State
                      module.isCompleted &&
                        "bg-[#FFC94A] text-[#1C1C3A] ring-4 ring-[#FFC94A]/30 shadow-warm hover:bg-[#F5B82E]",
                      // Current / Active State
                      module.isCurrent &&
                        "bg-[#3B3B98] text-white ring-4 ring-brand-yellow ring-offset-2 ring-offset-background shadow-warm-lg animate-pulse-subtle",
                      // Locked State
                      module.isLocked &&
                        "bg-muted text-muted-foreground border-2 border-border/70 cursor-not-allowed opacity-80"
                    )}
                    aria-label={`Milestone ${index + 1}: ${module.title}`}
                  >
                    {module.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2.5]" />
                    ) : module.isLocked ? (
                      <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                    ) : (
                      <span className="font-heading font-extrabold text-base sm:text-xl">
                        {index + 1}
                      </span>
                    )}
                  </motion.button>

                  {/* Micro milestone badge */}
                  {module.isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-brand-coral text-white text-[10px] font-bold uppercase tracking-wider font-sans shadow-sm">
                        Current 🔥
                      </span>
                    </div>
                  )}
                </div>

                {/* Module Detail Card Container */}
                <div
                  className={cn(
                    "flex-1 w-full md:max-w-xl",
                    isEven ? "md:text-left" : "md:text-left"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl border transition-all duration-300 overflow-hidden bg-card",
                      module.isCurrent
                        ? "border-[#FFC94A] shadow-warm-lg ring-1 ring-[#FFC94A]/40"
                        : "border-border shadow-warm hover:border-brand-yellow/60",
                      module.isLocked && "opacity-75"
                    )}
                  >
                    {/* Card Header Accordion Trigger */}
                    <button
                      onClick={() =>
                        setExpandedModuleId(isExpanded ? null : module.id)
                      }
                      className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 transition-colors hover:bg-brand-cream/30 dark:hover:bg-brand-navy-light/30"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-indigo dark:text-brand-yellow font-sans">
                            Milestone {index + 1}
                          </span>
                          {module.isCompleted && (
                            <Badge variant="mint" size="sm">
                              Completed ✓
                            </Badge>
                          )}
                          {module.isCurrent && (
                            <Badge variant="yellow" size="sm">
                              {module.completedInMod}/{module.totalInMod} Lessons
                            </Badge>
                          )}
                          {module.isLocked && (
                            <Badge variant="muted" size="sm">
                              Locked
                            </Badge>
                          )}
                        </div>

                        <h4 className="font-heading text-lg sm:text-xl font-bold text-foreground leading-snug">
                          {module.title}
                        </h4>

                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {module.description}
                        </p>
                      </div>

                      <div className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </button>

                    {/* Expandable Lesson List Panel */}
                    {isExpanded && (
                      <div className="border-t border-border/80 bg-brand-cream/20 dark:bg-brand-navy-light/20 p-4 sm:p-5 space-y-2.5">
                        <div className="flex items-center justify-between pb-1 text-xs text-muted-foreground font-medium">
                          <span>Curriculum Lessons ({module.lessons.length})</span>
                          <span>Click to launch lesson player</span>
                        </div>

                        <div className="space-y-2">
                          {module.lessons.map((lesson, lIdx) => {
                            const LessonIcon =
                              lesson.type === "video"
                                ? Play
                                : lesson.type === "quiz"
                                ? HelpCircle
                                : BookOpen;

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => handleOpenLesson(lesson, module.title)}
                                className={cn(
                                  "w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all duration-200 group",
                                  lesson.isCompleted
                                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                    : "bg-card border-border hover:border-brand-yellow hover:bg-brand-cream/40 dark:hover:bg-brand-navy-light/40"
                                )}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div
                                    className={cn(
                                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                      lesson.isCompleted
                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                                        : "bg-amber-100/70 text-brand-indigo dark:bg-indigo-950 dark:text-brand-yellow group-hover:bg-brand-yellow group-hover:text-brand-navy"
                                    )}
                                  >
                                    <LessonIcon className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-heading font-semibold text-foreground truncate group-hover:text-brand-indigo dark:group-hover:text-brand-yellow transition-colors">
                                      {lesson.order}. {lesson.title}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span className="capitalize">{lesson.type}</span>
                                      <span>•</span>
                                      <span className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {lesson.durationMinutes}m
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {lesson.isCompleted ? (
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-border group-hover:border-brand-yellow flex items-center justify-center">
                                      <Circle className="w-2.5 h-2.5 text-transparent group-hover:text-brand-yellow fill-current" />
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Lesson Modal */}
      <LessonModal
        lesson={selectedLesson}
        courseId={courseId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggleComplete={handleToggleLessonComplete}
        onNextLesson={() => {
          if (!selectedLesson) return;
          const currentIdx = allLessons.findIndex((l) => l.id === selectedLesson.id);
          if (currentIdx >= 0 && currentIdx < allLessons.length - 1) {
            setSelectedLesson(allLessons[currentIdx + 1]);
          }
        }}
        hasNextLesson={
          selectedLesson
            ? allLessons.findIndex((l) => l.id === selectedLesson.id) < allLessons.length - 1
            : false
        }
      />
    </div>
  );
}
