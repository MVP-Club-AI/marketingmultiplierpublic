/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors (customize these for your brand)
        navy: {
          DEFAULT: '#081f3f',
          50: '#e6eaf0',
          100: '#c0c9d9',
          200: '#96a5bf',
          300: '#6c81a5',
          400: '#4d6692',
          500: '#2d4b7f',
          600: '#264477',
          700: '#1d3a6c',
          800: '#153162',
          900: '#081f3f',
        },
        slate: {
          DEFAULT: '#15465b',
        },
        amber: {
          DEFAULT: '#d97706',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        stone: {
          DEFAULT: '#faf5f0',
        },
      },
      fontFamily: {
        headline: ['Zilla Slab', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
