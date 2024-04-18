import SideBar from './components/sideBar/SideBar.jsx'
import NavBar from './components/NavBar.jsx'
import authJPG from './assets/auth.jpg'
import USTOLogo from './assets/USTO-MB_logo2.svg'
import useAuth from './zustand/auth.js'
import useAccount from './zustand/account.js'
import { useEffect, useState } from 'react'

import './index.css'
import axios from 'axios'
//not Completed
//Add ux(hover)
function App() {
  const { auth, authentificate } = useAuth()
  const { account, setChef, setPresident, emptyAccount } = useAccount()
  const [ChangePassword, setChangePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [blurBg, setBlurBg] = useState(false)
  const [Msg, setMsg] = useState('')

  const api = 'http://localhost:3000'

  useEffect(() => {
    emptyAccount()
    setPassword('')
    setMsg('')
  }, [auth])

  useEffect(() => {
    setPassword('')
    setBlurBg(true)
    setTimeout(() => setBlurBg(false), 1000)
  }, [ChangePassword])

  function handleClick(e, color) {
    let y = e.clientY - e.target.offsetTop
    let x = e.clientX - e.target.offsetLeft - screen.availWidth / 2

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
      setMsg('Aucun comple est selectionné')
    } else if (password == '') {
      setMsg('Mot de pass est vide')
    } else if (account == 'chef') {
      if (!ChangePassword) {
        axios
          .post(api + '/auth/chef', { pass: password })
          .then((res) => {
            console.log(res)
            if (res.data == 'Correct pass') {
              authentificate()
            } else {
              setMsg('Mot de passe incorrect')
            }
          })
          .catch((err) => console.log(err))
      } else {
        axios
          .patch(api + '/auth/cedit', { pass: password })
          .then((res) => {
            if (res.data == 'Password changed') {
              setChangePassword(false)
              setTimeout(() => setMsg(`Mot de pass a ete changer pour ${account}`), 500)
              setTimeout(() => setMsg(''), 3000)
            }
          })
          .catch((err) => console.log(err))
      }
    } else {
      if (!ChangePassword) {
        axios
          .post(api + '/auth/pres', { pass: password })
          .then((res) => {
            console.log(res)
            if (res.data == 'Correct pass') {
              authentificate()
            } else {
              setMsg('Mot de passe incorrect')
            }
          })
          .catch((err) => console.log(err))
      } else {
        axios
          .patch(api + '/auth/pedit', { pass: password })
          .then((res) => {
            if (res.data == 'Password changed') {
              setChangePassword(false)
              setTimeout(() => setMsg(`Mot de pass a ete changer pour ${account}`), 500)
              setTimeout(() => setMsg(''), 3000)
            }
          })
          .catch((err) => console.log(err))
      }
    }
  }

  return (
    <div>
      {!auth && (
        <div className="flex h-full w-full font-poppins text-[24px]">
          {blurBg && (
            <div className="absolute w-full h-full bg-[rgba(0,0,0,0.6)] top-0 left-0 z-20"></div>
          )}
          <img className="w-1/2 p-0 max-h-[100vh] object-cover" src={authJPG}></img>
          <div className="flex flex-col relative w-1/2 items-center justify-center gap-3 text-light-gray">
            <div className="absolute flex top-4 w-full justify-between items-center px-6">
              <img className="w-20 aspect-square" src={USTOLogo}></img>
              <p className="font-cutive w-36 text-center">Conseil Discipline</p>
            </div>
            <h1 className="text-dark-gray text-[3vw] font-bold">
              {ChangePassword ? 'Changer mot de pass' : 'Se Connecter'}
            </h1>
            <p>Veulliez choisir une session</p>
            <button
              className="relative w-3/5 py-3 border rounded-[10px] hover:bg-blue/15 overflow-hidden"
              onClick={(e) => {
                handleClick(e, "#2B81B8")
                setChef()
              }}
              style={{
                borderColor: account === 'chef' ? '#2B81B8' : '',
                color: account === 'chef' ? '#2B81B8' : ''
              }}
            >
              Chef département
            </button>
            <button
              className="relative w-3/5 py-3 border rounded-[10px] hover:bg-blue/15 overflow-hidden"
              onClick={(e) => {
                handleClick(e, "#2B81B8")
                setPresident()
              }}
              style={{
                borderColor: account === 'president' ? '#2B81B8' : '',
                color: account === 'president' ? '#2B81B8' : ''
              }}
            >
              Président du conseil
            </button>
            <input
              className="w-3/5 py-3 px-5 border rounded-[10px] outline-none focus:border-blue hover:bg-blue/15"
              placeholder={ChangePassword ? 'nouveau mot de pass' : 'mot de pass'}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              value={password}
              type="password"
            ></input>
            <hr className="bg-light-gray w-3/5"></hr>
            <button
              className="relative w-3/5 py-3 px-5 border rounded-[10px] outline-none bg-blue text-white hover:opacity-80 overflow-hidden"
              onClick={(e) => {
                handleClick(e, "#fff")
                handleContinue()
              }}
            >
              Continuer
            </button>
            {Msg && <p className="text-red">{Msg}</p>}
            <button
              className={ChangePassword ? 'text-red' : 'text-blue'}
              onClick={() => {
                setChangePassword((prev) => !prev)
              }}
            >
              {ChangePassword ? 'Annuler ' : 'Changer le mot de pass'}
            </button>
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
