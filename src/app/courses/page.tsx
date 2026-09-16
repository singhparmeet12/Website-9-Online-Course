"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  Clock,
  BookOpen,
  ArrowRight,
  SlidersHorizontal,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";

interface CourseItem {
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
    avatar: string;
  };
  modulesCount: number;
  lessonsCount: number;
  isEnrolled: boolean;
  progressPercent: number;
}

const CATEGORIES = ["All", "Web Development", "UI/UX Design", "AI & Data", "Mobile"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const shouldReduceMotion = useReducedMotion();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      if (selectedLevel !== "All") params.set("level", selectedLevel);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/courses?${params.toString()}`);
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header Banner */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-brand-indigo dark:bg-indigo-950/70 dark:text-brand-yellow text-xs font-bold font-sans">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curriculum Roadmaps</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground">
          Explore Learning Journeys
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          Every Pathwise course is structured as a clear, milestone-driven roadmap. Pick a path, track your real progress, and build portfolio-grade skills.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-warm">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by course topic or skill (e.g. Next.js, Design Systems)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          />
        </form>

        {/* Desktop Category Filters */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#3B3B98] text-white dark:bg-[#FFC94A] dark:text-[#181830] shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex lg:hidden items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {courses.length} courses found
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
            Filters & Levels
          </Button>
        </div>
      </div>

      {/* Desktop Level Filters sub-bar */}
      <div className="hidden lg:flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Difficulty Level:</span>
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedLevel === lvl
                  ? "bg-amber-100 text-brand-indigo dark:bg-indigo-950 dark:text-brand-yellow font-bold"
                  : "hover:text-foreground"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
        <span>Showing {courses.length} courses</span>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 bg-[#1C1C3A]/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl border border-border p-6 shadow-2xl z-10 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-heading font-bold text-lg text-foreground">
                Filter Courses
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-heading font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-[#3B3B98] text-white dark:bg-[#FFC94A] dark:text-[#181830]"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Level selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Difficulty Level
              </label>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-heading font-semibold transition-all ${
                      selectedLevel === lvl
                        ? "bg-amber-100 text-brand-indigo dark:bg-indigo-950 dark:text-brand-yellow font-bold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full"
            >
              Apply Filters ({courses.length} Results)
            </Button>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 h-96 animate-pulse space-y-4"
            >
              <div className="w-full h-44 rounded-2xl bg-muted" />
              <div className="w-3/4 h-6 rounded bg-muted" />
              <div className="w-full h-4 rounded bg-muted" />
              <div className="w-1/2 h-4 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 space-y-4 bg-card rounded-3xl border border-border p-8">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="font-heading text-xl font-bold text-foreground">
            No courses found
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search terms or clearing filters to explore all roadmaps.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory("All");
              setSelectedLevel("All");
              setSearchQuery("");
            }}
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={shouldReduceMotion ? undefined : { y: 16, opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={shouldReduceMotion ? undefined : { y: -5 }}
              className="rounded-2xl sm:rounded-3xl border border-border bg-card overflow-hidden shadow-warm hover:shadow-warm-lg transition-all flex flex-col justify-between group"
            >
              {/* Card Image Banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Badges on Top */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <Badge variant="yellow" size="sm">
                    {course.category}
                  </Badge>
                </div>

                <div className="absolute top-3 right-3">
                  <Badge variant="muted" size="sm" className="bg-black/60 text-white border-0 backdrop-blur-sm">
                    {course.level}
                  </Badge>
                </div>

                {/* Rating & Duration on bottom banner */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-1 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-[#FFC94A] text-[#FFC94A]" />
                    {course.rating} ({course.reviewsCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.durationHours}h
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground leading-snug group-hover:text-[#3B3B98] dark:group-hover:text-[#FFC94A] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Embedded Mini-Progress if Student is Enrolled */}
                {course.isEnrolled && (
                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-indigo-950/40 border border-amber-200/60 dark:border-indigo-850/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Enrolled
                      </span>
                      <span className="font-bold text-foreground">
                        {course.progressPercent}% complete
                      </span>
                    </div>
                    <ProgressBar
                      percentage={course.progressPercent}
                      height={6}
                      color={course.progressPercent === 100 ? "coral" : "yellow"}
                    />
                  </div>
                )}

                {/* Instructor Row & Action */}
                <div className="pt-3 border-t border-border/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Image
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-border"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {course.instructor.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {course.modulesCount} modules • {course.lessonsCount} lessons
                      </p>
                    </div>
                  </div>

                  <Link href={`/courses/${course.slug}`}>
                    <Button variant={course.isEnrolled ? "primary" : "outline"} size="sm">
                      {course.isEnrolled ? "Resume" : "Explore"}
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
