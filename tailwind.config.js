/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  variants: {
    extend: {
      opacity: ['disabled'],
      // Add 'group' and 'group-hover' variants
      display: ['group', 'group-hover'],
    },
  },
}

