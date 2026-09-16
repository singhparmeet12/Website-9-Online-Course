"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ExternalLink, GraduationCap, Heart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierName?: string;
}

export function MembershipModal({
  isOpen,
  onClose,
  tierName = "Pathwise Pro",
}: MembershipModalProps) {
  if (!isOpen) return null;

  const portfolioUrl = "https://personal-portfolio-parmeet1.vercel.app/";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1C1C3A]/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
          className="relative w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl overflow-hidden z-10 p-6 sm:p-8 space-y-6"
        >
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="yellow" size="sm">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-brand-yellow" />
                  Showcase Demo
                </Badge>
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground leading-tight">
                Demo Site Notice
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Explanation Message Body */}
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p className="text-foreground font-medium text-base">
              You clicked to join <span className="font-bold text-[#3B3B98] dark:text-[#FFC94A]">{tierName}</span>!
            </p>
            <p>
              This is a <strong>demo showcase website</strong> created to showcase web development and design skills. This is not a real commercial website.
            </p>
            <p className="p-4 rounded-2xl bg-amber-50/80 dark:bg-indigo-950/50 border border-amber-200/80 dark:border-indigo-900/60 text-foreground font-medium text-xs sm:text-sm flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#FFC94A] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Want to make a website like this?</strong>
                <br />
                If you would like a custom website or web application created for your brand or company, feel free to contact me directly through my portfolio!
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1"
            >
              <Button variant="primary" size="md" className="w-full text-sm">
                Contact Me on My Portfolio
                <ExternalLink className="w-4 h-4 ml-1.5" />
              </Button>
            </a>

            <Button
              variant="outline"
              size="md"
              onClick={onClose}
              className="w-full sm:w-auto text-sm"
            >
              Back to Roadmaps
            </Button>
          </div>

          <p className="text-[11px] text-center text-muted-foreground pt-1 flex items-center justify-center gap-1 font-handwriting text-base">
            Crafted with <Heart className="w-3.5 h-3.5 text-brand-coral fill-current inline" /> by Parmeet
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
