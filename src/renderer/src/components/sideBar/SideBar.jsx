import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Home from "./sidebar_components/Home"
import ConseilDiscipline from "./sidebar_components/ConseilDiscipline"
import AjouterDossier from "./sidebar_components/AjouterDossier"
import Administration from "./sidebar_components/Administration"
import Planning from "./sidebar_components/Planning"
import Recours from "./sidebar_components/Recours"
import Documentation from "./sidebar_components/Documentation"

import ConseilDisciplineSVG from './../../assets/ConseilDiscipline.svg'
import AjouterDossierSVG from './../../assets/AjouterDossier.svg'
import AdministrationSVG from './../../assets/Administration.svg'
import PlanningSVG from './../../assets/Planning.svg'
import RecoursSVG from './../../assets/Recours.svg'
import DocumentationSVG from './../../assets/Documentation.svg'

import "./SideBarcss.css"

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
      <div className='flex flex-col w-[244px] pt-[120px] gap-5 justify-center items-center h-screen dark:bg-[#111111]'>
        <Link className="link_btn dark:link_btn_dark" to="/">Home</Link> 
        <Link className="link_btn dark:link_btn_dark" to="/ConseilDiscipline"><img src={ConseilDisciplineSVG}></img>Conseil Discipline</Link>
        <Link className="link_btn dark:link_btn_dark" to="/AjouterDossier"><img src={AjouterDossierSVG}></img>Ajouter Dossier</Link>
        <Link className="link_btn dark:link_btn_dark" to="/Administration"><img src={AdministrationSVG}></img>Administration</Link>
        <Link className="link_btn dark:link_btn_dark" to="/Planning"><img src={PlanningSVG}></img>Planning</Link>
        <Link className="link_btn dark:link_btn_dark" to="/Recours"><img src={RecoursSVG}></img>Recours</Link>
        <Link className="link_btn dark:link_btn_dark" to="/Documentation"><img src={DocumentationSVG}></img>Documentation</Link>
      </div>
    </Router>
  )
}
export default SideBar
