import SideBar from './components/sideBar/SideBar.jsx'
import NavBar from './components/NavBar.jsx'
import Display from './components/Display.jsx'

import './index.css'

function App() {
  return (
    <div className="flex h-screen w-screen relative">
      <SideBar></SideBar>
      <div className="flex flex-col h-full w-full relative">
        <NavBar></NavBar>
        <Display></Display>
      </div>
    </div>
  )
}

export default App
