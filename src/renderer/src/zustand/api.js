import { create } from 'zustand'

let usedPort = await window.electronAPI.getPort()

const useApi = create((set) => ({
  api: 'http://localhost:'.concat(usedPort.toString())
}))

export default useApi
