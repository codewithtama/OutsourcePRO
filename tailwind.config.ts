import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "hsl(var(--primary))",
          "primary-hover": "hsl(var(--primary-hover))",
          "primary-light": "hsl(var(--primary-light))",
          dark: "hsl(var(--text-dark))",
          muted: "hsl(var(--text-muted))",
          border: "hsl(var(--border-light))",
        },
        google: {
          blue: "#1e5cf2",
          "blue-50": "#eaf1ff",
          red: "#e03b30",
          yellow: "#f5a623",
          green: "#10b981",
          grey: "#6b7280",
          "grey-100": "#f9fafb",
          "grey-200": "#f3f4f6",
          "grey-300": "#e5e7eb",
          "grey-500": "#9ca3af",
          "grey-700": "#4b5563",
          "grey-900": "#1f2937",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        premium: "0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 4px 12px 0 rgba(0, 0, 0, 0.04)",
        "premium-hover": "0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 12px 32px 0 rgba(0, 0, 0, 0.08)",
        "google-card": "0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 4px 12px 0 rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;

