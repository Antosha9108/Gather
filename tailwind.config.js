/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.ejs", "public/js/*.js"],
    theme: {
      extend: {
        colors: {},
      },
    },
    daisyui: {
      themes: ["luxury"],
    },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
  };