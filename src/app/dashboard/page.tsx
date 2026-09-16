"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Flame,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  RotateCcw,
  GraduationCap,
  Play,
  HelpCircle,
  Trophy,
  ExternalLink,
} from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StickyNote } from "@/components/ui/sticky-note";
import { LessonModal, LessonData } from "@/components/roadmap/lesson-modal";
import { triggerMilestoneCelebration } from "@/components/roadmap/confetti-celebration";

interface DashboardData {
  student: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    streakDays: number;
    xpPoints: number;
  };
  stats: {
    enrolledCoursesCount: number;
    completedLessonsCount: number;
    hoursLearned: number;
    streakDays: number;
    xpPoints: number;
  };
  nextIncompleteLesson: {
    lessonId: string;
    lessonTitle: string;
    courseSlug: string;
    courseTitle: string;
    moduleTitle: string;
    durationMinutes: number;
    type: string;
  } | null;
  enrolledCourses: Array<{
    id: string;
    courseId: string;
    courseSlug: string;
    courseTitle: string;
    courseCategory: string;
    courseLevel: string;
    courseImage: string;
    instructor: {
      name: string;
      avatar: string;
    };
    progressPercent: number;
    completedLessonsCount: number;
    totalLessonsCount: number;
    moduleMilestones: Array<{
      id: string;
      title: string;
      order: number;
      isCompleted: boolean;
      isCurrent: boolean;
      completedCount: number;
      totalCount: number;
    }>;
    enrolledAt?: string | Date;
  }>;
  recentCompletions: Array<{
    id: string;
    lessonTitle: string;
    courseTitle: string;
    courseSlug: string;
    completedAt: string;
    type: string;
  }>;
}

