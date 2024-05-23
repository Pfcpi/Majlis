import { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios'

import BlueSearchSVG from './../../../assets/BlueSearch.svg'
import WarningSVG from './../../../assets/warning.svg'
import successmarkSVG from './../../../assets/success_mark.svg'
import addPlusSVg from './../../../assets/add_plus.svg'

import useDate from '../../../zustand/currentDate'

import './sidebar_com_css/archives.css'

import useApi from '../../../zustand/api'

function AjouterPV() {
  const { api } = useApi()
  const { date } = useDate()

  const sanctions = [
    'Aucune sanction',
    'Avertissement verbal',
    'Avertissement écrit',
    'Blâme',
    'Exclusion pour un semestre ou une année',
    'Exclusion pour deux ans',
    'Exclusion définitive'
  ]
  const roles = ['Administrateur', 'Agent', 'Enseignant', 'Étudiant', 'autres...']

  const [dropSanction, setDropSanction] = useState(false)
  const [dropSanctionValue, setDropSanctionValue] = useState('')
  const [dropRole, setDropRole] = useState(false)
  const [dropRoleValue, setDropRoleValue] = useState('')

  const [rapports, setRapports] = useState()
  const [currentSelectedRapports, setCurrentSelectedRapports] = useState([])
  const [query, setQuery] = useState('')
  const [supprimer, setSupprimer] = useState(false)
  const [pv, setPv] = useState({ numCD: '', libeleS: '', temoin: '', numR: '', numC: '' })
  const [cd, setCd] = useState({ dateCd: '', id: '' })
  const [members, setMembers] = useState([])
  const [creerConseilState, setCreerConseildState] = useState(false)
  const [isAddingTemoin, setIsAddingTemoin] = useState(false)
  const [temoinBuffer, setTemoinBuffer] = useState({ nomT: '', prenomT: '', roleT: '' })
  const [temoinArray, setTemoinArray] = useState([])

  const [error, setError] = useState({ dateCdError: '' })
  const [pvError, setPvError] = useState({ sanctionError: '' })
  const [temoinsError, setTemoinsError] = useState({ nomError: '', prenomError: '', roleError: '' })

  const AjouterPVPage = useRef(null)

  async function fetchData() {
    addLoadingBar()
    const tache = await axios
      .get(api + '/rapport/get')
      .then((res) => {
        setRapports(res.data)
      })
      .catch((err) => console.log(err))
    RemoveLoadingBar()
  }

  useEffect(() => {
    fetchData()
  }, [])

  let loadingBar = document.createElement('div')
  loadingBar.classList.add('loadingBar')
  loadingBar.classList.add('loadingBarAni')

  function addLoadingBar() {
    AjouterPVPage.current.appendChild(loadingBar)
  }

  function RemoveLoadingBar() {
    loadingBar.remove()
  }

  let coverWindow = document.createElement('div')
  coverWindow.classList.add('fullBgBlock2')

  function addCover() {
    AjouterPVPage.current.appendChild(coverWindow)
  }

  function removeCover() {
    coverWindow.remove()
  }

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
  const filteredRapports = useMemo(() => {
    return Array.isArray(rapports)
      ? rapports.filter((rapport) => {
          return rapport.nom_e
            .toLowerCase()
            .concat(' ')
            .concat(rapport.prenom_e.toLowerCase())
            .includes(query.toLowerCase())
        })
      : ''
  }, [rapports, query])

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
  const tableRapport = Array.isArray(filteredRapports) ? (
    filteredRapports.map((rapport) => (
      <tr
        className={
          currentSelectedRapports.findIndex((el) => el == rapport) == -1
            ? 'border-y duration-150 ease-linear hover:bg-side-bar-white-theme-color dark:hover:bg-dark-gray'
            : 'border-y duration-150 ease-linear bg-blue/25'
        }
        onClick={() => {
          const found = currentSelectedRapports.findIndex((el) => el == rapport)
          if (found == -1) setCurrentSelectedRapports((prev) => [...prev, rapport])
          else {
            setCurrentSelectedRapports((prev) => prev.slice(0, found).concat(prev.slice(found + 1)))
          }
        }}
      >
        <td className="border-x">
          <span>{rapport.num_r}</span>
        </td>
        <td className="font-medium border-x">{[rapport.nom_e, ' ', rapport.prenom_e]}</td>
        <td className="border-x">{rapport.date_i.slice(0, rapport.date_i.indexOf('T'))}</td>
      </tr>
    ))
  ) : (
    <></>
  )

  const supprimerImage = (
    <svg
      width="18"
      height="24"
      viewBox="0 0 18 24"
      fill="none"
      className={
        currentSelectedRapports.length != 0
          ? '[&>path]:fill-red duration-100'
          : '[&>path]:fill-dark-gray/25 dark:[&>path]:fill-white/25 duration-100'
      }
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.25 20.75C1.25 21.413 1.51339 22.0489 1.98223 22.5178C2.45107 22.9866 3.08696 23.25 3.75 23.25H13.75C14.413 23.25 15.0489 22.9866 15.5178 22.5178C15.9866 22.0489 16.25 21.413 16.25 20.75V5.75H1.25V20.75ZM3.75 8.25H13.75V20.75H3.75V8.25ZM13.125 2L11.875 0.75H5.625L4.375 2H0V4.5H17.5V2H13.125Z" />
    </svg>
  )

  const enregistrerImage = (
    <svg
      className={
        currentSelectedRapports.length == 1
          ? '[&>path]:fill-blue duration-100'
          : '[&>path]:fill-dark-gray/25 dark:[&>path]:fill-white/25 duration-100'
      }
      width="23"
      height="24"
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 0.75H2.5C1.125 0.75 0 1.875 0 3.25V20.75C0 22.125 1.125 23.25 2.5 23.25H20C21.375 23.25 22.5 22.125 22.5 20.75V3.25C22.5 1.875 21.375 0.75 20 0.75ZM8.125 11.375C8.125 12.375 7.25 13.25 6.25 13.25H5V15.75H3.125V8.25H6.25C7.25 8.25 8.125 9.125 8.125 10.125V11.375ZM14.375 13.875C14.375 14.875 13.5 15.75 12.5 15.75H9.375V8.25H12.5C13.5 8.25 14.375 9.125 14.375 10.125V13.875ZM19.375 10.125H17.5V11.375H19.375V13.25H17.5V15.75H15.625V8.25H19.375V10.125ZM11.25 10.125H12.5V13.875H11.25V10.125ZM5 10.125H6.25V11.375H5V10.125Z" />
    </svg>
  )

  function handlePreview(numR) {
    return new Promise(async () => {
      console.log('forwarding print preview request...')
      console.log('numR', numR)
      addLoadingBar()
      let path = await window.electronAPI.getPath()
      const pdfToPreview = await axios
        .post(api + '/archive/printrapport', { numR: numR, path: path })
        .then((res) => {
          const result = window.electronAPI.getUrl()
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
          alert('Vérifier la connexion internet')
        })
      RemoveLoadingBar()
    })
  }

  const handleAnuuler = (e) => {
    e.preventDefault()
    setCd({ id: '', dateCd: '' })
    setCurrentSelectedRapports([])
    setMembers([])
  }

  const handleAjouter = async (e) => {
    e.preventDefault()
    let numpv
    const newErrors = validateFormPV(pv)
    if (Object.keys(newErrors).length === 0) {
      if (currentSelectedRapports.length == 1) {
        setMembers([])
      }
      setCurrentSelectedRapports(currentSelectedRapports.slice(1))
      e.preventDefault()
      addLoadingBar()
      addCover()
      const tache = await axios
        .post(api + '/pv/addPV', {
          numR: pv.numR,
          libeleS: pv.libeleS,
          numCD: pv.numCD,
          numC: pv.numC,
          temoin: temoinArray
        })
        .then(async (res) => {
          RemoveLoadingBar()
          removeCover()
          console.log(res)
          numpv = res.data.numpv
        })
        .catch((err) => {
          RemoveLoadingBar()
          removeCover()
          console.log(err)
          alert("Vérifier la connexion internet \n le pv n'a pas été creé")
        })

      setPv((prev) => ({ ...prev, libeleS: '', temoin: '', numR: '' }))
      setTemoinBuffer({ nomT: '', prenomT: '', roleT: '' })
      setTemoinArray([])
      if (currentSelectedRapports.length > 1) {
        setPv((prev) => ({ ...prev, numR: currentSelectedRapports[1].num_r }))
      }
      setCurrentSelectedRapports(currentSelectedRapports.slice(1))
      if (numpv) {
        for (const m of members) {
          console.log('email on top of the loop: ', m)
          const tache = await axios
            .post(api + '/archive/mail', {
              numPV: Number(numpv),
              email: m.email_m
            })
            .then((res) => console.log(res))
            .catch((err) => {
              console.log(err)
              alert("Vérifier la connexion internet \n mail n'a pas été envoyé")
            })
          console.log('result after trying to send an email:', tache)
        }
      } else {
        alert("Vérifier la connexion internet \n le pv n'a pas été creé")
      }

      const tache1 = await axios
        .get(api + '/rapport/get')
        .then((res) => {
          setRapports(res.data)
        })
        .catch((err) => console.log(err))
    }
    setTimeout(() => {
      setPvError({ sanctionError: '' })
    }, 2000)
  }

  async function handleSupprimer() {
    if (currentSelectedRapports.length != 0) {
      addLoadingBar()
      const result = await Promise.all(
        currentSelectedRapports.map(async (sr) => {
          const tache = await axios
            .delete(api + '/rapport/delete', { data: { numR: sr.num_r } })
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
        })
      )
      const tache1 = await axios
        .get(api + '/rapport/get')
        .then((res) => {
          setRapports(res.data)
          console.log(res.data)
        })
        .catch((err) => console.log(err))

      setCurrentSelectedRapports([])
      RemoveLoadingBar()

      setSupprimer(false)
    }
  }

  useEffect(() => {
    setTemoinBuffer((prevState) => ({
      ...prevState,
      roleT: dropRoleValue
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

  const validateFormCd = (data) => {
    let errors = {}
    const currentDate = new Date().toISOString().slice(0, 10)

    console.log('data: ', data)
    if (data.dateCd.length == 0) {
      errors.dateCd = 'date est vide!'
      setError((prev) => ({ ...prev, dateCdError: errors.dateCd }))
      return errors
    } else if (data.dateCd > currentDate) {
      errors.dateCd = "date doit etre inferieure a la date d'aujourd'hui!"
      setError((prev) => ({ ...prev, dateCdError: errors.dateCd }))
      return errors
    } else {
      setError((prev) => ({ ...prev, dateCdError: '' }))
    }
    return errors
  }

  const validateFormPV = (data) => {
    let errors = {}

    console.log('data: ', data)
    if (dropSanctionValue != '' && dropSanctionValue != 'autres...') {
      setPvError((prev) => ({ ...prev, sanctionError: '' }))
    } else {
      if (data.libeleS.length == 0) {
        errors.sanction = 'sanction est vide!'
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
    if (data.nomT.length == 0) {
      errors.nom = 'nom est vide!'
      setTemoinsError((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else {
      setTemoinsError((prev) => ({ ...prev, nomError: '' }))
    }
    if (data.prenomT.length == 0) {
      errors.prenom = 'prenom est vide!'
      setTemoinsError((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else {
      setTemoinsError((prev) => ({ ...prev, prenomError: '' }))
    }
    if (dropRoleValue != '' && dropRoleValue != 'autres...') {
      setTemoinsError((prev) => ({ ...prev, roleError: '' }))
    } else {
      if (data.roleT.length == 0) {
        errors.role = 'role est vide!'
        setTemoinsError((prev) => ({ ...prev, roleError: errors.role }))
        return errors
      } else {
        setTemoinsError((prev) => ({ ...prev, roleError: '' }))
      }
    }
    return errors
  }
  return (
    <div ref={AjouterPVPage} className="flex w-full h-full">
      {creerConseilState && (
        <div className="fullBgBlock">
          <form className="w-1/2 overflow-y-auto flex flex-col justify-between items-center rounded-xl bg-side-bar-white-theme-color dark:bg-dark-gray min-h-fit min-w-[500px]">
            <h1 className="text-[36px] py-4">Création d'un conseil de discipline</h1>
            <hr className="w-full text-dark-gray/50 dark:text-gray"></hr>
            <div className="flex w-5/6 flex-col gap-6 my-4">
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="dateCd"
                  onChange={async (e) => {
                    setCd((prev) => ({ ...prev, dateCd: e.target.value }))
                    addLoadingBar()
                    const tache = await axios
                      .post(api + '/pv/getActiveCommissionAndMembersByData', {
                        date: e.target.value
                      })
                      .then((res) => {
                        setMembers(res.data)
                        setPv((prev) => ({ ...prev, numC: res.data[0].num_c }))
                        console.log('members: ', res.data)
                      })
                      .catch((err) => console.log(err))
                    RemoveLoadingBar()
                  }}
                  value={cd.dateCd}
                  type="date"
                  max={date}
                  required
                ></input>
                {error.dateCdError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {error.dateCdError}
                  </p>
                )}
              </div>
              <div className="container_input_rapport">
                <h2>Membres présents au conseil</h2>
                <div className="w-full h-[20vh] overflow-auto flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
                  {members.map((p) => (
                    <div className="flex border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray">
                      <div className="w-5/12">{p.role_m}</div>
                      <div className="w-3/12">{p.nom_m}</div>
                      <div className={members.length > 5 ? 'w-3/12' : 'w-1/3'}>{p.prenom_m}</div>
                      {members.length > 0 && (
                        <button
                          className="flex justify-end w-1/12"
                          onClick={(e) => {
                            e.preventDefault()
                            setMembers(members.filter((item) => item !== p))
                          }}
                        >
                          <div className="bg-red flex justify-center items-center h-full aspect-square rounded-md text-white">
                            X
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between py-4 w-5/6">
              <button
                className="button_dossier text-red border-red hover:bg-red/25"
                onClick={(e) => {
                  e.preventDefault()
                  setCreerConseildState(false)
                  setMembers([])
                }}
              >
                Annuler
              </button>
              <button
                className="button_dossier text-blue border-blue hover:bg-blue/25"
                type="submit"
                onClick={async (e) => {
                  e.preventDefault()
                  const newErrors = validateFormCd(cd)
                  if (Object.keys(newErrors).length === 0) {
                    addLoadingBar()
                    const tache = await axios
                      .post(api + '/pv/addCD', {
                        dateCd: cd.dateCd,
                        idM: members.map((obj) => obj.id_m)
                      })
                      .then((res) => {
                        console.log(res)
                        setCd((prev) => ({ ...prev, id: res.data.id }))
                        setPv((prev) => ({
                          ...prev,
                          numCD: res.data.id,
                          numR: currentSelectedRapports[0].num_r
                        }))
                      })
                      .catch((err) => console.log(err))
                    RemoveLoadingBar()
                    setCreerConseildState(false)
                  }
                  setTimeout(() => {
                    setError({ dateCdError: '' })
                  }, 2000)
                }}
              >
                Créer
              </button>
            </div>
          </form>
        </div>
      )}
      {cd.id && currentSelectedRapports != 0 && (
        <div className="fullBgBlock">
          <form className="w-1/2 overflow-y-auto flex flex-col justify-between items-center rounded-xl bg-side-bar-white-theme-color dark:bg-dark-gray min-h-fit min-w-[500px]">
            <h1 className="text-[36px] py-4">
              Détails du PV de {currentSelectedRapports[0].nom_e}
            </h1>
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
                    value={dropSanctionValue == 'autres...' ? pv.libeleS : dropSanctionValue}
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
                  Décision
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
                  <div>Ajouter un temoin</div>
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
                        name="nomT"
                        id="nomT"
                        onChange={(e) => {
                          handleInputTemoinChange(e)
                        }}
                        value={temoinBuffer.nomT}
                        required
                      ></input>
                      <label className="label_rapport" htmlFor="nomT">
                        nom
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
                        name="prenomT"
                        id="prenomT"
                        onChange={(e) => {
                          handleInputTemoinChange(e)
                        }}
                        value={temoinBuffer.prenomT}
                        required
                      ></input>
                      <label className="label_rapport" htmlFor="prenomT">
                        Prenom
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
                          name="roleT"
                          id="roleT"
                          onChange={(e) => {
                            if (dropRoleValue == 'autres...') {
                              handleInputTemoinChange(e)
                            }
                          }}
                          value={dropRoleValue == 'autres...' ? temoinBuffer.roleT : dropRoleValue}
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
                      <label className="label_rapport_fix" htmlFor="roleT">
                        Role
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
                        setIsAddingTemoin(false)
                        setTemoinBuffer({ nomT: '', prenomT: '', roleT: '' })
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
                  <h2>les témoins</h2>
                  <div className="w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray">
                    {Array.isArray(temoinArray) &&
                      temoinArray.length != 0 &&
                      temoinArray.map((t) => (
                        <div className="flex justify-between *:w-1/3 border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray">
                          <div>{t.roleT}</div>
                          <div>{t.nomT}</div>
                          <div>{t.prenomT}</div>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              setTemoinArray(temoinArray.filter((item) => item !== t))
                            }}
                          >
                            {supprimerImage}
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
                onClick={handleAnuuler}
              >
                Annuler
              </button>
              <button
                className="button_dossier text-blue border-blue hover:bg-blue/25"
                type="submit"
                onClick={handleAjouter}
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      )}
      {(!cd.id || currentSelectedRapports.length == 0) && (
        <div className="flex flex-col w-full h-full">
          {supprimer && (
            <div className="fullBgBlock">
              <div className="flex flex-col justify-evenly text-xl items-center h-40 w-1/3 z-30 rounded-xl text-white dark:text-black bg-dark-gray dark:bg-white">
                Confirmer la suppression du PV
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
                    onClick={handleSupprimer}
                    className="flex justify-center items-center border rounded-xl text-blue py-2 px-4 bg-0.08-blue"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex w-full justify-between py-3 px-6">
            <div className="flex gap-6">
              <button
                className={
                  currentSelectedRapports.length != 0
                    ? 'flex border py-2 px-4 rounded-xl gap-2 border-blue text-blue bg-blue/25 duration-100'
                    : 'flex border py-2 px-4 rounded-xl gap-2 border-table-border-white-theme-color text-dark-gray/25 dark:text-white/25 dark:border-white/25 cursor-not-allowed'
                }
                onClick={() => {
                  if (currentSelectedRapports.length > 0) {
                    setCreerConseildState(true)
                  }
                }}
              >
                Créer un conseil
              </button>
              <button
                className={
                  currentSelectedRapports.length == 1
                    ? 'flex border py-2 px-4 rounded-xl gap-2 border-blue text-blue bg-blue/25 duration-100'
                    : 'flex border py-2 px-4 rounded-xl gap-2 border-table-border-white-theme-color text-dark-gray/25 dark:text-white/25 dark:border-white/25 cursor-not-allowed'
                }
                onClick={() => {
                  if (currentSelectedRapports.length == 1) {
                    handlePreview(currentSelectedRapports[0].num_r)
                  }
                }}
              >
                {enregistrerImage}
                PDF
              </button>
              <button
                className={
                  currentSelectedRapports.length != 0
                    ? 'flex border py-2 px-4 rounded-xl gap-2 bg-red/25 dark:bg-brown text-red duration-100'
                    : 'flex border py-2 px-4 rounded-xl gap-2 text-dark-gray/25 dark:text-white/25 duration-100 cursor-not-allowed'
                }
                onClick={() => {
                  if (currentSelectedRapports.length == 1) {
                    setSupprimer(true)
                  }
                }}
              >
                {supprimerImage}
                supprimer
              </button>
            </div>
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
                  <th className="w-1/3 border-x">
                    <div>N° Rapport</div>
                  </th>
                  <th className="w-1/3 border-x">
                    <div>Étudiant</div>
                  </th>
                  <th className="w-1/3 border-x">
                    <div>Date de l'infraction</div>
                  </th>
                </tr>
                {tableRapport}
                {/*{pathMainProcess && <div>Main Process Path: {pathMainProcess}</div>}
                {pathBackend && <div>Main process Path: {pathBackend}</div>}*/}
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AjouterPV
