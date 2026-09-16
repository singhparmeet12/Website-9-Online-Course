"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  Star,
  Clock,
  BookOpen,
  CheckCircle2,
  Share2,
  Sparkles,
  Award,
  ChevronLeft,
  Users,
  Compass,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StickyNote } from "@/components/ui/sticky-note";
import { CurriculumRoadmap, RoadmapModule } from "@/components/roadmap/curriculum-roadmap";
import { triggerMilestoneCelebration } from "@/components/roadmap/confetti-celebration";

interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  level: string;
  durationHours: number;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  featured: boolean;
  instructor: {
    id: string;
    name: string;
    title: string;
    bio: string;
    avatar: string;
    rating: number;
    studentsCount: number;
    specialties: string;
  };
  modules: RoadmapModule[];
  isEnrolled: boolean;
  progressPercent: number;
}

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState<"roadmap" | "overview" | "instructor">("roadmap");

  const fetchCourse = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/courses/${slug}`);
      if (!res.ok) {
        throw new Error("Course not found");
      }
      const data = await res.json();
      setCourse(data.course);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const handleEnroll = async () => {
    if (!course) return;
    setEnrolling(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });
      if (res.ok) {
        triggerMilestoneCelebration();
        await fetchCourse();
      }
    } catch (err) {
      console.error("Enrollment failed:", err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#FFC94A] border-t-transparent animate-spin mx-auto" />
        <p className="font-heading text-lg font-medium text-muted-foreground">
          Loading learning roadmap...
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">Course Not Found</h2>
        <p className="text-muted-foreground">The requested learning journey doesn't exist.</p>
        <Link href="/courses">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedLessons = allLessons.filter((l) => l.isCompleted);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumb Back Link */}
      <div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Course Catalog
        </Link>
      </div>

      {/* Hero Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="yellow">{course.category}</Badge>
            <Badge variant="muted">{course.level}</Badge>
            {course.isEnrolled && (
              <Badge variant="mint">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Enrolled Student
              </Badge>
            )}
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
            {course.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {course.tagline}
          </p>

          {/* Quick Meta Strip */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-[#FFC94A] text-[#FFC94A]" />
              <strong className="text-foreground">{course.rating}</strong> ({course.reviewsCount} reviews)
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-indigo dark:text-brand-yellow" />
              {course.durationHours} hours total
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-brand-coral" />
              {course.modules.length} Milestones • {allLessons.length} Lessons
            </span>
          </div>

          {/* Instructor Quick Tag */}
          <div className="pt-2 flex items-center gap-3">
            <Image
              src={course.instructor.avatar}
              alt={course.instructor.name}
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-[#FFC94A]/40"
            />
            <div>
              <p className="font-heading font-bold text-sm text-foreground">
                Taught by {course.instructor.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {course.instructor.title}
              </p>
            </div>
          </div>
        </div>

        {/* Right Sticky / Highlight Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl sm:rounded-3xl p-6 bg-card border border-border shadow-warm space-y-5">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>

            {course.isEnrolled ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans">
                    Your Progress
                  </span>
                  <span className="font-heading font-bold text-foreground">
                    {course.progressPercent}%
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <ProgressRing
                    percentage={course.progressPercent}
                    size={64}
                    strokeWidth={6}
                    accentColor={course.progressPercent === 100 ? "coral" : "yellow"}
                  />
                  <div className="text-xs text-muted-foreground leading-snug">
                    <p className="font-semibold text-foreground">
                      {completedLessons.length} of {allLessons.length} lessons
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Scroll down to the roadmap to launch your next milestone!
                    </p>
                  </div>
                </div>

                <Link href="/dashboard" className="block pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    View in Student Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-heading text-3xl font-extrabold text-foreground">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">full roadmap access</span>
                  </div>
                  <Badge variant="mint">Zero Setup</Badge>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  isLoading={enrolling}
                  onClick={handleEnroll}
                  className="w-full text-base"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enroll Now & Start Roadmap
                </Button>

                <p className="text-[11px] text-center text-muted-foreground">
                  Instant access to all {course.modules.length} roadmap milestones and real student dashboard tracking.
                </p>
              </div>
            )}
          </div>

          {/* Sticky Note Encouragement */}
          <StickyNote
            color="coral"
            tilt={1.5}
            pinColor="gold"
            badge="Pathwise Tip"
            className="text-center"
          >
            "Follow the milestones in sequence — each unlocked lesson builds directly upon your sandbox project!"
          </StickyNote>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border flex items-center gap-2">
        <button
          onClick={() => setActiveTab("roadmap")}
          className={`pb-3 px-4 text-sm font-heading font-bold border-b-2 transition-all ${
            activeTab === "roadmap"
              ? "border-[#FFC94A] text-[#3B3B98] dark:text-[#FFC94A]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Curriculum Roadmap ({course.modules.length} Milestones)
        </button>
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 text-sm font-heading font-bold border-b-2 transition-all ${
            activeTab === "overview"
              ? "border-[#FFC94A] text-[#3B3B98] dark:text-[#FFC94A]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Course Overview
        </button>
        <button
          onClick={() => setActiveTab("instructor")}
          className={`pb-3 px-4 text-sm font-heading font-bold border-b-2 transition-all ${
            activeTab === "instructor"
              ? "border-[#FFC94A] text-[#3B3B98] dark:text-[#FFC94A]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Instructor Bio
        </button>
      </div>

      {/* Tab 1: The Signature Curriculum Roadmap */}
      {activeTab === "roadmap" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Interactive Learning Roadmap
              </h2>
              <p className="text-sm text-muted-foreground">
                Click any milestone node to open its module curriculum, launch video players, take checkpoint quizzes, and unlock your next step.
              </p>
            </div>
          </div>

          <CurriculumRoadmap
            courseId={course.id}
            courseTitle={course.title}
            modules={course.modules}
            isEnrolled={course.isEnrolled}
            onEnroll={handleEnroll}
            onLessonUpdate={fetchCourse}
          />
        </div>
      )}

      {/* Tab 2: Course Overview */}
      {activeTab === "overview" && (
        <div className="max-w-4xl space-y-8 py-4">
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4">
            <h3 className="font-heading text-xl font-bold text-foreground">
              About This Course
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {course.description}
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4">
            <h3 className="font-heading text-xl font-bold text-foreground">
              What You'll Achieve on This Roadmap
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                "Deep architectural mental models with zero guesswork",
                "Hands-on project code structured for production scale",
                "Milestone-based retention backed by active retrieval quizzes",
                "Sharable verified course completion certificate",
              ].map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span className="text-sm text-foreground font-medium leading-snug">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Instructor Bio */}
      {activeTab === "instructor" && (
        <div className="max-w-3xl py-4">
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-5">
              <Image
                src={course.instructor.avatar}
                alt={course.instructor.name}
                width={72}
                height={72}
                className="w-18 h-18 rounded-2xl object-cover ring-4 ring-[#FFC94A]/30 shadow-md"
              />
              <div>
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  {course.instructor.name}
                </h3>
                <p className="text-sm text-brand-indigo dark:text-brand-yellow font-medium">
                  {course.instructor.title}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span>★ {course.instructor.rating} Rating</span>
                  <span>•</span>
                  <span>{course.instructor.studentsCount.toLocaleString()} Students</span>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {course.instructor.bio}
            </p>

            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Specialties & Domain Expertise
              </p>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(course.instructor.specialties || "[]").map((tag: string) => (
                  <Badge key={tag} variant="indigo" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
