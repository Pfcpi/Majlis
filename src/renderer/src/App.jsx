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

import './index.css'
import axios from 'axios'
import Lottie from 'lottie-web'
import { useLoaderData } from 'react-router-dom'

function App() {
  const { auth, authentificate } = useAuth()
  const { account, setChef, setPresident, emptyAccount } = useAccount()
  const { api } = useApi()
  const [ChangePassword, setChangePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [blurBg, setBlurBg] = useState(false)
  const [authState, setAuthState] = useState(false)
  const [isLoadingForAuth, setIsLoadingForAuth] = useState(false)
  const [Msg, setMsg] = useState('')

  //const api = 'http://localhost:3000'

  useEffect(() => {
    if (!auth) {
      emptyAccount()
      setPassword('')
      setMsg('')
    }
  }, [auth])

  useEffect(() => {
    setPassword('')
    setBlurBg(true)
    setTimeout(() => setBlurBg(false), 1000)
  }, [ChangePassword])

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
    console.log('isloadingforauth:', isLoadingForAuth)
    console.log('added')
  }

  function RemoveLoadingBar() {
    console.log(authPage.current.childNodes)
    loadingBar.remove()
    console.log('loadingBar:', loadingBar)
    console.log('isloadingforauth:', isLoadingForAuth)
    console.log('removed')
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

  function handleContinue() {
    if (account == '') {
      setMsg("Aucun compte n'a été sélectionné")
    } else if (password == '') {
      setMsg('Le mot de passe est vide')
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
              }, 5000)
            } else {
              setMsg('Mot de passe incorrect')
            }
          })
          .catch((err) => {
            RemoveLoadingBar()
            console.log(err)
          })
      } else {
        axios
          .patch(api + '/auth/cedit', { pass: password })
          .then((res) => {
            if (res.data == 'Password changed') {
              setChangePassword(false)
              setTimeout(
                () => setMsg(`Le mot de passe a été changé pour le chef de département`),
                500
              )
              setTimeout(() => setMsg(''), 3000)
            }
          })
          .catch((err) => {
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
            }
          })
          .catch((err) => {
            RemoveLoadingBar()
            console.log(err)
          })
      } else {
        axios
          .patch(api + '/auth/pedit', { pass: password })
          .then((res) => {
            if (res.data == 'Password changed') {
              setChangePassword(false)
              setTimeout(() => setMsg(`Le mot de passe a été changé pour le président`), 500)
              setTimeout(() => setMsg(''), 3000)
            }
          })
          .catch((err) => console.log(err))
      }
    }
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
                  {ChangePassword ? 'Changer mot de pass' : 'Se Connecter'}
                </h1>
                <p>Veulliez choisir une session</p>
              </div>
              <div className="flex flex-col w-full justify-center items-center gap-3">
                <button
                  className={account == 'chef' ? 'auth_btns text-blue border-blue' : 'auth_btns'}
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
                <input
                  className="w-3/5 py-3 px-5 border rounded-[10px] outline-none focus:border-blue border-auth-border-gray hover:bg-blue/15"
                  placeholder={ChangePassword ? 'nouveau mot de passe' : 'mot de passe'}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  value={password}
                  type="password"
                ></input>
                <button
                  className="relative w-3/5 py-3 px-5 border rounded-[10px] outline-none bg-blue text-white hover:opacity-80 overflow-hidden"
                  onClick={(e) => {
                    handleClick(e, '#fff')
                    handleContinue()
                  }}
                >
                  Continuer
                </button>
              </div>
              <button
                className={ChangePassword ? 'text-red' : 'text-blue'}
                onClick={() => {
                  setChangePassword((prev) => !prev)
                }}
              >
                {ChangePassword ? 'Annuler' : 'Changer le mot de passe'}
              </button>
              <p className="h-9 text-red">{Msg}</p>
            </div>
          </div>
        </div>
      )}
      {auth && (
        <div className="flex flex-col h-screen w-screen relative text-primary-white-theme-text-color dark:text-white">
          <NavBar></NavBar>
          <SideBar></SideBar>
        </div>
      )}
    </div>
  )
}

export default App
