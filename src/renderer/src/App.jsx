//not Completed
//responsiveness when clicked animation
import SideBar from './components/sideBar/SideBar.jsx'
import NavBar from './components/NavBar.jsx'
import authJPG from './assets/usto.jpg'
import USTOLogo from './assets/USTO-MB_logo2.svg'
import applogo from '../../../build/icon.png'
import useAuth from './zustand/auth.js'
import useAccount from './zustand/account.js'
import { useEffect, useState, useRef } from 'react'
import useApi from './zustand/api.js'
import authAni from './assets/animations/authentication.json'
import useHelp from './zustand/help.js'
import arrowSVG from './assets/arrow.svg'
import useCliped from './zustand/cliped.js'
import ThreeDots from './assets/ThreeDots.svg'

import WarningSVG from './assets/warning.svg'

import './index.css'
import axios from 'axios'
import Lottie from 'lottie-web'

function App() {
  const { auth, authentificate } = useAuth()
  const { account, setChef, setPresident, emptyAccount } = useAccount()
  const { api } = useApi()
  const { cliped } = useCliped()
  const { help, setHelp, ExitHelp } = useHelp()
  const [ChangePassword, setChangePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [ancienPassword, setAncienPassword] = useState('')
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false)
  const [isDotting, setIsDotting] = useState(false)
  const [updatedInfo, setUpdatedInfo] = useState({ nom: '', prenom: '', email: '', oldPass: '' })
  const [blurBg, setBlurBg] = useState(false)
  const [step, setStep] = useState(0)
  const [authState, setAuthState] = useState(false)
  //modify this
  const [errors, setErrors] = useState({
    nomError: '',
    prenomError: '',
    emailError: ''
  })
  const [Msg, setMsg] = useState('')

  const dynamicHeight = [
    'top-[200px]',
    'top-[260px]',
    'top-[320px]',
    'top-[380px]',
    'top-[480px]',
    'top-[540px]'
  ]
  const guide = [
    'Consulter la liste des déclarations non traitées',
    'la commission et ses membres',
    `${account == 'chef' ? 'Ajouter un rapport' : 'Ajouter un Procès-Verbal'}`,
    "Voir l'archive des rapports, pvs, commissions et conseils",
    'Voir le réglement intérieur',
    'Une fois le travail terminé, vous pouvez vous déconnecter'
  ]
  const buttonRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && buttonRef.current) {
        buttonRef.current.click()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (!auth) {
      emptyAccount()
      setPassword('')
      setAncienPassword('')
      setUpdatedInfo({ nom: '', prenom: '', email: '', oldPass: '' })
      setMsg('')
    }
  }, [auth, ChangePassword, isUpdatingInfo])

  useEffect(() => {
    setPassword('')
    setBlurBg(true)
    setTimeout(() => setBlurBg(false), 1000)
  }, [ChangePassword, isUpdatingInfo])

  const container = useRef(null)

  useEffect(() => {
    if (authState == true) {
      Lottie.loadAnimation({
        container: container.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: authAni
      })
      Lottie.setSpeed(1.75)
    }
  }, [authState])

  const authPage = useRef(null)

  let loadingBar = document.createElement('div')
  loadingBar.classList.add('loadingBar')
  loadingBar.classList.add('loadingBarAni')

  function addLoadingBar() {
    authPage.current.appendChild(loadingBar)
  }

  function RemoveLoadingBar() {
    loadingBar.remove()
  }

  function handleClick(e, color) {
    let y = e.clientY - e.target.offsetTop
    let x = e.clientX - e.target.offsetLeft - window.innerWidth / 2

    let spread = document.createElement('div')
    spread.classList.add('spreadAni')
    spread.style.left = x + 'px'
    spread.style.top = y + 'px'
    spread.style.backgroundColor = color
    e.target.appendChild(spread)

    setTimeout(() => {
      spread.remove()
    }, 1000)
  }

  const helpHtml = (
    <div className="fullBgBlock">
      <img
        className={`w-10 h-10 absolute  ${cliped ? 'left-11' : 'left-32'} duration-100 ${dynamicHeight[step]}`}
        src={arrowSVG}
      ></img>
      <div
        className={`absolute flex flex-col top-48 ${cliped ? 'left-28' : 'left-64'} w-96 h-fit bg-white text-dark-gray shadow-md rounded-lg`}
      >
        <div className="w-full h-20 p-4 text-pretty">{guide[step]}</div>
        <div className="flex w-full justify-between p-4">
          <button
            onClick={() => {
              ExitHelp()
              setStep(0)
            }}
            className="buttonHelp"
          >
            Ok
          </button>
          <button
            onClick={() => {
              if (step >= 5) {
                ExitHelp()
                setStep(0)
              } else {
                setStep((prev) => prev + 1)
              }
            }}
            className="buttonHelp"
          >
            {step == 5 ? 'Terminer' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  )

  function handleInfoChange(e) {
    const { name, value } = e.target
    setUpdatedInfo((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  function handleContinue() {
    if (isUpdatingInfo) {
      const newErrors = validateForm(updatedInfo)
      console.log('newErrors:', newErrors)
      console.log('errors', errors)
      if (Object.keys(newErrors).length === 0) {
        addLoadingBar()
        axios
          .post(api + '/auth/chef', { pass: updatedInfo.oldPass })
          .then((res) => {
            if (res.data == 'Correct pass') {
              axios
                .patch(api + '/auth/chefupdate', updatedInfo)
                .then((res) => {
                  if (res.status < 300 && res.status >= 200) {
                    setTimeout(() => setMsg('Les information ont été changés'), 500)
                    setTimeout(() => setMsg(''), 2500)
                    setIsUpdatingInfo(false)
                  }
                  RemoveLoadingBar()
                })
                .catch((err) => {
                  console.log(err)
                  RemoveLoadingBar()
                  setTimeout(() => setMsg('Vérifier la connection internet'), 500)
                  setTimeout(() => setMsg(''), 2500)
                })
            } else {
              setMsg('Mot de passe incorrect')
              RemoveLoadingBar()
              setTimeout(() => setMsg(''), 2500)
            }
          })
          .catch((err) => {
            RemoveLoadingBar()
            setTimeout(() => setMsg('Vérifier la connection internet'), 500)
            setTimeout(() => setMsg(''), 2500)
            console.log(err)
          })
      }
      setTimeout(() => {
        setErrors({
          nomError: '',
          prenomError: '',
          emailError: ''
        })
      }, 2000)
    } else {
      if (account == '') {
        setMsg("Aucun compte n'a été sélectionné")
        setTimeout(() => setMsg(''), 2500)
      } else if (password == '') {
        setMsg('Le mot de passe est vide')
        setTimeout(() => setMsg(''), 2500)
      } else if (account == 'chef') {
        if (!ChangePassword) {
          addLoadingBar()
          axios
            .post(api + '/auth/chef', { pass: password })
            .then((res) => {
              RemoveLoadingBar()
              if (res.data == 'Correct pass') {
                setAuthState(true)
                setTimeout(() => {
                  setAuthState(false)
                  authentificate()
                }, 4000)
              } else {
                setMsg('Mot de passe incorrect')
                setTimeout(() => setMsg(''), 2500)
              }
            })
            .catch((err) => {
              RemoveLoadingBar()
              setTimeout(() => setMsg('Vérifier la connection internet'), 500)
              setTimeout(() => setMsg(''), 2500)
              console.log(err)
            })
        } else {
          addLoadingBar()
          axios
            .patch(api + '/auth/cedit', { oldPass: ancienPassword, newPass: password })
            .then((res) => {
              RemoveLoadingBar()
              if (res.data == 'Password changed') {
                setChangePassword(false)
                setTimeout(
                  () => setMsg(`Le mot de passe a été changé pour le chef de département`),
                  500
                )
                setTimeout(() => setMsg(''), 2500)
              } else {
                setTimeout(() => setMsg(`L'ancien mot de passe est faux`), 500)
                setTimeout(() => setMsg(''), 2500)
              }
            })
            .catch((err) => {
              RemoveLoadingBar()
              setMsg('Vérifier la connection internet')
              setTimeout(() => setMsg(''), 2500)
              console.log(err)
            })
        }
      } else {
        if (!ChangePassword) {
          addLoadingBar()
          axios
            .post(api + '/auth/pres', { pass: password })
            .then((res) => {
              RemoveLoadingBar()
              if (res.data == 'Correct pass') {
                setAuthState(true)
                setTimeout(() => {
                  setAuthState(false)
                  authentificate()
                }, 5000)
              } else {
                setMsg('Mot de passe incorrect')
                setTimeout(() => setMsg(''), 2500)
              }
            })
            .catch((err) => {
              RemoveLoadingBar()
              setTimeout(() => setMsg('Vérifier la connection internet'), 500)
              setTimeout(() => setMsg(''), 2500)
              console.log(err)
            })
        } else {
          addLoadingBar()
          axios
            .patch(api + '/auth/pedit', { oldPass: ancienPassword, newPass: password })
            .then((res) => {
              RemoveLoadingBar()
              if (res.data == 'Password changed') {
                setChangePassword(false)

                setTimeout(() => setMsg(`Le mot de passe a été changé pour le président`), 500)
                setTimeout(() => setMsg(''), 2500)
              } else {
                setTimeout(() => setMsg(`L'ancien mot de passe est faux`), 500)
                setTimeout(() => setMsg(''), 2500)
              }
            })
            .catch((err) => {
              console.log(err)

              setTimeout(() => setMsg('Vérifier la connection internet'), 500)
              setTimeout(() => setMsg(''), 2500)
            })
        }
      }
    }
  }

  const validateForm = (data) => {
    let errors = {}
    if (data.nom.length == 0) {
      errors.nom = 'nom est vide!'
      setErrors((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nom.length < 3) {
      errors.nom = "Ce n'est pas valid"
      setErrors((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nom.search(/^[a-zA-Z]*$/)) {
      errors.nom = "Uniquement les caractères (pas d'espace)"
      setErrors((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else {
      setErrors((prev) => ({ ...prev, nomError: '' }))
    }
    if (data.prenom.length == 0) {
      errors.prenom = 'Prenom est vide!'
      setErrors((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenom.length < 3) {
      errors.prenom = "Ce n'est pas valid"
      setErrors((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenom.search(/^[a-zA-Z\s]*$/)) {
      errors.prenom = 'Uniquement les caractères'
      setErrors((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else {
      setErrors((prev) => ({ ...prev, prenomError: '' }))
    }
    if (data.email.length == 0) {
      errors.email = 'email est vide!'
      setErrors((prev) => ({ ...prev, emailError: errors.email }))
      return errors
    } else if (data.email.search(/^[^\.\s][\w\-]+(\.[\w\-]+)*@([\w-]+\.)+[\w-]{2,}$/gm)) {
      errors.email = 'Format d’e-mail non valide'
      setErrors((prev) => ({ ...prev, emailError: errors.email }))
      return errors
    } else {
      setErrors((prev) => ({ ...prev, emailError: '' }))
    }
    return errors
  }

  return (
    <div ref={authPage} className="w-full h-full p-0 m-0">
      {!auth && (
        <div className="flex h-full w-full font-poppins text-[24px]">
          {blurBg && <div className="fullBgBlock"></div>}
          {authState && (
            <div className="fullBgBlock flex justify-center items-center ">
              <div ref={container} className="w-1/5"></div>
            </div>
          )}
          <img className="w-1/2 p-0 h-[100vh] object-cover" src={authJPG}></img>
          <div className="flex flex-col relative w-1/2 items-center justify-center gap-6 text-light-gray">
            <div className="absolute flex top-4 w-full justify-between items-center px-6">
              <img className="w-20 aspect-square" src={USTOLogo}></img>
              <img className="w-20 aspect-square rounded-[10px]" src={applogo}></img>
            </div>
            <div className="flex flex-col w-full items-center justify-center gap-6">
              <div className="flex flex-col">
                <h1 className="text-dark-gray text-[3vw] font-bold text-center">
                  {isUpdatingInfo
                    ? 'Mise à jour'
                    : ChangePassword
                      ? 'Changer mot de pass'
                      : 'Se Connecter'}
                </h1>
                <p className="h-8 text-center">
                  {isUpdatingInfo
                    ? 'Saisir les nouvelles informations du chef de département'
                    : 'Veulliez choisir une session'}
                </p>
              </div>
              <div className="flex flex-col w-full justify-center items-center gap-3">
                {!isUpdatingInfo && (
                  <>
                    <button
                      className={
                        account == 'chef' ? 'auth_btns text-blue border-blue' : 'auth_btns'
                      }
                      onClick={(e) => {
                        handleClick(e, '#2EA7F4')
                        setChef()
                      }}
                    >
                      Chef de département
                    </button>
                    <button
                      className={
                        account == 'president' ? 'auth_btns text-blue border-blue' : 'auth_btns'
                      }
                      onClick={(e) => {
                        handleClick(e, '#2EA7F4')
                        setPresident()
                      }}
                    >
                      Président du conseil
                    </button>
                  </>
                )}
                {isUpdatingInfo && (
                  <div className="w-full *:w-3/5 flex flex-col justify-center items-center gap-3">
                    {' '}
                    <div className="flex *:w-1/2 justify-center items-center gap-3">
                      <div className="container_input_rapport">
                        <input
                          className="input_dossier"
                          name="nom"
                          id="nom"
                          value={updatedInfo.nom}
                          onChange={(e) => {
                            handleInfoChange(e)
                          }}
                          required
                        ></input>
                        <label className="label_rapport" htmlFor="nom">
                          Nom
                        </label>
                        {errors.nomError && (
                          <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                            <img height="16" width="16" src={WarningSVG}></img>
                            {errors.nomError}
                          </p>
                        )}
                      </div>{' '}
                      <div className="container_input_rapport">
                        <input
                          className="input_dossier"
                          name="prenom"
                          id="prenom"
                          value={updatedInfo.prenom}
                          onChange={(e) => {
                            handleInfoChange(e)
                          }}
                          required
                        ></input>
                        <label className="label_rapport" htmlFor="prenom">
                          Prénom
                        </label>
                        {errors.prenomError && (
                          <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                            <img height="16" width="16" src={WarningSVG}></img>
                            {errors.prenomError}
                          </p>
                        )}
                      </div>
                    </div>{' '}
                    <div className="container_input_rapport">
                      <input
                        className="input_dossier"
                        name="email"
                        id="email"
                        value={updatedInfo.email}
                        onChange={(e) => {
                          handleInfoChange(e)
                        }}
                        required
                      ></input>
                      <label className="label_rapport" htmlFor="email">
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
                        name="oldPass"
                        id="oldPass"
                        value={updatedInfo.oldPass}
                        onChange={(e) => {
                          handleInfoChange(e)
                        }}
                        type="password"
                        required
                      ></input>
                      <label className="label_rapport" htmlFor="oldPass">
                        Mot de Passe
                      </label>
                    </div>
                  </div>
                )}
                {!isUpdatingInfo && (
                  <div
                    className={`flex w-3/5 justify-center items-center gap-3 ${ChangePassword ? '*:w-1/2' : '*:w-full'}`}
                  >
                    <input
                      className="py-3 px-5 border rounded-[10px] outline-none focus:border-blue border-auth-border-gray hover:bg-blue/15"
                      placeholder={ChangePassword ? 'Nouveau' : 'Mot de passe'}
                      onChange={(e) => {
                        setPassword(e.target.value)
                      }}
                      value={password}
                      type="password"
                    ></input>
                    {ChangePassword && (
                      <input
                        className="py-3 px-5 border rounded-[10px] outline-none focus:border-blue border-auth-border-gray hover:bg-blue/15"
                        placeholder="Ancien"
                        onChange={(e) => {
                          setAncienPassword(e.target.value)
                        }}
                        value={ancienPassword}
                        type="password"
                      ></input>
                    )}
                  </div>
                )}
                <button
                  ref={buttonRef}
                  className="relative w-3/5 py-3 px-5 border rounded-[10px] outline-none bg-blue text-white hover:opacity-80 overflow-hidden"
                  onClick={(e) => {
                    handleClick(e, '#fff')
                    handleContinue()
                  }}
                >
                  Continuer
                </button>
              </div>
              <div className="flex w-3/5 justify-between items-center h-20 gap-3">
                {!isUpdatingInfo && !isDotting && (
                  <button
                    className={ChangePassword ? 'text-red' : 'text-blue'}
                    onClick={() => {
                      setChangePassword((prev) => !prev)
                    }}
                  >
                    {ChangePassword ? 'Annuler' : 'Changer le mot de passe'}
                  </button>
                )}
                {!ChangePassword && !isUpdatingInfo && !isDotting && (
                  <>
                    <button
                      onClick={() => {
                        setIsDotting(true)
                      }}
                      className="h-10 aspect-square flex justify-center items-center rounded-full"
                    >
                      <img className="h-5 aspect-square" src={ThreeDots}></img>
                    </button>
                  </>
                )}
                {isDotting && (
                  <div className="flex flex-col items-start gap-2 h-20 bg-white">
                    <button
                      className={isUpdatingInfo ? 'text-red' : 'text-blue'}
                      onClick={() => {
                        if (!isUpdatingInfo) {
                          setIsUpdatingInfo(true)
                        } else {
                          setIsUpdatingInfo(false)
                          setIsDotting(false)
                        }
                      }}
                    >
                      {isUpdatingInfo ? 'Annuler' : ' Modifier les informations'}
                    </button>
                    {!isUpdatingInfo && (
                      <button
                        className="text-blue"
                        onClick={async () => {
                          setIsDotting(false)
                          if (account == '') {
                            setMsg("Aucun compte n'a été sélectionné")
                            setTimeout(() => setMsg(''), 2500)
                          } else {
                            addLoadingBar()
                            if (account == 'chef') {
                              axios
                                .get(api + '/auth/cmail')
                                .then((res) => {
                                  RemoveLoadingBar()
                                  console.log(res)
                                  setTimeout(
                                    () =>
                                      setMsg(
                                        'Vérifier ta boite email pour consulter le nouveau mot de passe'
                                      ),
                                    500
                                  )
                                  setTimeout(() => setMsg(''), 2500)
                                })
                                .catch((err) => {
                                  console.log(err)
                                  RemoveLoadingBar()
                                  setTimeout(() => setMsg('Vérifier la connection internet'), 500)
                                  setTimeout(() => setMsg(''), 2500)
                                })
                            } else {
                              axios
                                .get(api + '/auth/pmail')
                                .then((res) => {
                                  console.log(res)
                                  RemoveLoadingBar()
                                  setTimeout(
                                    () =>
                                      setMsg(
                                        'Vérifier ta boite email pour consulter le nouveau mot de passe'
                                      ),
                                    500
                                  )
                                  setTimeout(() => setMsg(''), 2500)
                                })
                                .catch((err) => {
                                  console.log(err)
                                  RemoveLoadingBar()
                                  setTimeout(() => setMsg('Vérifier la connection internet'), 500)
                                  setTimeout(() => setMsg(''), 2500)
                                })
                            }
                          }
                        }}
                      >
                        Mot de passe oublié?
                      </button>
                    )}
                  </div>
                )}
                {isDotting && !isUpdatingInfo && !ChangePassword && (
                  <button
                    onClick={() => {
                      setIsDotting(false)
                    }}
                    className="h-8 aspect-square bg-red rounded-md text-white flex items-center justify-center"
                  >
                    X
                  </button>
                )}
              </div>
              <p className="h-9 w-3/5 text-red text-center">{Msg}</p>
            </div>
          </div>
        </div>
      )}
      {auth && (
        <div className="flex flex-col h-screen w-screen relative text-primary-white-theme-text-color dark:text-white">
          {help && helpHtml}
          <NavBar></NavBar>
          <SideBar></SideBar>
        </div>
      )}
    </div>
  )
}

export default App
