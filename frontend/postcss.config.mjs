/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    'tailwindcss', // ✅ CORRECTED
    'autoprefixer',
  ],
};

export default config;
