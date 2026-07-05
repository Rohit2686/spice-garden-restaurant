/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        spice: {
          50: '#fdf6ee',
          100: '#fae9d4',
          200: '#f4d0a8',
          300: '#edb075',
          400: '#e58a4a',
          500: '#dd6f2c',
          600: '#c95a20',
          700: '#a8451c',
          800: '#87381c',
          900: '#6e301a',
          950: '#3b1710',
        },
        bark: {
          50: '#faf6f2',
          100: '#f0e6dc',
          200: '#e0cbb8',
          300: '#c9a887',
          400: '#b88a5e',
          500: '#a87344',
          600: '#945e3a',
          700: '#7b4a30',
          800: '#653e2a',
          900: '#523425',
          950: '#2d1c14',
        },
        cream: {
          50: '#fffdf9',
          100: '#fdf8ee',
          200: '#faf0d8',
          300: '#f5e2b8',
          400: '#efcf90',
          500: '#e8b96a',
        },
        saffron: {
          400: '#f5b740',
          500: '#e8a317',
          600: '#cf8a0a',
        },
        leaf: {
          500: '#5a7a3a',
          600: '#4a6530',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        warm: '0 20px 45px -20px rgba(110, 48, 26, 0.45)',
        card: '0 12px 30px -12px rgba(110, 48, 26, 0.25)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.4)', opacity: '0' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        'fade-in': 'fade-in 0.8s ease-out both',
        'float-slow': 'float-slow 4s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
