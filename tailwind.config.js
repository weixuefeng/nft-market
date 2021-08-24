const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
        cool: colors.coolGray,
      },
    },
    screens: {
      'xs': '450px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1860px',
    },
    fontSize: {
      xs: ".75rem",
      sm: ".875rem",
      tiny: ".65rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
    },
    boxShadow: {
      sm: "0 0 2px 0 rgba(0, 0, 0, 0.05)",
      DEFAULT: "0 0 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      md: "0 0 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg:
        "0 0 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl:
        "0 0 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      "2xl": "0 0 50px -12px rgba(0, 0, 0, 0.25)",
      "3xl": "0 0 60px -15px rgba(0, 0, 0, 0.3)",
      inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      none: "none",
    },
    maxHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      '1/4v': '25vh',
      '1/2v': '50vh',
      '3/4v': '75vh',
      '1/3v': '33vh',
      '2/3v': '67vh',
      'full': '100%',
      }
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
