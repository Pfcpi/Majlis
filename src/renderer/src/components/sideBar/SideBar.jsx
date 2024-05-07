import { useState, useRef, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Accueil from './sidebar_components/Accueil'
import Commission from './sidebar_components/Commission'
import AjouterRapport from './sidebar_components/AjouterRapport'
import AjouterPV from './sidebar_components/AjouterPV'
import Archive from './sidebar_components/Archive'
import Documentation from './sidebar_components/Documentation'

import AccueilSVG from './../../assets/Accueil.svg'
import CommissionSVG from './../../assets/Commission.svg'
import AjouterRapportSVG from './../../assets/AjouterRapport.svg'
import AjouterPVSVG from './../../assets/AjouterPV.svg'
import ArchiveSVG from './../../assets/Archive.svg'
import DocumentationSVG from './../../assets/Documentation.svg'
import LogOutSVG from './../../assets/LogOut.svg'

import AccueilBlueSVG from './../../assets/BlueSvgs/AccueilBlue.svg'
import CommissionBlueSVG from './../../assets/BlueSvgs/CommissionBlue.svg'
import AjouterRapportBlueSVG from './../../assets/BlueSvgs/AjouterRapportBlue.svg'
import AjouterPVBlueSVG from './../../assets/BlueSvgs/AjouterPVBlue.svg'
import ArchiveBlueSVG from './../../assets/BlueSvgs/ArchiveBlue.svg'
import DocumentationBlueSVG from './../../assets/BlueSvgs/DocumentationBlue.svg'

import AccueilWhiteSVG from './../../assets/BlueSvgs/AccueilWhite.svg'
import CommissionWhiteSVG from './../../assets/BlueSvgs/CommissionWhite.svg'
import AjouterRapportWhiteSVG from './../../assets/BlueSvgs/AjouterRapportWhite.svg'
import AjouterPVWhiteSVG from './../../assets/BlueSvgs/AjouterPVWhite.svg'
import ArchiveWhiteSVG from './../../assets/BlueSvgs/ArchiveWhite.svg'
import DocumentationWhiteSVG from './../../assets/BlueSvgs/DocumentationWhite.svg'
import LogOutWhiteSVG from './../../assets/BlueSvgs/LogOutWhite.svg'

import applogo from './../../../../../build/icon.png'

import useCliped from './../../zustand/cliped'
import useAuth from '../../zustand/auth'
import useAccount from '../../zustand/account'
import useDark from '../../zustand/dark'

import './SideBarcss.css'

function SideBar() {
  const [nav, setNav] = useState('Accueil')
  const { cliped, setCliped } = useCliped()
  const { logOut } = useAuth()
  const { dark } = useDark()
  const { account } = useAccount()

  const ref = useRef(null)

  useEffect(() => {
    var defaultPage = ref.current

    defaultPage.click()
  }, [])

  return (
    <div className="flex h-full w-full">
      <Router>
        <div
          className={
            cliped
              ? 'flex flex-col shrink-0 w-24 h-full pt-[20px] gap-[10%] justify-start items-center bg-side-bar-white-theme-color dark:bg-dark-gray'
              : 'flex flex-col shrink-0 w-[244px] h-full pt-[20px] gap-[10%] justify-start items-center bg-side-bar-white-theme-color dark:bg-dark-gray'
          }
        >
          <div className="flex flex-col w-full h-fit justify-center items-center gap-5">
            <div
              className="flex mb-10 w-full justify-evenly px-6 items-center"
              onClick={() => {
                setCliped()
              }}
            >
              <img
                data-cliped={cliped}
                className="p-0 w-1/3 aspect-square rounded-[10px] data-[cliped=true]:w-full"
                src={applogo}
                alt="Outil pour le conseil Discipline"
              />
              {!cliped && (
                <p className="font-cutive w-36 text-xl dark:text-white text-center">Conseil Discipline</p>
              )}
            </div>
            <Link
              data-cliped={cliped}
              className={
                nav === 'Accueil'
                  ? 'link_btn link_button_clicked data-[cliped=true]:link_btn_cliped'
                  : 'link_btn dark:link_btn_dark dark:link_button_not_clicked link_button_hover data-[cliped=true]:link_btn_cliped'
              }
              to="/"
              ref={ref}
              onClick={() => {
                setNav('Accueil')
              }}
            >
              <img
                src={nav === 'Accueil' ? AccueilBlueSVG : dark ? AccueilWhiteSVG : AccueilSVG}
              ></img>
              {!cliped && <p>Accueil</p>}
            </Link>
            <Link
              data-cliped={cliped}
              className={
                nav === 'Commission'
                  ? 'link_btn link_button_clicked data-[cliped=true]:link_btn_cliped'
                  : 'link_btn dark:link_btn_dark dark:link_button_not_clicked link_button_hover data-[cliped=true]:link_btn_cliped'
              }
              to="/Commission"
              onClick={() => {
                setNav('Commission')
              }}
            >
              <img
                src={
                  nav === 'Commission'
                    ? CommissionBlueSVG
                    : dark
                      ? CommissionWhiteSVG
                      : CommissionSVG
                }
              ></img>
              {!cliped && <p>Commission</p>}
            </Link>
            {account == 'chef' && (
              <Link
                data-cliped={cliped}
                className={
                  nav === 'AjouterRapport'
                    ? 'link_btn link_button_clicked data-[cliped=true]:link_btn_cliped'
                    : 'link_btn dark:link_btn_dark dark:link_button_not_clicked link_button_hover data-[cliped=true]:link_btn_cliped'
                }
                to="/AjouterRapport"
                onClick={() => {
                  setNav('AjouterRapport')
                }}
              >
                <img
                  src={
                    nav === 'AjouterRapport'
                      ? AjouterRapportBlueSVG
                      : dark
                        ? AjouterRapportWhiteSVG
                        : AjouterRapportSVG
                  }
                ></img>
                {!cliped && <p>Ajouter Rapport</p>}
              </Link>
            )}
            {account == 'president' && (
              <Link
                data-cliped={cliped}
                className={
                  nav === 'AjouterPV'
                    ? 'link_btn link_button_clicked data-[cliped=true]:link_btn_cliped'
                    : 'link_btn dark:link_btn_dark dark:link_button_not_clicked link_button_hover data-[cliped=true]:link_btn_cliped'
                }
                to="/AjouterPV"
                onClick={() => {
                  setNav('AjouterPV')
                }}
              >
                <img
                  src={
                    nav === 'AjouterPV' ? AjouterPVBlueSVG : dark ? AjouterPVWhiteSVG : AjouterPVSVG
                  }
                ></img>
                {!cliped && <p>Ajouter PV</p>}
              </Link>
            )}
            <Link
              data-cliped={cliped}
              className={
                nav === 'Archive'
                  ? 'link_btn link_button_clicked data-[cliped=true]:link_btn_cliped'
                  : 'link_btn dark:link_btn_dark dark:link_button_not_clicked link_button_hover data-[cliped=true]:link_btn_cliped'
              }
              to="/Archive"
              onClick={() => {
                setNav('Archive')
              }}
            >
              <img
                src={nav === 'Archive' ? ArchiveBlueSVG : dark ? ArchiveWhiteSVG : ArchiveSVG}
              ></img>
              {!cliped && <p>Archive</p>}
            </Link>
          </div>
          <div className="w-full flex flex-col items-center gap-5">
            <Link
              data-cliped={cliped}
              className={
                nav === 'Documentation'
                  ? 'link_btn link_button_clicked data-[cliped=true]:link_btn_cliped'
                  : 'link_btn dark:link_btn_dark dark:link_button_not_clicked link_button_hover data-[cliped=true]:link_btn_cliped'
              }
              to="/Documentation"
              onClick={() => {
                setNav('Documentation')
              }}
            >
              <img
                src={
                  nav === 'Documentation'
                    ? DocumentationBlueSVG
                    : dark
                      ? DocumentationWhiteSVG
                      : DocumentationSVG
                }
              ></img>
              {!cliped && <p>Documentation</p>}
            </Link>
            <button
              data-cliped={cliped}
              onClick={logOut}
              className="link_btn dark:link_btn_dark dark:link_button_not_clicked link_button_hover data-[cliped=true]:link_btn_cliped"
            >
              <img src={dark ? LogOutWhiteSVG : LogOutSVG}></img>
              {!cliped && <p>Se deconnecter</p>}
            </button>
          </div>
        </div>
        <div className="grow dark:bg-gray">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/Commission" element={<Commission />} />
            <Route path="/AjouterRapport" element={<AjouterRapport />} />
            <Route path="/AjouterPV" element={<AjouterPV />} />
            <Route path="/Archive" element={<Archive />} />
            <Route path="/Documentation" element={<Documentation />} />
          </Routes>
        </div>
      </Router>
    </div>
  )
}
export default SideBar
