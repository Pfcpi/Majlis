//Tasks:
//In edit section (imprimer, enregistrer, envoyer) (do it after you complete the whole functionnality of the project)

import { useState, useEffect, useMemo } from 'react'

import './sidebar_com_css/archives.css'
import './sidebar_com_css/scroll.css'
import './sidebar_com_css/accueil.css'

import useCliped from '../../../zustand/cliped'
import useDark from '../../../zustand/dark'
import useAccount from '../../../zustand/account'
import useApi from '../../../zustand/api'

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
  const niveaux = ['1 ING', '2 ING', 'L1', 'L2', 'L3', 'M1', 'M2', 'Doctorat']
  const degre = ['1', '2']
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

  const { api } = useApi()
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
        console.log(res)
      })
      .catch((err) => console.log(err))
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
              {account == 'chef' && (
                <button
                  onClick={() => {
                    setModify(true)
                    console.log()
                    axios
                      .post(api + '/rapport/gets', { numR: etudiant.num_r })
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
              )}
              {account == 'chef' && (
                <button
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
        <p className="text-xl">{[mem.nom_m, ' ', mem.prenom_m]}</p>
        <p className="text-blue">{mem.role_m}</p>
      </div>
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
                onClick={async () => {
                  const tache1 = await axios
                    .delete(api + '/rapport/delete', { data: { numR: currentDeletedStudent } })
                    .catch((err) => console.log(err))
                  const tache2 = await axios
                    .get(api + '/rapport/get')
                    .then((res) => {
                      setEtudiants(res.data)
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
                    <p>Matricule: {currentViewedEtudiant.matricule_e}</p>
                    <p>Nom: {[currentViewedEtudiant.nom_e, ' ', currentViewedEtudiant.prenom_e]}</p>
                    <p>Niveau: {currentViewedEtudiant.niveau_e}</p>
                    <p>Groupe: {currentViewedEtudiant.groupe_e}</p>
                    <p>Section: {currentViewedEtudiant.section_e}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-blue text-2xl">Informations du plaignant</h3>
                  <div className="flex flex-col gap-3">
                    <p>Nom: {[currentViewedEtudiant.nom_p, ' ', currentViewedEtudiant.prenom_p]}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-blue text-2xl">Informations globales</h3>
                  <div className="flex flex-col gap-3">
                    <p>
                      Date de l’infraction:{' '}
                      {currentViewedEtudiant.date_i
                        ? currentViewedEtudiant.date_i.slice(
                            0,
                            currentViewedEtudiant.date_i.indexOf('T')
                          )
                        : 'not found'}
                    </p>
                    <p>Lieu: {currentViewedEtudiant.lieu_i}</p>
                    <p>Degré: {currentViewedEtudiant.degre_i}</p>
                    <p>Motif: {currentViewedEtudiant.motif_i}</p>
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
                      ? ' Nouveau rapport ajouté...'
                      : ' Nouveax rapports ajoutés...'
                  ]}
                </p>
              </div>
            )}
            <h1 className="text-3xl py-4 font-semibold">Rapport à traiter</h1>
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
            <div className="max-h-[56vh] overflow-y-auto w-full">
              <table className="w-full">
                <tr className="border-t">
                  <th className="w-1/4 border-x">
                    <div>Rapport</div>
                  </th>
                  <th className="w-1/4 border-x">
                    <div>Nom Etudiant</div>
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
                  onClick={async () => {
                    setStep(1)
                    setModify(false)
                    const tache1 = await axios
                      .patch(api + '/rapport/edit', rapport)
                      .then((res) => console.log(res, res.data.sql ? res.data.sql : ''))
                      .catch((err) => console.log(err))
                    const tache2 = await axios
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
                      Prenom
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
            <hr className="w-full dark:text-gray"></hr>
            <div className="flex justify-between w-5/6 py-6">
              <button
                className="button_dossier text-red min-w-fit hover:bg-0.36-red"
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
    </div>
  )
}
export default Archive
