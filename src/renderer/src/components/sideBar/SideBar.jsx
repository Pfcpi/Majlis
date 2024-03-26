import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'

import Accueil from './sidebar_components/Accueil'
import ConseilDiscipline from './sidebar_components/ConseilDiscipline'
import AjouterDossier from './sidebar_components/AjouterDossier'
import Administration from './sidebar_components/Administration'
import Archives from './sidebar_components/Archives'
import Documentation from './sidebar_components/Documentation'

import OutilConseilSVG from './../../assets/OutilConseil.svg'
import ConseilDisciplineSVG from './../../assets/ConseilDiscipline.svg'
import AjouterDossierSVG from './../../assets/AjouterDossier.svg'
import AdministrationSVG from './../../assets/Administration.svg'
import PlanningSVG from './../../assets/Planning.svg'
import AccueilSVG from './../../assets/Accueil.svg'
import DocumentationSVG from './../../assets/Documentation.svg'

import './SideBarcss.css'

function SideBar() {
  return (
    <div className="flex h-full w-full">
      <Router>
        <div className="flex flex-col shrink-0 w-[244px] h-full pt-[20px] gap-[200px] justify-start items-center dark:bg-dark-gray">
          <div className="flex flex-col w-full h-fit justify-center items-center gap-5">
            <img className="mb-[40px] p-0" src={OutilConseilSVG} alt="Outil pour le conseil Discipline"/>
            <Link className="link_btn dark:link_btn_dark" to="/">
              <img src={AccueilSVG}></img>
              Accueil
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
            <Link className="link_btn dark:link_btn_dark" to="/Archives">
              <img src={PlanningSVG}></img>Archives
            </Link>
          </div>
          <Link className="link_btn dark:link_btn_dark" to="/Documentation">
            <img src={DocumentationSVG}></img>Documentation
          </Link>
        </div>
        <div className="grow dark:bg-gray">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/ConseilDiscipline" element={<ConseilDiscipline />} />
            <Route path="/AjouterDossier" element={<AjouterDossier />} />
            <Route path="/Administration" element={<Administration />} />
            <Route path="/Archives" element={<Archives />} />
            <Route path="/Documentation" element={<Documentation />} />
          </Routes>
        </div>
      </Router>
    </div>
  )
}
export default SideBar
