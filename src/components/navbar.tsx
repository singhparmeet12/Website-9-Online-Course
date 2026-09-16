"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Compass,
  Menu,
  X,
  Flame,
  LayoutDashboard,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { label: "Courses", href: "/courses" },
    { label: "Roadmaps", href: "/courses/nextjs-fullstack-architecture" },
    { label: "Instructors", href: "/#instructors" },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-[#FFF8EC]/90 dark:bg-[#1C1C3A]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group select-none py-1"
          aria-label="Pathwise Home"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B3B98] to-[#FFC94A] p-0.5 shadow-sm transform transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-[14px] bg-[#3B3B98] text-[#FFC94A] flex items-center justify-center">
              <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-xl tracking-tight text-foreground flex items-center gap-1">
              Pathwise
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-[#FFC94A]/20 text-brand-indigo dark:text-brand-yellow font-sans font-bold">
                edu
              </span>
            </span>
            <span className="text-[10px] text-muted-foreground -mt-1 font-medium tracking-wide">
              Roadmap-Driven Learning
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-sm font-heading font-medium transition-all duration-150",
                  isActive
                    ? "text-[#3B3B98] bg-amber-100/70 dark:text-[#FFC94A] dark:bg-indigo-950/60 font-semibold"
                    : "text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Theme Sun/Moon Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-border text-foreground hover:bg-amber-100/50 dark:hover:bg-indigo-950/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-[#FFC94A] transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-[#3B3B98] transition-transform hover:-rotate-12" />
              )}
            </button>
          )}

          {/* Student Dashboard Direct Jump */}
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "border-amber-300/80 dark:border-indigo-800 bg-amber-50/50 dark:bg-indigo-950/40",
                pathname === "/dashboard" && "ring-2 ring-[#FFC94A]"
              )}
            >
              <LayoutDashboard className="w-4 h-4 mr-1.5 text-brand-indigo dark:text-brand-yellow" />
              <span>Dashboard</span>
              <span className="ml-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 text-[10px] font-bold font-sans">
                <Flame className="w-3 h-3 fill-current" />
                5d
              </span>
            </Button>
          </Link>

          {/* Browse Courses CTA */}
          <Link href="/courses">
            <Button variant="primary" size="sm">
              <GraduationCap className="w-4 h-4 mr-1.5" />
              Browse Courses
            </Button>
          </Link>
        </div>

        {/* Mobile top actions */}
        <div className="flex sm:hidden items-center gap-1.5">
          {/* Mobile Streak Pill */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-orange-100 dark:bg-orange-950/80 border border-orange-200 dark:border-orange-900/60 text-orange-600 dark:text-orange-400 text-xs font-bold font-sans shadow-xs"
            aria-label="View 5-day streak on dashboard"
          >
            <Flame className="w-3.5 h-3.5 fill-current animate-pulse-subtle" />
            <span>5d</span>
          </Link>

          {/* Mobile Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-8 h-8 rounded-xl flex items-center justify-center border border-border text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-[#FFC94A]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#3B3B98]" />
              )}
            </button>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl border border-border text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-border bg-[#FFF8EC] dark:bg-[#1C1C3A] px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-base font-heading font-medium text-foreground hover:bg-amber-100/60 dark:hover:bg-indigo-950/60"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="md" className="w-full justify-start">
                <LayoutDashboard className="w-4 h-4 mr-2 text-brand-indigo dark:text-brand-yellow" />
                <span>My Dashboard</span>
                <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 text-xs font-bold font-sans">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  5d Streak
                </span>
              </Button>
            </Link>

            <Link href="/courses" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                <GraduationCap className="w-4 h-4 mr-2" />
                Browse All Courses
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
