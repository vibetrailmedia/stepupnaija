import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          50: "hsl(138, 76%, 97%)",
          100: "hsl(141, 84%, 93%)",
          500: "hsl(145, 63%, 42%)",
          600: "hsl(145, 63%, 35%)",
          700: "hsl(145, 63%, 28%)",
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          100: "hsl(25, 100%, 94%)",
          400: "hsl(25, 95%, 64%)",
          500: "hsl(25, 95%, 53%)",
          600: "hsl(25, 95%, 47%)",
          700: "hsl(25, 95%, 41%)",
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          100: "hsl(217, 91%, 93%)",
          500: "hsl(217, 91%, 60%)",
          600: "hsl(217, 91%, 54%)",
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        ui: ["var(--font-ui)"],
        display: ["var(--font-display)"],
      },
      fontSize: {
        caption: ["var(--text-caption)", { lineHeight: "1.4" }],
        "body-sm": ["var(--text-body-sm)", { lineHeight: "1.5" }],
        body: ["var(--text-body)", { lineHeight: "1.65" }],
        "body-lg": ["var(--text-body-lg)", { lineHeight: "1.6" }],
        title: ["var(--text-title)", { lineHeight: "1.4" }],
        heading: ["var(--text-heading)", { lineHeight: "1.3" }],
        display: ["var(--text-display)", { lineHeight: "1.2" }],
        hero: ["var(--text-hero)", { lineHeight: "1.1" }],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
