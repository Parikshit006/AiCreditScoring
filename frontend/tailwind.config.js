/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00aeef", // Barclays-ish Blue
        secondary: "#141414", // Dark background
        accent: "#00ff88", // Success/Green
        danger: "#ff4d4d", // Error/Red
        warning: "#ffd700", // Warning/Yellow
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
