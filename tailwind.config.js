/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0b0d13',
          900: '#0f1117',
          800: '#1a1d27',
          700: '#232736',
          600: '#2e3345',
          500: '#3d4258',
        },
        parchment: {
          50: '#f5f0e8',
          100: '#e8e2d6',
          200: '#d4cfc3',
          300: '#b5b0a4',
          400: '#8a8578',
          500: '#6b665a',
        },
        gold: {
          300: '#e8c896',
          400: '#d4a574',
          500: '#c49058',
          600: '#a87940',
        },
        sage: {
          400: '#7c9885',
          500: '#5c8a6a',
          600: '#4a7256',
        },
        wine: {
          400: '#c45c5c',
          500: '#a84848',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Nunito Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
