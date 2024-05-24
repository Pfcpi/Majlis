import { create } from 'zustand'

let usedPort = await window.electronAPI.getPort()

const useApi = create((set) => ({
  api: 'http://localhost:'.concat(usedPort.toString()),
  apiPDF: 'http://localhost:3000/'
}))

export default useApi
