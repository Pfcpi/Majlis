import { useState, useMemo, useEffect, useRef } from 'react'

import './sidebar_com_css/archives.css'

import useAccount from '../../../zustand/account'
import useDark from '../../../zustand/dark'
import useApi from '../../../zustand/api'

import BlueSearchSVG from './../../../assets/BlueSearch.svg'
import EnvoyerSVG from './../../../assets/Envoyer.svg'
import EnvoyerGraySVG from './../../../assets/BlueSvgs/EnvoyerGray.svg'
import WarningSVG from './../../../assets/warning.svg'
import axios from 'axios'

function Archive() {
  const roles = ['Président', 'Titulaire', 'Suppléant', 'Étudiant']
  const rep = [1, 4, 5, 1]

  const { account } = useAccount()
  const { dark } = useDark()
  const { api } = useApi()

  const [query, setQuery] = useState('')
  const [membres, setMembres] = useState([])
  const [currentModifiedMembres, setCurrentModifiedMembres] = useState([])

  const [renouvelerComMessage, setRenouvelerComMessage] = useState(false)
  const [deleteMembersMessage, setDeleteMembersMessage] = useState(false)
  const [addMemberMessage, setAddMemberMessage] = useState(false)
  const [modifyMemberMessage, setModifyMemberMessage] = useState(false)

  const [addMember, setAddMember] = useState(false)
  const [modifyMember, setModifyMember] = useState(false)
  const [dropRole, setDropRole] = useState(false)
  const [dropRoleValue, setDropRoleValue] = useState('')

  const [membreExiste, setMembreExiste] = useState(false)

  const [errors, setErrors] = useState({
    nomError: '',
    prenomError: '',
    emailError: '',
    roleError: ''
  })

  const dataFin = new Date().toISOString().slice(0, 10)

  const commissionPage = useRef(null)

  // edit a member information
  /* Body being in the format of :
  {
	  "roleM": string value,
    "nomM": string value,
    "prenomM": string value,
    "emailM": string value in the format of 'name@mail.x',
    "dateDebutM": date value in the format of 'YYYY-MM-DD',
    "idM": int value
  }
*/

  const [currentAddedMember, setCurrentAddedMember] = useState({
    roleM: '',
    nomM: '',
    prenomM: '',
    dateDebutM: new Date().toISOString().slice(0, 10),
    emailM: '',
    idM: 0
  })

  async function fetchData() {
    addLoadingBar()
    const tache = await axios
      .get(api + '/commission/get')
      .then((res) => {
        setMembres(res.data)
      })
      .catch((err) => console.log(err))
    RemoveLoadingBar()
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setDropRoleValue(currentAddedMember.roleM)
  }, [currentAddedMember.roleM])

  useEffect(() => {
    setCurrentAddedMember((prev) => ({ ...prev, roleM: dropRoleValue }))
  }, [dropRoleValue])

  let loadingBar = document.createElement('div')
  loadingBar.classList.add('loadingBar')
  loadingBar.classList.add('loadingBarAni')

  function addLoadingBar() {
    commissionPage.current.appendChild(loadingBar)
  }

  function RemoveLoadingBar() {
    loadingBar.remove()
  }

  const filteredMembres = useMemo(() => {
    return Array.isArray(membres)
      ? membres.filter((membres) => {
          return membres.nom_m
            .toLowerCase()
            .concat(' ')
            .concat(membres.prenom_m.toLowerCase())
            .includes(query.toLowerCase())
        })
      : ''
  }, [membres, query])

  const dropRoledownItems = (
    <div className="absolute w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
      {roles.filter(roleExistes).map((n) => (
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

  function roleExistes(role) {
    let matches = 0
    if (Array.isArray(membres)) {
      for (var i = 0; i < membres.length; i++) {
        if (membres[i].role_m == role) {
          matches++
        }
      }
      return matches < rep[roles.indexOf(role)]
    }
  }

  const ajouterImage = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={
        membres.length < 10
          ? '[&>*:last-child]:stroke-blue [&>*:first-child]:stroke-blue [&>*:nth-child(2)]:fill-blue duration-100'
          : '[&>*:last-child]:stroke-dark-gray/25 [&>*:first-child]:stroke-dark-gray/25 [&>*:nth-child(2)]:fill-dark-gray/25 dark:[&>*:last-child]:stroke-white/25 dark:[&>*:first-child]:stroke-white/25 dark:[&>*:nth-child(2)]:fill-white/25 duration-100'
      }
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13.327 15.076C12.889 15.026 12.445 15 12 15C10.08 15 8.19397 15.474 6.63097 16.373C5.06897 17.273 3.88097 18.57 3.33097 20.111C3.24979 20.3587 3.26856 20.6284 3.38328 20.8625C3.498 21.0966 3.69961 21.2766 3.94514 21.3642C4.19066 21.4519 4.4607 21.4401 4.69772 21.3316C4.93473 21.223 5.11997 21.0262 5.21397 20.783C5.57597 19.773 6.39698 18.816 7.62897 18.107C8.64297 17.523 9.86397 17.15 11.158 17.037C11.3226 16.5525 11.6083 16.1181 11.9879 15.7749C12.3674 15.4317 12.8284 15.1911 13.327 15.076Z"
      />
      <path d="M18 14V22M22 18H14" stroke-width="2.5" stroke-linecap="round" />
    </svg>
  )

  const supprimerImage = (
    <svg
      width="18"
      height="24"
      viewBox="0 0 18 24"
      fill="none"
      className={
        currentModifiedMembres.length != 0
          ? '[&>path]:fill-red duration-100'
          : '[&>path]:fill-dark-gray/25 dark:[&>path]:fill-white/25 duration-100'
      }
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.25 20.75C1.25 21.413 1.51339 22.0489 1.98223 22.5178C2.45107 22.9866 3.08696 23.25 3.75 23.25H13.75C14.413 23.25 15.0489 22.9866 15.5178 22.5178C15.9866 22.0489 16.25 21.413 16.25 20.75V5.75H1.25V20.75ZM3.75 8.25H13.75V20.75H3.75V8.25ZM13.125 2L11.875 0.75H5.625L4.375 2H0V4.5H17.5V2H13.125Z" />
    </svg>
  )

  const ModifierImage = (
    <svg
      width="19"
      height="20"
      viewBox="0 0 19 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={
        currentModifiedMembres.length == 1
          ? '[&>path]:stroke-blue duration-100'
          : '[&>path]:stroke-dark-gray/25 dark:[&>path]:stroke-white/25 duration-100'
      }
    >
      <path
        d="M4 5.5H3C2.46957 5.5 1.96086 5.71071 1.58579 6.08579C1.21071 6.46086 1 6.96957 1 7.5V16.5C1 17.0304 1.21071 17.5391 1.58579 17.9142C1.96086 18.2893 2.46957 18.5 3 18.5H12C12.5304 18.5 13.0391 18.2893 13.4142 17.9142C13.7893 17.5391 14 17.0304 14 16.5V15.5"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13 3.50011L16 6.50011M17.385 5.08511C17.7788 4.69126 18.0001 4.15709 18.0001 3.60011C18.0001 3.04312 17.7788 2.50895 17.385 2.11511C16.9912 1.72126 16.457 1.5 15.9 1.5C15.343 1.5 14.8088 1.72126 14.415 2.11511L6 10.5001V13.5001H9L17.385 5.08511Z"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )

  async function handleRemoveMembers() {
    console.log('currentModifiedMembres: ', currentModifiedMembres)
    if (currentModifiedMembres.length > 0) {
      currentModifiedMembres.map(async (m) => {
        const tache1 = await axios
          .patch(api + '/commission/remove', {
            dataFin: dataFin,
            idM: m.id_m
          })
          .catch((err) => console.log(err))
      })
      setCurrentModifiedMembres([])
      const tache2 = await axios
        .get(api + '/commission/get')
        .then((res) => setMembres(res.data))
        .catch((err) => console.log(err))
    }
  }

  const handleAnuuler = (e) => {
    e.preventDefault()
    setCurrentAddedMember({
      roleM: '',
      nomM: '',
      prenomM: '',
      dateDebutM: new Date().toISOString().slice(0, 19).replace('T', ' '),
      emailM: '',
      idM: 0
    })
    setErrors({ nomError: '', prenomError: '', emailError: '', roleError: '' })
    setDropRole(false)
    setAddMember(false)
    setModifyMember(false)
  }

  async function handleAddMember() {
    const tache1 = await axios
      .post(api + '/commission/add', currentAddedMember)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
    setAddMember(false)

    setCurrentModifiedMembres([])
    const tache2 = await axios
      .get(api + '/commission/get')
      .then((res) => setMembres(res.data))
      .catch((err) => console.log(err))

    setCurrentAddedMember({
      roleM: '',
      nomM: '',
      prenomM: '',
      dateDebutM: new Date().toISOString().slice(0, 19).replace('T', ' '),
      emailM: '',
      idM: 0
    })
  }

  async function handleModifyMember() {
    const tache1 = await axios
      .patch(api + '/commission/edit', currentAddedMember)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
    setModifyMember(false)

    setCurrentModifiedMembres([])
    const tache2 = await axios
      .get(api + '/commission/get')
      .then((res) => setMembres(res.data))
      .catch((err) => console.log(err))

    setCurrentAddedMember({
      roleM: '',
      nomM: '',
      prenomM: '',
      dateDebutM: new Date().toISOString().slice(0, 10),
      emailM: '',
      idM: 0
    })
  }

  async function handleAjouter(e) {
    e.preventDefault()
    const newErrors = validateForm(currentAddedMember)
    if (Object.keys(newErrors).length === 0) {
      if (addMember) {
        setAddMemberMessage(true)
      } else {
        setModifyMemberMessage(true)
      }
    }
    setTimeout(
      () => setErrors({ nomError: '', prenomError: '', emailError: '', roleError: '' }),
      2000
    )
  }

  async function handleModify() {
    if (currentModifiedMembres.length == 1) {
      setModifyMember(true)
      const mem = currentModifiedMembres[0]
      console.log(mem)
      setCurrentAddedMember({
        nomM: mem.nom_m,
        prenomM: mem.prenom_m,
        emailM: mem.email_m,
        roleM: mem.role_m,
        dateDebutM: mem.date_debut_m.substring(0, 10),
        idM: mem.id_m
      })
    }
  }

  const handleSendEmail = () => {
    if (currentModifiedMembres != 0) {
      currentModifiedMembres.map(async (m) => {
        const tache = await axios
          .post(api + '/commission/mail', { email: m.email_m })
          .then((res) => console.log(res))
          .catch((err) => console.log(err))
      })
      setCurrentModifiedMembres([])
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentAddedMember((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const validateForm = (data) => {
    let errors = {}
    if (data.nomM.length == 0) {
      errors.nom = 'nom est vide!'
      setErrors((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nomM.length < 3) {
      errors.nom = "Ce n'est pas valid"
      setErrors((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nomM.search(/^[a-zA-Z]*$/)) {
      errors.nom = "Uniquement les caractères (pas d'espace)"
      setErrors((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else {
      setErrors((prev) => ({ ...prev, nomError: '' }))
      membres.forEach((m) => {
        if (m.nom_m == data.nomM) {
          setMembreExiste(true)
        }
      })
    }
    if (data.prenomM.length == 0) {
      errors.prenom = 'Prenom est vide!'
      setErrors((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenomM.length < 3) {
      errors.prenom = "Ce n'est pas valid"
      setErrors((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenomM.search(/^[a-zA-Z\s]*$/)) {
      errors.prenom = 'Uniquement les caractères'
      setErrors((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else {
      setErrors((prev) => ({ ...prev, prenomError: '' }))
      membres.forEach((m) => {
        if (m.prenom_m == data.prenomM) {
          if (membreExiste) {
            setErrors((prev) => ({ ...prev, prenomError: 'ce membre existe déjà' }))
            return errors
          }
        }
      })
    }
    if (data.emailM.length == 0) {
      errors.email = 'email est vide!'
      setErrors((prev) => ({ ...prev, emailError: errors.email }))
      return errors
    } else if (data.emailM.search(/^[^\.\s][\w\-]+(\.[\w\-]+)*@([\w-]+\.)+[\w-]{2,}$/gm)) {
      errors.email = 'Format d’e-mail non valide'
      setErrors((prev) => ({ ...prev, emailError: errors.email }))
      return errors
    } else {
      setErrors((prev) => ({ ...prev, emailError: '' }))
    }
    if (data.roleM.length == 0) {
      errors.role = 'Role est vide!'
      setErrors((prev) => ({ ...prev, roleError: errors.role }))
      return errors
    } else {
      setErrors((prev) => ({ ...prev, roleError: '' }))
    }
    return errors
  }

  const membresTable = Array.isArray(filteredMembres)
    ? filteredMembres.map((m) => (
        <tr
          className={
            currentModifiedMembres.findIndex((el) => el == m) == -1
              ? 'border-y duration-150 ease-linear hover:bg-side-bar-white-theme-color dark:hover:bg-dark-gray'
              : 'border-y duration-150 ease-linear bg-blue/25'
          }
          onClick={(e) => {
            const found = currentModifiedMembres.findIndex((el) => el == m)
            if (found == -1) setCurrentModifiedMembres((prev) => [...prev, m])
            else {
              setCurrentModifiedMembres((prev) =>
                prev.slice(0, found).concat(prev.slice(found + 1))
              )
            }
          }}
        >
          <td className="border-x">
            <label htmlFor="choice"> {m.role_m}</label>
          </td>
          <td className="border-x font-semibold">{[m.nom_m, ' ', m.prenom_m]}</td>
          <td className="border-x">{m.email_m}</td>
          <td className="border-x">{m.date_debut_m.substring(0, 10)}</td>
        </tr>
      ))
    : ''

  return (
    <div
      ref={commissionPage}
      className="flex w-full h-full font-poppins flex-row-reverse justify-evenly"
    >
      {(renouvelerComMessage ||
        addMemberMessage ||
        modifyMemberMessage ||
        deleteMembersMessage) && (
        <div className="fullBgBlock">
          <div className="flex min-w-fit flex-col justify-evenly text-xl items-center h-40 w-1/3 z-30 rounded-xl text-white dark:text-black bg-dark-gray dark:bg-white">
            <p className="px-4">
              {renouvelerComMessage ? 'Confirmez-vous le renouvellement de la commission' : ''}
              {addMemberMessage ? "Confirmez-vous l'ajout de ce membre" : ''}
              {modifyMemberMessage ? 'Confirmez-vous la modification de ce membre' : ''}
              {deleteMembersMessage ? 'Confirmez-vous la suppression de ce membre' : ''}
            </p>
            <div className="flex w-full justify-between px-8">
              <button
                onClick={() => {
                  setAddMemberMessage(false)
                  setModifyMemberMessage(false)
                  setRenouvelerComMessage(false)
                  setDeleteMembersMessage(false)
                }}
                className="flex justify-center items-center border rounded-xl text-red py-2 px-4 bg-0.36-red"
              >
                Annuler
              </button>
              <button
                onClick={async (e) => {
                  e.preventDefault()
                  if (renouvelerComMessage) {
                    console.log('passed from renouvelycomMessage')
                    const tache1 = await axios
                      .patch(api + '/commission/archivecom')
                      .then((res) => console.log(res))
                      .then((err) => console.log(err))

                    setCurrentModifiedMembres([])
                    const tache2 = await axios
                      .get(api + '/commission/get')
                      .then((res) => setMembres(res.data))
                      .catch((err) => console.log(err))
                    setRenouvelerComMessage(false)
                  }
                  if (addMemberMessage) {
                    handleAddMember()
                    setAddMemberMessage(false)
                  }
                  if (modifyMemberMessage) {
                    handleModifyMember()
                    setModifyMemberMessage(false)
                  }
                  if (deleteMembersMessage) {
                    handleRemoveMembers()
                    setDeleteMembersMessage(false)
                  }
                }}
                className="flex justify-center items-center border rounded-xl text-blue py-2 px-4 bg-0.08-blue"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
      {(addMember || modifyMember) && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-blue/25 z-10">
          <form className="w-1/2 overflow-y-auto flex flex-col justify-between items-center rounded-xl bg-side-bar-white-theme-color dark:bg-dark-gray min-h-fit min-w-[500px]">
            <h1 className="text-[36px] py-4">
              {addMember ? 'Ajouter un membre' : 'Modifier ce membre'}
            </h1>
            <hr className="w-full text-dark-gray/50 dark:text-gray"></hr>
            <div className="flex w-5/6 flex-col gap-6 my-4">
              <div className="flex w-full gap-6 mt-4">
                <div className="container_input_rapport">
                  <input
                    className="input_dossier"
                    name="nomM"
                    id="nomM"
                    onChange={handleInputChange}
                    value={currentAddedMember.nomM}
                    required
                  ></input>
                  <label className="label_rapport" htmlFor="nomM">
                    Nom
                  </label>
                  {errors.nomError && (
                    <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                      <img height="16" width="16" src={WarningSVG}></img>
                      {errors.nomError}
                    </p>
                  )}
                </div>
                <div className="container_input_rapport">
                  <input
                    className="input_dossier"
                    name="prenomM"
                    id="prenomM"
                    onChange={handleInputChange}
                    value={currentAddedMember.prenomM}
                    required
                  ></input>
                  <label className="label_rapport" htmlFor="prenomM">
                    Prenom
                  </label>
                  {errors.prenomError && (
                    <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                      <img height="16" width="16" src={WarningSVG}></img>
                      {errors.prenomError}
                    </p>
                  )}
                </div>
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="emailM"
                  id="emailM"
                  onChange={handleInputChange}
                  value={currentAddedMember.emailM}
                  required
                ></input>
                <label className="label_rapport" htmlFor="emailM">
                  Email
                </label>
                {errors.emailError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {errors.emailError}
                  </p>
                )}
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="roleM"
                  id="roleM"
                  onChange={handleInputChange}
                  onClick={() => setDropRole(true)}
                  value={currentAddedMember.roleM}
                  required
                ></input>
                <label className="label_rapport" htmlFor="roleM">
                  Role
                </label>
                {errors.roleError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {errors.roleError}
                  </p>
                )}
                {dropRole && dropRoledownItems}
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="dateDebutM"
                  onChange={handleInputChange}
                  value={currentAddedMember.dateDebutM}
                  type="date"
                  required
                ></input>
              </div>
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
                onClick={(e) => {
                  handleAjouter(e)
                }}
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="flex flex-col w-full">
        <div className="flex px-[3vw] justify-between h-16 items-center rounded-tl-lg rounded-tr-lg border-t border-x border-table-border-white-theme-color dark:border-white/20 bg-side-bar-white-theme-color dark:bg-dark-gray">
          {account == 'chef' && (
            <>
              <button
                className={
                  'flex border mix-w-[130px] truncate max-h-12 py-2 px-4 rounded-xl gap-2 border-blue text-blue bg-blue/10 duration-100'
                }
                onClick={() => {
                  setRenouvelerComMessage(true)
                }}
              >
                Renouveler la commission
              </button>
              <div className="flex gap-0">
                <button
                  className={
                    membres.length < 10
                      ? 'button_active_blue rounded-r-none'
                      : 'button_inactive rounded-r-none'
                  }
                  onClick={() => {
                    if (membres.length < 10) {
                      setAddMember(true)
                    }
                  }}
                >
                  {ajouterImage}
                </button>
                <button
                  className={
                    currentModifiedMembres.length == 1
                      ? 'button_active_blue rounded-none'
                      : 'button_inactive rounded-none'
                  }
                  onClick={() => handleModify()}
                >
                  {ModifierImage}
                </button>
                <button
                  className={
                    currentModifiedMembres.length != 0
                      ? 'button_active_red rounded-l-none'
                      : 'button_inactive rounded-l-none'
                  }
                  onClick={() => setDeleteMembersMessage(true)}
                >
                  {supprimerImage}
                </button>
              </div>
            </>
          )}
          {account == 'president' && (
            <button
              onClick={handleSendEmail}
              className={
                currentModifiedMembres.length != 0
                  ? 'flex border py-2 px-4 rounded-xl gap-2 text-blue bg-blue/15 duration-100'
                  : 'flex border py-2 px-4 rounded-xl gap-2 text-dark-gray/25 dark:text-white/25 duration-100 cursor-not-allowed'
              }
            >
              <img src={dark ? EnvoyerSVG : EnvoyerGraySVG}></img>envoyer
            </button>
          )}
          <div className="searchDiv">
            <img className="imgp" src={BlueSearchSVG} alt="search icon"></img>
            <input
              className="searchInput"
              type="search"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              placeholder="Rechercher"
            ></input>
          </div>
        </div>
        <div className="w-full grow h-[50vh]">
          <div className="w-full h-full overflow-y-auto">
            <table className="w-full">
              <tr className="border-t">
                <th className="w-1/4 border-x">
                  <div>Titre</div>
                </th>
                <th className="w-1/4 border-x">
                  <div>Nom</div>
                </th>
                <th className="w-1/4 border-x">
                  <div>Email</div>
                </th>
                <th className="w-1/4 border-x">
                  <div>Date de début</div>
                </th>
              </tr>
              {membresTable}
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Archive
