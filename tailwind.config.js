/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/stylesheets/*.{html,js,css}",
    "./views/**/*.ejs",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      rotate: {
        '360': '360deg',
      },
      maxWidth: {
        '26': '26rem',
        '27': '27rem',
        '1/2': '50%',
        '2/3': '66%',
        '3/4': '75%',
      }
    },
    screens: {
      sm: "640px",
      md: "728px",
      lg: "903px",
      xlg: "1023px",
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

