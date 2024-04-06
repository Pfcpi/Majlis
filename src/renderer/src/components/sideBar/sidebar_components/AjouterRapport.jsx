import { useState } from 'react'
import './sidebar_com_css/ajouterRapport.css'

function AjouterRapport() {
  const [step, setStep] = useState(1)

  return (
    <div className="h-full w-full flex flex-col justify-center items-center font-poppins">
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
              <input className="input_dossier" placeholder="Niveau" required></input>
              <input className="input_dossier" placeholder="Section" required></input>
              <input className="input_dossier" placeholder="Groupe" required></input>
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
              <textarea className="input_dossier resize-none" placeholder="Motif" required></textarea>
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
            onClick={() => setStep((prev) => prev + 1)}
          >
            Continuer
          </button>
        </div>
      </form>
    </div>
  )
}
export default AjouterRapport
