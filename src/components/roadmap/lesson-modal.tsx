"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, BookOpen, HelpCircle, CheckCircle2, Award, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { triggerMilestoneCelebration } from "./confetti-celebration";

export interface LessonData {
  id: string;
  moduleId: string;
  moduleTitle?: string;
  title: string;
  order: number;
  durationMinutes: number;
  type: string; // "video" | "reading" | "quiz"
  summary: string;
  content: string;
  videoUrl?: string | null;
  isCompleted?: boolean;
}

interface LessonModalProps {
  lesson: LessonData | null;
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
  onToggleComplete: (lessonId: string, completed: boolean) => Promise<{ milestoneUnlocked?: boolean }>;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function LessonModal({
  lesson,
  courseId,
  isOpen,
  onClose,
  onToggleComplete,
  onNextLesson,
  hasNextLesson,
}: LessonModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showXPToast, setShowXPToast] = useState(false);

  if (!lesson || !isOpen) return null;

  const handleCompleteClick = async () => {
    setIsUpdating(true);
    const targetState = !lesson.isCompleted;
    try {
      const result = await onToggleComplete(lesson.id, targetState);
      if (targetState) {
        setShowXPToast(true);
        triggerMilestoneCelebration();
        setTimeout(() => setShowXPToast(false), 3500);
      }
    } catch (err) {
      console.error("Failed to update lesson progress:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const typeConfig = {
    video: {
      icon: Play,
      label: "Interactive Video",
      badgeVariant: "indigo" as const,
    },
    reading: {
      icon: BookOpen,
      label: "Deep Dive Reading",
      badgeVariant: "yellow" as const,
    },
    quiz: {
      icon: HelpCircle,
      label: "Milestone Quiz",
      badgeVariant: "coral" as const,
    },
  };

  const currentType = typeConfig[lesson.type as keyof typeof typeConfig] || typeConfig.reading;
  const TypeIcon = currentType.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1C1C3A]/70 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl bg-card border border-border shadow-2xl overflow-hidden z-10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-border bg-brand-cream/60 dark:bg-brand-navy-light/60">
            <div className="flex items-center gap-2.5">
              <Badge variant={currentType.badgeVariant} size="sm">
                <TypeIcon className="w-3.5 h-3.5 mr-1" />
                {currentType.label}
              </Badge>
              <span className="flex items-center text-xs text-muted-foreground font-medium">
                <Clock className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                {lesson.durationMinutes} mins
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Close lesson modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6">
            <div>
              {lesson.moduleTitle && (
                <p className="text-xs uppercase tracking-wider font-semibold text-brand-indigo dark:text-brand-yellow mb-1 font-sans">
                  {lesson.moduleTitle}
                </p>
              )}
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground leading-tight">
                {lesson.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {lesson.summary}
              </p>
            </div>

            {/* Type Specific Visual Content */}
            {lesson.type === "video" && (
              <div className="relative rounded-2xl overflow-hidden bg-brand-navy aspect-video border border-indigo-900/40 shadow-inner flex flex-col items-center justify-center text-white group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="relative z-10 text-center px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FFC94A] text-[#1C1C3A] flex items-center justify-center mx-auto mb-3 shadow-lg transform transition-transform group-hover:scale-105 cursor-pointer">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-current" />
                  </div>
                  <p className="font-heading font-semibold text-base sm:text-lg">
                    Interactive Video Masterclass
                  </p>
                  <p className="text-xs text-amber-100/80 mt-1 font-sans">
                    HD 1080p • Speed: 1.0x • English Subtitles
                  </p>
                </div>

                {/* Simulated Video Player Controls */}
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 flex items-center justify-between text-xs text-white/80 z-10 bg-black/40 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <button className="hover:text-brand-yellow transition-colors font-mono">04:15 / {lesson.durationMinutes}:00</button>
                  </div>
                  <div className="w-1/2 h-1.5 rounded-full bg-white/20 overflow-hidden mx-3">
                    <div className="h-full bg-brand-yellow w-1/3 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span>1080p</span>
                  </div>
                </div>
              </div>
            )}

            {lesson.type === "quiz" && (
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-coral" />
                  <h3 className="font-heading font-bold text-base sm:text-lg">
                    Checkpoint Challenge
                  </h3>
                </div>
                <p className="text-sm text-foreground/90 font-medium">
                  {lesson.content.includes("###")
                    ? lesson.summary
                    : "Which design pattern is essential for isolating client-side state without forfeiting Server-Side Rendering performance in modern Next.js?"}
                </p>

                <div className="space-y-2.5 pt-2">
                  {[
                    "Pass Server Components as serializable children into client boundary wrappers.",
                    "Wrap the entire application root layout in 'use client'.",
                    "Duplicate client states into localStorage on every fetch request.",
                  ].map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuizSelected(idx);
                        setQuizSubmitted(true);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all duration-200 ${
                        quizSelected === idx
                          ? idx === 0
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold"
                            : "border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200"
                          : "border-border hover:border-brand-yellow hover:bg-brand-cream/40 dark:hover:bg-brand-navy-light/40"
                      }`}
                    >
                      <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {option}
                      {quizSubmitted && idx === 0 && (
                        <span className="float-right text-emerald-600 dark:text-emerald-400 font-bold">
                          ✓ Correct
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {quizSubmitted && quizSelected === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs leading-relaxed"
                  >
                    🎉 <strong>Spot on!</strong> Passing Server Components as children allows Next.js to render them on the server first, while keeping the parent wrapper interactive.
                  </motion.div>
                )}
              </div>
            )}

            {lesson.type === "reading" && (
              <div className="prose prose-stone dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-4">
                <div className="p-4 rounded-xl bg-brand-cream/80 dark:bg-brand-navy-light/80 border border-amber-200/60 dark:border-indigo-900/60 font-mono text-xs">
                  <pre className="overflow-x-auto p-2 text-foreground">
                    <code>{lesson.content}</code>
                  </pre>
                </div>
                <p className="text-muted-foreground text-sm">
                  Pro-tip: Bookmark this section in your learning journal. In the next milestone, you will put these principles to work inside the course project sandbox!
                </p>
              </div>
            )}

            {/* Micro Celebratory Toast */}
            {showXPToast && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-brand-coral text-white font-heading font-bold text-center shadow-lg flex items-center justify-center gap-2"
              >
                <span>🔥 Lesson Completed! +50 XP earned for your learning streak!</span>
              </motion.div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-8 py-4 border-t border-border bg-brand-cream/40 dark:bg-brand-navy-light/40">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Status:</span>
              {lesson.isCompleted ? (
                <Badge variant="mint" size="sm">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Completed
                </Badge>
              ) : (
                <Badge variant="muted" size="sm">
                  In Progress
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                variant={lesson.isCompleted ? "outline" : "primary"}
                size="md"
                isLoading={isUpdating}
                onClick={handleCompleteClick}
                className="w-full sm:w-auto"
              >
                {lesson.isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                    Mark as Incomplete
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Mark Lesson Complete
                  </>
                )}
              </Button>

              {hasNextLesson && onNextLesson && (
                <Button
                  variant="indigo"
                  size="md"
                  onClick={onNextLesson}
                  className="hidden sm:inline-flex"
                >
                  Next Lesson
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
