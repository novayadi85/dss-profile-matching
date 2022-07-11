const primaryColors = require("@left4code/tw-starter/dist/js/colors");
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // that is animation class
      animation: {
        fade: 'fadeOut 5s ease-in-out',
        'fade-in': 'animation-fade-in 1s',
        'fade-out': 'animation-fade-out 1s'
      },

      // that is actual animation
      keyframes: theme => ({
        fadeOut: {
          '0%': { backgroundColor: theme('colors.red.300') },
          '100%': { backgroundColor: theme('colors.transparent') },
        },
        'animation-fade-in': {
          '0%': {
            opacity: 0
          },
          '100%': {
            opacity: 1
          }
        },
        'animation-fade-out': {
          '0%': {
            opacity: 1
          },
          '100%': {
            opacity: 0
          }
        }
      }),
    },
  },
  plugins: [
    require("tailwindcss"),
    function ({ addUtilities }) {
      addUtilities({
        '.btn': { overflow: 'initial' },
      })
    }
  ],
  mode: "jit",
  purge: [
    "./src/**/*.{php,html,js,jsx,ts,tsx,vue}",
    "./src/**/*.{php,html,js,jsx,ts,tsx,vue}",
    "./node_modules/@left4code/tw-starter/**/*.js",
  ],

}
