# Pathwise — Roadmap-Driven Online Skills Learning Platform

> **Pathwise Learning Platform** • A modern, interactive EdTech learning experience.

![Pathwise Banner](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80)

---

## Overview

**Pathwise** reimagines online education by replacing monolithic, intimidating video playlists with an encouraging **curriculum roadmap** — a visual, connected trail of milestone nodes (like a video game level-select map or trail expedition).

Each course is decomposed into sequential milestones. Completing lessons triggers celebratory feedback loops (milestone unlocks with pop + confetti-lite bursts), live SQLite progress updates, and a dedicated **Student Dashboard** reflecting authentic per-user statistics (streaks, hours learned, next incomplete milestones).

---

## Design System & Aesthetics

- **Warm Sunshine Yellow (`#FFC94A`) + Deep Indigo (`#3B3B98`) + Soft Cream (`#FFF8EC`)**: Light mode foundation creating an encouraging, warm, academic-playful atmosphere.
- **Deep Indigo-Navy (`#1C1C3A`) Dark Mode**: Rich, low-contrast navy base with high-visibility sunshine yellow and soft coral (`#FF7A5C`) completion accents.
- **Friendly Typography**:
  - **Headings**: `Outfit` (Google Fonts) — friendly, rounded, humanistic sans.
  - **Body**: `Inter` — highly legible, clean workhorse typography.
  - **Handwritten Accents**: `Caveat` — used exclusively for physical-style "sticky note" callouts, learning tips, and encouraging streak micro-copy (*"You're on a 5-day streak! 🔥"*).
- **Physical "Sticky Note" Elements**: Angled notes (`-2deg` to `+1.5deg`) with simulated tape/pushpin hardware, paper drop shadows, and handwriting font.

---

## Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Database & ORM**: Prisma 5 with SQLite (`dev.db` for instant local zero-config run; portable to Vercel Postgres, Turso, or Neon)
- **Styling**: Tailwind CSS + custom semantic design tokens + modern accessible scrollbars
- **Motion & Celebration**: Framer Motion (spring transitions, staggered roadmap entry) + Canvas-Confetti (lightweight celebration) with full `prefers-reduced-motion` compliance
- **Validation**: Zod (type-safe validation for enrollments, progress updates, filtering, and newsletter)
- **Rate Limiting**: Sliding window in-memory per-IP limiter for serverless API routes
- **Icons**: Lucide React

---

## Portfolio Architecture Notice: The "Demo Student" Auth Pattern

To make this portfolio piece immediately testable without requiring external OAuth configuration (GitHub/Google keys) or email verification servers, Pathwise implements a transparent **Session-less Demo Student profile**:

- **Demo Student Identity**: `Alex Turner` (`alex.turner@pathwise.edu` / ID `demo-student-alex`)
- **Real Database Writes**: Every enrollment, lesson completion toggle, XP update, and streak recalculation writes directly to SQLite through Prisma parameterized queries.
- **Production Equivalency**: In an enterprise production deployment, this mechanism would be replaced with NextAuth.js / Auth.js, JWT/session cookie validation, and Row-Level Security (RLS) ensuring strict multi-tenant isolation.

---

## Quick Start & Local Development

### 1. Clone & Install
```bash
# Clone the repository and navigate to the directory
cd "Website 9 Online Course"

# Install dependencies (Next.js 14, Tailwind, Prisma, Framer Motion, etc.)
npm install
```

### 2. Initialize Database & Seed
```bash
# Create SQLite tables
npm run db:push

# Seed courses, instructors, lessons, and demo student progress
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Seed Data Summary

- **Instructors (4)**:
  - `Dr. Marcus Vance` (Principal Engineer, 14+ yrs distributed systems)
  - `Elena Rostova` (Design Systems Director, ex-Figma/Linear)
  - `Maya Lin-Chen` (Senior AI Engineer, Applied GenAI & LLM Tools)
  - `Devon Brooks` (Cross-Platform Mobile Lead, React Native/Expo)
- **Courses (6)**:
  1. `Full-Stack Next.js & Modern Web Architecture` (Pre-enrolled at 40% progress)
  2. `Design Systems & Micro-Interactions Mastery` (Pre-enrolled at 11% progress)
  3. `Applied Generative AI for Frontend Engineers` (Ready to test "Enroll Now")
  4. `Interactive Data Visualization with D3 & SVG`
  5. `Cross-Platform Mobile Apps with React Native & Expo`
  6. `Creative Web Physics & Interactive Shaders`

---

## Key Features & User Flows

1. **The Interactive Curriculum Roadmap (`/courses/[slug]`)**:
   - Desktop: Serpentine alternating S-curve milestone trail connected by dashed SVG lines.
   - Mobile: Responsive vertical stepping-stone trail with ≥48px touch targets.
   - Click milestone nodes to expand curriculum modules.
   - Launch the interactive lesson viewer (videos, interactive markdown reading, or multiple-choice quiz).
   - Click **"Mark Lesson Complete"**: writes to database, triggers milestone celebration (confetti + XP toast), and updates the progress ring.

2. **The Student Dashboard (`/dashboard`)**:
   - Stats band: Courses In Progress, Lessons Completed, 5-day streak 🔥, Hours Learned.
   - "Continue Learning" jumpcard deep-linking directly to your next incomplete lesson.
   - Enrolled course cards with mini-roadmap milestone steppers.
   - "Reset Demo Progress" one-click button to reset data for clean evaluation.

3. **Filterable Course Catalog (`/courses`)**:
   - Instant search bar.
   - Category filtering (Web Dev, UI/UX, AI, Mobile).
   - Difficulty level filtering (Beginner, Intermediate, Advanced).
   - Mobile filter drawer.

4. **Sun / Moon Theme Switcher**:
   - Seamless next-themes toggle between Soft Cream and Deep Indigo-Navy.
   - Zero-FOUC inline hydration.

---

## Deploying to Vercel

1. Push your repository to GitHub.
2. In the Vercel Dashboard, import the repository.
3. Configure Environment Variables:
   - For temporary / demo deployment with SQLite, no extra variables are required.
   - For persistent Postgres/Turso production databases, set:
     ```env
     DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
     ```
     and update `datasource db.provider` in `prisma/schema.prisma` to `"postgresql"`.
4. Deploy! Next.js 14 and Prisma build automatically via `npm run build`.

---

## License

MIT © Pathwise Learning Inc. All rights reserved.
