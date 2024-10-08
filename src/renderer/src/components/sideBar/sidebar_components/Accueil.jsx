import { useState, useEffect, useMemo, useRef } from 'react'

import './sidebar_com_css/archives.css'
import './sidebar_com_css/scroll.css'
import './sidebar_com_css/accueil.css'

import useCliped from '../../../zustand/cliped'
import useDark from '../../../zustand/dark'
import useAccount from '../../../zustand/account'
import useApi from '../../../zustand/api'
import useDate from '../../../zustand/currentDate'

import BlueSearchSVG from './../../../assets/BlueSearch.svg'
import VoirDossierSVG from './../../../assets/VoirDossier.svg'
import ModifierDossierSVG from './../../../assets/ModifierDossier.svg'
import ModifierDossierGraySVG from './../../../assets/BlueSvgs/ModifierDossierGray.svg'
import NotificationsSVG from './../../../assets/gravity-ui_bell.svg'
import GOBackSVG from './../../../assets/GoBack.svg'
import GOBackGraySVG from './../../../assets/BlueSvgs/GoBackGray.svg'
import PdfSVG from './../../../assets/pdf.svg'
import ImprimerSVG from './../../../assets/imprimer.svg'
import SupprimerSVG from './../../../assets/supprimer.svg'
import WarningSVG from './../../../assets/warning.svg'

import axios from 'axios'

