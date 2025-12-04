import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0E3B2E',
          50: '#D6E7E2',
          100: '#BDD9D1',
          200: '#8ABCAF',
          300: '#569E8D',
          400: '#2E7F6B',
          500: '#0E3B2E',
          600: '#0B2E24',
          700: '#08221A',
          800: '#051710',
          900: '#030B08',
        },
        cream: '#F5EFE7',
        rose: '#C07A73',
        slate: '#6B7280'
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [],
} satisfies Config
