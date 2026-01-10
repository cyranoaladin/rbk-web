/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './formation_web3_tunisie.html',
    './chapters/**/*.html',
    './script.js',
    './script_tech.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};