import type { Metadata } from "next";
import { Outfit, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pathwise — Roadmap-Driven Online Skills Learning",
  description:
    "Master modern web engineering, design systems, and generative AI through interactive visual curriculum roadmaps and real milestone progress tracking.",
  keywords: [
    "online course",
    "edtech",
    "curriculum roadmap",
    "learning journey",
    "web development",
    "design systems",
    "generative AI",
  ],
  authors: [{ name: "Pathwise Learning" }],
  openGraph: {
    title: "Pathwise — Visual Curriculum Roadmaps for Modern Skills",
    description:
      "Break courses into an interactive trail of milestones. Track your progress with real database-backed student stats.",
    siteName: "Pathwise",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${inter.variable} ${caveat.variable}`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-blueprint-grid">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Navbar />
          <main className="flex-1 w-full pb-24 sm:pb-0">{children}</main>
          <Footer />
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
