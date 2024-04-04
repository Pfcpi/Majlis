import { create } from 'zustand'

const useDark = create((set) => ({
  dark: false,
  toggleTheme: () => set((state) => ({ dark: !state.dark})),
}))

export default useDark

