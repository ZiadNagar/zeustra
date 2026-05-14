import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"] as unknown as Config["darkMode"],
  content: [
    "./src/**/*.{astro,html,ts,tsx,md,mdx}",
    "./src/app/**/*.{ts,tsx,html}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        segoe: ['"Segoe UI"', "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          blue: "#4C91FF",
          "blue-deep": "#4281D4",
          "blue-light": "#4DB5FF",
          "blue-vivid": "#3E6AF8",
          cyan: "#00EEFF",
          "blue-std": "#3B82F6",
          "cyan-light": "#00D4FF",
        },
        neon: "#39FF14",
        mint: "#70EDAE",
        emerald: "#00AD8B",
        success: "#4ADE80",
        purple: {
          vivid: "#8E58E6",
          magenta: "#DF8DFB",
          muted: "#845495",
        },
        gold: {
          DEFAULT: "#FFD85C",
          dark: "#E5A734",
        },
        teal: "#2E8EAF",
        neutral: {
          50: "#F2F2F2",
          100: "#F1F5F9",
          200: "#E7ECF3",
          300: "#E0E0E0",
          400: "#CBD5E1",
          500: "#C4C4C4",
          600: "#9CA3AF",
          650: "#98A2B3",
          700: "#94A3B8",
          800: "#262626",
          850: "#1A1A1A",
          900: "#18191B",
          950: "#121212",
        },
        border: {
          glass: "rgba(255, 255, 255, 0.1)",
          "glass-strong": "rgba(255, 255, 255, 0.15)",
          blue: "rgba(59, 130, 246, 0.2)",
          "blue-strong": "rgba(59, 130, 246, 0.3)",
        },
        surface: {
          card: "rgba(255, 255, 255, 0.03)",
          "card-hover": "rgba(255, 255, 255, 0.05)",
          overlay: "rgba(15, 23, 42, 0.8)",
          dark: "rgba(15, 23, 42, 0.6)",
        },
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
      },
      fontSize: {
        "display-xl": [
          "clamp(32px, 6vw, 98px)",
          {
            lineHeight: "clamp(40px, 7.5vw, 132px)",
            letterSpacing: "-2.16px",
            fontWeight: "700",
          },
        ],
        "display-lg": [
          "clamp(28px, 5vw, 72px)",
          {
            lineHeight: "clamp(34px, 6vw, 86px)",
            letterSpacing: "-2.16px",
            fontWeight: "600",
          },
        ],
        "display-lg-alt": [
          "clamp(28px, 5vw, 50px)",
          {
            lineHeight: "clamp(34px, 6vw, 60px)",
            letterSpacing: "-2.16px",
            fontWeight: "500",
          },
        ],
        "heading-1": [
          "clamp(28px, 4vw, 48px)",
          {
            lineHeight: "clamp(34px, 5.5vw, 72px)",
            letterSpacing: "-2.16px",
            fontWeight: "500",
          },
        ],
        "heading-2": [
          "clamp(22px, 3.2vw, 40px)",
          {
            lineHeight: "clamp(28px, 4.5vw, 56px)",
            letterSpacing: "-1px",
            fontWeight: "600",
          },
        ],
        "heading-3": [
          "clamp(20px, 3vw, 32px)",
          {
            lineHeight: "clamp(26px, 4vw, 44px)",
            letterSpacing: "-1px",
            fontWeight: "600",
          },
        ],
        "heading-4": [
          "clamp(18px, 2.2vw, 24px)",
          {
            lineHeight: "clamp(24px, 3.2vw, 40px)",
            letterSpacing: "-1px",
            fontWeight: "400",
          },
        ],
        "heading-5": [
          "clamp(16px, 2vw, 20px)",
          { lineHeight: "clamp(22px, 2.6vw, 30px)", fontWeight: "700" },
        ],
        "body-lg": [
          "clamp(16px, 1.6vw, 18px)",
          { lineHeight: "clamp(22px, 2.4vw, 28px)", fontWeight: "400" },
        ],
        "body-md": [
          "clamp(15px, 1.4vw, 17px)",
          { lineHeight: "clamp(20px, 2.2vw, 26px)", fontWeight: "600" },
        ],
        "body-base": [
          "clamp(14px, 1.2vw, 15px)",
          { lineHeight: "clamp(18px, 1.8vw, 24px)", fontWeight: "400" },
        ],
        "body-sm": [
          "clamp(13px, 1vw, 14px)",
          { lineHeight: "clamp(16px, 1.4vw, 22px)", fontWeight: "400" },
        ],
        "body-xs": [
          "clamp(12px, 0.9vw, 13px)",
          { lineHeight: "clamp(14px, 1.2vw, 20px)", fontWeight: "600" },
        ],
        caption: [
          "clamp(11px, 0.8vw, 12px)",
          { lineHeight: "clamp(14px, 1vw, 18px)", fontWeight: "500" },
        ],
      },
      backgroundImage: {
        "gradient-cta": "linear-gradient(to bottom, #4DB5FF, #3E6AF8)",
        "gradient-cta-hover": "linear-gradient(to bottom, #5DC1FF, #4E7AFF)",
        "gradient-text": "linear-gradient(112deg, #00EEFF, #4DB5FF)",
        "gradient-text-alt": "linear-gradient(108deg, #00EEFF, #4DB5FF)",
        "gradient-card":
          "linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(0,0,0,0.25))",
        "gradient-card-blue":
          "linear-gradient(to bottom, rgba(59,130,246,0.1), rgba(59,130,246,0.02))",
        "gradient-table-header":
          "linear-gradient(90deg, rgba(30,58,138,0.4), rgba(59,130,246,0.2), rgba(30,58,138,0.4))",
        "gradient-hero": "linear-gradient(to bottom, #0F172A, #121212)",
        "glow-blue":
          "radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)",
        "glow-cyan":
          "radial-gradient(circle, rgba(0,238,255,0.1), transparent 70%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
        "glass-lg": "0 16px 48px rgba(0, 0, 0, 0.4)",
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-blue-lg": "0 0 40px rgba(59, 130, 246, 0.4)",
        "glow-neon": "0 0 20px rgba(57, 255, 20, 0.3)",
        "glow-neon-inset": "inset 0px 0px 20px #39FF14",
        cta: "0 4px 15px rgba(77, 181, 255, 0.3)",
        "cta-hover": "0 6px 25px rgba(77, 181, 255, 0.5)",
        "inner-blue": "inset 0px 0px 24px rgba(59, 130, 246, 0.25)",
        "button-inner": "inset 0 -5px 9px rgba(66, 66, 66, 0.75)",
        "heading-glow":
          "0 0 50px rgba(59,130,246,1), 0 0 16px rgba(0,212,255,0.5)",
        "surface-glow": "0 0 50px rgba(5,5,39,0.5)",
      },
      backdropBlur: {
        xs: "2px",
        glass: "3.5px",
        "heading-soft": "7px",
        card: "12px",
      },
      borderRadius: {
        card: "12px",
        "card-lg": "16px",
        "card-xl": "24px",
        button: "8px",
        pill: "9999px",
      },
      spacing: {
        "section-y": "120px",
        "section-y-sm": "80px",
        "section-gap": "64px",
        "card-gap": "24px",
        "card-padding": "32px",
        "card-padding-sm": "24px",
      },
      maxWidth: {
        container: "1280px",
        "container-sm": "1120px",
        content: "800px",
        hero: "900px",
        header: "1408px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-x": "gradient-x 3s ease infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        slideUp: {
          "0%": {
            transform: "translateY(20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
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
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      screens: {
        xxs: "320px",
        xs: "375px",
        sm: "480px",
        md: "640px",
        lg: "768px",
        nav: "1003px",
        xl: "1024px",
        "2xl": "1280px",
        "3xl": "1536px",
      },
    },
  },
  plugins: [],
};

export default config;
