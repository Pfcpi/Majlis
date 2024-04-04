import { create } from 'zustand'

const useCliped = create((set) => ({
  cliped: false,
  setCliped: () => set((state) => ({ cliped: !state.cliped }))
}))

export default useCliped
