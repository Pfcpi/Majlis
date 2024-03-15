import { useState } from 'react'
import './components_css/comp.css'

function Flon() {
  return (
    <label className="toggle">
      <input type="checkbox" />
      <div className="slider">
        <div className="ball"></div>
      </div>
    </label>
  )
}
export default Flon
