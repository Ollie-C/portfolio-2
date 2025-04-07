/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'base-dark': 'oklch(17.76% 0 0)',
      },
      fontFamily: {
        sans: ['Gotham', 'system-ui', 'sans-serif'],
      },
      backgroundColor: {
        base: 'var(--bg-color)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
      },
    },
  },
  plugins: [],
};
