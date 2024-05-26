import { create } from 'zustand'

let usedPort = await window.electronAPI.getPort()

const useApi = create((set) => ({
  api: 'http://localhost:'.concat(usedPort.toString()),
  //apiPDF: 'https://usto.madjria.com/'
  apiPDF: 'http://localhost:3000/'
}))

export default useApi
