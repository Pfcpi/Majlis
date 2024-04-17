import { useState, useRef, useEffect } from 'react'

import './sidebar_com_css/archives.css'
import './sidebar_com_css/scroll.css'

import useCliped from '../../../zustand/cliped'
import useDark from '../../../zustand/dark'

import UpDownSVG from './../../../assets/UpDown.svg'
import UpDownGraySVG from './../../../assets/BlueSvgs/UpDownGray.svg'
import SearchSVG from './../../../assets/Search.svg'
import VoirDossierSVG from './../../../assets/VoirDossier.svg'
import ModifierDossierSVG from './../../../assets/ModifierDossier.svg'
import ModifierDossierGraySVG from './../../../assets/BlueSvgs/ModifierDossierGray.svg'
import NotificationsSVG from './../../../assets/gravity-ui_bell.svg'
import GOBackSVG from './../../../assets/GoBack.svg'
import GOBackGraySVG from './../../../assets/BlueSvgs/GoBackGray.svg'
import PdfSVG from './../../../assets/pdf.svg'
import ImprimerSVG from './../../../assets/imprimer.svg'
import EnvoyerSVG from './../../../assets/Envoyer.svg'
import EnvoyerGraySVG from './../../../assets/BlueSvgs/EnvoyerGray.svg'
import axios from 'axios'

