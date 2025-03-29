import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
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
        brown: {
          500: "#8B4513",
          800: "#5D3A1A",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        flash: {
          "0%, 50%, 100%": { opacity: "0" },
          "25%, 75%": { opacity: "1" },
        },
        slash: {
          "0%": {
            transform: "translateX(100%) translateY(-50%) scale(0.5)",
            opacity: "0",
          },
          "50%": {
            transform: "translateX(0%) translateY(-50%) scale(1)",
            opacity: "1",
          },
          "100%": {
            transform: "translateX(-100%) translateY(-50%) scale(0.5)",
            opacity: "0",
          },
        },
        "slash-right": {
          "0%": {
            transform: "translateX(-100%) translateY(-50%) scale(0.5)",
            opacity: "0",
          },
          "50%": {
            transform: "translateX(0%) translateY(-50%) scale(1)",
            opacity: "1",
          },
          "100%": {
            transform: "translateX(100%) translateY(-50%) scale(0.5)",
            opacity: "0",
          },
        },
        stab: {
          "0%": {
            transform: "translateX(100%) translateY(-50%) scaleX(0.5)",
            opacity: "0",
          },
          "30%": {
            transform: "translateX(20%) translateY(-50%) scaleX(1.2)",
            opacity: "1",
          },
          "70%": {
            transform: "translateX(-20%) translateY(-50%) scaleX(1.2)",
            opacity: "1",
          },
          "100%": {
            transform: "translateX(-100%) translateY(-50%) scaleX(0.5)",
            opacity: "0",
          },
        },
        "stab-right": {
          "0%": {
            transform: "translateX(-100%) translateY(-50%) scaleX(0.5)",
            opacity: "0",
          },
          "30%": {
            transform: "translateX(-20%) translateY(-50%) scaleX(1.2)",
            opacity: "1",
          },
          "70%": {
            transform: "translateX(20%) translateY(-50%) scaleX(1.2)",
            opacity: "1",
          },
          "100%": {
            transform: "translateX(100%) translateY(-50%) scaleX(0.5)",
            opacity: "0",
          },
        },
        punch: {
          "0%": {
            transform: "translateX(100%) translateY(-50%) scale(0.2)",
            opacity: "0",
          },
          "40%": {
            transform: "translateX(10%) translateY(-50%) scale(0.6)",
            opacity: "0.6",
          },
          "50%": {
            transform: "translateX(0%) translateY(-50%) scale(1.2)",
            opacity: "1",
          },
          "60%": {
            transform: "translateX(-10%) translateY(-50%) scale(0.6)",
            opacity: "0.6",
          },
          "100%": {
            transform: "translateX(-100%) translateY(-50%) scale(0.2)",
            opacity: "0",
          },
        },
        "punch-right": {
          "0%": {
            transform: "translateX(-100%) translateY(-50%) scale(0.2)",
            opacity: "0",
          },
          "40%": {
            transform: "translateX(-10%) translateY(-50%) scale(0.6)",
            opacity: "0.6",
          },
          "50%": {
            transform: "translateX(0%) translateY(-50%) scale(1.2)",
            opacity: "1",
          },
          "60%": {
            transform: "translateX(10%) translateY(-50%) scale(0.6)",
            opacity: "0.6",
          },
          "100%": {
            transform: "translateX(100%) translateY(-50%) scale(0.2)",
            opacity: "0",
          },
        },
        magic: {
          "0%": {
            transform: "translateX(100%) translateY(-50%) scale(0.2)",
            opacity: "0",
          },
          "40%": {
            transform: "translateX(20%) translateY(-50%) scale(0.8)",
            opacity: "0.8",
          },
          "60%": {
            transform: "translateX(-20%) translateY(-50%) scale(0.8)",
            opacity: "0.8",
          },
          "100%": {
            transform: "translateX(-100%) translateY(-50%) scale(0.2)",
            opacity: "0",
          },
        },
        "magic-right": {
          "0%": {
            transform: "translateX(-100%) translateY(-50%) scale(0.2)",
            opacity: "0",
          },
          "40%": {
            transform: "translateX(-20%) translateY(-50%) scale(0.8)",
            opacity: "0.8",
          },
          "60%": {
            transform: "translateX(20%) translateY(-50%) scale(0.8)",
            opacity: "0.8",
          },
          "100%": {
            transform: "translateX(100%) translateY(-50%) scale(0.2)",
            opacity: "0",
          },
        },
        arrow: {
          "0%": {
            transform: "translateX(120%) translateY(-50%) scaleX(0.8)",
            opacity: "0",
          },
          "10%": {
            transform: "translateX(100%) translateY(-50%) scaleX(1)",
            opacity: "1",
          },
          "90%": {
            transform: "translateX(-100%) translateY(-50%) scaleX(1)",
            opacity: "1",
          },
          "100%": {
            transform: "translateX(-120%) translateY(-50%) scaleX(0.8)",
            opacity: "0",
          },
        },
        "arrow-right": {
          "0%": {
            transform: "translateX(-120%) translateY(-50%) scaleX(0.8)",
            opacity: "0",
          },
          "10%": {
            transform: "translateX(-100%) translateY(-50%) scaleX(1)",
            opacity: "1",
          },
          "90%": {
            transform: "translateX(100%) translateY(-50%) scaleX(1)",
            opacity: "1",
          },
          "100%": {
            transform: "translateX(120%) translateY(-50%) scaleX(0.8)",
            opacity: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
        flash: "flash 0.5s ease-out",
        slash: "slash 0.5s ease-in-out",
        "slash-right": "slash-right 0.5s ease-in-out",
        stab: "stab 0.5s ease-in-out",
        "stab-right": "stab-right 0.5s ease-in-out",
        punch: "punch 0.5s cubic-bezier(.22,.68,0,1.71)",
        "punch-right": "punch-right 0.5s cubic-bezier(.22,.68,0,1.71)",
        magic: "magic 0.7s ease-in-out",
        "magic-right": "magic-right 0.7s ease-in-out",
        arrow: "arrow 0.4s linear",
        "arrow-right": "arrow-right 0.4s linear",
      },
      transitionProperty: {
        width: "width",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
