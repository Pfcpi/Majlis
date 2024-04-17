import { useState, useRef } from 'react'
import './sidebar_com_css/ajouterRapport.css'
import axios from 'axios'

//Tasks:
//Remove matriculeP
//return button

function AjouterRapport() {
  const [step, setStep] = useState(1)
  const ref = useRef(null)
  // Add a rapport
  /* Body being in the format of :
  {
	 "matriculeE": big int value,
   "nomE": string value,
   "prenomE": string value,
   "niveauE": string value,
   "groupeE": int value,
   "sectionE": int value or null,
   "matriculeP": big int value,
   "nomP": string value,
   "prenomP": string value,
   "dateI": string value in the format of 'YYYY-MM-DD',
   "lieuI": string value,
   "motifI": string value,
   "descI": string value,
   "degreI": int value (1 or 2)
  }
*/
  const [rapport, setRapport] = useState({
    matriculeE: 0,
    nomE: '',
    prenomE: '',
    niveauE: '',
    groupeE: 0,
    sectionE: null,
    matriculeP: 0,
    nomP: '',
    prenomP: '',
    dateI: new Date().toISOString().slice(0, 19).replace('T', ' '),
    lieuI: '',
    motifI: '',
    descI: '',
    degreI: ''
  })
  const handleInputChange = (e) => {
    const { name, value } = e.target
      setRapport((prevState) => ({
        ...prevState,
        [name]: value
      }))
  }
  const api = 'http://localhost:3000'

  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-6">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="flex w-5/6 h-2 stretch-0 bg-[#D9D9D9] justify-evenly items-center [&>div]: [&>div]:h-8 [&>div]:aspect-square [&>div]:flex [&>div]:justify-center [&>div]:items-center [&>div]:rounded-full [&>div]:z-10">
          <div className={step >= 2 ? 'bg-blue text-white' : 'text-blue bg-[#D9D9D9]'}>1</div>
          <div className={step >= 3 ? 'bg-blue text-white' : 'text-blue bg-[#D9D9D9]'}>2</div>
          <div className={step >= 4 ? 'bg-blue text-white' : 'text-blue bg-[#D9D9D9]'}>3</div>
        </div>
        <div className="w-5/6 h-2 mt-[-8px] flex items-center">
          <div className={step >= 1 ? 'w-1/4 bg-blue h-2' : ''}></div>
          <div className={step >= 2 ? 'w-1/4 bg-blue h-2' : ''}></div>
          <div className={step >= 3 ? 'w-1/4 bg-blue h-2' : ''}></div>
          <div className={step >= 4 ? 'w-1/4 bg-blue h-2' : ''}></div>
        </div>
      </div>
      {step === 4 && (
        <div className="absolute w-full h-full bg-[rgba(0,0,0,0.6)] top-0 left-0 z-20"></div>
      )}
      {step === 4 && (
        <div className="absolute flex flex-col justify-evenly text-xl items-center h-40 w-1/3 z-30 rounded-xl text-white dark:text-black bg-dark-gray dark:bg-white">
          Confirmer la création du rapport
          <div className="flex w-full justify-between px-8">
            <button
              onClick={() => {
                setStep(1)
              }}
              className="flex justify-center items-center border rounded-xl text-red py-2 px-4 bg-0.36-red"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                setStep(1)
                axios
                  .post(api + '/rapport/add', rapport)
                  .then((res) => console.log(res))
                  .catch((err) => console.log(err))
              }}
              className="flex justify-center items-center border rounded-xl text-blue py-2 px-4 bg-0.08-blue"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}
      <form className="overflow-y-auto flex flex-col justify-center items-center rounded-xl bg-side-bar-white-theme-color dark:bg-dark-gray w-1/2 max-h-[84vh] min-w-[500px] ">
        <h1 className="text-[36px] py-4">Detail du rapport</h1>
        <hr className="w-full dark:text-gray"></hr>
        {step == 1 && (
          <div className="flex flex-col w-5/6 my-2">
            <label className="label_dossier">Etudiant</label>
            <div className="flex flex-col w-full gap-6 mb-4">
              <input
                className="input_dossier"
                placeholder="Matricule"
                name="matriculeE"
                onChange={handleInputChange}
                required
              ></input>
              <input
                className="input_dossier"
                placeholder="Nom"
                name="nomE"
                onChange={handleInputChange}
                required
              ></input>
              <input
                className="input_dossier"
                placeholder="Prenom"
                name="prenomE"
                onChange={handleInputChange}
                required
              ></input>
              <input
                className="input_dossier"
                placeholder="Niveau"
                name="niveauE"
                onChange={handleInputChange}
                required
              ></input>
              <input
                className="input_dossier"
                placeholder="Groupe"
                name="groupeE"
                onChange={handleInputChange}
                required
              ></input>
              <input
                className="input_dossier"
                placeholder="Section"
                name="sectionE"
                onChange={handleInputChange}
                required
              ></input>
            </div>
          </div>
        )}
        {step == 2 && (
          <div className="flex flex-col w-5/6 my-2">
            <label className="label_dossier">Plaignant</label>
            <div className="flex flex-col w-full gap-6 mb-4">
              <input
                className="input_dossier"
                placeholder="Matricule"
                name="matriculeP"
                onChange={handleInputChange}
                required
              ></input>
              <input
                className="input_dossier"
                placeholder="Nom"
                name="nomP"
                onChange={handleInputChange}
                required
              ></input>
              <input
                className="input_dossier"
                placeholder="Prenom"
                name="prenomP"
                onChange={handleInputChange}
                required
              ></input>
            </div>
          </div>
        )}
        {step == 3 && (
          <div className="flex flex-col w-5/6 my-2">
            <label className="label_dossier">Informations globales</label>
            <div className="flex flex-col w-full gap-6 mb-4">
              <input
                className="input_dossier"
                placeholder="Date de l'infraction"
                name="dateI"
                type="date"
                onChange={handleInputChange}
                required
              ></input>
              <input
                className="input_dossier"
                placeholder="lieu"
                name="lieuI"
                onChange={handleInputChange}
                required
              ></input>
              <input
                className="input_dossier"
                placeholder="Motif"
                name="motifI"
                onChange={handleInputChange}
                required
              ></input>
              <textarea
                className="input_dossier resize-none"
                placeholder="Description"
                name="descI"
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
          </div>
        )}
        <hr className="w-full dark:text-gray"></hr>
        <div className="flex justify-between w-5/6 py-6">
          <button className="button_dossier text-red min-w-fit" type="reset">
            Annuler
          </button>
          <button
            className="button_dossier text-blue min-w-fit"
            type="submit"
            onClick={(e) => {
              if (step > 2) {
                e.preventDefault()
                console.log('rapport a ajouter:', rapport)
              }
              setStep((prev) => prev + 1)
            }}
          >
            {step > 2 ? 'finish' : 'continue'}
          </button>
        </div>
      </form>
    </div>
  )
}
export default AjouterRapport
