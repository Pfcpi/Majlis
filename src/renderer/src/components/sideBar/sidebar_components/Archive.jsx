import { useState, useRef, useEffect, useMemo } from 'react'

import './sidebar_com_css/archives.css'

import useDark from '../../../zustand/dark'
import useApi from '../../../zustand/api'
import useAccount from '../../../zustand/account'

import BlueSearchSVG from './../../../assets/BlueSearch.svg'
import VoirDossierSVG from './../../../assets/VoirDossier.svg'
import ModifierDossierSVG from './../../../assets/ModifierDossier.svg'
import ModifierDossierGraySVG from './../../../assets/BlueSvgs/ModifierDossierGray.svg'
import PdfSVG from './../../../assets/pdf.svg'
import WarningSVG from './../../../assets/warning.svg'
import SupprimerSVG from './../../../assets/supprimer.svg'
import EnvoyerSVG from './../../../assets/Envoyer.svg'
import EnvoyerGraySVG from './../../../assets/BlueSvgs/EnvoyerGray.svg'
import GOBackSVG from './../../../assets/GoBack.svg'
import GOBackGraySVG from './../../../assets/BlueSvgs/GoBackGray.svg'
import axios from 'axios'

//Need to modify:
function Archive() {
  const win = ['rapport', 'pv', 'conseil', 'commission']

  const [currentWindow, setCurrentWindow] = useState(win[0])

  const [rapports, setRapports] = useState([])
  const [currentViewedRapport, setCurrentViewedRappport] = useState({})
  const [query, setQuery] = useState('')

  const [commissions, setCommissions] = useState([])
  const [selectedMem, setSelectedMem] = useState([])
  const [queryCom, setQueryCom] = useState('')

  const [PVs, setPVs] = useState([])
  const [currentViewedPV, setCurrentViewedPV] = useState({})
  const [selectedPVs, setSelectedPVs] = useState([])
  const [queryPV, setQueryPV] = useState('')

  const [conseils, setConseils] = useState([])
  const [currentViewedCD, setCurrentViewedCD] = useState({})
  const [selectedCon, setSelectedCon] = useState([])
  const [queryCon, setQueryCon] = useState('')

  const [view, setView] = useState(false)

  const { dark } = useDark()
  const { api } = useApi()
  const { account } = useAccount()

  const archivePage = useRef(null)

  const niveaux = [
    'ING 1',
    'ING 2',
    'ING 3',
    'ING 4',
    'ING 5',
    'L1',
    'L2',
    'L3',
    'M1',
    'M2',
    'Doctorat'
  ]
  const accueilPage = useRef(null)
  const motif1 = [
    'Demande non fondée de double correction',
    'tentative de fraude ou fraude établie',
    "rufus d'obtempérer à des directives émanant de l'administration, du personnel enseignant ou de sécurité"
  ]
  const motif2 = [
    'Les récidives des infractions du 1er degré',
    "l'entrave à la bonne marche de l'établissement",
    'le désordre organisé',
    'la voilance',
    'les menaces et voies de fais',
    'le faux',
    "la détérioration délibérée des beins de l'établissement",
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

  const buttonRef = useRef(null)

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

  async function fetchData() {
    addLoadingBar()
    const tache1 = await axios
      .get(api + '/archive/getrapport')
      .then((res) => {
        setRapports(res.data)
      })
      .catch((err) => console.log(err))

    const tache2 = await axios
      .get(api + '/archive/getpv')
      .then((res) => {
        setPVs(res.data)
      })
      .catch((err) => console.log(err))

    const tache3 = await axios
      .get(api + '/archive/getcommission')
      .then((res) => {
        setCommissions(res.data)
      })
      .catch((err) => console.log(err))

    const tache4 = await axios
      .get(api + '/archive/getcd')
      .then((res) => {
        setConseils(res.data)
        console.log('/archive/getcd:', res.data)
      })
      .catch((err) => console.log(err))
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
    setRapport((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  function handlePreview(num, rapport_ou_pv) {
    return new Promise(async () => {
      let path = await window.electronAPI.getPath()
      if (rapport_ou_pv == win[0]) {
        console.log('in rapport')
        const pdfToPreview = await axios
          .post(api + '/archive/printrapport', { numR: num, path: path })
          .then((res) => {
            const result = window.electronAPI.getUrl()
          })
          .catch((err) => console.log(err))
      } else {
        console.log('in pv')
        const pdfToPreview = await axios
          .post(api + '/archive/printpv', { numPV: num, path: path })
          .then((res) => {
            const result = window.electronAPI.getUrl()
          })
          .catch((err) => console.log(err))
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
    axios
      .post(api + '/rapport/gets', { numR: num_r })
      .then((res) => {
        setCurrentViewedEtudiant(res.data[0])
        setRapport((prev) => ({
          degreI: res.data[0].degre_i,
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
          numR: num_r
        }))
      })
      .catch((err) => console.log(err))
  }

  async function handleViewPV() {
    addLoadingBar()
    setView(true)
    console.log('selected pv: ', selectedPVs)
    const tache1 = await axios
      .post(api + '/archive/getspv', { numPV: selectedPVs[0].num_pv })
      .then((res) => {
        console.log(res.data)
        setCurrentViewedPV({ ...res.data, numPV: selectedPVs[0].num_pv })
        console.log('the object', { ...res.data, numPV: selectedPVs[0].num_pv })
      })
      .catch((err) => console.log(err))
    RemoveLoadingBar()
  }

  async function handleViewCD() {
    addLoadingBar()
    const tache = await axios
      .post(api + '/archive/getscd', { numCD: selectedCon[0].num_cd })
      .then((res) => {
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
        <td>{m.date_i.slice(0, m.date_i.indexOf('T'))}</td>
        <td>
          <div className="w-full flex justify-evenly">
            <button
              onClick={() => {
                handleDetailedViewRapport(m.num_r)
              }}
            >
              <img src={VoirDossierSVG} alt=""></img>
            </button>
            {account == 'chef' && (
              <button onClick={() => handleModifyRapport(m.num_r)}>
                <img src={!dark ? ModifierDossierGraySVG : ModifierDossierSVG} alt=""></img>
              </button>
            )}
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
          selectedPVs.findIndex((el) => el == m) == -1
            ? 'border-y duration-150 ease-linear hover:bg-side-bar-white-theme-color dark:hover:bg-dark-gray'
            : 'border-y duration-150 ease-linear bg-blue/25'
        }
        onClick={() => {
          const found = selectedPVs.findIndex((el) => el == m)
          if (found == -1) setSelectedPVs((prev) => [...prev, m])
          else {
            setSelectedPVs((prev) => prev.slice(0, found).concat(prev.slice(found + 1)))
          }
        }}
      >
        <td>
          <span>{m.num_pv}</span>
        </td>
        <td>{[m.nom_e, ' ', m.prenom_e]}</td>
        <td>{m.date_i.slice(0, m.date_i.indexOf('T'))}</td>
        <td>{m.date_pv.slice(0, m.date_i.indexOf('T'))}</td>
        <td>{m.libele_s}</td>
      </tr>
    ))
  ) : (
    <></>
  )

  /*
  const filteredMembers = useMemo(() => {
    return Array.isArray(commissions)
      ? commissions.filter((m) => {
          return m.nom_m
            .toLowerCase()
            .concat(' ')
            .concat(m.prenom_m.toLowerCase())
            .includes(queryCom.toLowerCase())
        })
      : ''
  }, [commissions, queryCom])

  const tabComs = Array.isArray(filteredMembers) ? (
    filteredMembers.map((m) => (
      <tr
        className={
          selectedMem.findIndex((el) => el == m) == -1
            ? 'border-y duration-150 ease-linear hover:bg-side-bar-white-theme-color dark:hover:bg-dark-gray'
            : 'border-y duration-150 ease-linear bg-blue/25'
        }
        onClick={() => {
          const found = selectedMem.findIndex((el) => el == m)
          if (found == -1) setSelectedMem((prev) => [...prev, m])
          else {
            setSelectedMem((prev) => prev.slice(0, found).concat(prev.slice(found + 1)))
          }
        }}
      >
        <td>
          <span>{m.id_m}</span>
        </td>
        <td>{[m.nom_m, ' ', m.prenom_m]}</td>
        <td>{m.date_debut_c.slice(0, m.date_debut_c.indexOf('T'))}</td>
        <td>{m.date_fin_c.slice(0, m.date_fin_c.indexOf('T'))}</td>
        <td>{m.role_m}</td>
      </tr>
    ))
  ) : (
    <></>
  )*/

  const tabCons = Array.isArray(conseils) ? (
    conseils.map((m) => (
      <tr
        className={
          selectedCon.findIndex((el) => el == m) == -1
            ? 'border-y duration-150 ease-linear hover:bg-side-bar-white-theme-color dark:hover:bg-dark-gray'
            : 'border-y duration-150 ease-linear bg-blue/25'
        }
        onClick={() => {
          const found = selectedCon.findIndex((el) => el == m)
          if (found == -1) setSelectedCon((prev) => [...prev, m])
          else {
            setSelectedCon((prev) => prev.slice(0, found).concat(prev.slice(found + 1)))
          }
        }}
      >
        <td>
          <span>{m.num_cd}</span>
        </td>
        <td>{m.date_cd.slice(0, m.date_cd.indexOf('T'))}</td>
      </tr>
    ))
  ) : (
    <></>
  )

  const validateFormStep1 = (data) => {
    let errors = {}

    const que_les_nombres_regex = /^[0-9]+$/
    if (data.matriculeE.length == 0) {
      errors.matricule = 'matricule est vide!'
      setErrorsStep1((prev) => ({ ...prev, matriculeError: errors.matricule }))
      return errors
    } else if (!que_les_nombres_regex.test(data.matriculeE)) {
      errors.matricule = 'Uniquement les nombres'
      setErrorsStep1((prev) => ({ ...prev, matriculeError: errors.matricule }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, matriculeError: '' }))
    }

    if (data.nomE.length == 0) {
      errors.nom = 'nom est vide!'
      setErrorsStep1((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nomE.length < 3) {
      errors.nom = 'la longueur doit etre > 3'
      setErrorsStep1((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nomE.search(/^[a-zA-Z]*$/g)) {
      errors.nom = "Uniquement les caractères (pas d'espace)"
      setErrorsStep1((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, nomError: '' }))
    }

    if (data.prenomE.length == 0) {
      errors.prenom = 'Prenom est vide!'
      setErrorsStep1((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenomE.length < 3) {
      errors.prenom = 'la longueur doit etre > 3'
      setErrorsStep1((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenomE.search(/^[a-zA-Z\s]*$/g)) {
      errors.prenom = 'Uniquement les caractères'
      setErrorsStep1((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, prenomError: '' }))
    }

    if (data.niveauE.length == 0) {
      errors.niveau = 'Niveau est vide!'
      setErrorsStep1((prev) => ({ ...prev, niveauError: errors.niveau }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, niveauError: '' }))
    }

    if (data.groupeE.length == 0) {
      errors.groupe = 'groupe est vide!'
      setErrorsStep1((prev) => ({ ...prev, groupeError: errors.groupe }))
      return errors
    } else if (!que_les_nombres_regex.test(data.groupeE)) {
      errors.groupe = 'Uniquement les nombres'
      setErrorsStep1((prev) => ({ ...prev, groupeError: errors.groupe }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, groupeError: '' }))
    }

    if (data.sectionE == null || data.sectionE.length == 0) {
      errors.section = 'section est vide!'
      setErrorsStep1((prev) => ({ ...prev, sectionError: errors.section }))
      return errors
    } else if (!que_les_nombres_regex.test(data.sectionE)) {
      errors.section = 'Uniquement les nombres'
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
      errors.nom = 'nom est vide!'
      setErrorsStep2((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nomP.length < 3) {
      errors.nom = 'la longueur doit etre > 3'
      setErrorsStep2((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nomP.search(/^[a-zA-Z]*$/g)) {
      errors.nom = "Uniquement les caractères (pas d'espace)"
      setErrorsStep2((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else {
      setErrorsStep2((prev) => ({ ...prev, nomError: '' }))
    }

    if (data.prenomP.length == 0) {
      errors.prenom = 'Prenom est vide!'
      setErrorsStep2((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenomP.length < 3) {
      errors.prenom = 'la longueur doit etre > 3'
      setErrorsStep2((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenomP.search(/^[a-zA-Z\s]*$/g)) {
      errors.prenom = 'Uniquement les caractères'
      setErrorsStep2((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else {
      setErrorsStep2((prev) => ({ ...prev, prenomError: '' }))
    }

    return errors
  }

  const validateFormStep3 = (data) => {
    let errors = {}

    console.log('data: ', data)
    if (data.lieuI.length == 0) {
      errors.lieu = 'lieu est vide!'
      setErrorsStep3((prev) => ({ ...prev, lieuError: errors.lieu }))
      return errors
    } else {
      setErrorsStep3((prev) => ({ ...prev, lieuError: '' }))
    }

    console.log('data.motifI', data.motifI)
    if (data.motifI.length == 0) {
      errors.motif = 'motif est vide!'
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
              Conseil de Discipline
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
                      handlePreview(selectedPVs[0].num_pv, win[1])
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
              <div className="w-fit flex gap-4">
                <button>
                  <div
                    className={selectedMem.length == 1 ? 'button_active_blue' : 'button_inactive'}
                  >
                    {modifierImage}Modifier
                  </div>
                </button>
              </div>
              <div className="searchDiv">
                <img className="imgp" src={BlueSearchSVG} alt="search icon"></img>
                <input
                  className="searchInput"
                  aria-label="search input"
                  value={queryCom}
                  onChange={(e) => setQueryCom(e.target.value)}
                  type="search"
                  placeholder="Membre"
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
                      handlePreview()
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
                <button>
                  <div
                    className={selectedCon.length == 1 ? 'button_active_blue' : 'button_inactive'}
                  >
                    {modifierImage}Modifier
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
                  placeholder="Conseil"
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
                        <div>Rapport</div>
                      </th>
                      <th className="w-1/4 ">
                        <div>Nom Etudiant</div>
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
                        <div>PV</div>
                      </th>
                      <th className="w-1/5">
                        <div>Nom Etudiant</div>
                      </th>
                      <th className="w-1/5 ">
                        <div>Date de l'infraction</div>
                      </th>
                      <th className="w-1/5">
                        <div>Date de PV</div>
                      </th>
                      <th className="w-1/5">
                        <div>Sanction </div>
                      </th>
                    </>
                  )}
                  {currentWindow == win[2] && (
                    <>
                      <th className="w-1/5">
                        <div>Membre</div>
                      </th>
                      <th className="w-1/5 ">
                        <div>Nom Membre</div>
                      </th>
                      <th className="w-1/5 ">
                        <div>Date de debut</div>
                      </th>
                      <th className="w-1/5">
                        <div>Date de fin</div>
                      </th>
                      <th className="w-1/5">
                        <div>Role </div>
                      </th>
                    </>
                  )}
                  {currentWindow == win[3] && (
                    <>
                      <th className="w-1/5">
                        <div>Conseild Discipline</div>
                      </th>
                      <th className="w-1/5 ">
                        <div>Date</div>
                      </th>
                    </>
                  )}
                </tr>
                {currentWindow == win[0] && tabRapports}
                {currentWindow == win[1] && tabPVs}
                {/*currentWindow == win[2] && tabComs */}
                {currentWindow == win[3] && tabCons}
              </table>
            </div>
          </div>
        </div>
      )}
      {modify && (
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
                  ref={buttonRef}
                  onClick={async () => {
                    setStep(1)
                    setModify(false)
                    addLoadingBar()
                    const tache1 = await axios
                      .patch(api + '/rapport/edit', rapport)
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
            {step == 1 && (
              <div className="flex flex-col w-5/6">
                <label className="label_dossier">Etudiant</label>
                <div className="flex flex-col w-full gap-6 mb-4">
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
                      name="niveauE"
                      id="niveauE"
                      onClick={() => {
                        if (!dropNiveau) {
                          setdropNiveau(true)
                        }
                      }}
                      onChange={handleInputChange}
                      value={dropNiveauValue || currentViewedEtudiant.niveau_e}
                      required
                    ></input>
                    <label className="label_rapport" htmlFor="niveauE">
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
                    <input
                      className="input_dossier"
                      name="motifI"
                      id="motifI"
                      onChange={(e) => {
                        console.log('dropMotifValue:', dropMotifValue)
                        if (dropMotifValue == 'autres...') {
                          handleInputChange(e)
                          setCurrentViewedEtudiant((prev) => ({ ...prev, motif_i: e.target.value }))
                          if (dropMotif) setDropMotif(false)
                        }
                      }}
                      onClick={() => {
                        if (!dropMotif && dropMotifValue != 'autres...') setDropMotif(true)
                      }}
                      value={
                        dropMotifValue == 'autres...' || dropMotifValue == ''
                          ? currentViewedEtudiant.motif_i
                          : dropMotifValue
                      }
                      required
                    ></input>
                    <label className="label_rapport" htmlFor="motifI">
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
                    <input
                      className="input_dossier"
                      name="degreI"
                      id="degreI"
                      value={motif2.includes(rapport.motifI) ? '2' : '1'}
                      required
                    ></input>
                    <label className="label_rapport" htmlFor="degreI">
                      Degré
                    </label>
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
                {step >= 2 ? 'retourner' : 'annuler'}
              </button>
              <button
                ref={buttonRef}
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
                {step > 2 ? 'modifier' : 'continuer'}
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
              <h2 className="text-4xl">Details du Dossier </h2>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations de l'étudiant:</h3>
                <div className="flex flex-col gap-3">
                  <p>matricule: {currentViewedRapport.matricule_e}</p>
                  <p>Nom: {[currentViewedRapport.nom_e, ' ', currentViewedRapport.prenom_e]}</p>
                  <p>Niveau: {currentViewedRapport.niveau_e}</p>
                  <p>Section: {currentViewedRapport.section_e}</p>
                  <p>Groupe: {currentViewedRapport.groupe_e}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations du plaignant</h3>
                <div className="flex flex-col gap-3">
                  <p>Nom: {[currentViewedRapport.nom_p, ' ', currentViewedRapport.prenom_p]}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations globales</h3>
                <div className="flex flex-col gap-3">
                  {currentViewedRapport.date_i && (
                    <p>
                      Date de l’infraction:
                      {currentViewedRapport.date_i.slice(
                        0,
                        currentViewedRapport.date_i.indexOf('T')
                      )}
                    </p>
                  )}
                  {currentViewedRapport.date_r && (
                    <p>
                      Date de Rapport:
                      {currentViewedRapport.date_r.slice(
                        0,
                        currentViewedRapport.date_r.indexOf('T')
                      )}
                    </p>
                  )}
                  <p>Lieu: {currentViewedRapport.lieu_i}</p>
                  <p>Motif: {currentViewedRapport.motif_i}</p>
                  <p>Degre: {currentViewedRapport.degre_i}</p>
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
                handlePreview(currentViewedRapport.num_r, win[0])
              }}
              className="modify_rapport_button"
            >
              <img src={PdfSVG}></img>
              PDF
            </button>
            <button className="modify_rapport_button">
              <img src={dark ? EnvoyerSVG : EnvoyerGraySVG}></img>envoyer
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
              <h2 className="text-4xl">Details du PV</h2>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations de l'étudiant:</h3>
                <div className="flex flex-col gap-3">
                  <p>matricule: {currentViewedPV.matriculeE}</p>
                  <p>Nom: {[currentViewedPV.nomE, ' ', currentViewedPV.prenomE]}</p>
                  <p>Niveau: {currentViewedPV.niveauE}</p>
                  <p>Section: {currentViewedPV.sectionE}</p>
                  <p>Groupe: {currentViewedPV.groupeE}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations du plaignant</h3>
                <div className="flex flex-col gap-3">
                  <p>Nom: {[currentViewedPV.nomP, ' ', currentViewedPV.prenomP]}</p>
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
                  <h3 className="text-blue text-2xl">Informations du Conseil discipline</h3>
                  <div className="flex flex-col gap-3">
                    <p>Date: {currentViewedPV.dateCd ? currentViewedPV.dateCd.slice(0, 10) : ''}</p>
                    <div>
                      membres:{' '}
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
                      temoins:{' '}
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
    </div>
  )
}
export default Archive
