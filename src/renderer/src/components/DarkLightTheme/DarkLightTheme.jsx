<<<<<<< HEAD
import { useEffect, useState } from 'react'
import useDark from '../../zustand/dark'

import MoonSVG from './../../assets/moon.svg'
import SunSVG from './../../assets/sun.svg'

function DarkLightTheme() {
  const { dark, toggleTheme } = useDark()

  function DarkLight() {
    if (!dark === false) {
=======
import { useState } from 'react'
import './comp.css'

function DarkLightTheme() {
  function DarkLight(e) {
    if (e.target.checked === false) {
>>>>>>> 1f834b1 (A)
      localStorage.theme = 'light'
    } else {
      localStorage.theme = 'dark'
    }

<<<<<<< HEAD
    if (localStorage.theme === 'dark') {
=======
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function SysPrefrence() {
    localStorage.removeItem('theme')
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
>>>>>>> 1f834b1 (A)
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
<<<<<<< HEAD
    <button
      onClick={() => {
        toggleTheme()
        DarkLight()
      }}
      className="w-7 p-1 rounded-md aspect-square flex items-center justify-center border border-blue"
    >
      <img src={dark ? MoonSVG : SunSVG}></img>
    </button>
=======
    <>
      <label className="toggle">
        <input type="checkbox" onChange={DarkLight} />
        <div className="slider">
          <div className="ball"></div>
        </div>
      </label>
      <button onClick={SysPrefrence}>System prefrence</button>
    </>
>>>>>>> 1f834b1 (A)
  )
}
export default DarkLightTheme
