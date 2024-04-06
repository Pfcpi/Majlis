import { create } from 'zustand'

const useAccount = create((set) => ({
  account: '',
  setChef: () => set(() => ({ account: 'chef'})),
  setPresident: () => set(() => ({ account: 'president'}))
}))

export default useAccount

