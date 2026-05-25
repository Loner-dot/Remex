/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff2d95',
          purple: '#9b30ff',
          red: '#ff0044',
          blue: '#00d4ff',
        }
      },
    },
  },
  plugins: [],
}