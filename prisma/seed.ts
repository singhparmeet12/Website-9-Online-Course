import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Pathwise database seed...");

  // Clean up existing data to ensure idempotent seeding
  await prisma.lessonCompletion.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.instructor.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.newsletterSubscriber.deleteMany({});

  // 1. Seed Demo Student
  const demoUser = await prisma.user.create({
    data: {
      id: "demo-student-alex",
      email: "alex.turner@pathwise.edu",
      name: "Alex Turner",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      streakDays: 5,
      xpPoints: 1420,
    },
  });

  // 2. Seed Instructors
  const marcus = await prisma.instructor.create({
    data: {
      id: "inst-marcus",
      name: "Dr. Marcus Vance",
      title: "Principal Engineer & Former Tech Lead",
      bio: "14+ years building high-throughput distributed web systems. Creator of several popular open-source state machines and architecture guides.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      rating: 4.98,
      studentsCount: 16400,
      courseCount: 4,
      specialties: JSON.stringify(["TypeScript", "Next.js Architecture", "Performance"]),
    },
  });

  const elena = await prisma.instructor.create({
    data: {
      id: "inst-elena",
      name: "Elena Rostova",
      title: "Lead Product Designer & Design Systems Architect",
      bio: "Previously Staff Designer at Figma and Linear. Obsessed with micro-interactions, accessible design tokens, and fluid animation curves.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      rating: 4.96,
      studentsCount: 11200,
      courseCount: 3,
      specialties: JSON.stringify(["Design Systems", "Figma", "Micro-Interactions", "Accessibility"]),
    },
  });

  const maya = await prisma.instructor.create({
    data: {
      id: "inst-maya",
      name: "Maya Lin-Chen",
      title: "Senior AI Engineer & Creative Technologist",
      bio: "Bridges the gap between foundational models and intuitive product UX. Teaches frontend developers how to leverage LLM APIs and function calling.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
      rating: 4.97,
      studentsCount: 13500,
      courseCount: 3,
      specialties: JSON.stringify(["Applied GenAI", "Agentic UI", "Streaming APIs", "Python"]),
    },
  });

  const devon = await prisma.instructor.create({
    data: {
      id: "inst-devon",
      name: "Devon Brooks",
      title: "Cross-Platform Mobile Tech Lead",
      bio: "Shipped top-chart iOS and Android applications used by millions. Passionate about native gestures, fluid transitions, and offline-first sync.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      rating: 4.92,
      studentsCount: 8900,
      courseCount: 2,
      specialties: JSON.stringify(["React Native", "Expo", "Native Gestures", "Mobile UX"]),
    },
  });

  // 3. Seed Courses with Modules and Lessons
  // Course 1: Full-Stack Next.js & Modern Web Architecture
  const course1 = await prisma.course.create({
    data: {
      id: "course-nextjs",
      slug: "nextjs-fullstack-architecture",
      title: "Full-Stack Next.js & Modern Web Architecture",
      tagline: "Master the mental model of Server Components, Streaming SSR, and high-performance full-stack web applications.",
      description: "Step beyond the basics into true production architecture. Learn how React Server Components reshape state, how to optimize streaming data boundaries, and how to structure robust mutation pipelines with zero runtime friction.",
      category: "Web Development",
      level: "Intermediate",
      durationHours: 14.5,
      price: 0,
      rating: 4.98,
      reviewsCount: 384,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      featured: true,
      instructorId: marcus.id,
      modules: {
        create: [
          {
            title: "The Next.js 14 Mental Model",
            order: 1,
            description: "Understand the unified client-server mental model, request lifecycles, and component tree boundaries.",
            icon: "compass",
            lessons: {
              create: [
                {
                  title: "Deconstructing the App Router & File Conventions",
                  order: 1,
                  durationMinutes: 18,
                  type: "video",
                  summary: "A deep dive into route segments, layouts, templates, and how Next.js stitches subtrees together on navigation.",
                  content: "In this lesson, we break down how Next.js 14 handles nested layout preservation, page rendering contexts, and metadata inheritance.",
                  videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
                },
                {
                  title: "Server vs. Client Components Boundary Map",
                  order: 2,
                  durationMinutes: 22,
                  type: "reading",
                  summary: "Learn the golden rule of composition: passing server children into client wrappers to eliminate client-bundle bloat.",
                  content: "### The Composition Pattern\n\nWhen a Client Component needs to wrap server-rendered content, never import the Server Component directly. Instead, accept it via the `children` prop.\n\n```tsx\n// ClientWrapper.tsx\n'use client';\nexport function ClientWrapper({ children }: { children: React.ReactNode }) {\n  const [isOpen, setIsOpen] = useState(false);\n  return <div onClick={() => setIsOpen(!isOpen)}>{children}</div>;\n}\n```",
                },
                {
                  title: "Mental Model Mastery Quiz",
                  order: 3,
                  durationMinutes: 12,
                  type: "quiz",
                  summary: "Test your understanding of boundary boundaries, hydration triggers, and bundle isolation.",
                  content: "Check your knowledge on when to use `use client`, how props serialize over the wire, and how layouts avoid remounting.",
                },
              ],
            },
          },
          {
            title: "Streaming SSR & Suspense Boundaries",
            order: 2,
            description: "Eliminate blocking server requests with granular Suspense wrappers and instant skeleton transitions.",
            icon: "layout",
            lessons: {
              create: [
                {
                  title: "Configuring Granular Suspense Boundaries",
                  order: 1,
                  durationMinutes: 24,
                  type: "video",
                  summary: "Stop letting slow database queries block initial TTFB. Learn how to stream slow chunks incrementally.",
                  content: "Watch how parallel data streaming works with React 18 and Next.js App Router.",
                  videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
                },
                {
                  title: "Instant Loading States & Skeleton Design",
                  order: 2,
                  durationMinutes: 16,
                  type: "reading",
                  summary: "Techniques for skeleton loading that match production geometry without causing layout shifts.",
                  content: "Designing fluid skeleton placeholders that maintain precise aspect ratios and prevent Cumulative Layout Shift (CLS).",
                },
                {
                  title: "Streaming Architecture Quiz",
                  order: 3,
                  durationMinutes: 10,
                  type: "quiz",
                  summary: "Verify how the HTTP response stream flushes chunks and how browsers render partial DOM nodes.",
                  content: "Interactive quiz on HTTP chunked transfer encoding and Suspense fallback lifecycles.",
                },
              ],
            },
          },
          {
            title: "Mutations, Forms & Optimistic Updates",
            order: 3,
            description: "Handle writes gracefully with Server Actions, Zod validation, and zero-latency optimistic rollbacks.",
            icon: "code",
            lessons: {
              create: [
                {
                  title: "Server Actions: Security, Validation & Lifecycles",
                  order: 1,
                  durationMinutes: 28,
                  type: "video",
                  summary: "How Server Actions work under the hood as POST endpoints, with automatic CSRF protection and closure serialization.",
                  content: "Learn the proper way to sanitize input with Zod before running transactional database mutations.",
                  videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
                },
                {
                  title: "useOptimistic: Seamless Instant UI Feedback",
                  order: 2,
                  durationMinutes: 20,
                  type: "reading",
                  summary: "Implement buttery-smooth optimistic state updates with automatic rollback if network requests fail.",
                  content: "Step-by-step implementation of `useOptimistic` hook with React 18 transitions.",
                },
                {
                  title: "Mutations Practice Workshop",
                  order: 3,
                  durationMinutes: 25,
                  type: "reading",
                  summary: "Hands-on project: building an optimistic course bookmarking and review submission module.",
                  content: "Interactive coding walkthrough with code diffs and error boundary patterns.",
                },
              ],
            },
          },
          {
            title: "Database Architecture, Prisma & Caching",
            order: 4,
            description: "Connect to modern databases with Prisma ORM, understand connection pooling, and leverage Data Cache.",
            icon: "database",
            lessons: {
              create: [
                {
                  title: "Prisma Modeling, Indexes & Migration Workflows",
                  order: 1,
                  durationMinutes: 30,
                  type: "video",
                  summary: "Design relational models that scale, write clean migrations, and prevent N+1 query traps.",
                  content: "In-depth guide to relational database schema design, foreign keys, and cascading deletes.",
                },
                {
                  title: "The Next.js Data Cache & Tagged Invalidation",
                  order: 2,
                  durationMinutes: 22,
                  type: "reading",
                  summary: "Master `unstable_cache`, `revalidateTag`, and `revalidatePath` to keep cached pages lightning fast.",
                  content: "Deep exploration of Next.js four-tiered caching architecture.",
                },
                {
                  title: "Cache Invalidation Checkpoint",
                  order: 3,
                  durationMinutes: 12,
                  type: "quiz",
                  summary: "Test your cache invalidation strategies and edge revalidation flows.",
                  content: "Scenario-based questions on edge caching and on-demand revalidation.",
                },
              ],
            },
          },
          {
            title: "Production Deployment & Core Web Vitals",
            order: 5,
            description: "Deploy to Vercel, optimize LCP/INP/CLS metrics, set up telemetry, and achieve 100/100 Lighthouse scores.",
            icon: "rocket",
            lessons: {
              create: [
                {
                  title: "Core Web Vitals Optimization Deep Dive",
                  order: 1,
                  durationMinutes: 26,
                  type: "video",
                  summary: "Identify slow server scripts, optimize font loading with next/font, and minimize bundle execution time.",
                  content: "Practical auditing using Chrome DevTools Performance panel and Web Vitals extension.",
                },
                {
                  title: "Zero-Downtime Deployment & Environment Hardening",
                  order: 2,
                  durationMinutes: 18,
                  type: "reading",
                  summary: "Setup preview environments, automated database migrations, and production secrets management.",
                  content: "Checklist for deploying production Next.js apps with strict security headers and CSP rules.",
                },
                {
                  title: "Final Capstone Certification Project",
                  order: 3,
                  durationMinutes: 45,
                  type: "reading",
                  summary: "Build and deploy a full-scale interactive web application following all course best practices.",
                  content: "Capstone project guidelines, rubric, and submission requirements for certificate issuance.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Course 2: Design Systems & Micro-Interactions Mastery
  const course2 = await prisma.course.create({
    data: {
      id: "course-design-systems",
      slug: "design-systems-micro-interactions",
      title: "Design Systems & Micro-Interactions Mastery",
      tagline: "Craft cohesive, accessible, and delight-driven design systems with fluid physics and modern CSS.",
      description: "From atomic design tokens to delightful celebratory micro-animations. Learn how top tech companies build living design systems that bridge Figma and production code seamlessly.",
      category: "UI/UX Design",
      level: "Beginner",
      durationHours: 10.0,
      price: 0,
      rating: 4.96,
      reviewsCount: 245,
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
      featured: true,
      instructorId: elena.id,
      modules: {
        create: [
          {
            title: "Design Tokens & Semantic Foundations",
            order: 1,
            description: "Build a robust palette, typography scale, spacing units, and dark-mode token architecture.",
            icon: "compass",
            lessons: {
              create: [
                {
                  title: "The Science of Harmonious Color Palettes",
                  order: 1,
                  durationMinutes: 20,
                  type: "video",
                  summary: "Why generic hex colors fail in dark mode, and how to build perceived-brightness matching scales.",
                  content: "Explore HSL, OKLCH, and functional token hierarchy across light and dark contexts.",
                },
                {
                  title: "Typography Scales & Optical Sizing",
                  order: 2,
                  durationMinutes: 16,
                  type: "reading",
                  summary: "Pairing rounded friendly display fonts with ultra-legible body sans and expressive accent typefaces.",
                  content: "How font-feature-settings, line-height proportions, and tracking create effortless hierarchy.",
                },
                {
                  title: "Foundations Checkpoint Quiz",
                  order: 3,
                  durationMinutes: 10,
                  type: "quiz",
                  summary: "Test your knowledge of semantic tokens, contrast ratios (APCA / WCAG 2.2), and scale math.",
                  content: "Test your understanding of AAA contrast standards and token naming conventions.",
                },
              ],
            },
          },
          {
            title: "Component Architecture & State Machines",
            order: 2,
            description: "Structure resilient UI primitives with complete keyboard accessibility and focus management.",
            icon: "layout",
            lessons: {
              create: [
                {
                  title: "Accessible Primitives with Radix UI & ARIA",
                  order: 1,
                  durationMinutes: 25,
                  type: "video",
                  summary: "Building accordions, dialogs, and progress rings that conform strictly to WAI-ARIA 1.2 patterns.",
                  content: "Live walkthrough building fully keyboard-navigable components.",
                },
                {
                  title: "Component State Matrix: Default to Celebratory",
                  order: 2,
                  durationMinutes: 18,
                  type: "reading",
                  summary: "Mapping every component state: default, hover, focus-visible, active, disabled, loading, and completed.",
                  content: "Why state completeness is what separates junior UI from world-class design systems.",
                },
              ],
            },
          },
          {
            title: "Fluid Physics & Encouraging Motion",
            order: 3,
            description: "Animate with purpose using Framer Motion springs, celebratory pops, and particle celebrations.",
            icon: "rocket",
            lessons: {
              create: [
                {
                  title: "Spring Physics vs. Linear Transitions",
                  order: 1,
                  durationMinutes: 22,
                  type: "video",
                  summary: "Why real-world physical mass, stiffness, and damping feel organic and comforting to human eyes.",
                  content: "Configuring Framer Motion `type: 'spring'` parameters for intuitive card lifts and button presses.",
                },
                {
                  title: "Designing Celebratory Feedback Loops",
                  order: 2,
                  durationMinutes: 15,
                  type: "reading",
                  summary: "How confetti-lite bursts, milestone unlocks, and sound effects boost learning habit retention by 38%.",
                  content: "Case studies on Duolingo, Linear, and Stripe motivational micro-moments.",
                },
              ],
            },
          },
          {
            title: "Documentation & Living Component Catalog",
            order: 4,
            description: "Package your design system for cross-team adoption with interactive sandboxes and zero-friction handoff.",
            icon: "book",
            lessons: {
              create: [
                {
                  title: "Creating Interactive Playground Sandboxes",
                  order: 1,
                  durationMinutes: 20,
                  type: "video",
                  summary: "Set up component previews with live property controls, copy-paste snippets, and variant switchers.",
                  content: "Building developer-friendly documentation that teammates actually love to use.",
                },
                {
                  title: "Design System Capstone Showcase",
                  order: 2,
                  durationMinutes: 30,
                  type: "reading",
                  summary: "Assemble a complete interactive UI kit and publish your personal portfolio design system.",
                  content: "Step-by-step submission checklist for your final design system review.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Course 3: Applied Generative AI for Frontend Engineers
  const course3 = await prisma.course.create({
    data: {
      id: "course-genai",
      slug: "applied-genai-frontend",
      title: "Applied Generative AI for Frontend Engineers",
      tagline: "Build streaming AI assistants, multimodal chat, and structured agentic UI with modern web APIs.",
      description: "Stop writing generic ChatGPT wrappers. Learn to engineer resilient, production-ready AI applications with structured JSON schema outputs, streaming UI updates, and tool-calling interfaces.",
      category: "AI & Data",
      level: "Intermediate",
      durationHours: 12.0,
      price: 49,
      rating: 4.97,
      reviewsCount: 198,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      featured: true,
      instructorId: maya.id,
      modules: {
        create: [
          {
            title: "Foundations: LLM Architecture & Structured Output",
            order: 1,
            description: "How token generation works, context windows, and forcing 100% reliable schema validation.",
            icon: "compass",
            lessons: {
              create: [
                {
                  title: "From Raw Prompts to Type-Safe JSON Schemas",
                  order: 1,
                  durationMinutes: 22,
                  type: "video",
                  summary: "Using Zod schemas to guarantee runtime type safety when interacting with generative models.",
                  content: "Never parse markdown code blocks again. Learn native JSON Schema and constrained decoding.",
                },
                {
                  title: "System Prompt Architecture & Few-Shot Guidance",
                  order: 2,
                  durationMinutes: 18,
                  type: "reading",
                  summary: "Structuring robust system prompts that prevent jailbreaks and maintain brand tone.",
                  content: "Best practices for temperature, top_p, and grounding your prompts with user context.",
                },
              ],
            },
          },
          {
            title: "Streaming Responses & Real-Time Token UI",
            order: 2,
            description: "Render tokens as they arrive over Server-Sent Events with markdown parsing and copyable blocks.",
            icon: "code",
            lessons: {
              create: [
                {
                  title: "ReadableStream & Server-Sent Events (SSE)",
                  order: 1,
                  durationMinutes: 26,
                  type: "video",
                  summary: "Implementing SSE endpoints in Next.js API routes with zero third-party lock-in.",
                  content: "Handling reader locks, cancellation signals, and graceful network reconnection.",
                },
                {
                  title: "Smooth Auto-Scroll & Typing Cursor Effects",
                  order: 2,
                  durationMinutes: 16,
                  type: "reading",
                  summary: "Building an accessible chat transcript that respects user scroll position when reading history.",
                  content: "Techniques to prevent erratic jumping during rapid token bursts.",
                },
              ],
            },
          },
          {
            title: "Function Calling & Agentic Interactive Tools",
            order: 3,
            description: "Empower LLMs to invoke your frontend tools: search databases, plot charts, and execute actions.",
            icon: "rocket",
            lessons: {
              create: [
                {
                  title: "Defining Client & Server Tools",
                  order: 1,
                  durationMinutes: 28,
                  type: "video",
                  summary: "How tool schemas are exposed to the model, and orchestrating multi-step execution loops.",
                  content: "Creating declarative tools that let users book appointments or filter search results via conversation.",
                },
                {
                  title: "Generative UI: Rendering Dynamic Components",
                  order: 2,
                  durationMinutes: 24,
                  type: "reading",
                  summary: "Returning interactive React components rather than static text when tools resolve.",
                  content: "Architecting a component registry that maps tool payloads directly to rich UI widgets.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Course 4: Interactive Data Visualization with D3 & Canvas
  const course4 = await prisma.course.create({
    data: {
      id: "course-dataviz",
      slug: "interactive-data-visualization",
      title: "Interactive Data Visualization with D3 & SVG",
      tagline: "Turn complex raw datasets into breathtaking, interactive charts, maps, and dynamic visual narratives.",
      description: "Master SVG path generation, scales, continuous color ramps, and enter/update/exit lifecycles to create editorial-grade data stories that inform and captivate.",
      category: "Web Development",
      level: "Advanced",
      durationHours: 16.0,
      price: 59,
      rating: 4.94,
      reviewsCount: 162,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      featured: false,
      instructorId: marcus.id,
      modules: {
        create: [
          {
            title: "Mathematical Foundations & Coordinate Systems",
            order: 1,
            description: "SVG viewports, viewBox calculations, Cartesian transformations, and responsive scaling.",
            icon: "compass",
            lessons: {
              create: [
                {
                  title: "The SVG Geometry Playground",
                  order: 1,
                  durationMinutes: 20,
                  type: "video",
                  summary: "Mastering `<path>`, Bezier curves, arcs, and responsive aspect-ratio containment.",
                  content: "How SVG viewBox parameters map to browser layout boxes and responsive containers.",
                },
                {
                  title: "Linear, Logarithmic & Band Scales",
                  order: 2,
                  durationMinutes: 18,
                  type: "reading",
                  summary: "Mapping mathematical data domains to visual pixel ranges with D3 scale primitives.",
                  content: "Complete reference for `scaleLinear`, `scaleBand`, `scaleTime`, and threshold scales.",
                },
              ],
            },
          },
          {
            title: "Dynamic Visual Narratives & Interactive Hover",
            order: 2,
            description: "Tooltips, crosshairs, voronoi hit-testing, and buttery-smooth brush interactions.",
            icon: "layout",
            lessons: {
              create: [
                {
                  title: "Voronoi Diagrams for Pixel-Perfect Hit Detection",
                  order: 1,
                  durationMinutes: 24,
                  type: "video",
                  summary: "Why standard mouseover fails on dense scatterplots and how Voronoi polygons save user experience.",
                  content: "Implementing Delaunay triangulation in React for instant, magnetic hover tooltips.",
                },
                {
                  title: "Fluid Chart Transitions & Morphing Paths",
                  order: 2,
                  durationMinutes: 22,
                  type: "reading",
                  summary: "Interpolating between bar charts, area charts, and donut representations without breaking layout.",
                  content: "Step-by-step path interpolation with flubber and d3-interpolate-path.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Course 5: Cross-Platform Mobile Apps with React Native & Expo
  const course5 = await prisma.course.create({
    data: {
      id: "course-react-native",
      slug: "react-native-expo-craft",
      title: "Cross-Platform Mobile Apps with React Native & Expo",
      tagline: "Build native-feeling iOS and Android experiences with Expo Router, Reanimated 3, and gesture physics.",
      description: "Learn mobile engineering the right way: file-based native routing, 120 FPS gesture interactions, haptic feedback, and local SQLite offline sync for seamless user retention.",
      category: "Mobile",
      level: "Beginner",
      durationHours: 11.5,
      price: 39,
      rating: 4.92,
      reviewsCount: 178,
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
      featured: false,
      instructorId: devon.id,
      modules: {
        create: [
          {
            title: "Expo Router & Native Navigation Architecture",
            order: 1,
            description: "File-based mobile routing, tabs, native modal stacks, and deep-linking configuration.",
            icon: "compass",
            lessons: {
              create: [
                {
                  title: "Native Layouts, Safe Areas & Insets",
                  order: 1,
                  durationMinutes: 22,
                  type: "video",
                  summary: "Handling the Dynamic Island, notch geometries, and Android gesture navigation bars seamlessly.",
                  content: "Working with `react-native-safe-area-context` and adaptive padding.",
                },
                {
                  title: "File-Based Mobile Navigation Patterns",
                  order: 2,
                  durationMinutes: 18,
                  type: "reading",
                  summary: "Building native stack headers, bottom sheets, and custom transition configurations.",
                  content: "How Expo Router maps directory structures to native UINavigationController instances.",
                },
              ],
            },
          },
          {
            title: "60-120 FPS Gesture Physics with Reanimated 3",
            order: 2,
            description: "Worklet-driven animations on the native UI thread that never drop frames during JavaScript heavy lifting.",
            icon: "rocket",
            lessons: {
              create: [
                {
                  title: "Pan Gestures, Velocity Deceleration & Haptics",
                  order: 1,
                  durationMinutes: 28,
                  type: "video",
                  summary: "Creating swipeable cards, pull-to-refresh triggers, and tactile haptic clicks.",
                  content: "Combining React Native Gesture Handler with Expo Haptics for physical tactile feel.",
                },
                {
                  title: "Offline-First Sync Architecture",
                  order: 2,
                  durationMinutes: 20,
                  type: "reading",
                  summary: "Persisting local state with SQLite and syncing queue items in background jobs.",
                  content: "Building offline resilience so mobile users can keep learning on flights and subways.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Course 6: Creative Web Physics & 3D Shaders
  const course6 = await prisma.course.create({
    data: {
      id: "course-web-physics",
      slug: "creative-web-physics-shaders",
      title: "Creative Web Physics & Interactive Shaders",
      tagline: "Explore computational design, particle simulations, GLSL shaders, and audio-reactive web art.",
      description: "Push the boundaries of the browser canvas. Learn Verlet integration, rigid body physics, noise algorithms, and custom GPU fragment shaders for immersive creative storytelling.",
      category: "Web Development",
      level: "Advanced",
      durationHours: 13.0,
      price: 69,
      rating: 4.95,
      reviewsCount: 140,
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
      featured: false,
      instructorId: maya.id,
      modules: {
        create: [
          {
            title: "Canvas Math & Particle Dynamics",
            order: 1,
            description: "Vectors, velocity integration, friction, and multi-body gravitational attraction loops.",
            icon: "compass",
            lessons: {
              create: [
                {
                  title: "Vector Math for Creative Technologists",
                  order: 1,
                  durationMinutes: 24,
                  type: "video",
                  summary: "Magnitude, dot products, normalized directions, and bounce collision resolution.",
                  content: "Building an expressive particle fountain with custom wind turbulence and gravity.",
                },
                {
                  title: "Verlet Integration & Cloth Simulation",
                  order: 2,
                  durationMinutes: 22,
                  type: "reading",
                  summary: "Simulating ropes, nets, and physical fabrics with point constraints and relaxation passes.",
                  content: "Hands-on implementation of Verlet particles and interactive mouse slicing.",
                },
              ],
            },
          },
          {
            title: "GPU Fragment Shaders & Perlin Noise",
            order: 2,
            description: "Writing raw GLSL, understanding UV coordinates, color gradients, and procedural organic textures.",
            icon: "rocket",
            lessons: {
              create: [
                {
                  title: "Your First GLSL Fragment Shader",
                  order: 1,
                  durationMinutes: 30,
                  type: "video",
                  summary: "How graphics cards execute parallel pixel shaders and mapping uniforms (time, resolution, mouse).",
                  content: "Writing a dynamic liquid distortion shader from scratch.",
                },
                {
                  title: "Simplex & Perlin Noise Algorithms",
                  order: 2,
                  durationMinutes: 25,
                  type: "reading",
                  summary: "Generating organic terrain, smoke, clouds, and generative topographic wave art.",
                  content: "Step-by-step breakdown of Fractional Brownian Motion (fBm) in shader pipelines.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 4. Seed Demo Student Enrollments and Progress
  // Alex is enrolled in Course 1 (Next.js) with 5 lessons completed (65% progress)
  // And Course 2 (Design Systems) with 1 lesson completed (15% progress)

  // Fetch created lessons for Course 1
  const course1Lessons = await prisma.lesson.findMany({
    where: { module: { courseId: course1.id } },
    orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
  });

  // Mark first 6 lessons as complete for Course 1
  const completedForCourse1 = course1Lessons.slice(0, 6);
  for (const lesson of completedForCourse1) {
    await prisma.lessonCompletion.create({
      data: {
        userId: demoUser.id,
        lessonId: lesson.id,
      },
    });
  }

  const course1Percent = Math.round((completedForCourse1.length / course1Lessons.length) * 100);

  await prisma.enrollment.create({
    data: {
      userId: demoUser.id,
      courseId: course1.id,
      progressPercent: course1Percent,
    },
  });

  // Fetch created lessons for Course 2
  const course2Lessons = await prisma.lesson.findMany({
    where: { module: { courseId: course2.id } },
    orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
  });

  // Mark first 1 lesson as complete for Course 2
  if (course2Lessons.length > 0) {
    await prisma.lessonCompletion.create({
      data: {
        userId: demoUser.id,
        lessonId: course2Lessons[0].id,
      },
    });
  }

  const course2Percent = Math.round((1 / course2Lessons.length) * 100);

  await prisma.enrollment.create({
    data: {
      userId: demoUser.id,
      courseId: course2.id,
      progressPercent: course2Percent,
    },
  });

  console.log(`✅ Seed finished successfully!`);
  console.log(`- Demo Student: ${demoUser.name} (${demoUser.email})`);
  console.log(`- Instructors seeded: 4`);
  console.log(`- Courses seeded: 6 (Next.js, Design Systems, GenAI, DataViz, React Native, Web Physics)`);
  console.log(`- Course 1 Progress: ${course1Percent}% (${completedForCourse1.length}/${course1Lessons.length} lessons)`);
  console.log(`- Course 2 Progress: ${course2Percent}% (1/${course2Lessons.length} lessons)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
