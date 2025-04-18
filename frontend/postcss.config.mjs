// postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    '@tailwindcss/postcss', // <-- CHANGE THIS LINE from 'tailwindcss'
    'autoprefixer', // Autoprefixer (adds vendor prefixes)
  ],
};

export default config;
