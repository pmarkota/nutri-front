/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
        },
        cyan: {
          500: '#06b6d4',
        },
        teal: {
          500: '#14b8a6',
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
