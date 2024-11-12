/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          900: "#064e3b",
        },
        cyan: {
          500: "#06b6d4",
        },
        teal: {
          500: "#14b8a6",
        },
        dark: {
          bg: "#111827",
          card: "#1F2937",
          hover: "#374151",
        },
      },
      animation: {
        in: "fadeIn 0.3s ease-in-out",
        spin: "spin 0.8s linear infinite",
        float1: "float1 2s ease-in-out infinite",
        float2: "float2 2s ease-in-out infinite",
        float3: "float3 2.5s ease-in-out infinite",
        float4: "float4 2.5s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float1: {
          "0%, 100%": { transform: "translate(0, 0)", opacity: 0 },
          "50%": { transform: "translate(4px, -4px)", opacity: 0.6 },
        },
        float2: {
          "0%, 100%": { transform: "translate(0, 0)", opacity: 0 },
          "50%": { transform: "translate(-4px, 4px)", opacity: 0.6 },
        },
        float3: {
          "0%, 100%": { transform: "translate(0, 0)", opacity: 0 },
          "50%": { transform: "translate(6px, -6px)", opacity: 0.4 },
        },
        float4: {
          "0%, 100%": { transform: "translate(0, 0)", opacity: 0 },
          "50%": { transform: "translate(-6px, 6px)", opacity: 0.4 },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      backdropBlur: {
        sm: "4px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
