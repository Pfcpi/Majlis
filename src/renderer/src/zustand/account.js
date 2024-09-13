import { create } from 'zustand'

const useAccount = create((set) => ({
  account: '',
  setChef: () => set(() => ({ account: 'chef' })),
  setPresident: () => set(() => ({ account: 'president' })),
  emptyAccount: () => set(() => ({ account: ''})),
}))

export default useAccount
