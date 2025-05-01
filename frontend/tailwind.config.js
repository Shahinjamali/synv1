/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,css}', // Include all relevant files
    './components/**/*.{html,js,jsx,ts,tsx,css}',
    './app/**/*.{html,js,jsx,ts,tsx,css}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};