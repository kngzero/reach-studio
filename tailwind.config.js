/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#2C2421',   // Deep Espresso Brown
          accent: '#A87B5D', // Warm Copper/Bronze for Text Accents
          beige: '#E6DCCA',  // Light Beige for backgrounds/shapes
          light: '#F9F7F5',  // Off-white/Cream
        }
      }
    },
  },
  plugins: [],
}