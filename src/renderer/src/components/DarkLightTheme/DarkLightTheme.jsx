import { useState } from 'react'
import './comp.css'

function DarkLightTheme() {
  function DarkLight(e) {
    console.log(e.target.checked)

    if (e.target.checked === false) {
      localStorage.theme = 'light'
    } else {
      localStorage.theme = 'dark'
    }

    console.log(localStorage)

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
    console.log('Clicked')
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <>
      <label className="toggle">
        <input type="checkbox" onChange={DarkLight} />
        <div className="slider">
          <div className="ball"></div>
        </div>
      </label>
      <button onClick={SysPrefrence}>System prefrence</button>
    </>
  )
}
export default DarkLightTheme
