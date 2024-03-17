import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from "./Home"
import ConseilDiscipline from "./ConseilDiscipline"
import AjouterDossier from "./AjouterDossier"
import Administration from "./Administration"
import Planning from "./Planning"
import Recours from "./Recours"
import Documentation from "./Documentation"

function SideBar() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/ConseilDiscipline" element={<ConseilDiscipline/>} />
        <Route path="/AjouterDossier" element={<AjouterDossier/>} />
        <Route path="/Administration" element={<Administration/>} />
        <Route path="/Planning" element={<Planning/>} />
        <Route path="/Recours" element={<Recours/>} />
        <Route path="/Documentation" element={<Documentation/>} />
      </Routes>
      <div className='flex flex-col'>
        <Link to="/" >Home</Link> 
        <Link to="/ConseilDiscipline">Conseil Discipline</Link>
        <Link to="/AjouterDossier">Ajouter Dossier</Link>
        <Link to="/Administration">Administration</Link>
        <Link to="/Planning">Planning</Link>
        <Link to="/Recours">Recours</Link>
        <Link to="/Documentation">Documentation</Link>
      </div>
    </Router>
  )
}
export default SideBar
