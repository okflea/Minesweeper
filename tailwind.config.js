const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["index.html", "./src/**/*.{js,jsx,ts,tsx,vue,html}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
        head: ["Nabla", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
  darkMode: "class",
};
