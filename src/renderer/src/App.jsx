import SideBar from './components/sideBar/SideBar.jsx'
import NavBar from './components/NavBar.jsx'
import authJPG from './assets/auth.jpg'
import USTOLogo from './assets/USTO-MB_logo2.svg'
import { useState } from 'react'

import './index.css'
//not completed
//zustand variable
function App() {
  const [auth, setAuth] = useState(false)
  const [account, setAccount] = useState('')
  return (
    <div>
      {!auth && (
        <div className="flex h-full w-full font-poppins text-[24px]">
          <img className="w-1/2 p-0 max-h-[100vh] object-cover" src={authJPG}></img>
          <div className="flex flex-col relative w-1/2 items-center justify-center gap-3 text-light-gray">
            <div className="absolute flex top-4 w-full justify-between items-center px-6">
              <img className="w-20 aspect-square" src={USTOLogo}></img>
              <p className='font-cutive w-36 text-center'>Conseil Descipline</p>
            </div>
            <h1 className="text-dark-gray text-[64px] font-bold">Se Connecter</h1>
            <p>Veulliez choisir une session</p>
            <button
              className="w-3/5 py-3 border rounded-[10px] hover:bg-blue/15"
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
              className="w-3/5 py-3 border rounded-[10px] hover:bg-blue/15"
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
            <button
              className="w-3/5 py-3 px-5 border rounded-[10px] outline-none bg-blue text-white"
              onClick={() => {
                setAuth(true)
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
