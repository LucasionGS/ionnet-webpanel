/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./client/src/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#f9f6f0',
        },
      },
    },
  },
  plugins: [],
}

