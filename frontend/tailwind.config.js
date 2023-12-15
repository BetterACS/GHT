/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
export default withMT({
  content: [
    "./index.html",
    "./src/pages/*.{js,ts,jsx,tsx}",
    "./src/components/*.{js,ts,jsx,tsx}",
    "./src/utils/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {    
    },
  },
  plugins: [],
})