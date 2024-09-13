import { useEffect, useState } from 'react'
import useDark from '../../zustand/dark'

import MoonSVG from './../../assets/moon.svg'
import SunSVG from './../../assets/sun.svg'

function DarkLightTheme() {
  const { dark, toggleTheme } = useDark()

  function DarkLight() {
    if (!dark === false) {
      localStorage.theme = 'light'
    } else {
      localStorage.theme = 'dark'
    }

    if (localStorage.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <button
      onClick={() => {
        toggleTheme()
        DarkLight()
      }}
      className="w-full p-1 rounded-md aspect-square flex items-center justify-center border border-blue bg-blue"
    >
      <img src={dark ? MoonSVG : SunSVG}></img>
    </button>
  )
}
export default DarkLightTheme
