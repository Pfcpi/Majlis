import { create } from 'zustand'

const useAuth = create((set) => ({
  auth: false,
  authentificate: () => set(() => ({ auth: true })),
  logOut: () => set(() => ({ auth: false }))
}))

export default useAuth
