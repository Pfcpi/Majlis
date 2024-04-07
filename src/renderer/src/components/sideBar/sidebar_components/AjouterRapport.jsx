import { useState, useRef } from 'react'
import { ReactDOM } from 'react-dom'
import './sidebar_com_css/ajouterRapport.css'

function AjouterRapport() {
  const [step, setStep] = useState(1)
  const ref = useRef(null)

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
      {step == 4 && (
        <div className="absolute w-full h-full bg-[rgba(0,0,0,0.4)] top-0 left-0 z-20"></div>
      )}
      {step == 4 && (
        <div ref={ref} className="absolute flex flex-col justify-evenly text-xl items-center h-40 w-1/3 z-30 text-white dark:text-black bg-dark-gray dark:bg-white">
          Confirmer la création du rapport
          <div className='flex w-full justify-between px-8'>
          <button className='flex justify-center items-center border rounded-xl text-red py-2 px-4 bg-0.36-red'>Annuler</button>
          <button onClick={() => setStep(prev => prev + 1)} className='flex justify-center items-center border rounded-xl text-blue py-2 px-4 bg-0.08-blue'>Ajouter</button>
          </div>
        </div>
      )}
      <form className="flex flex-col justify-center items-center rounded-xl bg-side-bar-white-theme-color dark:bg-dark-gray w-1/2">
        <h1 className="text-[36px] py-4">Detail du rapport</h1>
        <hr className="w-full dark:text-gray"></hr>
        {step == 1 && (
          <div className="flex flex-col w-5/6 my-2">
            <lable className="label_dossier">Etudiant</lable>
            <div className="flex flex-col w-full gap-6 mb-4">
              <input className="input_dossier" placeholder="Matricule" required></input>
              <input className="input_dossier" placeholder="Nom" required></input>
              <input className="input_dossier" placeholder="Prenom" required></input>
              <input className="input_dossier" placeholder="Niveau, Groupe et Section" required></input>
            </div>
          </div>
        )}
        {step == 2 && (
          <div className="flex flex-col w-5/6 my-2">
            <lable className="label_dossier">Plaignant</lable>
            <div className="flex flex-col w-full gap-6 mb-4">
              <input className="input_dossier" placeholder="Matricule" required></input>
              <input className="input_dossier" placeholder="Nom" required></input>
              <input className="input_dossier" placeholder="Prenom" required></input>
            </div>
          </div>
        )}
        {step == 3 && (
          <div className="flex flex-col w-5/6 my-2">
            <lable className="label_dossier">Informations globales</lable>
            <div className="flex flex-col w-full gap-6 mb-4">
              <input className="input_dossier" placeholder="Date de l'infraction" required></input>
              <input className="input_dossier" placeholder="lieu" required></input>
              <input className="input_dossier" placeholder="Motif" required></input>
              <textarea
                className="input_dossier resize-none"
                placeholder="Description"
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
            onClick={() => {
              setStep((prev) => prev + 1)
              if (step == 3) {
                console.log(ReactDOM.findDOMNode(App))
              } else {
                console.log('else')
              }
            }}
          >
            Continuer
          </button>
        </div>
      </form>
    </div>
  )
}
export default AjouterRapport
