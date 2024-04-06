import { useState, useRef, Component } from 'react'

import './sidebar_com_css/archives.css'

import useCliped from '../../../zustand/cliped'
import useAccount from '../../../zustand/account'
import useDark from '../../../zustand/dark'

import UpDownSVG from './../../../assets/UpDown.svg'
import UpDownGraySVG from './../../../assets/BlueSvgs/UpDownGray.svg'
import SearchSVG from './../../../assets/Search.svg'
import VoirDossierSVG from './../../../assets/VoirDossier.svg'
import ModifierDossierSVG from './../../../assets/ModifierDossier.svg'
import AjouterPersonneSVG from './../../../assets/AjouterPersonne.svg'
import ModifierCommissionSVG from './../../../assets/ModifierCommission.svg'
import SupprimerRedSVG from './../../../assets/BlueSvgs/SupprimerRed.svg'
import EnvoyerSVG from './../../../assets/Envoyer.svg'
import EnvoyerGraySVG from './../../../assets/BlueSvgs/EnvoyerGray.svg'

//Need to modify:
//Clicking on modify and review will enable the checkmark
function Archive() {
  //false for rapport, true for Dossier
  const { account } = useAccount()
  const { dark} = useDark()
  const ref = useRef(null)
  const { cliped, setCliped } = useCliped()
  const classNames = (array) => array?.filter(Boolean).join(' ')
  function handleRowChecked() {
    var label = ref.current
    label.click()
  }

  return (
    <div className="flex w-full h-full font-poppins flex-row-reverse justify-evenly">
      <div className="flex flex-col w-3/4 mt-[8vh]">
        <div className="flex px-12 justify-between h-16 items-center rounded-tl-lg rounded-tr-lg border-t border-x border-table-border-white-theme-color dark:border-white/20 bg-side-bar-white-theme-color dark:bg-dark-gray">
          {account == 'chef' && (
            <div className="flex w-1/2 justify-evenly items-center">
              <button className="flex border py-2 px-4 rounded-xl gap-2 border-table-border-white-theme-color">
                <img src={AjouterPersonneSVG}></img>Ajouter
              </button>
              <button className="flex border py-2 px-4 rounded-xl gap-2 border-table-border-white-theme-color">
                <img src={ModifierCommissionSVG}></img>Modifier
              </button>
              <button className="flex border py-2 px-4 rounded-xl gap-2 dark:bg-brown text-red">
                <img src={SupprimerRedSVG}></img>Supprimer
              </button>
            </div>
          )}
          {account == 'president' && (
            <button className="flex justify-center items-center gap-3 py-2 px-4 border rounded-xl border-table-border-white-theme-color">
              <img src={dark ? EnvoyerSVG : EnvoyerGraySVG}></img>envoyer
            </button>
          )}
          <div className="flex bg-white dark:bg-light-gray rounded-lg">
            <img className="px-2" src={SearchSVG} alt="Search icon"></img>
            <input
              className="flex justify-start items-center w-[240px] h-10 px-2 py-1 rounded-lg bg-transparent outline-none text-[#B6BCD1] dark:text-white"
              type="search"
              placeholder="Rechercher"
            ></input>
          </div>
        </div>
        <table className="">
          <tr className="border-t">
            <th className="w-1/4 border-x">
              <div>
                Titre
                <img className="imgp" src={dark? UpDownSVG: UpDownGraySVG} alt="filter"></img>
              </div>
            </th>
            <th className="w-1/4 border-x">
              <div>
                Nom
                <img className="imgp" src={dark? UpDownSVG: UpDownGraySVG}alt="filter"></img>
              </div>
            </th>
            <th className="w-1/4 border-x">
              <div>
                Email
                <img className="imgp" src={dark? UpDownSVG: UpDownGraySVG}alt="filter"></img>
              </div>
            </th>
          </tr>
          <tr className="border-y dark:hover:bg-dark-gray" onClick={handleRowChecked}>
            <td className="border-x">Président</td>
            <td className="border-x">Aboura yacine</td>
            <td className="border-x">aboura@gmail.com</td>
          </tr>
        </table>
      </div>
    </div>
  )
}
export default Archive
