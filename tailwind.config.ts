import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Design Tokens
        brand: {
          cream: "#FFF8EC",
          yellow: "#FFC94A",
          "yellow-hover": "#F5B82E",
          "yellow-light": "#FFF3D6",
          indigo: "#3B3B98",
          "indigo-dark": "#2A2A72",
          "indigo-light": "#EEF0FB",
          navy: "#1C1C3A",
          "navy-light": "#25254B",
          "navy-card": "#232347",
          coral: "#FF7A5C",
          "coral-light": "#FFEBE6",
          mint: "#10B981",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "Baloo 2", "sans-serif"],
        sans: ["var(--font-inter)", "Work Sans", "sans-serif"],
        handwriting: ["var(--font-caveat)", "cursive"],
      },
      boxShadow: {
        warm: "0 10px 25px -5px rgba(59, 59, 152, 0.08), 0 8px 10px -6px rgba(59, 59, 152, 0.04)",
        "warm-lg": "0 20px 30px -10px rgba(59, 59, 152, 0.12), 0 10px 15px -5px rgba(255, 201, 74, 0.15)",
        sticky: "2px 6px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
        "sticky-dark": "0 8px 20px rgba(0, 0, 0, 0.35)",
        glow: "0 0 20px rgba(255, 201, 74, 0.5)",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.04)" },
        },
        "node-pop": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "70%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
        "node-pop": "node-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
