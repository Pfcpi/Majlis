import { useState, useRef, useEffect, useMemo } from 'react'

import './sidebar_com_css/archives.css'

import useDark from '../../../zustand/dark'
import useApi from '../../../zustand/api'
import useAccount from '../../../zustand/account'
import useDate from '../../../zustand/currentDate'

import BlueSearchSVG from './../../../assets/BlueSearch.svg'
import VoirDossierSVG from './../../../assets/VoirDossier.svg'
import ModifierDossierSVG from './../../../assets/ModifierDossier.svg'
import ModifierDossierGraySVG from './../../../assets/BlueSvgs/ModifierDossierGray.svg'
import PdfSVG from './../../../assets/pdf.svg'
import WarningSVG from './../../../assets/warning.svg'
import GOBackSVG from './../../../assets/GoBack.svg'
import GOBackGraySVG from './../../../assets/BlueSvgs/GoBackGray.svg'
import successmarkSVG from './../../../assets/success_mark.svg'
import addPlusSVg from './../../../assets/add_plus.svg'
import axios from 'axios'

//Need to modify:
function Archive() {
  const { date } = useDate()
  const win = ['rapport', 'pv', 'conseil', 'commission']
  const sanctions = [
    'Aucune sanction',
    'Avertissement verbal',
    'Avertissement écrit',
    'Blâme',
    'Exclusion pour un semestre ou une année',
    'Exclusion pour deux ans',
    'Exclusion définitive',
    'autres...'
  ]
  const roles = ['Administration', 'Agent', 'Enseignant', 'Étudiant', 'autres...']
  const degre = ['1', '2']

  const [dropDegre, setDropDegre] = useState(false)
  const [dropDegreValue, setDropDegreValue] = useState('1')

  const [dropSanction, setDropSanction] = useState(false)
  const [dropSanctionValue, setDropSanctionValue] = useState('')
  const [dropRole, setDropRole] = useState(false)
  const [dropRoleValue, setDropRoleValue] = useState('')

  const [currentWindow, setCurrentWindow] = useState(win[0])

  const [rapports, setRapports] = useState([])
  const [currentViewedRapport, setCurrentViewedRappport] = useState({})
  const [query, setQuery] = useState('')

  const [commissions, setCommissions] = useState([])
  const [selectedMem, setSelectedMem] = useState([])
  const [currentViewedCOM, setCurrentViewedCOM] = useState({})
  const [currentViewedMembers, setCurrentViewedMembers] = useState([])
  const [queryCom, setQueryCom] = useState('')

  const [PVs, setPVs] = useState([])
  const [currentViewedPV, setCurrentViewedPV] = useState({})
  const [selectedPVs, setSelectedPVs] = useState([])
  const [queryPV, setQueryPV] = useState('')
  const [pv, setPv] = useState({ numPV: '', libeleS: '', temoin: '' })
  const [isAddingTemoin, setIsAddingTemoin] = useState(false)
  const [temoinBuffer, setTemoinBuffer] = useState({ nom: '', prenom: '', role: '' })
  const [temoinArray, setTemoinArray] = useState([])
  const [pvError, setPvError] = useState({ sanctionError: '' })
  const [temoinsError, setTemoinsError] = useState({ nomError: '', prenomError: '', roleError: '' })

  const [conseils, setConseils] = useState([])
  const [currentViewedCD, setCurrentViewedCD] = useState({})
  const [selectedCon, setSelectedCon] = useState([])
  const [queryCon, setQueryCon] = useState('')

  const [view, setView] = useState(false)

  const { dark } = useDark()
  const { api, apiPDF } = useApi()
  const { account } = useAccount()

  const archivePage = useRef(null)

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

  const [rapport, setRapport] = useState({
    matriculeE: '',
    nomE: '',
    prenomE: '',
    niveauE: '',
    email: '',
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
  const [modify, setModify] = useState(false)
  const [step, setStep] = useState(1)
  const [currentViewedEtudiant, setCurrentViewedEtudiant] = useState({})

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
      .get(api + '/archive/getrapport')
      .then((res) => {
        setRapports(res.data)
      })
      .catch((err) => {
        alert('Vérifier la connexion internet')
        console.log(err)
      })

    const tache2 = await axios
      .get(api + '/archive/getpv')
      .then((res) => {
        setPVs(res.data)
      })
      .catch((err) => {
        console.log(err)
        alert('Vérifier la connexion internet')
      })

    const tache3 = await axios
      .get(api + '/archive/getcommission')
      .then(async (res) => {
        setCommissions(res.data)
        console.log('/archive/getcommission', res.data)
      })
      .catch((err) => {
        console.log(err)
        alert('Vérifier la connexion internet')
      })

    const tache4 = await axios
      .get(api + '/archive/getcd')
      .then((res) => {
        setConseils(res.data)
      })
      .catch((err) => {
        console.log(err)
        alert('Vérifier la connexion internet')
      })
    RemoveLoadingBar()
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setSelectedCon([])
    setSelectedMem([])
    setSelectedPVs([])
  }, [currentWindow])

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
    setRapport((prev) => ({ ...prev, degreI: dropDegreValue }))
    setCurrentViewedEtudiant((prev) => ({ ...prev, degreI: dropDegreValue }))
  }, [dropDegreValue])

  useEffect(() => {
    setRapport((prev) => ({
      ...prev,
      degreI: motif2.includes(currentViewedEtudiant.motif_i) ? '2' : '1'
    }))
  }, [currentViewedEtudiant.motif_i])

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
    archivePage.current.appendChild(loadingBar)
  }

  function RemoveLoadingBar() {
    loadingBar.remove()
  }

  const dropSanctionItems = (
    <div className="absolute w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
      {sanctions.map((n) => (
        <div
          className="border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray"
          onClick={() => {
            setDropSanction(false)
            setDropSanctionValue(n)
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

  const dropRoledownItems = (
    <div className="absolute w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
      {roles.map((n) => (
        <div
          className="border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray"
          onClick={() => {
            setDropRole(false)
            setDropRoleValue(n)
          }}
        >
          {n}
        </div>
      ))}
    </div>
  )
  const supprimerImage = (
    <svg
      width="18"
      height="24"
      viewBox="0 0 18 24"
      fill="none"
      className={
        selectedPVs.length != 0
          ? '[&>path]:fill-red duration-100'
          : '[&>path]:fill-dark-gray/25 dark:[&>path]:fill-white/25 duration-100'
      }
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.25 20.75C1.25 21.413 1.51339 22.0489 1.98223 22.5178C2.45107 22.9866 3.08696 23.25 3.75 23.25H13.75C14.413 23.25 15.0489 22.9866 15.5178 22.5178C15.9866 22.0489 16.25 21.413 16.25 20.75V5.75H1.25V20.75ZM3.75 8.25H13.75V20.75H3.75V8.25ZM13.125 2L11.875 0.75H5.625L4.375 2H0V4.5H17.5V2H13.125Z" />
    </svg>
  )

  const modifierImage = (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      className={
        selectedPVs.length == 1 || selectedCon.length == 1 || selectedMem.length == 1
          ? '[&>path]:fill-blue duration-100'
          : '[&>path]:fill-dark-gray/25 dark:[&>path]:fill-white/25 duration-100'
      }
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 20.5044H6V4.50439H13V9.50439H18V12.6044L20 10.6044V8.50439L14 2.50439H6C4.9 2.50439 4 3.40439 4 4.50439V20.5044C4 21.6044 4.9 22.5044 6 22.5044H10V20.5044ZM20.2 13.5044C20.3 13.5044 20.5 13.6044 20.6 13.7044L21.9 15.0044C22.1 15.2044 22.1 15.6044 21.9 15.8044L20.9 16.8044L18.8 14.7044L19.8 13.7044C19.9 13.6044 20 13.5044 20.2 13.5044ZM20.2 17.4044L14.1 23.5044H12V21.4044L18.1 15.3044L20.2 17.4044Z"
        fill-opacity="0.78"
      />
    </svg>
  )

  const voirDossierImage = (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      className={
        selectedPVs.length == 1 || selectedCon.length == 1 || selectedMem.length == 1
          ? '[&>path]:fill-blue duration-100'
          : '[&>path]:fill-dark-gray/25 dark:[&>path]:fill-white/25 duration-100'
      }
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17 18.5044C17.56 18.5044 18 18.9444 18 19.5044C18 20.0644 17.56 20.5044 17 20.5044C16.44 20.5044 16 20.0644 16 19.5044C16 18.9444 16.44 18.5044 17 18.5044ZM17 15.5044C14.27 15.5044 11.94 17.1644 11 19.5044C11.94 21.8444 14.27 23.5044 17 23.5044C19.73 23.5044 22.06 21.8444 23 19.5044C22.06 17.1644 19.73 15.5044 17 15.5044ZM17 22.0044C16.337 22.0044 15.7011 21.741 15.2322 21.2722C14.7634 20.8033 14.5 20.1674 14.5 19.5044C14.5 18.8414 14.7634 18.2055 15.2322 17.7366C15.7011 17.2678 16.337 17.0044 17 17.0044C17.663 17.0044 18.2989 17.2678 18.7678 17.7366C19.2366 18.2055 19.5 18.8414 19.5 19.5044C19.5 20.1674 19.2366 20.8033 18.7678 21.2722C18.2989 21.741 17.663 22.0044 17 22.0044ZM9.27 20.5044H6V4.50439H13V9.50439H18V13.5744C18.7 13.6544 19.36 13.8244 20 14.0644V8.50439L14 2.50439H6C5.46957 2.50439 4.96086 2.71511 4.58579 3.09018C4.21071 3.46525 4 3.97396 4 4.50439V20.5044C4 21.0348 4.21071 21.5435 4.58579 21.9186C4.96086 22.2937 5.46957 22.5044 6 22.5044H10.5C9.99562 21.9006 9.58132 21.2269 9.27 20.5044Z" />
    </svg>
  )

  const PdfImage = (
    <svg
      width="23"
      height="24"
      viewBox="0 0 23 24"
      className={
        selectedPVs.length == 1 || selectedCon.length == 1 || selectedMem.length == 1
          ? '[&>path]:fill-blue duration-100'
          : '[&>path]:fill-dark-gray/25 dark:[&>path]:fill-white/25 duration-100'
      }
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 0.75H2.5C1.125 0.75 0 1.875 0 3.25V20.75C0 22.125 1.125 23.25 2.5 23.25H20C21.375 23.25 22.5 22.125 22.5 20.75V3.25C22.5 1.875 21.375 0.75 20 0.75ZM8.125 11.375C8.125 12.375 7.25 13.25 6.25 13.25H5V15.75H3.125V8.25H6.25C7.25 8.25 8.125 9.125 8.125 10.125V11.375ZM14.375 13.875C14.375 14.875 13.5 15.75 12.5 15.75H9.375V8.25H12.5C13.5 8.25 14.375 9.125 14.375 10.125V13.875ZM19.375 10.125H17.5V11.375H19.375V13.25H17.5V15.75H15.625V8.25H19.375V10.125ZM11.25 10.125H12.5V13.875H11.25V10.125ZM5 10.125H6.25V11.375H5V10.125Z" />
    </svg>
  )

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log(name, value)
    setRapport((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  useEffect(() => {
    setTemoinBuffer((prevState) => ({
      ...prevState,
      role: dropRoleValue
    }))
  }, [dropRoleValue])

  useEffect(() => {
    setPv((prevState) => ({
      ...prevState,
      libeleS: dropSanctionValue
    }))
  }, [dropSanctionValue])

  function handleInputTemoinChange(e) {
    const { name, value } = e.target
    setTemoinBuffer((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleAjouterModifyPV = async (e) => {
    e.preventDefault()
    const newErrors = validateFormPV(pv)
    if (Object.keys(newErrors).length === 0) {
      setModify(false)
      addLoadingBar()
      console.log('temoinArray: ', temoinArray)
      const tache = await axios
        .patch(api + '/archive/editpv', {
          libeleS: pv.libeleS,
          numPV: pv.numPV,
          temoin: temoinArray
        })
        .then((res) => {
          console.log(res.data)
        })
        .catch((err) => {
          console.log(err)
          alert('Vérifier la connexion internet')
        })
      RemoveLoadingBar()
      setPv({ numPV: '', libeleS: '', temoin: '' })
      setTemoinArray([])
      setPvError({ sanctionError: '' })
      setTemoinBuffer({ nom: '', prenom: '', role: '' })
      setTemoinsError({ nomError: '', prenomError: '', roleError: '' })
    }
    setTimeout(() => {
      setErrorsStep1({ sanctionError: '' })
    }, 2000)
  }

  const handleAnnulerModifyPV = (e) => {
    setModify(false)
    setPv({ numPV: '', libeleS: '', temoin: '' })
    setTemoinArray([])
    setPvError({ sanctionError: '' })
    setTemoinBuffer({ nom: '', prenom: '', role: '' })
    setTemoinsError({ nomError: '', prenomError: '', roleError: '' })
  }

  const validateFormPV = (data) => {
    let errors = {}

    console.log('data: ', data)
    if (dropSanctionValue != '' && dropSanctionValue != 'autres...') {
      setPvError((prev) => ({ ...prev, sanctionError: '' }))
    } else {
      if (data.libeleS.length == 0) {
        errors.sanction = ' Ce champ est obligatoire'
        setPvError((prev) => ({ ...prev, sanctionError: errors.sanction }))
        return errors
      } else {
        setPvError((prev) => ({ ...prev, sanctionError: '' }))
      }
    }
    return errors
  }

  const validateFormTemoin = (data) => {
    let errors = {}
    //nomT: '', prenomT: '', roleT: '
    console.log('data: ', data)
    if (data.nom.length == 0) {
      errors.nom = 'Ce champ est obligatoire'
      setTemoinsError((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nom.length < 3) {
      errors.nom = 'Nom invalide'
      setTemoinsError((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nom.search(/^[a-zA-Z\s]*$/g)) {
      errors.nom = 'Nom invalide'
      setTemoinsError((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else {
      setTemoinsError((prev) => ({ ...prev, nomError: '' }))
    }
    if (data.prenom.length == 0) {
      errors.prenom = 'Ce champ est obligatoire'
      setTemoinsError((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenom.length < 3) {
      errors.prenom = 'Prénom invalide'
      setTemoinsError((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenom.search(/^[a-zA-Z\s]*$/g)) {
      errors.prenom = 'Prénom invalide'
      setTemoinsError((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else {
      setTemoinsError((prev) => ({ ...prev, prenomError: '' }))
    }
    if (dropRoleValue != '' && dropRoleValue != 'autres...') {
      setTemoinsError((prev) => ({ ...prev, roleError: '' }))
    } else {
      if (data.role.length == 0) {
        errors.role = 'Ce champ est obligatoire'
        setTemoinsError((prev) => ({ ...prev, roleError: errors.role }))
        return errors
      } else {
        setTemoinsError((prev) => ({ ...prev, roleError: '' }))
      }
    }
    return errors
  }

  function handlePreview(num) {
    return new Promise(async () => {
      let path = await window.electronAPI.getPath()
      addLoadingBar()
      if (currentWindow == win[0]) {
        console.log('in rapport')
        const pdfToPreview = await axios
          .post(apiPDF + 'generateRA', { numR: num })
          .then((res) => {
            const result = window.electronAPI.getUrl()
          })
          .catch((err) => console.log(err))
        RemoveLoadingBar()
      }
      if (currentWindow == win[1]) {
        console.log('in pv')
        const pdfToPreview = await axios
          .post(apiPDF + 'generatePV', { numPV: num })
          .then((res) => {
            const result = window.electronAPI.getUrl()
          })
          .catch((err) => console.log(err))
        RemoveLoadingBar()
      }
      if (currentWindow == win[3]) {
        console.log('in cons')
        const pdfToPreview = await axios
          .post(apiPDF + 'generateCD', { numCD: num })
          .then((res) => {
            const result = window.electronAPI.getUrl()
          })
          .catch((err) => console.log(err))
        RemoveLoadingBar()
      }
    })
  }

  async function handleDetailedViewRapport(numR) {
    setView(true)
    const tache1 = await axios
      .post(api + '/rapport/gets', { numR: numR })
      .then((res) => {
        setCurrentViewedRappport({ ...res.data[0], num_r: numR })
      })
      .catch((err) => console.log(err))
  }

  function handleModifyRapport(num_r) {
    setModify(true)
    if (account == 'president') setStep(3)
    addLoadingBar()
    axios
      .post(api + '/rapport/gets', { numR: num_r })
      .then((res) => {
        RemoveLoadingBar()
        setCurrentViewedEtudiant(res.data[0])
        setRapport((prev) => ({
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
          numR: num_r
        }))
      })
      .catch((err) => {
        console.log(err)
        RemoveLoadingBar()
        alert('Verifier la connexion internet')
      })
  }

  async function handleViewPV() {
    addLoadingBar()
    const tache1 = await axios
      .post(api + '/archive/getspv', { numPV: selectedPVs[0].num_pv })
      .then((res) => {
        console.log(res.data)
        if (res.status >= 200 && res.status < 300) {
          setCurrentViewedPV({ ...res.data, numPV: selectedPVs[0].num_pv })
          console.log('/archive/gets: temoins:', res.data.temoins)
          setPv({
            libeleS: res.data.libeleS,
            temoin: res.data.temoins,
            numPV: selectedPVs[0].num_pv
          })
          setTemoinArray(res.data.temoins)
        }
      })
      .catch((err) => {
        console.log(err)
        alert('vérifier la connexion internet')
      })
    RemoveLoadingBar()
  }

  async function handleViewCOM() {
    addLoadingBar()
    const tache = await axios
      .post(api + '/archive/getscommission', { numC: selectedMem[0].num_c })
      .then((res) => {
        console.log(res)
        setCurrentViewedCOM(res.data)
      })
      .catch((err) => {
        alert('vérifier la connexion internet')
        console.log(err)
      })
    RemoveLoadingBar()
  }

  async function handleViewCD() {
    addLoadingBar()
    const tache = await axios
      .post(api + '/archive/getscd', { numCD: selectedCon[0].num_cd })
      .then((res) => {
        setView(true)
        console.log(res)
        setCurrentViewedCD(res.data)
      })
      .catch((err) => console.log(err))
    RemoveLoadingBar()
  }

  const filteredEtudiants = useMemo(() => {
    return Array.isArray(rapports)
      ? rapports.filter((etudiant) => {
          return etudiant.nom_e
            .toLowerCase()
            .concat(' ')
            .concat(etudiant.prenom_e.toLowerCase())
            .includes(query.toLowerCase())
        })
      : ''
  }, [rapports, query])

  const tabRapports = Array.isArray(filteredEtudiants) ? (
    filteredEtudiants.map((m) => (
      <tr className="border-y-[1px]">
        <td>
          <span>{m.num_r}</span>
        </td>
        <td>{[m.nom_e, ' ', m.prenom_e]}</td>
        <td>{m.date_i ? m.date_i.slice(0, m.date_i.indexOf('T')) : ''}</td>
        <td>
          <div className="w-full flex justify-evenly">
            <button
              title="Afficher le rapport"
              onClick={() => {
                handleDetailedViewRapport(m.num_r)
              }}
            >
              <img src={VoirDossierSVG} alt=""></img>
            </button>
            <button
              title={account == 'chef' ? 'Modifier le rapport' : 'Changer le motif'}
              onClick={() => {
                handleModifyRapport(m.num_r)
              }}
            >
              <img src={!dark ? ModifierDossierGraySVG : ModifierDossierSVG} alt=""></img>
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <></>
  )

  const filteredPVs = useMemo(() => {
    return Array.isArray(PVs)
      ? PVs.filter((etudiant) => {
          return etudiant.nom_e
            .toLowerCase()
            .concat(' ')
            .concat(etudiant.prenom_e.toLowerCase())
            .includes(queryPV.toLowerCase())
        })
      : ''
  }, [PVs, queryPV])

  const tabPVs = Array.isArray(filteredPVs) ? (
    filteredPVs.map((m) => (
      <tr
        className={
          selectedPVs[0] != m
            ? 'border-y duration-150 ease-linear hover:bg-side-bar-white-theme-color dark:hover:bg-dark-gray'
            : 'border-y duration-150 ease-linear bg-blue/25'
        }
        onClick={() => {
          setSelectedPVs([m])
        }}
      >
        <td>
          <span>{m.num_pv}</span>
        </td>
        <td>{[m.nom_e, ' ', m.prenom_e]}</td>
        <td>{m.date_i ? m.date_i.slice(0, m.date_i.indexOf('T')) : ''}</td>
        <td>{m.date_pv ? m.date_pv.slice(0, m.date_i.indexOf('T')) : ''}</td>
        <td>{m.libele_s}</td>
      </tr>
    ))
  ) : (
    <></>
  )

  const filteredMembers = useMemo(() => {
    return Array.isArray(commissions)
      ? commissions.filter((m) => {
          if (m.date_fin_c) {
            return m.date_fin_c.slice(0, 10).includes(queryCom)
          }
        })
      : ''
  }, [commissions, queryCom])

  const tabComs = Array.isArray(filteredMembers) ? (
    filteredMembers.map((m) => (
      <tr
        className={
          selectedMem[0] != m
            ? 'border-y duration-150 ease-linear hover:bg-side-bar-white-theme-color dark:hover:bg-dark-gray'
            : 'border-y duration-150 ease-linear bg-blue/25'
        }
        onClick={() => {
          setSelectedMem([m])
        }}
      >
        <td>
          <span>{m.num_c}</span>
        </td>
        <td>{m.date_debut_c ? m.date_debut_c.slice(0, m.date_debut_c.indexOf('T')) : ''}</td>
        <td>{m.date_fin_c ? m.date_fin_c.slice(0, m.date_fin_c.indexOf('T')) : ''}</td>
      </tr>
    ))
  ) : (
    <></>
  )
  const filteredCons = useMemo(() => {
    return Array.isArray(conseils)
      ? conseils.filter((c) => {
          if (c.date_cd) {
            return c.date_cd.slice(0, 10).includes(queryCon)
          }
        })
      : ''
  }, [conseils, queryCon])

  const tabCons = Array.isArray(filteredCons) ? (
    filteredCons.map((m) => (
      <tr
        className={
          selectedCon[0] != m
            ? 'border-y duration-150 ease-linear hover:bg-side-bar-white-theme-color dark:hover:bg-dark-gray'
            : 'border-y duration-150 ease-linear bg-blue/25'
        }
        onClick={() => {
          setSelectedCon([m])
        }}
      >
        <td>
          <span>{m.num_cd}</span>
        </td>
        <td>{m.date_cd ? m.date_cd.slice(0, m.date_cd.indexOf('T')) : ''}</td>
      </tr>
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
      errors.nom = 'Nom invalide'
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
      errors.nom = "Nom invalide(pas d'éspace"
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
    <div ref={archivePage} className="w-full h-full">
      {!view && !modify && (
        <div className="w-full h-full flex flex-col">
          <div className="flex w-full">
            <button
              data-rapportdossier={currentWindow == win[0]}
              className="w-1/2 text-2xl  py-4 rounded-xl data-[rapportDossier=true]:text-blue data-[rapportdossier=true]:bg-0.08-blue data-[rapportdossier=true]:border data-[rapportdossier=true]:border-blue"
              onClick={() => setCurrentWindow(win[0])}
            >
              Rapport
            </button>
            <button
              data-rapportdossier={currentWindow == win[1]}
              className="w-1/2 text-2xl py-4 rounded-xl data-[rapportDossier=true]:text-blue data-[rapportdossier=true]:bg-0.08-blue data-[rapportdossier=true]:border data-[rapportdossier=true]:border-blue"
              onClick={() => setCurrentWindow(win[1])}
            >
              PV
            </button>
            <button
              data-rapportdossier={currentWindow == win[2]}
              className="w-1/2 text-2xl py-4 rounded-xl data-[rapportDossier=true]:text-blue data-[rapportdossier=true]:bg-0.08-blue data-[rapportdossier=true]:border data-[rapportdossier=true]:border-blue"
              onClick={() => setCurrentWindow(win[2])}
            >
              Commission
            </button>
            <button
              data-rapportdossier={currentWindow == win[3]}
              className="w-1/2 text-2xl py-4 rounded-xl data-[rapportDossier=true]:text-blue data-[rapportdossier=true]:bg-0.08-blue data-[rapportdossier=true]:border data-[rapportdossier=true]:border-blue"
              onClick={() => setCurrentWindow(win[3])}
            >
              Conseil de discipline
            </button>
          </div>
          {currentWindow == win[0] && (
            <div className="flex px-4 justify-end h-16 items-center bg-side-bar-white-theme-color dark:bg-dark-gray">
              <div className="searchDiv">
                <img className="imgp" src={BlueSearchSVG} alt="search icon"></img>
                <input
                  className="searchInput"
                  aria-label="search input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Rapport"
                ></input>
              </div>
            </div>
          )}
          {currentWindow == win[1] && (
            <div className="h-16 px-4 flex items-center justify-between bg-side-bar-white-theme-color text-[18px] dark:bg-dark-gray">
              <div className="w-fit flex gap-4">
                <button
                  onClick={() => {
                    if (selectedPVs.length == 1) {
                      handlePreview(selectedPVs[0].num_pv)
                    }
                  }}
                  className="text-blue"
                >
                  <div
                    className={selectedPVs.length == 1 ? 'button_active_blue' : 'button_inactive'}
                  >
                    {PdfImage}PDF
                  </div>
                </button>
                {account == 'president' && (
                  <button>
                    <div
                      className={selectedPVs.length == 1 ? 'button_active_blue' : 'button_inactive'}
                      onClick={() => {
                        handleViewPV()
                        setModify(true)
                      }}
                    >
                      {modifierImage}Modifier
                    </div>
                  </button>
                )}
                <button className="text-blue">
                  <div
                    className={selectedPVs.length == 1 ? 'button_active_blue' : 'button_inactive'}
                    onClick={() => {
                      if (selectedPVs.length == 1) {
                        handleViewPV()
                        setView(true)
                      }
                    }}
                  >
                    {voirDossierImage}Voir
                  </div>
                </button>
                <button className="text-blue">
                  <div
                    className={selectedPVs.length == 1 ? 'button_active_blue' : 'button_inactive'}
                    onClick={async () => {
                      if (selectedPVs.length == 1) {
                        setSelectedPVs([])
                        addLoadingBar()
                        const tache1 = await axios
                          .post(api + '/archive/getStudentMail', { numPV: selectedPVs[0].num_pv })
                          .then((res) => {
                            console.log(res.data)
                            if (res.status >= 200 && res.status < 300) {
                              axios
                                .post(apiPDF + 'mail', {
                                  numPV: selectedPVs[0].num_pv,
                                  email: res.data[0].email_e
                                })
                                .then((res) => {
                                  console.log('res mail: ', res)
                                })
                                .catch((err) => {
                                  console.log(err)
                                  alert("L'email n'a pas été envoyé")
                                })
                            }
                          })
                          .catch((err) => {
                            console.log(err)
                            alert('Vérifier la connexion internet')
                          })
                        RemoveLoadingBar()
                      }
                    }}
                  >
                    {voirDossierImage}Envoyer
                  </div>
                </button>
              </div>
              <div className="searchDiv">
                <img className="imgp" src={BlueSearchSVG} alt="search icon"></img>
                <input
                  className="searchInput"
                  aria-label="search input"
                  value={queryPV}
                  onChange={(e) => setQueryPV(e.target.value)}
                  type="search"
                  placeholder="Dossier"
                ></input>
              </div>
            </div>
          )}
          {currentWindow == win[2] && (
            <div className="h-16 px-4 flex items-center justify-between bg-side-bar-white-theme-color text-[18px] dark:bg-dark-gray">
              <button className="text-blue">
                <div
                  className={selectedMem.length == 1 ? 'button_active_blue' : 'button_inactive'}
                  onClick={async () => {
                    if (selectedMem.length == 1) {
                      handleViewCOM()
                      console.log(selectedMem)
                      const array1 = selectedMem[0].nomM.split(',')
                      const array2 = selectedMem[0].prenomM.split(',')
                      for (let i = 0; i < array1.length; i++) {
                        setCurrentViewedMembers((prev) => [...prev, [array1[i], array2[i]]])
                      }

                      setView(true)
                    }
                  }}
                >
                  {voirDossierImage}Voir
                </div>
              </button>
              <div className="searchDiv">
                <img className="imgp" src={BlueSearchSVG} alt="search icon"></img>
                <input
                  className="searchInput"
                  aria-label="search input"
                  value={queryCom}
                  onChange={(e) => setQueryCom(e.target.value)}
                  type="search"
                  placeholder="Date fin"
                ></input>
              </div>
            </div>
          )}
          {currentWindow == win[3] && (
            <div className="h-16 px-4 flex items-center justify-between bg-side-bar-white-theme-color text-[18px] dark:bg-dark-gray">
              <div className="w-fit flex gap-4">
                <button
                  onClick={() => {
                    if (selectedCon.length == 1) {
                      handlePreview(selectedCon[0].num_cd)
                    }
                  }}
                  className="text-blue"
                >
                  <div
                    className={selectedCon.length == 1 ? 'button_active_blue' : 'button_inactive'}
                  >
                    {PdfImage}PDF
                  </div>
                </button>
                <button className="text-blue">
                  <div
                    className={selectedCon.length == 1 ? 'button_active_blue' : 'button_inactive'}
                    onClick={() => {
                      if (selectedCon.length == 1) {
                        handleViewCD()
                      }
                    }}
                  >
                    {voirDossierImage}Voir
                  </div>
                </button>
              </div>
              <div className="searchDiv">
                <img className="imgp" src={BlueSearchSVG} alt="search icon"></img>
                <input
                  className="searchInput"
                  aria-label="search input"
                  value={queryCon}
                  onChange={(e) => setQueryCon(e.target.value)}
                  type="search"
                  placeholder="Date"
                ></input>
              </div>
            </div>
          )}
          <div className="w-full grow h-[50vh]">
            <div className="w-full max-h-full overflow-y-auto">
              <table className="w-full">
                <tr className="border-t-[1px]">
                  {currentWindow == win[0] && (
                    <>
                      <th className="w-1/4">
                        <div>N° Rapport</div>
                      </th>
                      <th className="w-1/4 ">
                        <div>Étudiant</div>
                      </th>
                      <th className="w-1/4">
                        <div>Date de l'infraction</div>
                      </th>
                      <th className="w-1/4">
                        <div>Action</div>
                      </th>
                    </>
                  )}
                  {currentWindow == win[1] && (
                    <>
                      <th className="w-1/5 ">
                        <div>N° PV</div>
                      </th>
                      <th className="w-1/5">
                        <div>Étudiant</div>
                      </th>
                      <th className="w-1/5 ">
                        <div>Date de l'infraction</div>
                      </th>
                      <th className="w-1/5">
                        <div>Date du PV</div>
                      </th>
                      <th className="w-1/5">
                        <div>Décision</div>
                      </th>
                    </>
                  )}
                  {currentWindow == win[2] && (
                    <>
                      <th className="w-1/5">
                        <div>N° Commission</div>
                      </th>
                      <th className="w-1/5 ">
                        <div>Date de debut</div>
                      </th>
                      <th className="w-1/5">
                        <div>Date de fin</div>
                      </th>
                    </>
                  )}
                  {currentWindow == win[3] && (
                    <>
                      <th className="w-1/5">
                        <div>N° Conseil</div>
                      </th>
                      <th className="w-1/5 ">
                        <div>Date</div>
                      </th>
                    </>
                  )}
                </tr>
                {currentWindow == win[0] && tabRapports}
                {currentWindow == win[1] && tabPVs}
                {currentWindow == win[2] && tabComs}
                {currentWindow == win[3] && tabCons}
              </table>
            </div>
          </div>
        </div>
      )}
      {modify && currentWindow == win[0] && (
        <div className="h-full w-full flex flex-col justify-center items-center gap-6">
          {account == 'chef' && (
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
          )}
          {step === 4 && <div className="fullBgBlock"></div>}
          {step === 4 && (
            <div className="absolute flex flex-col justify-evenly text-xl items-center h-40 w-1/3 z-30 rounded-xl text-white dark:text-black bg-dark-gray dark:bg-white">
              Confirmer la modification du rapport
              <div className="flex w-full justify-between px-8">
                <button
                  onClick={() => {
                    setStep(1)
                    setModify(false)
                    setDropMotifValue('')
                  }}
                  className="flex justify-center items-center border rounded-xl text-red py-2 px-4 bg-0.36-red"
                >
                  Annuler
                </button>
                <button
                  onClick={async () => {
                    setStep(1)
                    setModify(false)
                    setDropMotifValue('')
                    addLoadingBar()
                    let data = account == 'chef' ? rapport : { rapport, isEmailing: true }
                    const tache1 = await axios
                      .patch(api + '/rapport/edit', data)
                      .then((res) => console.log(res, res.data.sql ? res.data.sql : ''))
                      .catch((err) => console.log(err))
                    const tache2 = await axios
                      .get(api + '/archive/getrapport')
                      .then((res) => {
                        setRapports(res.data)
                      })
                      .catch((err) => console.log(err))
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
            {step == 1 && account == 'chef' && (
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
                    <div className="flex gap-4 items-center">
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
            {step == 2 && account == 'chef' && (
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
                  {account == 'chef' && (
                    <>
                      <div className="container_input_rapport">
                        <input
                          className="input_dossier"
                          name="dateI"
                          id="dateI"
                          type="date"
                          max={date}
                          onChange={(e) => {
                            handleInputChange(e)
                            setCurrentViewedEtudiant((prev) => ({
                              ...prev,
                              date_i: e.target.value
                            }))
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
                            setCurrentViewedEtudiant((prev) => ({
                              ...prev,
                              lieu_i: e.target.value
                            }))
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
                    </>
                  )}
                  <div className="container_input_rapport">
                    <div className="flex gap-4 items-center">
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
                  if (account == 'president') {
                    setModify(false)
                  }
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
                {account == 'chef' ? (step >= 2 ? 'Précédent' : 'Annuler') : 'Annuler'}
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
      {modify && currentWindow == win[1] && (
        <div className="fullBgBlock">
          <form className="w-1/2 overflow-y-auto flex flex-col justify-between items-center rounded-xl bg-side-bar-white-theme-color dark:bg-dark-gray min-h-fit min-w-[500px]">
            <h1 className="text-[36px] py-4">Détails du PV de {selectedPVs[0].nom_e || ''}</h1>
            <hr className="w-full text-dark-gray/50 dark:text-gray"></hr>
            <div className="flex w-5/6 flex-col gap-6 my-4">
              <div className="container_input_rapport">
                <div className="flex items-center gap-4">
                  <input
                    className="input_dossier"
                    name="libeleS"
                    id="libeleS"
                    onChange={(e) => {
                      e.preventDefault()
                      if (dropSanctionValue == 'autres...') {
                        setPv((prev) => ({ ...prev, libeleS: e.target.value }))
                      }
                    }}
                    value={
                      dropSanctionValue == 'autres...' || dropSanctionValue == ''
                        ? pv.libeleS
                        : dropSanctionValue
                    }
                    required
                  ></input>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setDropSanction((prev) => !prev)
                    }}
                    className="bg-blue h-12 aspect-square rounded-md flex items-center justify-center"
                  >
                    {dropSanction ? ChoiceUp : ChoiceDown}
                  </button>
                </div>
                <label className="label_rapport_fix" htmlFor="libeleS">
                  Sanction
                </label>
                {pvError.sanctionError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {pvError.sanctionError}
                  </p>
                )}
                {dropSanction && dropSanctionItems}
              </div>
              {!isAddingTemoin && temoinArray.length < 3 && (
                <div className="flex w-full justify-between items-center">
                  <div>Ajouter un témoin</div>
                  <button className="bg-blue rounded-md" onClick={() => setIsAddingTemoin(true)}>
                    <img className="h-6 aspect-square" src={addPlusSVg}></img>
                  </button>
                </div>
              )}
              {isAddingTemoin && (
                <div className="flex w-full items-center gap-2">
                  <div className="flex">
                    <div className="container_input_rapport">
                      <input
                        className="input_dossier rounded-r-none"
                        name="nom"
                        id="nom"
                        onChange={(e) => {
                          handleInputTemoinChange(e)
                        }}
                        value={temoinBuffer.nom}
                        required
                      ></input>
                      <label className="label_rapport" htmlFor="nom">
                        Nom
                      </label>
                      {temoinsError.nomError && (
                        <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                          <img height="16" width="16" src={WarningSVG}></img>
                          {temoinsError.nomError}
                        </p>
                      )}
                    </div>
                    <div className="container_input_rapport">
                      <input
                        className="input_dossier rounded-none"
                        name="prenom"
                        id="prenom"
                        onChange={(e) => {
                          handleInputTemoinChange(e)
                        }}
                        value={temoinBuffer.prenom}
                        required
                      ></input>
                      <label className="label_rapport" htmlFor="prenom">
                        Prénom
                      </label>
                      {temoinsError.prenomError && (
                        <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                          <img height="16" width="16" src={WarningSVG}></img>
                          {temoinsError.prenomError}
                        </p>
                      )}
                    </div>
                    <div className="container_input_rapport ">
                      <div className="flex items-center gap-4">
                        <input
                          className="input_dossier rounded-l-none"
                          name="role"
                          id="role"
                          onChange={(e) => {
                            if (dropRoleValue == 'autres...') {
                              handleInputTemoinChange(e)
                            }
                          }}
                          value={dropRoleValue == 'autres...' ? temoinBuffer.role : dropRoleValue}
                          required
                        ></input>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            setDropRole((prev) => !prev)
                          }}
                          className="bg-blue h-12 aspect-square rounded-md flex items-center justify-center"
                        >
                          {dropRole ? ChoiceUp : ChoiceDown}
                        </button>
                      </div>
                      <label className="label_rapport_fix" htmlFor="role">
                        Rôle
                      </label>
                      {temoinsError.roleError && (
                        <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                          <img height="16" width="16" src={WarningSVG}></img>
                          {temoinsError.roleError}
                        </p>
                      )}
                      {dropRole && dropRoledownItems}
                    </div>
                  </div>
                  <button
                    className="bg-white h-8 w-8 flex rounded-md items-center justify-center"
                    onClick={(e) => {
                      e.preventDefault()
                      const newErrors = validateFormTemoin(temoinBuffer)
                      if (Object.keys(newErrors).length === 0) {
                        setTemoinArray((prev) => [...prev, temoinBuffer])
                        console.log('temoinBuffer: ', temoinBuffer)
                        setIsAddingTemoin(false)
                        setTemoinBuffer({ nom: '', prenom: '', role: '' })
                      }
                      setTimeout(() => {
                        setTemoinsError({ nomError: '', prenomError: '', roleError: '' })
                      }, 2000)
                    }}
                  >
                    <img className="h-6 w-6" src={successmarkSVG}></img>
                  </button>
                </div>
              )}
              {Array.isArray(temoinArray) && temoinArray.length != 0 && (
                <div className="container_input_rapport">
                  <h2>Témoins</h2>
                  <div className="w-full h-[99px] overflow-auto flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-0">
                    {temoinArray.map((t) => (
                      <div className="flex justify-between border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray">
                        <div className="w-1/3">{t.role}</div>
                        <div className="w-1/3">{t.nom}</div>
                        <div className="w-1/4">{t.prenom}</div>
                        <button
                          className="flex justify-end 1/12"
                          onClick={(e) => {
                            e.preventDefault()
                            setTemoinArray(temoinArray.filter((item) => item !== t))
                          }}
                        >
                          <div className="bg-red h-6 flex justify-center items-center aspect-square rounded-md text-white">
                            X
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between py-4 w-5/6">
              <button
                className="button_dossier text-red border-red hover:bg-red/25"
                onClick={handleAnnulerModifyPV}
              >
                Annuler
              </button>
              <button
                className="button_dossier text-blue border-blue hover:bg-blue/25"
                type="submit"
                onClick={handleAjouterModifyPV}
              >
                Modifier
              </button>
            </div>
          </form>
        </div>
      )}
      {view && currentWindow == win[0] && (
        <div className="w-full h-full flex">
          <div className="h-full w-1/2 bg-side-bar-white-theme-color dark:bg-dark-gray flex flex-col">
            <button
              className="w-10 aspect-square"
              onClick={() => {
                setView(false)
              }}
            >
              <img src={!dark ? GOBackGraySVG : GOBackSVG}></img>
            </button>
            <div className="overflow-y-auto max-h-[86vh] flex flex-col w-full h-auto px-8 gap-4">
              <h2 className="text-4xl">Détails du Dossier </h2>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations de l'étudiant</h3>
                <div className="flex flex-col gap-3">
                  <p>Matricule: {currentViewedRapport.matricule_e}</p>
                  <p>
                    Nom et prénom:{' '}
                    {[currentViewedRapport.nom_e, ' ', currentViewedRapport.prenom_e]}
                  </p>
                  <p>Email: {currentViewedRapport.email_e}</p>
                  <p>Niveau: {currentViewedRapport.niveau_e}</p>
                  <p>Section: {currentViewedRapport.section_e}</p>
                  <p>Groupe: {currentViewedRapport.groupe_e}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations du plaignant</h3>
                <div className="flex flex-col gap-3">
                  <p>
                    Nom et prénom:{' '}
                    {[currentViewedRapport.nom_p, ' ', currentViewedRapport.prenom_p]}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations globales</h3>
                <div className="flex flex-col gap-3">
                  {currentViewedRapport.date_i && (
                    <p>
                      Date de l’infraction:{' '}
                      {currentViewedRapport.date_i.slice(
                        0,
                        currentViewedRapport.date_i.indexOf('T')
                      )}
                    </p>
                  )}
                  {currentViewedRapport.date_r && (
                    <p>
                      Date de Rapport:{' '}
                      {currentViewedRapport.date_r.slice(
                        0,
                        currentViewedRapport.date_r.indexOf('T')
                      )}
                    </p>
                  )}
                  <p>Lieu: {currentViewedRapport.lieu_i}</p>
                  <p>Motif: {currentViewedRapport.motif_i}</p>
                  <p>Degré: {currentViewedRapport.degre_i}</p>
                  {currentViewedRapport.description_i && (
                    <p>Description: {currentViewedRapport.description_i}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/2 justify-center items-center [&>button]:w-1/3 [&>button]:min-w-fit gap-4">
            <button
              onClick={() => {
                handlePreview(currentViewedRapport.num_r)
              }}
              className="modify_rapport_button"
            >
              <img src={PdfSVG}></img>
              PDF
            </button>
          </div>
        </div>
      )}
      {view && currentWindow == win[1] && (
        <div className="w-full h-full flex">
          <div className="h-full w-1/2 bg-side-bar-white-theme-color dark:bg-dark-gray flex flex-col">
            <button
              className="w-10 aspect-square"
              onClick={() => {
                setView(false)
                setSelectedPVs([])
              }}
            >
              <img src={!dark ? GOBackGraySVG : GOBackSVG}></img>
            </button>
            <div className="overflow-y-auto max-h-[86vh] flex flex-col w-full h-auto px-8 gap-4">
              <h2 className="text-4xl">Détails du PV</h2>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations de l'étudiant</h3>
                <div className="flex flex-col gap-3">
                  <p>Matricule: {currentViewedPV.matriculeE}</p>
                  <p>Nom et prénom: {[currentViewedPV.nomE, ' ', currentViewedPV.prenomE]}</p>
                  <p>Niveau: {currentViewedPV.niveauE}</p>
                  <p>Section: {currentViewedPV.sectionE}</p>
                  <p>Groupe: {currentViewedPV.groupeE}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations du plaignant</h3>
                <div className="flex flex-col gap-3">
                  <p>Nom et prénom: {[currentViewedPV.nomP, ' ', currentViewedPV.prenomP]}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations du l'infraction</h3>
                <div className="flex flex-col gap-3">
                  <p>Date: {currentViewedPV.dateI ? currentViewedPV.dateI.slice(0, 10) : ''}</p>
                  <p>Lieu: {currentViewedPV.lieuI}</p>
                  <p>Motif: {currentViewedPV.motifI}</p>
                  {/* <p>Degre: {currentViewedPV.degre_i}</p> */}
                  <p>Description: {currentViewedPV.descriptionI}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-full w-1/2 bg-side-bar-white-theme-color dark:bg-dark-gray flex flex-col">
            <div className="w-full grow h-[50vh]">
              <div className="w-full h-full overflow-y-auto">
                <div className="flex flex-col gap-4">
                  <h3 className="text-blue text-2xl">Informations du Conseil de discipline</h3>
                  <div className="flex flex-col gap-3">
                    <p>Date: {currentViewedPV.dateCd ? currentViewedPV.dateCd.slice(0, 10) : ''}</p>
                    <div>
                      Membres:{' '}
                      <div className="w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
                        {Array.isArray(currentViewedPV.membres) &&
                          currentViewedPV.membres.length != 0 &&
                          currentViewedPV.membres.map((t) => (
                            <div className="flex justify-between *:w-1/3 border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray">
                              <div>{t.role}</div>
                              <div>{t.nom}</div>
                              <div>{t.prenom}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-blue text-2xl">Informations du PV</h3>
                  <div className="flex flex-col gap-3">
                    <p>Sanction: {currentViewedPV.libeleS}</p>
                    <p>Date: {currentViewedPV.datePV ? currentViewedPV.datePV.slice(0, 10) : ''}</p>

                    <p>
                      Témoins:{' '}
                      <div className="w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
                        {Array.isArray(currentViewedPV.temoins) &&
                          currentViewedPV.temoins.length != 0 &&
                          currentViewedPV.temoins.map((t) => (
                            <div className="flex justify-between *:w-1/3 border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray">
                              <div>{t.role}</div>
                              <div>{t.nom}</div>
                              <div>{t.prenom}</div>
                            </div>
                          ))}
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {view && currentWindow == win[2] && (
        <div className="w-full h-full flex">
          <div className="h-full w-1/2 bg-side-bar-white-theme-color dark:bg-dark-gray flex flex-col">
            <button
              className="w-10 aspect-square"
              onClick={() => {
                setView(false)
                setSelectedMem([])
                setCurrentViewedMembers([])
                setCurrentViewedCOM({})
              }}
            >
              <img src={!dark ? GOBackGraySVG : GOBackSVG}></img>
            </button>
            <div className="overflow-y-auto max-h-[86vh] flex flex-col w-full h-auto px-8 gap-4">
              <h2 className="text-4xl">Détails de la commission</h2>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations de la commission</h3>
                <div className="flex flex-col gap-3">
                  <p>
                    Date de début:{' '}
                    {selectedMem[0].date_debut_c ? selectedMem[0].date_debut_c.slice(0, 10) : ''}
                  </p>
                  <p>
                    Date de fin:{' '}
                    {selectedMem[0].date_fin_c ? selectedMem[0].date_fin_c.slice(0, 10) : ''}
                  </p>
                  <div>
                    Membres :{' '}
                    <div className="w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
                      {Array.isArray(currentViewedMembers) &&
                        currentViewedMembers.length != 0 &&
                        currentViewedMembers.map((t) => (
                          <div className="flex justify-between border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray">
                            <div>{t[0] + ' ' + t[1]}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    Conseils :{' '}
                    <div className="w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
                      {Array.isArray(currentViewedCOM) &&
                        currentViewedCOM.length != 0 &&
                        currentViewedCOM.map((t) => (
                          <div className="flex justify-between border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray">
                            <div>{t.date_cd.slice(0, 10)}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {view && currentWindow == win[3] && (
        <div className="w-full h-full flex">
          <div className="h-full w-1/2 bg-side-bar-white-theme-color dark:bg-dark-gray flex flex-col">
            <button
              className="w-10 aspect-square"
              onClick={() => {
                setView(false)
                setSelectedCon([])
              }}
            >
              <img src={!dark ? GOBackGraySVG : GOBackSVG}></img>
            </button>
            <div className="overflow-y-auto max-h-[86vh] flex flex-col w-full h-auto px-8 gap-4">
              <h2 className="text-4xl">Détails du conseil de discipline</h2>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations du conseil de discipline</h3>
                <div className="flex flex-col gap-3">
                  <p>
                    Date de conseil:{' '}
                    {currentViewedCD.dateCD ? currentViewedCD.dateCD.slice(0, 10) : ''}
                  </p>
                  <div>
                    Membres:{' '}
                    <div className="w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
                      {Array.isArray(currentViewedCD.membres) &&
                        currentViewedCD.membres.length != 0 &&
                        currentViewedCD.membres.map((t) => (
                          <div className="flex justify-between border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray">
                            <div>{t}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    Étudiants:{' '}
                    <div className="w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
                      {Array.isArray(currentViewedCD.etudiants) &&
                        currentViewedCD.etudiants.length != 0 &&
                        currentViewedCD.etudiants.map((t) => (
                          <div className="flex justify-between border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray">
                            <div>{t}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Archive
