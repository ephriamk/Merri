/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    {
      pattern: /bg-(emerald|yellow|blue|amber|pink|purple)-(500|600)/,
      variants: ['hover']
    },
    {
      pattern: /ring-(emerald|yellow|blue|amber|pink|purple)-(200)/,
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}