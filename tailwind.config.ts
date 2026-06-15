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
          primary: "#1a73e8",
          "primary-hover": "#1557b0",
          "primary-light": "#e8f0fe",
          dark: "#202124",
          muted: "#5f6368",
          border: "#dadce0",
        },
        google: {
          blue: "#1a73e8",
          "blue-50": "#e8f0fe",
          red: "#d93025",
          yellow: "#f9ab00",
          green: "#1e8e3e",
          grey: "#5f6368",
          "grey-100": "#f8f9fa",
          "grey-200": "#e8eaed",
          "grey-300": "#dadce0",
          "grey-500": "#9aa0a6",
          "grey-700": "#5f6368",
          "grey-900": "#202124",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        premium: "0 1px 2px 0 rgba(60,64,67,.15), 0 1px 3px 1px rgba(60,64,67,.1)",
        "premium-hover": "0 1px 3px 0 rgba(60,64,67,.2), 0 4px 8px 3px rgba(60,64,67,.15)",
        "google-card": "0 1px 2px 0 rgba(60,64,67,.15), 0 1px 3px 1px rgba(60,64,67,.1)",
      },
    },
  },
  plugins: [],
};
export default config;


