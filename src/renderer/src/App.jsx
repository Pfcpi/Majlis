import SideBar from './components/sideBar/SideBar.jsx'
import NavBar from './components/NavBar.jsx'
import authJPG from './assets/auth.jpg'
import { useState, useRef } from 'react'

import './index.css'
//not completed
//password management, continue button, changing password.
function App() {
  const [auth, setAuth] = useState(false)
  const [account, setAccount] = useState('')
  const pass = useRef(null)
  return (
    <div>
      {!auth && (
        <div className="flex h-full w-full font-poppins text-[24px]">
          <img className="w-1/2 p-0 max-h-[100vh] object-cover" src={authJPG}></img>
          <div className="flex flex-col w-1/2 items-center justify-center gap-3 text-light-gray">
            <h1 className="text-dark-gray text-[64px] font-bold">Se Connecter</h1>
            <p>Veulliez choisir une session</p>
            <button
              className="w-3/5 py-3 border rounded-[10px]"
              onClick={() => {
                setAccount('chef')
              }}
              style={{
                borderColor: account === 'chef' ? '#2B81B8' : '',
                color: account === 'chef' ? '#2B81B8' : ''
              }}
            >
              Chef département
            </button>
            <button
              className="w-3/5 py-3 border rounded-[10px]"
              onClick={() => {
                setAccount('president')
              }}
              style={{
                borderColor: account === 'president' ? '#2B81B8' : '',
                color: account === 'president' ? '#2B81B8' : ''
              }}
            >
              Président du conseil
            </button>
            <hr className="bg-light-gray w-3/5"></hr>
            <input
              className="w-3/5 py-3 px-5 border rounded-[10px] outline-none bg-clear-blue placeholder:text-light-gray"
              type="password"
              placeholder="entrer votre mot de passe"
              ref={pass}
            ></input>
            <button
              className="w-3/5 py-3 px-5 border rounded-[10px] outline-none bg-blue text-white"
              onClick={() => {
                const input = pass.current
                if (input.value === 'password') {
                  setAuth(true)
                }
              }}
            >
              Continuer
            </button>
          </div>
        </div>
      )}
      {auth && (
        <div className="flex flex-col h-screen w-screen relative">
          <NavBar></NavBar>
          <SideBar></SideBar>
        </div>
      )}
    </div>
  )
}

export default App
