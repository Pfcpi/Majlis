import { useState, useRef, Component } from 'react'

import './sidebar_com_css/archives.css'

import UpDownSVG from './../../../assets/UpDown.svg'
import SearchSVG from './../../../assets/Search.svg'
import VoirDossierSVG from './../../../assets/VoirDossier.svg'
import ModifierDossierSVG from './../../../assets/ModifierDossier.svg'
import NotificationsSVG from './../../../assets/gravity-ui_bell.svg'

//Need to modify:
//Clicking on modify and review will enable the checkmark
function Archive() {
  //false for rapport, true for Dossier
  const ref = useRef(null)
  function handleRowChecked() {
    var label = ref.current
    label.click()
  }

  return (
    <div className="text-white flex w-full font-poppins flex-row-reverse justify-evenly">
      <div className="flex flex-col w-1/5 mt-[4vh]">
        <h2 className="text-[1.5vw] text-center py-4">Commission Active</h2>
        <div className="flex flex-col justify-center items-center gap-4 py-16 max-h-[40vh] overflow-y-scroll snap-y scroll-py-6 dark:bg-dark-gray rounded-lg">
          <div className="flex flex-col snap-center">
            <p className="text-[20px]">ZOUJKILO BATATA</p>
            <p className="text-blue">Président</p>
          </div>
          <div className="flex flex-col snap-center">
            <p className="text-[20px]">ZOUJKILO BATATA</p>
            <p className="text-blue">Président</p>
          </div>
          <div className="flex flex-col snap-center">
            <p className="text-[20px]">ZOUJKILO BATATA</p>
            <p className="text-blue">Président</p>
          </div>
          <div className="flex flex-col snap-center">
            <p className="text-[20px]">ZOUJKILO BATATA</p>
            <p className="text-blue">Président</p>
          </div>
          <div className="flex flex-col snap-center">
            <p className="text-[20px]">ZOUJKILO BATATA</p>
            <p className="text-blue">Président</p>
          </div>
          <div className="flex flex-col snap-center">
            <p className="text-[20px]">ZOUJKILO BATATA</p>
            <p className="text-blue">Président</p>
          </div>
          <div className="flex flex-col snap-center">
            <p className="text-[20px]">ZOUJKILO BATATA</p>
            <p className="text-blue">Président</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-3/4 mt-[8vh]">
        <div className="flex items-center w-fit px-4 gap-4 py-2 text-blue bg-blue/15 border border-blue rounded-lg">
          <img className="w-7 aspect-square" src={NotificationsSVG}></img>
          <p>8 Nouveax rapports ajoutés...</p>
        </div>
        <h1 className="text-3xl py-4">Rapport a traiter</h1>
        <div className="flex px-12 justify-end h-16 items-center rounded-tl-lg rounded-tr-lg border-t border-x border-white/20 dark:bg-dark-gray">
          <div className="flex dark:bg-light-gray rounded-lg">
            <img className="px-2" src={SearchSVG} alt="Search icon"></img>
            <input
              className="flex justify-start items-center w-[240px] h-10 px-2 py-1 rounded-lg bg-transparent outline-none text-[#B6BCD1] dark:text-white"
              placeholder="Rechercher"
            ></input>
          </div>
        </div>
        <table className="">
          <tr className="border-t-[1px]">
            <th className="w-1/4 border-x-[1px]">
              <div>
                Rapport
                <img className="imgp" src={UpDownSVG} alt="filter"></img>
              </div>
            </th>
            <th className="w-1/4 border-x-[1px]">
              <div>
                Nom Etudiant
                <img className="imgp" src={UpDownSVG} alt="filter"></img>
              </div>
            </th>
            <th className="w-1/4 border-x-[1px]">
              <div>
                Date de l'infraction
                <img className="imgp" src={UpDownSVG} alt="filter"></img>
              </div>
            </th>
            <th className="w-1/4 border-x-[1px]">
              <div>Action</div>
            </th>
          </tr>
          <tr className="border-y-[1px] dark:hover:bg-dark-gray" onClick={handleRowChecked}>
            <td className="border-x-[1px]">
              <label className="" ref={ref} id="DossierCheck">
                <input className="mr-2" type="checkbox"></input>
                <span>1000</span>
              </label>
            </td>
            <td className="border-x-[1px]">Aboura yacine</td>
            <td className="border-x-[1px]">22 Jan 2023</td>
            <td className="border-x-[1px]">
              <button className="mr-10">
                <img src={VoirDossierSVG} alt="voir dossier icon"></img>
              </button>
              <button>
                <img src={ModifierDossierSVG} alt="modifier dossier icon"></img>
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  )
}
export default Archive
