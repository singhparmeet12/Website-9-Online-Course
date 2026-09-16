"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Compass,
  Layers,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  exact?: boolean;
}

export function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navItems: NavItem[] = [
    {
      label: "Home",
      href: "/",
      icon: Compass,
      exact: true,
    },
    {
      label: "Roadmaps",
      href: "/courses/nextjs-fullstack-architecture",
      icon: Layers,
    },
    {
      label: "Courses",
      href: "/courses",
      icon: GraduationCap,
      exact: true,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: "5d 🔥",
    },
    {
      label: "Pro",
      href: "/#pricing",
      icon: Sparkles,
    },
  ];

  const checkIsActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    if (item.href === "/#pricing") {
      return false;
    }
    return pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
  };

  return (
    <nav
      aria-label="Mobile Navigation Dock"
      className="fixed bottom-3 inset-x-3 sm:hidden z-50 max-w-md mx-auto"
    >
      <div className="glass-panel border border-amber-300/80 dark:border-indigo-850/90 shadow-[0_12px_30px_rgba(59,59,152,0.22)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.6)] rounded-2xl px-2 py-1.5 flex items-center justify-around gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = checkIsActive(item);

          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors select-none group"
            >
              {/* Active animated pill indicator */}
              {isActive && (
                <motion.div
                  layoutId="mobileNavActivePill"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  className="absolute inset-0 bg-[#3B3B98] text-[#FFC94A] dark:bg-[#FFC94A] dark:text-[#181830] rounded-xl -z-10 shadow-sm"
                />
              )}

              {/* Icon & optional mini badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                    isActive
                      ? "text-[#FFC94A] dark:text-[#181830] scale-105"
                      : "text-foreground/70 dark:text-foreground/75"
                  )}
                />
                {item.badge && !isActive && (
                  <span className="absolute -top-1.5 -right-3 px-1 py-0.2 rounded-full bg-orange-500 text-white text-[8px] font-bold font-sans tracking-tight shadow-xs flex items-center">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-heading font-semibold mt-0.5 tracking-tight transition-colors",
                  isActive
                    ? "text-[#FFC94A] dark:text-[#181830] font-bold"
                    : "text-foreground/70 dark:text-foreground/75"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
