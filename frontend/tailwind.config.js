/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: "#root",
  theme: {
    extend: {
      colors: {
        primary: {
          400: "#F7AC1D",
          500: "#F7901D",
          600: "#ED8109",
        },
      },
    },
  },
  plugins: [],
};
