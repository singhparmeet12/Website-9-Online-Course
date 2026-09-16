"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  Award,
  BookOpen,
  Flame,
  LayoutDashboard,
  Layers,
  GraduationCap,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StickyNote } from "@/components/ui/sticky-note";
import { HeroRoadmapPreview } from "@/components/sections/hero-roadmap-preview";
import { MembershipModal } from "@/components/ui/membership-modal";

interface CourseCard {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  level: string;
  durationHours: number;
  rating: number;
  reviewsCount: number;
  image: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  modulesCount: number;
  lessonsCount: number;
  isEnrolled: boolean;
  progressPercent: number;
}

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [featuredCourses, setFeaturedCourses] = useState<CourseCard[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState("Pathwise Pro");

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (data.courses) {
          setFeaturedCourses(data.courses.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadFeatured();
  }, []);

  const instructors = [
    {
      name: "Dr. Marcus Vance",
      title: "Principal Web Architect",
      bio: "14+ years designing high-throughput distributed web systems. Former Tech Lead with open-source state machines used by thousands of companies.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      rating: 4.98,
      students: "16,400+",
      courses: 4,
      specialties: ["TypeScript", "Next.js Architecture", "Performance"],
    },
    {
      name: "Elena Rostova",
      title: "Design Systems Director",
      bio: "Previously Staff Designer at Figma and Linear. Obsessed with accessible design tokens, micro-interactions, and fluid physics.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      rating: 4.96,
      students: "11,200+",
      courses: 3,
      specialties: ["Design Systems", "Figma", "Micro-Interactions"],
    },
    {
      name: "Maya Lin-Chen",
      title: "Senior AI & Creative Technologist",
      bio: "Bridges foundational models and intuitive frontend product UX. Teaches engineers how to leverage structured LLM outputs and streaming agents.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
      rating: 4.97,
      students: "13,500+",
      courses: 3,
      specialties: ["Applied GenAI", "Agentic UI", "Streaming APIs"],
    },
    {
      name: "Devon Brooks",
      title: "Cross-Platform Mobile Lead",
      bio: "Shipped top-tier iOS and Android applications used by millions. Passionate about native gesture handlers, 120 FPS animations, and offline sync.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      rating: 4.92,
      students: "8,900+",
      courses: 2,
      specialties: ["React Native", "Expo Router", "Native Gestures"],
    },
  ];

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Frontend Engineer at Vercel ecosystem",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      completed: "Completed 3 roadmaps",
      quote:
        "The visual milestone roadmap completely changed how I learn. Instead of staring at a 40-hour playlist, I could see my exact trail of progress. Unlocking each milestone felt like a game.",
    },
    {
      name: "David Kalu",
      role: "Product Designer at Fintech",
      photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      completed: "Completed 2 roadmaps",
      quote:
        "Elena's design systems course gave me the exact vocabulary and token patterns I needed to ship our company's new design system in Figma and React.",
    },
    {
      name: "Priya Patel",
      role: "Full-Stack Developer",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      completed: "Completed 4 roadmaps",
      quote:
        "Having a real student dashboard with day streaks and milestone checkpoints kept me accountable. Landed my dream senior role 2 months after finishing the Next.js path!",
    },
  ];

  return (
    <div className="w-full space-y-20 sm:space-y-28 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 pb-12 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={shouldReduceMotion ? undefined : { y: 16, opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF3D6] text-[#9A6700] border border-amber-300/80 dark:bg-amber-950/60 dark:text-[#FFC94A] dark:border-amber-800/80 text-xs font-bold font-sans"
            >
              <Sparkles className="w-4 h-4 text-[#FFC94A]" />
              <span>A Fresh Way to Learn Online</span>
              <span className="ml-1 px-1.5 py-0.2 rounded bg-amber-400/20 text-[10px] uppercase">
                New
              </span>
            </motion.div>

            <motion.h1
              initial={shouldReduceMotion ? undefined : { y: 20, opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1]"
            >
              Master skills on an{" "}
              <span className="relative inline-block text-[#3B3B98] dark:text-[#FFC94A]">
                interactive roadmap
                <svg
                  className="absolute left-0 -bottom-2 w-full h-3 text-[#FFC94A] dark:text-[#FF7A5C] -z-10"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,8 Q50,0 100,8"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              , not a boring playlist.
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? undefined : { y: 20, opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Courses structured like an adventure trail. Complete bite-sized milestones, unlock next steps with celebratory pops, and track genuine progress in your student dashboard.
            </motion.p>

            {/* CTA Group */}
            <motion.div
              initial={shouldReduceMotion ? undefined : { y: 20, opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link href="/courses" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-base">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Start Learning Free
                </Button>
              </Link>
              <Link href="/courses/nextjs-fullstack-architecture" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base border-2">
                  <Compass className="w-5 h-5 mr-2 text-brand-indigo dark:text-brand-yellow" />
                  Explore Roadmap Demo
                </Button>
              </Link>
            </motion.div>

            {/* Social Trust Metrics */}
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&auto=format&fit=crop&q=80",
                  ].map((src, i) => (
                    <Image
                      key={i}
                      src={src}
                      alt="Student"
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-background"
                    />
                  ))}
                </div>
                <span className="font-semibold text-foreground">38,000+ Students</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#FFC94A] text-[#FFC94A]" />
                <span className="font-semibold text-foreground">4.96/5.0</span>
                <span>Average rating</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>100% Free Demo Access</span>
              </div>
            </motion.div>
          </div>

          {/* Right Animated Mini-Roadmap Interactive Simulation */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroRoadmapPreview />
          </div>
        </div>
      </section>

      {/* 2. FEATURED CURRICULUM PATHS */}
      <section id="paths" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="indigo">Structured Learning</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              Featured Curriculum Tracks
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Each track is a hand-crafted progression of milestones designed for measurable mastery.
            </p>
          </div>
          <Link href="/courses">
            <Button variant="outline" size="sm">
              View All 6 Roadmaps
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-3xl border border-border bg-card overflow-hidden shadow-warm hover:shadow-warm-lg transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="yellow" size="sm">
                    {course.category}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="muted" size="sm" className="bg-black/60 text-white border-0">
                    {course.level}
                  </Badge>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-brand-indigo dark:group-hover:text-brand-yellow transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {course.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-foreground">
                      {course.instructor.name}
                    </span>
                  </div>
                  <Link href={`/courses/${course.slug}`}>
                    <Button variant="primary" size="sm">
                      Open Trail
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. "WHY PATHWISE" TRUST SECTION WITH STICKY NOTES */}
      <section id="why-pathwise" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="coral">Why Pathwise</Badge>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-foreground">
            Why Roadmap Learning Works 3x Better
          </h2>
          <p className="text-muted-foreground text-xs sm:text-base">
            Traditional online courses have an 8% completion rate because learners feel lost in endless video files. Pathwise replaces the void with an encouraging journey map.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {[
            {
              index: "01",
              title: "Bite-Sized Milestones",
              desc: "Lessons are chunked into 15-25 minute interactive steps. You never feel overwhelmed by infinite playlists.",
              icon: Compass,
              noteText: "Learn 15 mins a day on lunch breaks!",
              noteColor: "yellow" as const,
              hasNote: true,
            },
            {
              index: "02",
              title: "Real Production Code",
              desc: "No toy code snippets. Every course builds directly toward scalable architectures ready for production deployment.",
              icon: Layers,
              hasNote: false,
            },
            {
              index: "03",
              title: "Live Database Tracking",
              desc: "Every completed lesson saves in real time. Your student dashboard recalculates streaks, XP, and milestone progress automatically.",
              icon: Flame,
              noteText: "94% completion rate on roadmap paths 🚀",
              noteColor: "coral" as const,
              hasNote: true,
            },
            {
              index: "04",
              title: "Verified Certificates",
              desc: "Finish every module on a roadmap to unlock a verified certificate with a cryptographic completion stamp.",
              icon: Award,
              hasNote: false,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl sm:rounded-3xl border border-border/90 bg-card p-5 sm:p-6 shadow-warm hover:shadow-warm-lg transition-all space-y-3 sm:space-y-4 flex flex-col justify-between relative group hover:border-amber-300 dark:hover:border-amber-700"
              >
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100/80 dark:bg-indigo-950 text-brand-indigo dark:text-brand-yellow flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-muted-foreground/60">
                      {item.index}
                    </span>
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {item.hasNote && item.noteText && (
                  <div className="pt-1 sm:pt-2">
                    <StickyNote
                      color={item.noteColor}
                      tilt={idx % 2 === 0 ? -2 : 1.5}
                      pinColor={idx % 2 === 0 ? "gold" : "tape"}
                      className="text-[11px] sm:text-xs py-1.5 sm:py-2 px-2.5 sm:px-3"
                    >
                      {item.noteText}
                    </StickyNote>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. INSTRUCTORS SECTION - Structured 2-col on Mobile, 4-col on Desktop */}
      <section id="instructors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto">
          <Badge variant="yellow">Industry Practitioners</Badge>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-foreground">
            Learn From Engineers & Designers Who Build
          </h2>
          <p className="text-muted-foreground text-xs sm:text-base">
            Our curriculum architects are principal engineers, staff designers, and tech leads who bring real battle-tested experience.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {instructors.map((inst) => (
            <div
              key={inst.name}
              className="rounded-2xl sm:rounded-3xl border border-border/90 bg-card p-3.5 sm:p-6 shadow-warm hover:shadow-warm-lg transition-all space-y-3 flex flex-col justify-between hover:border-brand-yellow/60"
            >
              <div className="space-y-2.5 sm:space-y-3">
                <Image
                  src={inst.avatar}
                  alt={inst.name}
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover ring-2 ring-[#FFC94A]/40 shadow-xs"
                />
                <div>
                  <h3 className="font-heading text-sm sm:text-lg font-bold text-foreground leading-snug">
                    {inst.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs font-semibold text-brand-indigo dark:text-brand-yellow line-clamp-1">
                    {inst.title}
                  </p>
                </div>

                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {inst.bio}
                </p>

                <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-0.5">
                  {inst.specialties.slice(0, 2).map((spec) => (
                    <span
                      key={spec}
                      className="px-1.5 sm:px-2 py-0.5 rounded-md bg-muted text-[9px] sm:text-[10px] font-semibold text-muted-foreground font-sans truncate max-w-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 sm:pt-3 border-t border-border flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">★ {inst.rating}</span>
                <span>{inst.students}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PRICING TIERS */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="indigo">Simple Pricing</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Accessible Learning For Everyone
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Start completely free with zero commitment, or unlock unlimited certificates and community code reviews.
          </p>

          {/* Billing Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              className={`text-xs font-heading font-semibold ${
                billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Monthly Billing
            </span>
            <button
              onClick={() =>
                setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")
              }
              className="w-12 h-6 rounded-full bg-amber-200 dark:bg-indigo-950 p-1 transition-colors relative"
              aria-label="Toggle billing cycle"
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#FFC94A] shadow-sm transform transition-transform ${
                  billingCycle === "annual" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-xs font-heading font-semibold flex items-center gap-1.5 ${
                billingCycle === "annual" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Annual Billing
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                Save 25%
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
          {/* Tier 1: Free Starter */}
          <div className="rounded-3xl border border-border bg-card p-7 shadow-warm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Free Starter
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Perfect for exploring roadmaps and testing skills.
                </p>
              </div>

              <div>
                <span className="font-heading text-4xl font-extrabold text-foreground">
                  $0
                </span>
                <span className="text-xs text-muted-foreground ml-1">/ forever</span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground pt-2">
                {[
                  "Access to free foundational roadmaps",
                  "Real student dashboard tracking",
                  "Interactive checkpoint quizzes",
                  "Community forum access",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => {
                setSelectedTier("Free Starter");
                setMembershipModalOpen(true);
              }}
            >
              Get Started Free
            </Button>
          </div>

          {/* Tier 2: Pathwise Pro (Highlighted) */}
          <div className="rounded-3xl border-2 border-[#FFC94A] bg-card p-7 shadow-warm-lg space-y-6 flex flex-col justify-between relative overflow-hidden ring-4 ring-[#FFC94A]/20">
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFC94A] text-[#1C1C3A] text-[10px] font-bold uppercase tracking-wider font-sans">
                Most Popular
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Pathwise Pro
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Everything you need to level up into senior roles.
                </p>
              </div>

              <div>
                <span className="font-heading text-4xl font-extrabold text-foreground">
                  {billingCycle === "annual" ? "$19" : "$25"}
                </span>
                <span className="text-xs text-muted-foreground ml-1">/ month</span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-foreground pt-2">
                {[
                  "Unlimited access to all 6+ roadmaps",
                  "Verified course completion certificates",
                  "Downloadable project sandboxes",
                  "Priority instructor Q&A sessions",
                  "Offline video and reading access",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#FFC94A] flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => {
                setSelectedTier("Pathwise Pro");
                setMembershipModalOpen(true);
              }}
            >
              Join Pathwise Pro
            </Button>
          </div>

          {/* Tier 3: Team / Enterprise */}
          <div className="rounded-3xl border border-border bg-card p-7 shadow-warm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Team Academy
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  For engineering & design teams upskilling together.
                </p>
              </div>

              <div>
                <span className="font-heading text-4xl font-extrabold text-foreground">
                  {billingCycle === "annual" ? "$49" : "$59"}
                </span>
                <span className="text-xs text-muted-foreground ml-1">/ seat / mo</span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground pt-2">
                {[
                  "Team progress tracking analytics",
                  "Custom internal roadmap tracks",
                  "Centralized billing & seat manager",
                  "Dedicated customer success coach",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => {
                setSelectedTier("Team Academy");
                setMembershipModalOpen(true);
              }}
            >
              Talk to Team Sales
            </Button>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2 text-center sm:text-left">
          <Badge variant="yellow">Student Stories</Badge>
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Loved by 38,000+ Lifelong Learners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={t.name}
              className="rounded-3xl border border-border bg-card p-6 shadow-warm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#FFC94A]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-border flex items-center gap-3">
                <Image
                  src={t.photo}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-border"
                />
                <div>
                  <h4 className="font-heading font-bold text-sm text-foreground">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  <span className="text-[10px] font-bold text-brand-indigo dark:text-brand-yellow">
                    {t.completed}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CLOSING CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-3xl bg-gradient-to-tr from-[#3B3B98] via-[#2A2A72] to-[#1C1C3A] text-white p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-warm-lg">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#FFC94A]/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="px-3 py-1 rounded-full bg-[#FFC94A] text-[#1C1C3A] text-xs font-bold uppercase tracking-wider font-sans inline-block">
              Start Your Trail Today
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              Ready to learn on a visual roadmap?
            </h2>
            <p className="text-sm sm:text-base text-indigo-200 leading-relaxed">
              Join thousands of engineers and designers mastering modern technologies one milestone at a time.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/courses">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-base">
                  Explore Course Catalog
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base border-white/30 text-white hover:bg-white/10"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Go to Demo Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Membership Demo Notice Modal */}
      <MembershipModal
        isOpen={membershipModalOpen}
        onClose={() => setMembershipModalOpen(false)}
        tierName={selectedTier}
      />
    </div>
  );
}
