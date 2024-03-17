/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      poppins: ['Poppins', 'sans-serif']
    },
  },
  plugins: []
}
