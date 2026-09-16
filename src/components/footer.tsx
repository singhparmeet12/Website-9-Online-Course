"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Mail,
  ArrowRight,
  Sparkles,
  Heart,
  Github,
  Twitter,
  Linkedin,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to subscribe. Please try again.");
    }
  };

  return (
    <footer className="w-full border-t border-border bg-[#FFF8EC] dark:bg-[#1C1C3A] transition-colors mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-28 sm:py-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3B3B98] to-[#FFC94A] p-0.5">
                <div className="w-full h-full rounded-[10px] bg-[#3B3B98] text-[#FFC94A] flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-foreground">
                Pathwise
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Empowering engineers and designers through roadmap-driven learning journeys. Master modern skills milestone by milestone with zero fluff.
            </p>

            {/* Newsletter Box */}
            <div className="pt-2">
              <p className="text-xs font-heading font-bold text-foreground mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
                Get a new free lesson every week
              </p>
              {status === "success" ? (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You're in! Watch your inbox for this week's milestone guide.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={status === "loading"}
                    className="flex-shrink-0"
                  >
                    Join
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </form>
              )}
              {status === "error" && (
                <p className="text-[11px] text-rose-500 mt-1">{errorMsg}</p>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
              Learning Paths
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/courses" className="hover:text-foreground transition-colors">
                  Web Architecture
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-foreground transition-colors">
                  Design Systems & Tokens
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-foreground transition-colors">
                  Applied Generative AI
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-foreground transition-colors">
                  Interactive Data Viz
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-foreground transition-colors">
                  Cross-Platform Mobile
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/courses/nextjs-fullstack-architecture" className="hover:text-foreground transition-colors">
                  Interactive Roadmap Demo
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/#instructors" className="hover:text-foreground transition-colors">
                  Meet the Instructors
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-foreground transition-colors">
                  Pricing & Memberships
                </Link>
              </li>
              <li>
                <Link href="/#why-pathwise" className="hover:text-foreground transition-colors">
                  Why Pathwise
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Legal */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
              About Pathwise
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Designed & built as an interactive learning platform demonstrating visual curriculum roadmaps, real-time progress tracking, and celebratory learning mechanics.
            </p>
            <div className="pt-2 flex items-center gap-3 text-muted-foreground">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="GitHub repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Twitter profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-12 pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Pathwise Learning Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 font-handwriting text-base text-foreground">
            Crafted with <Heart className="w-3.5 h-3.5 text-brand-coral fill-current inline" /> for lifelong learners.
          </p>
        </div>
      </div>
    </footer>
  );
}
