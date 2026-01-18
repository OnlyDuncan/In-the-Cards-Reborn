/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'card-bg': '#322238',
        'modal-bg': '#404355',
        'bg-primary': '#cffafbff',
      }
    },
  },
  plugins: [],
}
