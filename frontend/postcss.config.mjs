/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <-- CORRECTED
    autoprefixer: {},
    // other plugins...
  },
};

export default config;
