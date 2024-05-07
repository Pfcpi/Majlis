import { spread } from 'axios'
import { Transform } from 'nodemailer/lib/xoauth2'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-gray': '#1A1B1F',
        'light-gray': '#3A3D3E',
        'clear-blue': 'rgba(152, 160, 164, 0.22)',
        'notification-blue': '#0080F5',
        'notification-border-blue': '#2EA7F4',
        'auth-border-gray': 'rgba(101, 101, 101, 0.72)',
        pink: '#FF8C8C',
        brown: '#443434',
        red: '#FF8C8C',
        '0.36-red': 'rgba(255, 100, 100, 0.35)',
        blue: '#2EA7F4',
        gray: '#242529',
        'light-blue': 'rgba(15, 68, 102, 0.78)',
        '0.08-blue': 'rgba(51, 160, 231, 0.08)',
        'side-bar-white-theme-color': '#EFEFEF',
        'primary-white-theme-text-color': '#2A2B2D',
        'table-border-white-theme-color': '#C0C2CA'
      }
    },
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
      cutive: ['Cutive', 'sans-serif']
    },
    keyframes: {
      spread: {
        '0%': { width: '10px', opacity: '0.5' },
        '100%': { width: '100%', opacity: '0' }
      },
      scaledownUp: {
        '0%': { scale: '100%' },
        '30%': { scale: '97%' },
        '100%': { scale: '100%' }
      },
      badInput: {
        '0%': { opacity: '0' },
        '5%': { opacity: '1', transform: 'translateY(10px)' },
        '75%': { opacity: '1' },
        '100%': { opacity: '0', transform: 'translateY(13px)' }
      }
    },
    animation: {
      clickDownUp: 'scaledownUp .3s linear',
      spread: 'spread .5s linear',
      badInput: 'badInput 2s linear'
    }
  },
  plugins: []
}
