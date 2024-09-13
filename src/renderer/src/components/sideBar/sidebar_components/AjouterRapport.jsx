import { useState, useEffect, useRef } from 'react'
import WarningSVG from './../../../assets/warning.svg'
import ChoiceSVG from './../../../assets/Choice.svg'
import './sidebar_com_css/accueil.css'
import './sidebar_com_css/ajouterRapport.css'
import axios from 'axios'
import useDate from '../../../zustand/currentDate'

import useApi from '../../../zustand/api'

function AjouterRapport() {
  const { date } = useDate()
  const niveaux = [
    'ING1',
    'ING2',
    'ING3',
    'ING4',
    'ING5',
    'L1',
    'L2',
    'L3-ISIL',
    'L3-SI',
    'M1-IAA',
    'M1-RSID',
    'M1-SID',
    'M2-IAA',
    'M2-RSID',
    'M2-SID',
    'Doctorat'
  ]
  const motif1 = [
    "Tentative de fraude à l'examen",
    "Fraude établie et reconnue à l'examen",
    "Insulte et propos irrévérencieux à l'égard de l'ensemble du personnel universitaire et des étudiants",
    "Indiscipline caractérisée envers l'ensemble du personnel universitaire"
  ]
  const motif2 = [
    "Fraude préméditée à l'examen",
    "Entrave à la bonne marche de l'université, violence, menace, voles de faits de toute nature, désordre organisé",
    "Détention de tout moyen aux fins de porter atteinte à l'intégrité physique du personnel universitaire et des étudiants",
    'Faux et usage de faux, falsification',
    "Diffamation de l'égard de l'ensemble du personnel universitaire et des étudiants",
    'Actions délibérées de perturbation et désordre caractérisé portant atteinte au bon déroulement des activités pédagogiques',
    "Vols, abus de confiance et détournements de biens de l'établissement des enseignants et des étudiants",
    "Détérioration de biens de l'établissement",
    'autres...'
  ]
  const degre = ['1', '2']

  const [dropNiveau, setdropNiveau] = useState(false)
  const [dropNiveauValue, setdropNiveauValue] = useState('')
  const [dropMotif, setDropMotif] = useState(false)
  const [dropMotifValue, setDropMotifValue] = useState('')
  const [dropDegre, setDropDegre] = useState(false)
  const [dropDegreValue, setDropDegreValue] = useState('')

  const [etudiants, setEtudiants] = useState([])
  const [errorsStep1, setErrorsStep1] = useState({
    matriculeError: '',
    nomError: '',
    prenomError: '',
    emailError: '',
    niveauError: '',
    groupeError: '',
    sectionError: ''
  })
  const [errorsStep2, setErrorsStep2] = useState({
    nomError: '',
    prenomError: ''
  })
  const [errorsStep3, setErrorsStep3] = useState({
    lieuError: '',
    motifError: ''
  })

  const [step, setStep] = useState(1)
  // Add a rapport
  /* Body being in the format of :
  {
	 "matriculeE": big int value,
   "nomE": string value,
   "prenomE": string value,
   "niveauE": string value,
   "groupeE": int value,
   "sectionE": int value or null,
   "email": string value,
   "matriculeP": big int value,
   "nomP": string value,
   "prenomP": string value,
   "dateI": string value in the format of 'YYYY-MM-DD',
   "lieuI": string value,
   "motifI": string value,
   "descI": string value,
   "degreI": int value (1 or 2)
  }
*/
  const [rapport, setRapport] = useState({
    matriculeE: '',
    nomE: '',
    prenomE: '',
    niveauE: '',
    groupeE: '',
    email: '',
    sectionE: null,
    nomP: '',
    prenomP: '',
    dateI: new Date().toISOString().slice(0, 19).replace('T', ' '),
    lieuI: '',
    motifI: '',
    descI: '',
    degreI: 1
  })

  const { api } = useApi()

  const buttonRef = useRef(null)

  const ChoiceDown = (
    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 1L7 7L13 1"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
  const ChoiceUp = (
    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 7L7 1L1 7"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        buttonRef.current.click()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  useEffect(() => {
    axios
      .get(api + '/rapport/get')
      .then((res) => setEtudiants(res.data))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    setRapport((prev) => ({ ...prev, niveauE: dropNiveauValue }))
  }, [dropNiveauValue])

  useEffect(() => {
    setRapport((prev) => ({ ...prev, degreI: dropDegreValue }))
  }, [dropDegreValue])

  useEffect(() => {
    if (dropMotifValue != 'autres...') {
      setRapport((prev) => ({ ...prev, motifI: dropMotifValue }))
    } else {
      setRapport((prev) => ({ ...prev, motifI: '' }))
    }
  }, [dropMotifValue])

  const ajouterRapportPage = useRef(null)

  let loadingBar = document.createElement('div')
  loadingBar.classList.add('loadingBar')
  loadingBar.classList.add('loadingBarAni')

  function addLoadingBar() {
    ajouterRapportPage.current.appendChild(loadingBar)
  }

  function RemoveLoadingBar() {
    loadingBar.remove()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRapport((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const dropNiveaudownItems = (
    <div className="absolute w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
      {niveaux.map((n) => (
        <div
          className="border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray"
          onClick={() => {
            setdropNiveau(false)
            setdropNiveauValue(n)
          }}
        >
          {n}
        </div>
      ))}
    </div>
  )

  const dropDegredownItems = (
    <div className="absolute w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
      {degre.map((n) => (
        <div
          className="border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray"
          onClick={() => {
            setDropDegre(false)
            setDropDegreValue(n)
          }}
        >
          {n}
        </div>
      ))}
    </div>
  )

  const dropMotifdownItems = (
    <div className="absolute w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
      {motif1.map((n) => (
        <div
          className="border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray"
          onClick={() => {
            setDropMotif(false)
            setDropMotifValue(n)
          }}
        >
          {n}
        </div>
      ))}
      {motif2.map((n) => (
        <div
          className="border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray"
          onClick={() => {
            setDropMotif(false)
            setDropMotifValue(n)
          }}
        >
          {n}
        </div>
      ))}
    </div>
  )

  const validateFormStep1 = (data) => {
    let errors = {}

    const que_les_nombres_regex = /^[0-9]+$/
    if (data.matriculeE.length == 0) {
      errors.matricule = 'Ce champ est obligatoire'
      setErrorsStep1((prev) => ({ ...prev, matriculeError: errors.matricule }))
      return errors
    } else if (!que_les_nombres_regex.test(data.matriculeE)) {
      errors.matricule = 'Matricule invalide'
      setErrorsStep1((prev) => ({ ...prev, matriculeError: errors.matricule }))
      return errors
    } else if (data.matriculeE.length < 8 || data.matriculeE.length > 16) {
      errors.matricule = 'Matricule invalide'
      setErrorsStep1((prev) => ({ ...prev, matriculeError: errors.matricule }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, matriculeError: '' }))
    }

    if (data.nomE.length == 0) {
      errors.nom = 'Ce champ est obligatoire'
      setErrorsStep1((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nomE.length < 3) {
      errors.nom = 'Nom invalide'
      setErrorsStep1((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nomE.search(/^[a-zA-Z\s]*$/g)) {
      errors.nom = "Nom invalide"
      setErrorsStep1((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, nomError: '' }))
    }

    if (data.prenomE.length == 0) {
      errors.prenom = 'Ce champ est obligatoire'
      setErrorsStep1((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenomE.length < 3) {
      errors.prenom = 'Prénom invalide'
      setErrorsStep1((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenomE.search(/^[a-zA-Z\s]*$/g)) {
      errors.prenom = 'Prénom invalide'
      setErrorsStep1((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, prenomError: '' }))
    }
    console.log(data.email, rapport)
    if (data.email.length == 0) {
      errors.email = 'Ce champ est obligatoire'
      console.log(errors.email)
      setErrorsStep1((prev) => ({ ...prev, emailError: errors.email }))
      return errors
    } else if (data.email.search(/^[^\.\s][\w\-]+(\.[\w\-]+)*@([\w-]+\.)+[\w-]{2,}$/gm)) {
      errors.email = 'Email invalide'
      setErrorsStep1((prev) => ({ ...prev, emailError: errors.email }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, emailError: '' }))
    }
    if (data.niveauE.length == 0) {
      errors.niveau = 'Ce champ est obligatoire'
      setErrorsStep1((prev) => ({ ...prev, niveauError: errors.niveau }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, niveauError: '' }))
    }

    if (data.groupeE.length == 0) {
      errors.groupe = 'Ce champ est obligatoire'
      setErrorsStep1((prev) => ({ ...prev, groupeError: errors.groupe }))
      return errors
    } else if (!que_les_nombres_regex.test(data.groupeE)) {
      errors.groupe = 'Groupe invalide'
      setErrorsStep1((prev) => ({ ...prev, groupeError: errors.groupe }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, groupeError: '' }))
    }

    if (data.sectionE == null || data.sectionE.length == 0) {
      errors.section = 'Ce champ est obligatoire'
      setErrorsStep1((prev) => ({ ...prev, sectionError: errors.section }))
      return errors
    } else if (!que_les_nombres_regex.test(data.sectionE)) {
      errors.section = 'Section invalide'
      setErrorsStep1((prev) => ({ ...prev, sectionError: errors.section }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, sectionError: '' }))
    }
    return errors
  }

  const validateFormStep2 = (data) => {
    let errors = {}

    if (data.nomP.length == 0) {
      errors.nom = 'Ce champ est obligatoire'
      setErrorsStep2((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nomP.length < 3) {
      errors.nom = 'Nom invalide'
      setErrorsStep2((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nomP.search(/^[a-zA-Z\s]*$/g)) {
      errors.nom = "Nom invalide"
      setErrorsStep2((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else {
      setErrorsStep2((prev) => ({ ...prev, nomError: '' }))
    }

    if (data.prenomP.length == 0) {
      errors.prenom = 'Ce champ est obligatoire'
      setErrorsStep2((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenomP.length < 3) {
      errors.prenom = 'Prénom invalide'
      setErrorsStep2((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenomP.search(/^[a-zA-Z\s]*$/g)) {
      errors.prenom = 'Prénom invalide'
      setErrorsStep2((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else {
      setErrorsStep2((prev) => ({ ...prev, prenomError: '' }))
    }

    return errors
  }

  const validateFormStep3 = (data) => {
    let errors = {}

    if (data.lieuI.length == 0) {
      errors.lieu = 'Ce champ est obligatoire'
      setErrorsStep3((prev) => ({ ...prev, lieuError: errors.lieu }))
      return errors
    } else {
      setErrorsStep3((prev) => ({ ...prev, lieuError: '' }))
    }

    console.log('data.motifI', data.motifI)
    if (data.motifI.length == 0) {
      errors.motif = 'Ce champ est obligatoire'
      setErrorsStep3((prev) => ({ ...prev, motifError: errors.motif }))
      return errors
    } else {
      setErrorsStep3((prev) => ({ ...prev, motifError: '' }))
    }

    return errors
  }
  return (
    <div
      ref={ajouterRapportPage}
      className="h-full w-full flex flex-col justify-center items-center gap-6"
    >
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
      {step === 4 && <div className="fullBgBlock"></div>}
      {step === 4 && (
        <div className="absolute flex flex-col justify-evenly text-xl items-center h-40 w-1/3 z-30 rounded-xl text-white dark:text-black bg-dark-gray dark:bg-white">
          Confirmer la création du rapport
          <div className="flex w-full justify-between px-8">
            <button
              onClick={() => {
                setStep(1)
                setdropNiveauValue('')
                setDropDegreValue('')
                setDropMotifValue('')
                setRapport({})
              }}
              className="flex justify-center items-center border rounded-xl text-red py-2 px-4 bg-0.36-red"
            >
              Annuler
            </button>
            <button
              onClick={async () => {
                addLoadingBar()
                setStep(1)
                setdropNiveauValue('')
                setDropDegreValue('')
                setDropMotifValue('')
                setRapport({})
                const tache = await axios
                  .post(api + '/rapport/add', rapport)
                  .then((res) => console.log(res))
                  .catch((err) => console.log(err))
                RemoveLoadingBar()
              }}
              className="flex justify-center items-center border rounded-xl text-blue py-2 px-4 bg-0.08-blue"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}
      <form className="overflow-y-auto flex flex-col justify-center items-center rounded-xl bg-side-bar-white-theme-color dark:bg-dark-gray w-1/2 max-h-[84vh] min-w-[500px] ">
        <h1 className="text-[36px] py-4">Détail du rapport</h1>
        <hr className="w-full dark:text-gray"></hr>
        {step == 1 && (
          <div className="flex flex-col w-5/6 my-2">
            <label className="label_dossier">Etudiant</label>
            <div className="flex flex-col w-full gap-6 mb-4 max-h-[38vh] overflow-auto pt-4">
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="matriculeE"
                  id="matriculeE"
                  onChange={handleInputChange}
                  value={rapport.matriculeE}
                  required
                ></input>
                <label className="label_rapport" htmlFor="matriculeE">
                  Matricule
                </label>
                {errorsStep1.matriculeError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {errorsStep1.matriculeError}
                  </p>
                )}
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="nomE"
                  id="nomE"
                  onChange={handleInputChange}
                  value={rapport.nomE}
                  required
                ></input>
                <label className="label_rapport" htmlFor="nomE">
                  Nom
                </label>
                {errorsStep1.nomError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {errorsStep1.nomError}
                  </p>
                )}
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="prenomE"
                  id="prenomE"
                  onChange={handleInputChange}
                  value={rapport.prenomE}
                  required
                ></input>
                <label className="label_rapport" htmlFor="prenomE">
                  Prénom
                </label>
                {errorsStep1.prenomError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {errorsStep1.prenomError}
                  </p>
                )}
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                  value={rapport.email}
                  required
                ></input>
                <label className="label_rapport" htmlFor="email">
                  Email
                </label>
                {errorsStep1.emailError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {errorsStep1.emailError}
                  </p>
                )}
              </div>
              <div className="container_input_rapport">
                <div className="flex items-center gap-4">
                  <input
                    className="input_dossier"
                    name="niveauE"
                    id="niveauE"
                    value={dropNiveauValue}
                    onChange={handleInputChange}
                    required
                  ></input>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setdropNiveau((prev) => !prev)
                    }}
                    className="bg-blue h-full aspect-square rounded-md flex items-center justify-center"
                  >
                    {dropNiveau ? ChoiceUp : ChoiceDown}
                  </button>
                </div>
                <label className="label_rapport_fix" htmlFor="niveauE">
                  Niveau
                </label>
                {errorsStep1.niveauError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {errorsStep1.niveauError}
                  </p>
                )}
                {dropNiveau && dropNiveaudownItems}
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="groupeE"
                  id="groupeE"
                  onChange={handleInputChange}
                  value={rapport.groupeE}
                  required
                ></input>
                <label className="label_rapport" htmlFor="GroupeE">
                  Groupe
                </label>
                {errorsStep1.groupeError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {errorsStep1.groupeError}
                  </p>
                )}
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="sectionE"
                  id="sectionE"
                  onChange={handleInputChange}
                  value={rapport.sectionE}
                  required
                ></input>
                <label className="label_rapport" htmlFor="sectionE">
                  Section
                </label>
                {errorsStep1.sectionError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {errorsStep1.sectionError}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {step == 2 && (
          <div className="flex flex-col w-5/6 my-2">
            <label className="label_dossier">Plaignant</label>
            <div className="flex flex-col w-full gap-6 mb-4">
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="nomP"
                  id="nomP"
                  onChange={handleInputChange}
                  value={rapport.nomP}
                  required
                ></input>
                <label className="label_rapport" htmlFor="nomP">
                  Nom
                </label>
                {errorsStep2.nomError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {errorsStep2.nomError}
                  </p>
                )}
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="prenomP"
                  id="prenomP"
                  onChange={handleInputChange}
                  value={rapport.prenomP}
                  required
                ></input>
                <label className="label_rapport" htmlFor="prenomP">
                  Prénom
                </label>
                {errorsStep2.prenomError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {errorsStep2.prenomError}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {step == 3 && (
          <div className="flex flex-col w-5/6 my-2">
            <label className="label_dossier">Informations globales</label>
            <div className="flex flex-col w-full gap-6 mb-4">
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="dateI"
                  id="dateI"
                  type="date"
                  max={date}
                  onChange={handleInputChange}
                  value={rapport.dateI}
                  required
                ></input>
                <label className="label_rapport_fix" htmlFor="dateI">
                  Date
                </label>
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="lieuI"
                  id="lieuI"
                  onChange={handleInputChange}
                  value={rapport.lieuI}
                  required
                ></input>
                <label className="label_rapport" htmlFor="lieuI">
                  Lieu
                </label>
                {errorsStep3.lieuError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {errorsStep3.lieuError}
                  </p>
                )}
              </div>
              <div className="container_input_rapport">
                <div className="flex items-center gap-4">
                  <input
                    className="input_dossier"
                    name="motifI"
                    id="motifI"
                    value={dropMotifValue == 'autres...' ? rapport.motifI : dropMotifValue}
                    onChange={(e) => {
                      if (dropMotifValue == 'autres...') {
                        handleInputChange(e)
                        setRapport((prev) => ({ ...prev, motifI: e.target.value }))
                        if (dropMotif) setDropMotif(false)
                      }
                    }}
                    required
                  ></input>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setDropMotif((prev) => !prev)
                    }}
                    className="bg-blue h-full aspect-square rounded-md flex items-center justify-center"
                  >
                    {dropMotif ? ChoiceUp : ChoiceDown}
                  </button>
                </div>
                <label className="label_rapport_fix" htmlFor="motifI">
                  Motif
                </label>
                {errorsStep3.motifError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {errorsStep3.motifError}
                  </p>
                )}
                {dropMotif && dropMotifdownItems}
              </div>
              <div className="container_input_rapport">
                <div className="flex items-center gap-4">
                  <input
                    className="input_dossier"
                    name="degreI"
                    id="degreI"
                    onChange={(e) => {
                      if (dropMotifValue == 'autres...') {
                        handleInputChange(e)
                      }
                    }}
                    value={
                      dropMotifValue == 'autres...'
                        ? rapport.degreI
                        : motif2.includes(rapport.motifI)
                          ? '2'
                          : '1'
                    }
                    required
                  ></input>
                  {dropMotifValue == 'autres...' && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setDropDegre((prev) => !prev)
                      }}
                      className="bg-blue h-full aspect-square rounded-md flex items-center justify-center"
                    >
                      {dropDegre ? ChoiceUp : ChoiceDown}
                    </button>
                  )}
                </div>
                <label className="label_rapport_fix" htmlFor="degreI">
                  Degré
                </label>
                {dropDegre && dropDegredownItems}
              </div>
              <div className="container_input_rapport">
                <textarea
                  className="input_dossier resize-none"
                  name="descI"
                  id="descI"
                  onChange={handleInputChange}
                  value={rapport.descI}
                  required
                ></textarea>
                <label className="label_rapport" htmlFor="descI">
                  Description
                </label>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between w-5/6 py-6 *:text-[18px]">
          <button
            className="button_dossier text-red border-red hover:bg-red/25 min-w-fit"
            onClick={(e) => {
              e.preventDefault()
              if (step > 1) setStep((prev) => prev - 1)
              if (step == 1) {
                setRapport({
                  matriculeE: '',
                  nomE: '',
                  prenomE: '',
                  niveauE: '',
                  groupeE: '',
                  email: '',
                  sectionE: '',
                  nomP: '',
                  prenomP: '',
                  dateI: new Date().toISOString().slice(0, 19).replace('T', ' '),
                  lieuI: '',
                  motifI: '',
                  descI: '',
                  degreI: 1
                })
                setdropNiveauValue('')
                setDropDegreValue('')
              }
              setTimeout(() => {
                setErrorsStep1({
                  matriculeError: '',
                  nomError: '',
                  prenomError: '',
                  emailError: '',
                  niveauError: '',
                  groupeError: '',
                  sectionError: ''
                })
                setErrorsStep2({
                  nomError: '',
                  prenomError: ''
                })
                setErrorsStep3({
                  lieuError: '',
                  motifError: ''
                })
              }, 2000)
            }}
            type="reset"
          >
            {step > 1 ? 'Précédent' : 'Annuler'}
          </button>
          <button
            ref={buttonRef}
            className="button_dossier text-blue border-blue hover:bg-blue/25 min-w-fit"
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              if (step == 1) {
                const newErrors = validateFormStep1(rapport)
                if (Object.keys(newErrors).length === 0) {
                  setStep((prev) => prev + 1)
                }
              }
              if (step == 2) {
                const newErrors = validateFormStep2(rapport)
                if (Object.keys(newErrors).length === 0) {
                  setStep((prev) => prev + 1)
                }
              }
              if (step == 3) {
                const newErrors = validateFormStep3(rapport)
                if (Object.keys(newErrors).length === 0) {
                  setStep((prev) => prev + 1)
                }
              }
              setTimeout(() => {
                setErrorsStep1({
                  matriculeError: '',
                  nomError: '',
                  prenomError: '',
                  emailError: '',
                  niveauError: '',
                  groupeError: '',
                  sectionError: ''
                })
                setErrorsStep2({
                  nomError: '',
                  prenomError: ''
                })
                setErrorsStep3({
                  lieuError: '',
                  motifError: ''
                })
              }, 2000)
            }}
          >
            {step > 2 ? 'Ajouter' : 'Suivant'}
          </button>
        </div>
      </form>
    </div>
  )
}
export default AjouterRapport
