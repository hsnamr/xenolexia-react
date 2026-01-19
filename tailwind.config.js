/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Accent color for foreign words
        foreign: {
          light: '#818cf8', // Indigo for light theme
          dark: '#a5b4fc', // Lighter indigo for dark theme
        },
        // Reader themes
        reader: {
          light: {
            bg: '#ffffff',
            text: '#1f2937',
          },
          dark: {
            bg: '#1a1a2e',
            text: '#e5e7eb',
          },
          sepia: {
            bg: '#f4ecd8',
            text: '#5c4b37',
          },
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['System', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      spacing: {
        reader: '1.5rem',
      },
    },
  },
  plugins: [],
};
