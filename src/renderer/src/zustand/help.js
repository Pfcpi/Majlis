import { create } from 'zustand'

const useHelp = create((set) => ({
  help: false,
  setHelp: () => set(() => ({ help: true })),
  ExitHelp: () => set(() => ({ help: false }))
}))

export default useHelp