function Archive() {
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
  const accueilPage = useRef(null)
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

  const [dropDegre, setDropDegre] = useState(false)
  const [dropDegreValue, setDropDegreValue] = useState('1')
  const [dropNiveau, setdropNiveau] = useState(false)
  const [dropNiveauValue, setdropNiveauValue] = useState('')
  const [dropMotif, setDropMotif] = useState(false)
  const [dropMotifValue, setDropMotifValue] = useState('')
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

  const { api, apiPDF } = useApi()
  const { cliped, setCliped } = useCliped()
  const { dark } = useDark()
  const { account } = useAccount()

  const [step, setStep] = useState(1)
  const [view, setView] = useState(false)
  const [modify, setModify] = useState(false)
  const [supprimer, setSupprimer] = useState(false)
  const [currentDeletedStudent, setCurrentDeletedStudent] = useState(0)
  const [etudiants, setEtudiants] = useState([])
  const [query, setQuery] = useState('')
  const [commission, setCommission] = useState([])
  const [currentViewedEtudiant, setCurrentViewedEtudiant] = useState({})

  const classNames = (array) => array?.filter(Boolean).join(' ')

  const [rapport, setRapport] = useState({
    matriculeE: '',
    nomE: '',
    prenomE: '',
    email: '',
    niveauE: '',
    groupeE: '',
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

  async function fetchData() {
    addLoadingBar()
    const tache1 = await axios
      .get(api + '/rapport/get')
      .then((res) => {
        console.log(res.data)
        setEtudiants(res.data)
      })
      .catch((err) => {
        console.log(err)
      })

    const tache2 = await axios
      .get(api + '/commission/get')
      .then((res) => {
        setCommission(res.data)
      })
      .catch((err) => console.log(err))
    RemoveLoadingBar()
  }
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (!modify) {
      setdropNiveauValue('')
      setdropNiveau(false)
      setDropMotifValue('')
      setDropMotif(false)
    }
  }, [modify])

  useEffect(() => {
    setdropNiveauValue(currentViewedEtudiant.niveau_e)
  }, [currentViewedEtudiant.niveau_e])

  useEffect(() => {
    setRapport((prev) => ({
      ...prev,
      degreI: motif2.includes(currentViewedEtudiant.motif_i) ? '2' : '1'
    }))
  }, [currentViewedEtudiant.motif_i])

  useEffect(() => {
    setRapport((prev) => ({ ...prev, degreI: dropDegreValue }))
    setCurrentViewedEtudiant((prev) => ({ ...prev, degreI: dropDegreValue }))
  }, [dropDegreValue])

  useEffect(() => {
    setRapport((prev) => ({ ...prev, niveauE: dropNiveauValue }))
  }, [dropNiveauValue])

  useEffect(() => {
    if (dropMotifValue != 'autres...') {
      setRapport((prev) => ({ ...prev, motifI: dropMotifValue }))
      setCurrentViewedEtudiant((prev) => ({ ...prev, motif_i: dropMotifValue }))
      const degrePick = motif2.includes(dropMotifValue) ? '2' : '1'
      setRapport((prev) => ({ ...prev, degreI: degrePick }))
      setCurrentViewedEtudiant((prev) => ({ ...prev, degreI: degrePick }))
    } else {
      setCurrentViewedEtudiant((prev) => ({ ...prev, motif_i: '' }))
      setRapport((prev) => ({ ...prev, motifI: '' }))
    }
  }, [dropMotifValue])

  let loadingBar = document.createElement('div')
  loadingBar.classList.add('loadingBar')
  loadingBar.classList.add('loadingBarAni')

  function addLoadingBar() {
    accueilPage.current.appendChild(loadingBar)
  }

  function RemoveLoadingBar() {
    loadingBar.remove()
  }

  const filteredEtudiants = useMemo(() => {
    return Array.isArray(etudiants)
      ? etudiants.filter((etudiant) => {
          return etudiant.nom_e
            .toLowerCase()
            .concat(' ')
            .concat(etudiant.prenom_e.toLowerCase())
            .includes(query.toLowerCase())
        })
      : ''
  }, [etudiants, query])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRapport((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  function handlePreview(num) {
    return new Promise(async () => {
      let path = await window.electronAPI.getPath()
      addLoadingBar()
      const pdfToPreview = await axios
        .post(apiPDF + 'generateRA', { numR: num })
        .then((res) => {
          const result = window.electronAPI.getUrl()
        })
        .catch((err) => console.log(err))
      RemoveLoadingBar()
    })
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

  const tableEtu = Array.isArray(filteredEtudiants) ? (
    filteredEtudiants.map((etudiant) => (
      <tr className="border-y dark:hover:bg-dark-gray">
        <td className="border-x">
          <span>{etudiant.num_r}</span>
        </td>
        <td className="font-medium border-x">{[etudiant.nom_e, ' ', etudiant.prenom_e]}</td>
        <td className="border-x">{etudiant.date_i.slice(0, etudiant.date_i.indexOf('T'))}</td>
        {!view && (
          <td className="px-0 border-x">
            <div className="flex justify-evenly *:shrink-0">
              <button
                className=""
                title="Afficher le rapport"
                onClick={() => {
                  if (!cliped) setCliped()
                  setView(true)
                  addLoadingBar()
                  axios
                    .post(api + '/rapport/gets', { numR: etudiant.num_r })
                    .then((res) => {
                      setCurrentViewedEtudiant({ ...res.data[0], num_r: etudiant.num_r })
                      RemoveLoadingBar()
                    })
                    .catch((err) => {
                      console.log(err)
                      RemoveLoadingBar()
                      alert('Vérifier la connection internet')
                    })
                }}
              >
                <img src={VoirDossierSVG} alt="voir dossier icon"></img>
              </button>
              {account == 'chef' && (
                <button
                  title="Modifier le rapport"
                  onClick={() => {
                    setModify(true)
                    setCurrentViewedEtudiant({})
                    console.log()
                    addLoadingBar()
                    axios
                      .post(api + '/rapport/gets', { numR: etudiant.num_r })
                      .then((res) => {
                        RemoveLoadingBar()
                        setCurrentViewedEtudiant(res.data[0])
                        console.log(res.data[0])
                        setRapport({
                          degreI: res.data[0].degre_i,
                          matriculeE: res.data[0].matricule_e,
                          nomE: res.data[0].nom_e,
                          prenomE: res.data[0].prenom_e,
                          email: res.data[0].email_e,
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
                        })
                      })
                      .catch((err) => {
                        console.log(err)
                        RemoveLoadingBar()
                        alert('Vérifier la connection internet')
                      })
                  }}
                >
                  <img
                    src={!dark ? ModifierDossierGraySVG : ModifierDossierSVG}
                    alt="modifier dossier icon"
                  ></img>
                </button>
              )}
              {account == 'chef' && (
                <button
                  title="Supprimer le rapport"
                  onClick={() => {
                    setSupprimer(true)
                    setCurrentDeletedStudent(etudiant.num_r)
                  }}
                >
                  <img src={SupprimerSVG}></img>
                </button>
              )}
            </div>
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
        <p className="text-xl text-active-com-acceil dark:text-white font-semibold">
          {[mem.nom_m, ' ', mem.prenom_m]}
        </p>
        <p className="text-blue font-semibold">{mem.role_m}</p>
      </div>
    ))
  ) : (
    <></>
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
      errors.nom = "Nom invalide(pas d'éspace)"
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
      errors.nom = 'Nom invalide'
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
    <div ref={accueilPage} className="flex w-full h-full">
      {supprimer && (
        <div className="fullBgBlock">
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
                onClick={async () => {
                  setSupprimer(false)
                  const tache1 = await axios
                    .delete(api + '/rapport/delete', { data: { numR: currentDeletedStudent } })
                    .catch((err) => {
                      alert("Vérifier la connexion internet \nLe rapport n'a pas été supprimé")
                      console.log(err)
                    })
                  const tache2 = await axios
                    .get(api + '/rapport/get')
                    .then((res) => {
                      setEtudiants(res.data)
                    })
                    .catch((err) => {
                      console.log(err)
                      alert('Vérifier la connextion internet')
                    })
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
            <div className="flex flex-col w-1/5 min-w-[130px] mt-[4vh]">
              <h2 className="text-[1.4vw] text-center font-bold py-4">Commission active</h2>
              <div className="w-full h-[80vh] bg-side-bar-white-theme-color dark:bg-dark-gray snap-y snap-mandatory overflow-x-auto overflow-y-scroll scroll-pt-1 flex flex-col gap-1 rounded-lg">
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
                <h2 className="text-4xl">Détails du Dossier </h2>
                <div className="flex flex-col gap-4">
                  <h3 className="text-blue text-2xl">Informations de l'étudiant:</h3>
                  <div className="flex flex-col gap-3">
                    {currentViewedEtudiant.matricule_e && (
                      <p>Matricule: {currentViewedEtudiant.matricule_e}</p>
                    )}
                    {currentViewedEtudiant.nom_e && currentViewedEtudiant.prenom_e && (
                      <p>
                        Nom et prénom:{' '}
                        {[currentViewedEtudiant.nom_e, ' ', currentViewedEtudiant.prenom_e]}
                      </p>
                    )}
                    {currentViewedEtudiant.email_e && <p>Email: {currentViewedEtudiant.email_e}</p>}
                    {currentViewedEtudiant.niveau_e && (
                      <p>Niveau: {currentViewedEtudiant.niveau_e}</p>
                    )}
                    {currentViewedEtudiant.groupe_e && (
                      <p>Groupe: {currentViewedEtudiant.groupe_e}</p>
                    )}
                    {currentViewedEtudiant.section_e && (
                      <p>Section: {currentViewedEtudiant.section_e}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-blue text-2xl">Informations du plaignant</h3>
                  <div className="flex flex-col gap-3">
                    {currentViewedEtudiant.nom_p && currentViewedEtudiant.prenom_p && (
                      <p>
                        Nom et prénom:{' '}
                        {[currentViewedEtudiant.nom_p, ' ', currentViewedEtudiant.prenom_p]}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-blue text-2xl">Informations globales</h3>
                  <div className="flex flex-col gap-3">
                    {currentViewedEtudiant.date_i && (
                      <p>
                        Date de l’infraction:{' '}
                        {currentViewedEtudiant.date_i.slice(
                          0,
                          currentViewedEtudiant.date_i.indexOf('T')
                        )}
                      </p>
                    )}
                    {currentViewedEtudiant.lieu_i && <p>Lieu: {currentViewedEtudiant.lieu_i}</p>}
                    {currentViewedEtudiant.degre_i && <p>Degré: {currentViewedEtudiant.degre_i}</p>}
                    {currentViewedEtudiant.motif_i && <p>Motif: {currentViewedEtudiant.motif_i}</p>}
                  </div>
                </div>
                {currentViewedEtudiant.description_i && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-blue text-2xl">Description:</h3>
                    <div className="flex flex-col gap-3">
                      <p>{currentViewedEtudiant.description_i}</p>
                    </div>
                  </div>
                )}
                <div className="flex justify-evenly">
                  <button
                    onClick={() => {
                      handlePreview(currentViewedEtudiant.num_r)
                      console.log(currentViewedEtudiant.num_r)
                    }}
                    className="button_active_blue "
                  >
                    <img src={PdfSVG}></img>PDF
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className={classNames(['flex flex-col mt-[8vh]', view ? 'w-1/2' : 'w-3/4'])}>
            {Array.isArray(etudiants) && etudiants.length != 0 && (
              <div className="flex items-center w-fit px-4 gap-4 py-2 text-notification-blue bg-notification-blue/10 border border-notification-border-blue rounded-lg">
                <img className="w-7 aspect-square" src={NotificationsSVG}></img>
                <p>
                  {[
                    etudiants.length,
                    etudiants.length == 1
                      ? ' nouveau rapport ajouté...'
                      : ' nouveax rapports ajoutés...'
                  ]}
                </p>
              </div>
            )}
            <h1 className="text-3xl py-4 font-semibold">Rapports à traiter</h1>
            <div className="flex px-12 justify-end h-16 w-full items-center rounded-tl-lg rounded-tr-lg border-t border-x border-table-border-white-theme-color dark:border-white/20 bg-side-bar-white-theme-color dark:bg-dark-gray">
              <div className="searchDiv">
                <img className="imgp" src={BlueSearchSVG} alt="search icon"></img>
                <input
                  className="searchInput"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Rechercher"
                ></input>
              </div>
            </div>

            <div className="w-full grow h-[50vh]">
              <div className="w-full h-full overflow-y-auto">
                <table className="w-full">
                  <tr className="border-t">
                    <th className="w-1/4 border-x">
                      <div>N° Rapport</div>
                    </th>
                    <th className="w-1/4 border-x">
                      <div>Étudiant</div>
                    </th>
                    <th className="w-1/4 border-x">
                      <div>Date de l'infraction</div>
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
          {step === 4 && <div className="fullBgBlock"></div>}
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
                  onClick={async () => {
                    setStep(1)
                    setModify(false)
                    addLoadingBar()
                    const tache1 = await axios
                      .patch(api + '/rapport/edit', rapport)
                      .then((res) => console.log(res, res.data.sql ? res.data.sql : ''))
                      .catch((err) => {
                        alert("Vérifier la connexion internet \nLe rapport n'a pas été modifier")
                        console.log(err)
                      })
                    const tache2 = await axios
                      .get(api + '/rapport/get')
                      .then((res) => {
                        setEtudiants(res.data)
                      })
                      .catch((err) => {
                        console.log(err)
                        alert('Vérifier la connexion internet')
                      })
                    RemoveLoadingBar()
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
              <div className="flex flex-col w-5/6">
                <label className="label_dossier">Etudiant</label>
                <div className="flex flex-col w-full gap-6 mb-4 max-h-[38vh] overflow-auto pt-4">
                  <div className="container_input_rapport">
                    <input
                      className="input_dossier"
                      name="matriculeE"
                      id="matriculeE"
                      onChange={(e) => {
                        handleInputChange(e)
                        setCurrentViewedEtudiant((prev) => ({
                          ...prev,
                          matricule_e: e.target.value
                        }))
                      }}
                      value={currentViewedEtudiant.matricule_e}
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
                      onChange={(e) => {
                        handleInputChange(e)
                        setCurrentViewedEtudiant((prev) => ({ ...prev, nom_e: e.target.value }))
                      }}
                      value={currentViewedEtudiant.nom_e}
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
                      value={currentViewedEtudiant.prenom_e}
                      onChange={(e) => {
                        handleInputChange(e)
                        setCurrentViewedEtudiant((prev) => ({ ...prev, prenom_e: e.target.value }))
                      }}
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
                      onChange={(e) => {
                        handleInputChange(e)
                        setCurrentViewedEtudiant((prev) => ({ ...prev, email_e: e.target.value }))
                      }}
                      value={currentViewedEtudiant.email_e || ''}
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
                        value={dropNiveauValue || currentViewedEtudiant.niveau_e}
                        required
                      ></input>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setdropNiveau((prev) => !prev)
                        }}
                        className="bg-blue h-12 aspect-square rounded-md flex items-center justify-center"
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
                      onChange={(e) => {
                        handleInputChange(e)
                        setCurrentViewedEtudiant((prev) => ({ ...prev, groupe_e: e.target.value }))
                      }}
                      value={currentViewedEtudiant.groupe_e}
                      required
                    ></input>
                    <label className="label_rapport" htmlFor="groupeE">
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
                      onChange={(e) => {
                        handleInputChange(e)
                        setCurrentViewedEtudiant((prev) => ({ ...prev, section_e: e.target.value }))
                      }}
                      value={currentViewedEtudiant.section_e}
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
                      onChange={(e) => {
                        handleInputChange(e)
                        setCurrentViewedEtudiant((prev) => ({ ...prev, nom_p: e.target.value }))
                      }}
                      value={currentViewedEtudiant.nom_p}
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
                      onChange={(e) => {
                        handleInputChange(e)
                        setCurrentViewedEtudiant((prev) => ({ ...prev, prenom_p: e.target.value }))
                      }}
                      value={currentViewedEtudiant.prenom_p}
                      required
                    ></input>
                    <label className="label_rapport" htmlFor="prenomP">
                      Prenom
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
                      onChange={(e) => {
                        handleInputChange(e)
                        setCurrentViewedEtudiant((prev) => ({ ...prev, date_i: e.target.value }))
                      }}
                      value={currentViewedEtudiant.date_i.substring(0, 10)}
                      required
                    ></input>
                    <label
                      className="absolute -translate-x-4 -translate-y-9 scale-90 z-10 ml-4 mt-[13px]  text-dark-gray cursor-text dark:text-white h-fit w-fit bg-transparent"
                      htmlFor="dateI"
                    >
                      Date
                    </label>
                  </div>
                  <div className="container_input_rapport">
                    <input
                      className="input_dossier"
                      name="lieuI"
                      id="lieuI"
                      onChange={(e) => {
                        handleInputChange(e)
                        setCurrentViewedEtudiant((prev) => ({ ...prev, lieu_i: e.target.value }))
                      }}
                      value={currentViewedEtudiant.lieu_i}
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
                        onChange={(e) => {
                          console.log('dropMotifValue:', dropMotifValue)
                          if (dropMotifValue == 'autres...') {
                            handleInputChange(e)
                            setCurrentViewedEtudiant((prev) => ({
                              ...prev,
                              motif_i: e.target.value
                            }))
                            if (dropMotif) setDropMotif(false)
                          }
                        }}
                        value={
                          dropMotifValue == 'autres...' || dropMotifValue == ''
                            ? currentViewedEtudiant.motif_i
                            : dropMotifValue
                        }
                        required
                      ></input>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setDropMotif((prev) => !prev)
                        }}
                        className="bg-blue h-12 aspect-square rounded-md flex items-center justify-center"
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
                          if (dropMotifValue == 'autres...' || dropMotifValue == '') {
                            handleInputChange(e)
                            setCurrentViewedEtudiant((prev) => ({
                              ...prev,
                              degre_i: dropDegreValue
                            }))
                          }
                        }}
                        value={
                          dropMotifValue == 'autres...'
                            ? dropDegreValue
                            : dropMotifValue == ''
                              ? rapport.degreI
                              : motif2.includes(rapport.motifI)
                                ? '2'
                                : '1'
                        }
                        required
                      ></input>
                      {/* Complete from here --------------------------------------------- */}
                      {(dropMotifValue == 'autres...' ||
                        (!motif1.includes(rapport.motifI) && !motif2.includes(rapport.motifI))) && (
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
                      onChange={(e) => {
                        handleInputChange(e)
                        setCurrentViewedEtudiant((prev) => ({
                          ...prev,
                          description_i: e.target.value
                        }))
                      }}
                      value={currentViewedEtudiant.description_i}
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
                className="button_dossier text-red min-w-fit  hover:bg-0.36-red"
                onClick={(e) => {
                  e.preventDefault()
                  if (step == 1) {
                    setModify(false)
                  } else {
                    setStep((prev) => prev - 1)
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
                {step >= 2 ? 'Précédent' : 'Annuler'}
              </button>
              <button
                className="button_dossier text-blue min-w-fit hover:bg-0.08-blue"
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
                {step > 2 ? 'Modifier' : 'Suivant'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
export default Archive
