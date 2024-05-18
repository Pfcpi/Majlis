import { create } from 'zustand'

const useRapport = create((set) => ({
  rapport: {
    matriculeE: '',
    nomE: '',
    prenomE: '',
    niveauE: '',
    groupeE: '',
    sectionE: null,
    nomP: '',
    prenomP: '',
    dateI: new Date().toISOString().slice(0, 19).replace('T', ' '),
    lieuI: '',
    motifI: '',
    descI: '',
    degreI: 1,
    numR: 0
  },
  setChef: () => set(() => ({ account: 'chef' })),
  setPresident: () => set(() => ({ account: 'president' })),
  emptyAccount: () => set(() => ({ account: '' }))
}))

export default useRapport
