/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: '#2B81B8',
        gray: '#242529',
        "light-blue": "rgba(15, 68, 102, 0.78)",
      },
    },
    fontFamily: {
      poppins: ['Poppins', 'sans-serif']
    },
  },
  plugins: []
}
