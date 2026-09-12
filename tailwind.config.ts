import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ebot: {
          primary: "rgb(var(--ebot-primary) / <alpha-value>)",
          primaryHover: "rgb(var(--ebot-primary-hover) / <alpha-value>)",
          primaryText: "rgb(var(--ebot-primary-text) / <alpha-value>)",
          primarySoft: "rgb(var(--ebot-primary-soft) / <alpha-value>)",
          green: "rgb(var(--ebot-green) / <alpha-value>)",
          teal: "rgb(var(--ebot-teal) / <alpha-value>)",
          orange: "rgb(var(--ebot-orange) / <alpha-value>)",
          red: "rgb(var(--ebot-red) / <alpha-value>)",
          whatsapp: "rgb(var(--ebot-whatsapp) / <alpha-value>)",
          dark: "rgb(var(--ebot-dark) / <alpha-value>)",
          header: "rgb(var(--ebot-header) / <alpha-value>)",
          charcoal: "rgb(var(--ebot-charcoal) / <alpha-value>)",
          slate: "rgb(var(--ebot-slate) / <alpha-value>)",
          muted: "rgb(var(--ebot-muted) / <alpha-value>)",
          snow: "rgb(var(--ebot-snow) / <alpha-value>)",
          soft: "rgb(var(--ebot-soft) / <alpha-value>)",
          surface: "rgb(var(--ebot-surface) / <alpha-value>)",
          surfaceMuted: "rgb(var(--ebot-surface-muted) / <alpha-value>)",
          border: "rgb(var(--ebot-border) / <alpha-value>)"
        }
      },
      boxShadow: {
        ebot: "var(--shadow-ebot)",
        card: "var(--shadow-card)",
        glow: "var(--shadow-glow)"
      },
      borderRadius: {
        ebot: "28px"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
