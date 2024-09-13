import { create } from 'zustand'

const useDate = create((set) => ({
  date: new Date().toISOString().split('T')[0]
}))

export default useDate
