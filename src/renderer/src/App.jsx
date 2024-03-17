import Flon from './components/Flon'
import "./index.css" 

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <h1 className="text-3xl font-bold underline text-blue">
      Hello world!
    </h1>
  )
}

export default App
