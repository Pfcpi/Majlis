import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'

import Home from './sidebar_components/Home'
import ConseilDiscipline from './sidebar_components/ConseilDiscipline'
import AjouterDossier from './sidebar_components/AjouterDossier'
import Administration from './sidebar_components/Administration'
import Planning from './sidebar_components/Planning'
import Recours from './sidebar_components/Recours'
import Documentation from './sidebar_components/Documentation'

import ConseilDisciplineSVG from './../../assets/ConseilDiscipline.svg'
import AjouterDossierSVG from './../../assets/AjouterDossier.svg'
import AdministrationSVG from './../../assets/Administration.svg'
import PlanningSVG from './../../assets/Planning.svg'
import RecoursSVG from './../../assets/Recours.svg'
import DocumentationSVG from './../../assets/Documentation.svg'

import './SideBarcss.css'

function SideBar() {
  useEffect(() => {
    axios
      .get('http://localhost:3000/')
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }, [])

  return (
    <div className="flex h-full w-full">
      <Router>
        <div className="flex flex-col shrink-0 w-[244px] h-full pt-[120px] gap-[200px] justify-start items-center dark:bg-[#111111]">
          <div className="flex flex-col w-full h-fit justify-center items-center gap-5">
            <Link className="link_btn dark:link_btn_dark" to="/">
              Home
            </Link>
            <Link className="link_btn dark:link_btn_dark" to="/ConseilDiscipline">
              <img src={ConseilDisciplineSVG}></img>Conseil Discipline
            </Link>
            <Link className="link_btn dark:link_btn_dark" to="/AjouterDossier">
              <img src={AjouterDossierSVG}></img>Ajouter Dossier
            </Link>
            <Link className="link_btn dark:link_btn_dark" to="/Administration">
              <img src={AdministrationSVG}></img>Administration
            </Link>
            <Link className="link_btn dark:link_btn_dark" to="/Planning">
              <img src={PlanningSVG}></img>Planning
            </Link>
            <Link className="link_btn dark:link_btn_dark" to="/Recours">
              <img src={RecoursSVG}></img>Recours
            </Link>
          </div>
          <Link className="link_btn dark:link_btn_dark" to="/Documentation">
            <img src={DocumentationSVG}></img>Documentation
          </Link>
        </div>
        <div className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ConseilDiscipline" element={<ConseilDiscipline />} />
            <Route path="/AjouterDossier" element={<AjouterDossier />} />
            <Route path="/Administration" element={<Administration />} />
            <Route path="/Planning" element={<Planning />} />
            <Route path="/Recours" element={<Recours />} />
            <Route path="/Documentation" element={<Documentation />} />
          </Routes>
        </div>
      </Router>
    </div>
  )
}
export default SideBar
