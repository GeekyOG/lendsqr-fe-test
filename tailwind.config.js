/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      lgMax: { max: "1400px" },
      mdMax: { max: "1200px" },
      smMax: { max: "825px" },
      xsMax: { max: "765px" },
    },
  },
  plugins: [],
};
