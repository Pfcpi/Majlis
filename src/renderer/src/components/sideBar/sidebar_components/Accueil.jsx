import { useState, useRef, useEffect } from 'react'

import './sidebar_com_css/archives.css'
import './sidebar_com_css/scroll.css'

import useCliped from '../../../zustand/cliped'
import useDark from '../../../zustand/dark'
import useAccount from '../../../zustand/account'

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
//route /rapport/est_traiter (commit by mouhssin to fix route that will only display traited reports)
//searching mecanisme
//What functionnality does the checkBox provide
//In edit section (imprimer, enregistrer, envoyer) (do it after you complete the whole functionnality of the project)

function Archive() {
  //false for rapport, true for Dossier
  const ref = useRef(null)
  const api = 'http://localhost:3000'

  const { cliped, setCliped } = useCliped()
  const { dark, toggleTheme } = useDark()
  const { account } = useAccount()

  const [step, setStep] = useState(1)
  const [view, setView] = useState(false)
  const [modify, setModify] = useState(false)
  const [supprimer, setSupprimer] = useState(false)
  const [currentDeletedStudent, setCurrentDeletedStudent] = useState(0)
  const [etudiants, setEtudiants] = useState([])
  const [commission, setCommission] = useState([])
  const [currentViewedEtudiant, setCurrentViewedEtudiant] = useState({})

  const classNames = (array) => array?.filter(Boolean).join(' ')

  const [rapport, setRapport] = useState({
    matriculeE: 0,
    nomE: '',
    prenomE: '',
    niveauE: '',
    groupeE: 0,
    sectionE: null,
    nomP: '',
    prenomP: '',
    dateI: new Date().toISOString().slice(0, 19).replace('T', ' '),
    lieuI: '',
    motifI: '',
    descI: '',
    degreI: 1,
    numR: 0
  })

  useEffect(() => {
    axios
      .get(api + '/rapport/get')
      .then((res) => {
        setEtudiants(res.data)
      })
      .catch((err) => console.log(err))

    axios
      .get(api + '/commission/get')
      .then((res) => {
        setCommission(res.data)
      })
      .catch((err) => console.log(err))
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRapport((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const tableEtu = Array.isArray(etudiants) ? (
    etudiants.map((etudiant) => (
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
          <td className="flex justify-evenly px-0 border-x *:shrink-0">
            <button
              className=""
              onClick={() => {
                if (!cliped) setCliped()
                setView(true)
                axios
                  .post(api + '/rapport/gets', { numR: etudiant.num_r })
                  .then((res) => {
                    setCurrentViewedEtudiant(res.data[0])
                  })
                  .catch((err) => console.log(err))
              }}
            >
              <img src={VoirDossierSVG} alt="voir dossier icon"></img>
            </button>
            <button
              onClick={() => {
                setModify(true)
                console.log()
                axios
                  .post(api + '/rapport/gets', { numR: etudiant.num_r })
                  .then((res) => {
                    setCurrentViewedEtudiant(res.data[0])
                    setRapport((prev) => ({
                      ...prev,
                      matriculeE: res.data[0].matricule_e,
                      nomE: res.data[0].nom_e,
                      prenomE: res.data[0].prenom_e,
                      niveauE: res.data[0].niveau_e,
                      groupeE: res.data[0].groupe_e,
                      sectionE: res.data[0].section_e,
                      nomP: res.data[0].nom_p,
                      prenomP: res.data[0].prenom_p,
                      dateI: res.data[0].date_i,
                      lieuI: res.data[0].lieu_i,
                      motifI: res.data[0].motif_i,
                      descI: res.data[0].description_i,
                      numR: etudiant.num_r
                    }))
                  })
                  .catch((err) => console.log(err))
              }}
            >
              <img
                src={!dark ? ModifierDossierGraySVG : ModifierDossierSVG}
                alt="modifier dossier icon"
              ></img>
            </button>
            {account == 'chef' && (
              <button
                onClick={() => {
                  setSupprimer(true)
                  setCurrentDeletedStudent(etudiant.num_r)
                }}
                className="bg-red w-7 aspect-square"
              ></button>
            )}
          </td>
        )}
      </tr>
    ))
  ) : (
    <></>
  )

  const ListCom = Array.isArray(commission) ? (
    commission.map((mem) => (
      <div className="flex flex-col snap-start h-fit py-2 px-4 w-full">
        <p className="text-xl">{[mem.nom_m, ' ', mem.prenom_m]}</p>
        <p className="text-blue">{mem.role_m}</p>
      </div>
    ))
  ) : (
    <></>
  )
  return (
    <div className="flex w-full h-full">
      {supprimer && (
        <div className="absolute flex items-center justify-center w-full h-full bg-[rgba(0,0,0,0.6)] top-0 left-0 z-20">
          <div className="flex flex-col justify-evenly text-xl items-center h-40 w-1/3 z-30 rounded-xl text-white dark:text-black bg-dark-gray dark:bg-white">
            Confirmer la suppression du rapport
            <div className="flex w-full justify-between px-8">
              <button
                onClick={() => {
                  setSupprimer(false)
                }}
                className="flex justify-center items-center border rounded-xl text-red py-2 px-4 bg-0.36-red"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  axios
                    .delete(api + '/rapport/delete', { data: { numR: currentDeletedStudent } })
                    .then((res) => {
                      console.log('/rapport/delete', res)
                    })
                    .catch((err) => console.log(err))
                  axios
                    .get(api + '/rapport/get')
                    .then((res) => {
                      setEtudiants(res.data)
                      console.log("worked updated students after delete")
                    })
                    .catch((err) => console.log(err))
                  setSupprimer(false)
                }}
                className="flex justify-center items-center border rounded-xl text-blue py-2 px-4 bg-0.08-blue"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      {!modify && (
        <div className="flex w-full h-full font-poppins flex-row-reverse justify-evenly">
          {!view && (
            <div className="flex flex-col w-1/5 mt-[4vh]">
              <h2 className="text-[1.5vw] text-center py-4">Commission Active</h2>
              <div className="w-full h-[80vh] bg-side-bar-white-theme-color dark:bg-dark-gray snap-y snap-mandatory overflow-y-scroll scroll-pt-1 flex flex-col gap-1 rounded-lg">
                {ListCom}
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
                    <p>
                      Nom : {[currentViewedEtudiant.nom_e, ' ', currentViewedEtudiant.prenom_e]}
                    </p>
                    <p>Filière : {currentViewedEtudiant.niveau_e}</p>
                    <p>Groupe : {currentViewedEtudiant.groupe_e}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-blue text-2xl">Informations du plaignant</h3>
                  <div className="flex flex-col gap-3">
                    <p>
                      Nom : {[currentViewedEtudiant.nom_p, ' ', currentViewedEtudiant.prenom_p]}
                    </p>
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
            <div className="flex px-12 justify-end h-16 w-full items-center rounded-tl-lg rounded-tr-lg border-t border-x border-table-border-white-theme-color dark:border-white/20 bg-side-bar-white-theme-color dark:bg-dark-gray">
              <div className="flex bg-white dark:bg-light-gray rounded-lg">
                <img className="px-2" src={SearchSVG} alt="Search icon"></img>
                <input
                  className="flex justify-start items-center w-[240px] h-10 px-2 py-1 rounded-lg bg-transparent outline-none text-[#B6BCD1] dark:text-white"
                  type="search"
                  placeholder="Rechercher"
                ></input>
              </div>
            </div>
            <div className="max-h-[56vh] overflow-y-auto w-full">
              <table className="w-full">
                <tr className="border-t">
                  <th className="w-1/4 border-x">
                    <div>
                      Rapport
                      <img
                        className="imgp"
                        src={dark ? UpDownSVG : UpDownGraySVG}
                        alt="filter"
                      ></img>
                    </div>
                  </th>
                  <th className="w-1/4 border-x">
                    <div>
                      Nom Etudiant
                      <img
                        className="imgp"
                        src={dark ? UpDownSVG : UpDownGraySVG}
                        alt="filter"
                      ></img>
                    </div>
                  </th>
                  <th className="w-1/4 border-x">
                    <div>
                      Date de l'infraction
                      <img
                        className="imgp"
                        src={dark ? UpDownSVG : UpDownGraySVG}
                        alt="filter"
                      ></img>
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
      )}
      {modify && !!currentViewedEtudiant && (
        <div className="h-full w-full flex flex-col justify-center items-center gap-6">
          <div className="w-full flex flex-col items-center justify-center">
            <div className="flex w-5/6 h-2 stretch-0 bg-[#D9D9D9] justify-evenly items-center [&>div]: [&>div]:h-8 [&>div]:aspect-square [&>div]:flex [&>div]:justify-center [&>div]:items-center [&>div]:rounded-full [&>div]:z-10">
              <div className={step >= 2 ? 'bg-blue text-white' : 'text-blue bg-[#D9D9D9]'}>1</div>
              <div className={step >= 3 ? 'bg-blue text-white' : 'text-blue bg-[#D9D9D9]'}>2</div>
              <div className={step >= 4 ? 'bg-blue text-white' : 'text-blue bg-[#D9D9D9]'}>3</div>
            </div>
            <div className="w-5/6 h-2 mt-[-8px] flex items-center">
              <div className={step >= 1 ? 'w-1/4 bg-blue h-2' : ''}></div>
              <div className={step >= 2 ? 'w-1/4 bg-blue h-2' : ''}></div>
              <div className={step >= 3 ? 'w-1/4 bg-blue h-2' : ''}></div>
              <div className={step >= 4 ? 'w-1/4 bg-blue h-2' : ''}></div>
            </div>
          </div>
          {step === 4 && (
            <div className="absolute w-full h-full bg-[rgba(0,0,0,0.6)] top-0 left-0 z-20"></div>
          )}
          {step === 4 && (
            <div className="absolute flex flex-col justify-evenly text-xl items-center h-40 w-1/3 z-30 rounded-xl text-white dark:text-black bg-dark-gray dark:bg-white">
              Confirmer la modification du rapport
              <div className="flex w-full justify-between px-8">
                <button
                  onClick={() => {
                    setStep(1)
                    setModify(false)
                  }}
                  className="flex justify-center items-center border rounded-xl text-red py-2 px-4 bg-0.36-red"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setStep(1)
                    setModify(false)
                    axios
                      .patch(api + '/rapport/edit', rapport)
                      .then((res) => console.log(res, res.data.sql))
                      .catch((err) => console.log(err))
                    axios
                      .get(api + '/rapport/get')
                      .then((res) => {
                        setEtudiants(res.data)
                      })
                      .catch((err) => console.log(err))
                  }}
                  className="flex justify-center items-center border rounded-xl text-blue py-2 px-4 bg-0.08-blue"
                >
                  confirmer
                </button>
              </div>
            </div>
          )}
          <form className="overflow-y-auto flex flex-col justify-center items-center rounded-xl bg-side-bar-white-theme-color dark:bg-dark-gray w-1/2 max-h-[84vh] min-w-[500px] ">
            <h1 className="text-[36px] py-4">Detail du rapport</h1>
            <hr className="w-full dark:text-gray"></hr>
            {step == 1 && (
              <div className="flex flex-col w-5/6 my-2">
                <label className="label_dossier">Etudiant</label>
                <div className="flex flex-col w-full gap-6 mb-4">
                  <input
                    className="input_dossier"
                    placeholder="Matricule"
                    name="matriculeE"
                    onChange={handleInputChange}
                    defaultValue={currentViewedEtudiant.matricule_e}
                    required
                  ></input>
                  <input
                    className="input_dossier"
                    placeholder="Nom"
                    name="nomE"
                    onChange={handleInputChange}
                    defaultValue={currentViewedEtudiant.nom_e}
                    required
                  ></input>
                  <input
                    className="input_dossier"
                    placeholder="Prenom"
                    name="prenomE"
                    defaultValue={currentViewedEtudiant.prenom_e}
                    onChange={handleInputChange}
                    required
                  ></input>
                  <input
                    className="input_dossier"
                    placeholder="Niveau"
                    name="niveauE"
                    onChange={handleInputChange}
                    defaultValue={currentViewedEtudiant.niveau_e}
                    required
                  ></input>
                  <input
                    className="input_dossier"
                    placeholder="Groupe"
                    name="groupeE"
                    onChange={handleInputChange}
                    defaultValue={currentViewedEtudiant.groupe_e}
                    required
                  ></input>
                  <input
                    className="input_dossier"
                    placeholder="Section"
                    name="sectionE"
                    onChange={handleInputChange}
                    defaultValue={currentViewedEtudiant.section_e}
                    required
                  ></input>
                </div>
              </div>
            )}
            {step == 2 && (
              <div className="flex flex-col w-5/6 my-2">
                <label className="label_dossier">Plaignant</label>
                <div className="flex flex-col w-full gap-6 mb-4">
                  <input
                    className="input_dossier"
                    placeholder="Nom"
                    name="nomP"
                    onChange={handleInputChange}
                    defaultValue={currentViewedEtudiant.nom_p}
                    required
                  ></input>
                  <input
                    className="input_dossier"
                    placeholder="Prenom"
                    name="prenomP"
                    onChange={handleInputChange}
                    defaultValue={currentViewedEtudiant.prenom_p}
                    required
                  ></input>
                </div>
              </div>
            )}
            {step == 3 && (
              <div className="flex flex-col w-5/6 my-2">
                <label className="label_dossier">Informations globales</label>
                <div className="flex flex-col w-full gap-6 mb-4">
                  <input
                    className="input_dossier"
                    placeholder="Date de l'infraction"
                    name="dateI"
                    type="date"
                    onChange={handleInputChange}
                    defaultValue={currentViewedEtudiant.date_i.substring(0, 10)}
                    required
                  ></input>
                  <input
                    className="input_dossier"
                    placeholder="lieu"
                    name="lieuI"
                    onChange={handleInputChange}
                    defaultValue={currentViewedEtudiant.lieu_i}
                    required
                  ></input>
                  <input
                    className="input_dossier"
                    placeholder="Motif"
                    name="motifI"
                    onChange={handleInputChange}
                    defaultValue={currentViewedEtudiant.motif_i}
                    required
                  ></input>
                  <textarea
                    className="input_dossier resize-none"
                    placeholder="Description"
                    name="descI"
                    onChange={handleInputChange}
                    defaultValue={currentViewedEtudiant.description_i}
                    required
                  ></textarea>
                </div>
              </div>
            )}
            <hr className="w-full dark:text-gray"></hr>
            <div className="flex justify-between w-5/6 py-6">
              <button className="button_dossier text-red min-w-fit" type="reset">
                Annuler
              </button>
              <button
                className="button_dossier text-blue min-w-fit"
                type="submit"
                onClick={(e) => {
                  e.preventDefault()
                  setStep((prev) => prev + 1)
                }}
              >
                {step > 2 ? 'modifier' : 'continue'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
export default Archive
