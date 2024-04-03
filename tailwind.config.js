/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        "dark-gray":"#1A1B1F",
        "light-gray": "#3A3D3E",
        "clear-blue": "rgba(152, 160, 164, 0.22)",
        "pink": "#FF8C8C",
        brown: "#443434",
        blue: '#2B81B8',
        gray: '#242529',
        "light-blue": "rgba(15, 68, 102, 0.78)",
        "0.08-blue":"rgba(51, 160, 231, 0.08)"
      },
    },
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
      cutive: ['Cutive', 'sans-serif']
    },
  },
  plugins: []
}