//Tasks:
//Edit rapport
//What functionnality does the checkBox provide
//Commission active (fetching data)
function Archive() {
  //false for rapport, true for Dossier
  const ref = useRef(null)
  const api = 'http://localhost:3000'

  const { cliped, setCliped } = useCliped()
  const { dark, toggleTheme } = useDark()

  const [view, setView] = useState(false)
  const [etudiants, setEtudiants] = useState([])
  const [currentViewedEtudiant, setCurrentViewedEtudiant] = useState({})

  const classNames = (array) => array?.filter(Boolean).join(' ')

  function handleRowChecked() {
    var label = ref.current
    label.click()
  }

  useEffect(() => {
    axios
      .get(api + '/rapport/get')
      .then((res) => {
        setEtudiants(res.data)
      })
      .catch((err) => console.log(err))
  }, [])

  const tableEtu = etudiants.map((etudiant) => (
    <tr className="border-y dark:hover:bg-dark-gray">
      <td className="border-x">
        <label className="" id="DossierCheck">
          <input className="mr-2" type="checkbox"></input>
          <span>{etudiant.num_r}</span>
        </label>
      </td>
      <td className="font-medium border-x">{[etudiant.nom_e, ' ', etudiant.prenom_e]}</td>
      <td className="border-x">{etudiant.date_i.slice(0, etudiant.date_i.indexOf('T'))}</td>
      {!view && (
        <td className="border-x">
          <button
            className="mr-10"
            onClick={() => {
              if (!cliped) setCliped()
              setView(true)
              axios
                .post(api + '/rapport/gets', { numR: etudiant.num_r })
                .then((res) => {
                  console.log('current student: ', res.data[0])
                  setCurrentViewedEtudiant(res.data[0])
                })
                .catch((err) => console.log(err))
            }}
          >
            <img src={VoirDossierSVG} alt="voir dossier icon"></img>
          </button>
          <button>
            <img
              src={!dark ? ModifierDossierGraySVG : ModifierDossierSVG}
              alt="modifier dossier icon"
            ></img>
          </button>
        </td>
      )}
    </tr>
  ))

  return (
    <div className="flex w-full h-full font-poppins flex-row-reverse justify-evenly">
      {!view && (
        <div className="flex flex-col w-1/5 mt-[4vh]">
          <h2 className="text-[1.5vw] text-center py-4">Commission Active</h2>
          <div className="w-full h-[80vh] bg-side-bar-white-theme-color dark:bg-dark-gray snap-y snap-mandatory overflow-y-scroll scroll-pt-1 flex flex-col gap-1 rounded-lg">
            <div className="flex flex-col snap-start h-fit py-2 px-4 w-full">
              <p className="text-xl">ZOUJKILO BATATA</p>
              <p className="text-blue">Président</p>
            </div>
            <div className="flex flex-col snap-start h-fit py-2 px-4 w-full">
              <p className="text-xl">ZOUJKILO BATATA</p>
              <p className="text-blue">titulaire</p>
            </div>
            <div className="flex flex-col snap-start h-fit py-2 px-4 w-full">
              <p className="text-xl">ZOUJKILO BATATA</p>
              <p className="text-blue">titulaire</p>
            </div>
            <div className="flex flex-col snap-start h-fit py-2 px-4 w-full">
              <p className="text-xl">ZOUJKILO BATATA</p>
              <p className="text-blue">titulaire</p>
            </div>
            <div className="flex flex-col snap-start h-fit py-2 px-4 w-full">
              <p className="text-xl">ZOUJKILO BATATA</p>
              <p className="text-blue">titulaire</p>
            </div>
            <div className="flex flex-col snap-start h-fit py-2 px-4 w-full">
              <p className="text-xl">ZOUJKILO BATATA</p>
              <p className="text-blue">suppliant</p>
            </div>
            <div className="flex flex-col snap-start h-fit py-2 px-4 w-full">
              <p className="text-xl">ZOUJKILO BATATA</p>
              <p className="text-blue">suppliant</p>
            </div>
            <div className="flex flex-col snap-start h-fit py-2 px-4 w-full">
              <p className="text-xl">ZOUJKILO BATATA</p>
              <p className="text-blue">suppliant</p>
            </div>
            <div className="flex flex-col snap-start h-fit py-2 px-4 w-full">
              <p className="text-xl">ZOUJKILO BATATA</p>
              <p className="text-blue">suppliant</p>
            </div>
            <div className="flex flex-col snap-start h-fit py-2 px-4 w-full">
              <p className="text-xl">ZOUJKILO BATATA</p>
              <p className="text-blue">suppliant</p>
            </div>
            <div className="flex flex-col snap-start h-fit py-2 px-4 w-full">
              <p className="text-xl">ZOUJKILO BATATA</p>
              <p className="text-blue">etudiant</p>
            </div>
          </div>
        </div>
      )}
      {view && !!currentViewedEtudiant && (
        <div className="w-1/2 bg-side-bar-white-theme-color dark:bg-dark-gray h-full flex flex-col">
          <button
            className="w-10 aspect-square"
            onClick={() => {
              if (cliped) setCliped()
              setView(false)
            }}
          >
            <img src={!dark ? GOBackGraySVG : GOBackSVG}></img>
          </button>
          <div className="overflow-y-auto max-h-[85vh] flex flex-col w-full px-6 gap-4">
            <h2 className="text-4xl">Details du Dossier </h2>
            <div className="flex flex-col gap-4">
              <h3 className="text-blue text-2xl">Informations de l'étudiant:</h3>
              <div className="flex flex-col gap-3">
                <p>Matricule : {currentViewedEtudiant.matricule_e}</p>
                <p>Nom : {[currentViewedEtudiant.nom_e, ' ', currentViewedEtudiant.prenom_e]}</p>
                <p>Filière : {currentViewedEtudiant.niveau_e}</p>
                <p>Groupe : {currentViewedEtudiant.groupe_e}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-blue text-2xl">Informations du plaignant</h3>
              <div className="flex flex-col gap-3">
                <p>Nom : {[currentViewedEtudiant.nom_p, ' ', currentViewedEtudiant.prenom_p]}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-blue text-2xl">Informations globales</h3>
              <div className="flex flex-col gap-3">
                <p>
                  Date de l’infraction :{' '}
                  {currentViewedEtudiant.date_i
                    ? currentViewedEtudiant.date_i.slice(
                        0,
                        currentViewedEtudiant.date_i.indexOf('T')
                      )
                    : 'not found'}
                </p>
                <p>Lieu : {currentViewedEtudiant.lieu_i}</p>
                <p>Motif : {currentViewedEtudiant.motif_i}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-blue text-2xl">Description:</h3>
              <div className="flex flex-col gap-3">
                <p>{currentViewedEtudiant.description_i}</p>
              </div>
            </div>
            <div className="flex justify-evenly">
              <button className="py-2 px-4 border rounded-xl flex gap-3 justify-center items-center">
                <img src={ImprimerSVG}></img>imprimer
              </button>
              <button className="py-2 px-4 border rounded-xl flex gap-3 justify-center items-center">
                <img src={PdfSVG}></img>enregistrer
              </button>
              <button className="py-2 px-4 border rounded-xl flex gap-3 justify-center items-center">
                <img src={dark ? EnvoyerSVG : EnvoyerGraySVG}></img>envoyer
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={classNames(['flex flex-col mt-[8vh]', view ? 'w-1/2' : 'w-3/4'])}>
        {etudiants.length != 0 && (
          <div className="flex items-center w-fit px-4 gap-4 py-2 text-blue bg-blue/15 border border-blue rounded-lg">
            <img className="w-7 aspect-square" src={NotificationsSVG}></img>
            <p>{etudiants.length} Nouveax rapports ajoutés...</p>
          </div>
        )}
        <h1 className="text-3xl py-4">Rapport a traiter</h1>
        <div className="flex px-12 justify-end h-16 w-[calc(100%-8px)] items-center rounded-tl-lg rounded-tr-lg border-t border-x border-table-border-white-theme-color dark:border-white/20 bg-side-bar-white-theme-color dark:bg-dark-gray">
          <div className="flex bg-white dark:bg-light-gray rounded-lg">
            <img className="px-2" src={SearchSVG} alt="Search icon"></img>
            <input
              className="flex justify-start items-center w-[240px] h-10 px-2 py-1 rounded-lg bg-transparent outline-none text-[#B6BCD1] dark:text-white"
              type="search"
              placeholder="Rechercher"
            ></input>
          </div>
        </div>
        <div className="max-h-[56vh] overflow-y-auto w-[calc(100%-8px)]">
          <table className="w-full">
            <tr className="border-t">
              <th className="w-1/4 border-x">
                <div>
                  Rapport
                  <img className="imgp" src={dark ? UpDownSVG : UpDownGraySVG} alt="filter"></img>
                </div>
              </th>
              <th className="w-1/4 border-x">
                <div>
                  Nom Etudiant
                  <img className="imgp" src={dark ? UpDownSVG : UpDownGraySVG} alt="filter"></img>
                </div>
              </th>
              <th className="w-1/4 border-x">
                <div>
                  Date de l'infraction
                  <img className="imgp" src={dark ? UpDownSVG : UpDownGraySVG} alt="filter"></img>
                </div>
              </th>
              {!view && (
                <th className="w-1/4 border-x">
                  <div>Action</div>
                </th>
              )}
            </tr>
            {tableEtu}
          </table>
        </div>
      </div>
    </div>
  )
}
export default Archive
