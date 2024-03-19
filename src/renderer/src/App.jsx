import SideBar from './components/sideBar/SideBar.jsx'
import NavBar from './components/NavBar.jsx'

import './index.css'

function App() {
  return (
    <div className="flex flex-col h-screen w-screen relative">
      <NavBar></NavBar>
      <SideBar></SideBar>
    </div>
  )
}

export default App
