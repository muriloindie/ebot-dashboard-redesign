import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        clinical: {
          blue: "#2B9FE8",
          blueHover: "#1A7EBC",
          green: "#87A630",
          teal: "#30A3A4",
          orange: "#F19D18",
          whatsapp: "#25D366",
          dark: "#263532",
          header: "#2F3835",
          charcoal: "#111716",
          slate: "#485653",
          muted: "#52625F",
          snow: "#F6FAFC",
          soft: "#F5F5F5"
        }
      },
      boxShadow: {
        clinical: "0 24px 70px rgba(17, 23, 22, 0.08)",
        card: "0 18px 50px rgba(43, 159, 232, 0.10)",
        glow: "0 0 36px rgba(43, 159, 232, 0.22)"
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
