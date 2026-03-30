import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        mist: "#E2E8F0",
        sand: "#F8FAFC",
        aqua: "#0F766E",
        sun: "#F59E0B"
      },
      boxShadow: {
        panel: "0 20px 45px -24px rgba(15, 23, 42, 0.45)"
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(148, 163, 184, 0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.14) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
