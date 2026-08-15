import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        clinical: {
          blue: "rgb(var(--clinical-blue) / <alpha-value>)",
          blueHover: "rgb(var(--clinical-blue-hover) / <alpha-value>)",
          blueText: "rgb(var(--clinical-blue-text) / <alpha-value>)",
          blueSoft: "rgb(var(--clinical-blue-soft) / <alpha-value>)",
          green: "rgb(var(--clinical-green) / <alpha-value>)",
          teal: "rgb(var(--clinical-teal) / <alpha-value>)",
          orange: "rgb(var(--clinical-orange) / <alpha-value>)",
          red: "rgb(var(--clinical-red) / <alpha-value>)",
          whatsapp: "rgb(var(--clinical-whatsapp) / <alpha-value>)",
          dark: "rgb(var(--clinical-dark) / <alpha-value>)",
          header: "rgb(var(--clinical-header) / <alpha-value>)",
          charcoal: "rgb(var(--clinical-charcoal) / <alpha-value>)",
          slate: "rgb(var(--clinical-slate) / <alpha-value>)",
          muted: "rgb(var(--clinical-muted) / <alpha-value>)",
          snow: "rgb(var(--clinical-snow) / <alpha-value>)",
          soft: "rgb(var(--clinical-soft) / <alpha-value>)",
          surface: "rgb(var(--clinical-surface) / <alpha-value>)",
          surfaceMuted: "rgb(var(--clinical-surface-muted) / <alpha-value>)",
          border: "rgb(var(--clinical-border) / <alpha-value>)"
        }
      },
      boxShadow: {
        clinical: "var(--shadow-clinical)",
        card: "var(--shadow-card)",
        glow: "var(--shadow-glow)"
      },
      borderRadius: {
        clinical: "28px"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
