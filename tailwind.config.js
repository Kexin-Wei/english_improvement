/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#faf8f5',
          900: '#f3efe9',
          800: '#ffffff',
          700: '#e5dfd7',
          600: '#d1cbc2',
          500: '#b8b2a8',
        },
        parchment: {
          50: '#1c1917',
          100: '#2e2a26',
          200: '#44403c',
          300: '#57534e',
          400: '#78716c',
          500: '#a8a29e',
        },
        gold: {
          300: '#d4a373',
          400: '#b8860b',
          500: '#a67709',
          600: '#8b6508',
        },
        sage: {
          400: '#4d7c5f',
          500: '#3d6b50',
          600: '#2f5a40',
        },
        wine: {
          400: '#b34040',
          500: '#963636',
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
