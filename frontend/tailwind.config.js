/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'blue-900': '#12203c',
        'orange-500': '#faa31a',
      },
      fontFamily: {
        primary: ['var(--elitecons-font)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