export default function DashboardPage() {
  const shouldReduceMotion = useReducedMotion();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonData | null>(null);
  const [activeCourseId, setActiveCourseId] = useState<string>("");
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleResetDemoData = async () => {
    setResetting(true);
    try {
      await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      await fetchDashboard();
    } finally {
      setResetting(false);
    }
  };

  const handleOpenNextLesson = () => {
    if (!data?.nextIncompleteLesson) return;
    const n = data.nextIncompleteLesson;
    setSelectedLesson({
      id: n.lessonId,
      moduleId: "",
      moduleTitle: n.moduleTitle,
      title: n.lessonTitle,
      order: 1,
      durationMinutes: n.durationMinutes,
      type: n.type,
      summary: `Continue your progress in ${n.courseTitle}: ${n.moduleTitle}`,
      content: "Ready to conquer your next milestone? Complete this lesson to unlock the next node on your curriculum roadmap!",
      isCompleted: false,
    });
    // Find course id
    const foundCourse = data.enrolledCourses.find((c) => c.courseSlug === n.courseSlug);
    if (foundCourse) {
      setActiveCourseId(foundCourse.courseId);
    }
    setIsLessonModalOpen(true);
  };

  const handleToggleLessonComplete = async (lessonId: string, completed: boolean) => {
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          courseId: activeCourseId,
          completed,
        }),
      });
      const resJson = await res.json();
      if (resJson.milestoneUnlocked) {
        triggerMilestoneCelebration();
      }
      await fetchDashboard();
      return { milestoneUnlocked: resJson.milestoneUnlocked };
    } catch (e) {
      console.error(e);
      return {};
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#FFC94A] border-t-transparent animate-spin mx-auto" />
        <p className="font-heading text-lg font-medium text-muted-foreground">
          Loading your learning journey...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-rose-500">Failed to load dashboard. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Student Welcome Header & Demo Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={data.student.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
              alt={data.student.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#FFC94A]/30 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-sm" title="Online Demo Student">
              ✓
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                Welcome back, {data.student.name.split(" ")[0]}!
              </h1>
              <Badge variant="yellow" size="sm">
                Demo Student Mode
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {data.student.email} • {data.student.xpPoints.toLocaleString()} Total XP earned
            </p>
          </div>
        </div>

        {/* Quick Demo Utilities */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            isLoading={resetting}
            onClick={handleResetDemoData}
            className="text-xs"
            title="Reset demo progress back to initial test state"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset Demo Progress
          </Button>
          <Link href="/courses">
            <Button variant="primary" size="sm">
              <GraduationCap className="w-4 h-4 mr-1.5" />
              Enroll More
            </Button>
          </Link>
        </div>
      </div>

      {/* Encouraging Sticky Note Callout Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          {/* Continue Learning Jumpcard */}
          {data.nextIncompleteLesson ? (
            <motion.div
              initial={shouldReduceMotion ? undefined : { y: 12, opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#3B3B98] to-[#2A2A72] text-white shadow-warm-lg relative overflow-hidden group"
            >
              <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#FFC94A]/10 blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#FFC94A] text-[#1C1C3A] text-xs font-bold uppercase tracking-wider font-sans">
                    Next Up on Your Roadmap
                  </span>
                  <span className="text-xs text-amber-200/80 font-medium">
                    {data.nextIncompleteLesson.courseTitle}
                  </span>
                </div>

                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-white leading-snug group-hover:text-[#FFC94A] transition-colors">
                    {data.nextIncompleteLesson.lessonTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-indigo-200/80 mt-1">
                    {data.nextIncompleteLesson.moduleTitle} • {data.nextIncompleteLesson.durationMinutes} mins
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleOpenNextLesson}
                  >
                    <Play className="w-4 h-4 mr-1.5 fill-current" />
                    Launch Lesson Player
                  </Button>
                  <Link href={`/courses/${data.nextIncompleteLesson.courseSlug}`}>
                    <Button
                      variant="outline"
                      size="md"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      View Full Roadmap
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-2xl sm:rounded-3xl p-6 bg-card border border-border shadow-warm text-center space-y-3">
              <Trophy className="w-12 h-12 text-[#FFC94A] mx-auto" />
              <h3 className="font-heading text-xl font-bold">All Milestones Completed!</h3>
              <p className="text-sm text-muted-foreground">
                Incredible work! You have finished every enrolled lesson on Pathwise.
              </p>
              <Link href="/courses">
                <Button variant="primary" size="sm">Explore New Roadmaps</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Motivational Sticky Note */}
        <div className="flex justify-center md:justify-end">
          <StickyNote
            color="yellow"
            tilt={-1.5}
            pinColor="tape"
            badge="Keep Going!"
            className="w-full max-w-sm"
          >
            "You're on a 5-day streak! 🔥 Just 3 more lessons to unlock your Next.js Architecture Certificate."
          </StickyNote>
        </div>
      </div>

      {/* Stats Band */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            label: "Courses In Progress",
            value: data.stats.enrolledCoursesCount,
            sub: "Active tracks",
            icon: BookOpen,
            color: "text-brand-indigo dark:text-brand-yellow",
            bg: "bg-amber-100/60 dark:bg-indigo-950/60",
          },
          {
            label: "Lessons Completed",
            value: data.stats.completedLessonsCount,
            sub: "Milestones unlocked",
            icon: CheckCircle2,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-100/60 dark:bg-emerald-950/60",
          },
          {
            label: "Day Learning Streak",
            value: `${data.stats.streakDays} Days`,
            sub: "Keep the momentum! 🔥",
            icon: Flame,
            color: "text-orange-500",
            bg: "bg-orange-100/60 dark:bg-orange-950/60",
          },
          {
            label: "Hours Invested",
            value: `${data.stats.hoursLearned}h`,
            sub: "Time well spent",
            icon: Clock,
            color: "text-brand-coral",
            bg: "bg-rose-100/60 dark:bg-rose-950/60",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={shouldReduceMotion ? undefined : { y: 16, opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-2xl p-5 bg-card border border-border shadow-warm hover:shadow-warm-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground mt-2">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Enrolled Courses with Mini-Roadmap Progress Summaries */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Your Enrolled Learning Journeys
            </h2>
            <p className="text-sm text-muted-foreground">
              Track and resume your progress on every curriculum roadmap.
            </p>
          </div>
          <Link href="/courses" className="text-xs sm:text-sm font-heading font-semibold text-brand-indigo dark:text-brand-yellow hover:underline flex items-center gap-1">
            Browse All Courses
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl sm:rounded-3xl border border-border bg-card p-6 shadow-warm hover:shadow-warm-lg transition-all space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="indigo" size="sm">
                        {course.courseCategory}
                      </Badge>
                      <Badge variant="muted" size="sm">
                        {course.courseLevel}
                      </Badge>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground leading-snug">
                      {course.courseTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Instructor: {course.instructor.name}
                    </p>
                  </div>

                  <ProgressRing
                    percentage={course.progressPercent}
                    size={64}
                    strokeWidth={6}
                    accentColor={course.progressPercent === 100 ? "coral" : "yellow"}
                  />
                </div>

                {/* Linear Progress Indicator */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span>{course.completedLessonsCount} of {course.totalLessonsCount} lessons finished</span>
                    <span className="font-bold text-foreground">{course.progressPercent}%</span>
                  </div>
                  <ProgressBar
                    percentage={course.progressPercent}
                    height={8}
                    color={course.progressPercent === 100 ? "coral" : "yellow"}
                  />
                </div>

                {/* Mini-Roadmap Milestone Trail */}
                <div className="pt-2 border-t border-border/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2 font-sans">
                    Roadmap Milestone Stepper
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {course.moduleMilestones.map((milestone, mIdx) => (
                      <div
                        key={milestone.id}
                        className="flex items-center gap-2 flex-shrink-0"
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-heading font-bold transition-all ${
                            milestone.isCompleted
                              ? "bg-[#FFC94A] text-[#1C1C3A] shadow-sm ring-2 ring-[#FFC94A]/40"
                              : milestone.isCurrent
                              ? "bg-[#3B3B98] text-white ring-2 ring-brand-yellow"
                              : "bg-muted text-muted-foreground border border-border"
                          }`}
                          title={`Milestone ${mIdx + 1}: ${milestone.title}`}
                        >
                          {milestone.isCompleted ? "✓" : mIdx + 1}
                        </div>
                        {mIdx < course.moduleMilestones.length - 1 && (
                          <div
                            className={`w-4 h-0.5 border-t border-dashed ${
                              milestone.isCompleted ? "border-[#FFC94A]" : "border-border"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Enrolled {course.enrolledAt ? new Date(course.enrolledAt).toLocaleDateString() : "Recently"}
                </span>
                <Link href={`/courses/${course.courseSlug}`}>
                  <Button variant="primary" size="sm">
                    Open Roadmap
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Log */}
      {data.recentCompletions.length > 0 && (
        <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-6 shadow-warm space-y-4">
          <h3 className="font-heading text-lg font-bold text-foreground">
            Recent Milestone Activity
          </h3>
          <div className="divide-y divide-border">
            {data.recentCompletions.map((activity) => (
              <div
                key={activity.id}
                className="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground">
                      Completed: {activity.lessonTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.courseTitle} • {activity.type}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(activity.completedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lesson Modal for Quick Complete from Dashboard */}
      <LessonModal
        lesson={selectedLesson}
        courseId={activeCourseId}
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onToggleComplete={handleToggleLessonComplete}
      />
    </div>
  );
}
