//Tasks:
//Add id attribute for input elements

import { useState, useEffect } from 'react'
import './sidebar_com_css/accueil.css'
import './sidebar_com_css/ajouterRapport.css'
import axios from 'axios'

function AjouterRapport() {
  const niveaux = ['1 ING', '2 ING', 'L1', 'L2', 'L3', 'M1', 'M2', 'Doctorat']
  const degre = ['1', '2']
  const motif1 = [
    'Demande non fondée de double correction',
    'tentative de fraude ou fraude établie',
    "rufus d'obtempérer à des directives émanant de l'administration, du personnel enseignant chercheur ou de sécurité",
    'autres...'
  ]
  const motif2 = [
    'Les récidives des infractions du 1er degré',
    "l'entrave à la bonne marche de l'établissement",
    'le désordre organisé',
    'la voilance',
    'les menaces et voies de fais',
    'le faux',
    "la détérioration délibérée des beins de l'établissement",
    'autres...'
  ]
  const [dropNiveau, setdropNiveau] = useState(false)
  const [dropNiveauValue, setdropNiveauValue] = useState('')
  const [dropDegre, setDropDegre] = useState(false)
  const [dropDegreValue, setDropDegreValue] = useState('')
  const [dropMotif, setDropMotif] = useState(false)
  const [dropMotifValue, setDropMotifValue] = useState('')
  const [etudiants, setEtudiants] = useState([])

  const [step, setStep] = useState(1)
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
    groupeE: 1,
    sectionE: null,
    nomP: '',
    prenomP: '',
    dateI: new Date().toISOString().slice(0, 19).replace('T', ' '),
    lieuI: '',
    motifI: '',
    descI: '',
    degreI: 1
  })

  useEffect(() => {
    axios
      .get(api + '/rapport/get')
      .then((res) => setEtudiants(res.data))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    setRapport((prev) => ({ ...prev, niveauE: dropNiveauValue }))
  }, [dropNiveauValue])

  useEffect(() => {
    setRapport((prev) => ({ ...prev, degreI: dropDegreValue }))
  }, [dropDegreValue])

  useEffect(() => {
    setRapport((prev) => ({ ...prev, motifI: dropMotifValue }))
  }, [dropMotifValue])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRapport((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const api = 'http://localhost:3000'

  const dropNiveaudownItems = (
    <div className="absolute w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
      {niveaux.map((n) => (
        <div
          className="border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray"
          onClick={() => {
            setdropNiveau(false)
            setdropNiveauValue(n)
          }}
        >
          {n}
        </div>
      ))}
    </div>
  )

  const dropDegredownItems = (
    <div className="absolute w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
      {degre.map((n) => (
        <div
          className="border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray"
          onClick={() => {
            setDropDegre(false)
            setDropDegreValue(n)
          }}
        >
          {n}
        </div>
      ))}
    </div>
  )

  const dropMotif1downItems = (
    <div className="absolute w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
      {motif1.map((n) => (
        <div
          className="border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray"
          onClick={() => {
            setDropMotif(false)
            setDropMotifValue(n)
          }}
        >
          {n}
        </div>
      ))}
    </div>
  )

  const dropMotif2downItems = (
    <div className="absolute w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
      {motif2.map((n) => (
        <div
          className="border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray"
          onClick={() => {
            setDropMotif(false)
            setDropMotifValue(n)
          }}
        >
          {n}
        </div>
      ))}
    </div>
  )

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
                setDropDegreValue('')
                setdropNiveauValue('')
                setDropMotifValue('')
                setRapport({})
              }}
              className="flex justify-center items-center border rounded-xl text-red py-2 px-4 bg-0.36-red"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                setStep(1)
                setDropDegreValue('')
                setdropNiveauValue('')
                setDropMotifValue('')
                setRapport({})
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
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="matriculeE"
                  onChange={handleInputChange}
                  value={rapport.matriculeE}
                  required
                ></input>
                <label className="label_rapport" htmlFor="matriculeE">
                  Matricule
                </label>
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="nomE"
                  onChange={handleInputChange}
                  value={rapport.nomE}
                  required
                ></input>
                <label className="label_rapport" htmlFor="nomE">
                  Nom
                </label>
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="prenomE"
                  onChange={handleInputChange}
                  value={rapport.prenomE}
                  required
                ></input>
                <label className="label_rapport" htmlFor="prenomE">
                  Prenom
                </label>
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="niveauE"
                  onClick={() => {
                    if (!dropNiveau) {
                      setdropNiveau(true)
                    }
                  }}
                  value={dropNiveauValue}
                  onChange={handleInputChange}
                  required
                ></input>
                <label className="label_rapport" htmlFor="niveauE">
                  Niveau
                </label>
                {dropNiveau && dropNiveaudownItems}
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="groupeE"
                  onChange={handleInputChange}
                  value={rapport.groupeE}
                  required
                ></input>
                <label className="label_rapport" htmlFor="GroupeE">
                  Groupe
                </label>
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="sectionE"
                  onChange={handleInputChange}
                  value={rapport.sectionE}
                  required
                ></input>
                <label className="label_rapport" htmlFor="sectionE">
                  Section
                </label>
              </div>
            </div>
          </div>
        )}
        {step == 2 && (
          <div className="flex flex-col w-5/6 my-2">
            <label className="label_dossier">Plaignant</label>
            <div className="flex flex-col w-full gap-6 mb-4">
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="nomP"
                  onChange={handleInputChange}
                  value={rapport.nomP}
                  required
                ></input>
                <label className="label_rapport" htmlFor="nomP">
                  Nom
                </label>
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="prenomP"
                  onChange={handleInputChange}
                  value={rapport.prenomP}
                  required
                ></input>
                <label className="label_rapport" htmlFor="prenomP">
                  Prenom
                </label>
              </div>
            </div>
          </div>
        )}
        {step == 3 && (
          <div className="flex flex-col w-5/6 my-2">
            <label className="label_dossier">Informations globales</label>
            <div className="flex flex-col w-full gap-6 mb-4">
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="dateI"
                  type="date"
                  onChange={handleInputChange}
                  value={rapport.dateI}
                  required
                ></input>
                <label className="label_rapport" htmlFor="dateI">
                  Date
                </label>
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="lieuI"
                  onChange={handleInputChange}
                  value={rapport.lieuI}
                  required
                ></input>
                <label className="label_rapport" htmlFor="lieuI">
                  Lieu
                </label>
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  onClick={() => {
                    if (!dropDegre) {
                      setDropDegre(true)
                    }
                  }}
                  name="degreI"
                  onChange={handleInputChange}
                  value={dropDegreValue}
                  required
                ></input>
                <label className="label_rapport" htmlFor="degreI">
                  Degré
                </label>
                {dropDegre && dropDegredownItems}
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="motifI"
                  onClick={() => {
                    if (!dropMotif) setDropMotif(true)
                  }}
                  value={dropMotifValue == 'autres...' ? rapport.motifI : dropMotifValue}
                  onChange={(e) => {
                    handleInputChange
                    setRapport((prev) => ({ ...prev, motifI: e.target.value }))
                    if (dropMotif) setDropMotif(false)
                  }}
                  required
                ></input>
                <label className="label_rapport" htmlFor="motifI">
                  Motif
                </label>
                {dropMotif && dropDegreValue == 1 && dropMotif1downItems}
                {dropMotif && dropDegreValue == 2 && dropMotif2downItems}
              </div>
              <div className="container_input_rapport">
                <textarea
                  className="input_dossier resize-none"
                  name="descI"
                  onChange={handleInputChange}
                  value={rapport.descI}
                  required
                ></textarea>
                <label className="label_rapport" htmlFor="descI">
                  Description
                </label>
              </div>
            </div>
          </div>
        )}
        <hr className="w-full dark:text-gray"></hr>
        <div className="flex justify-between w-5/6 py-6">
          <button
            className="button_dossier text-red border-red hover:bg-red/25 min-w-fit"
            onClick={(e) => {
              e.preventDefault()
              if (step > 1) setStep((prev) => prev - 1)
            }}
            type="reset"
          >
            {step > 1 ? 'Retourner' : 'Annuler'}
          </button>
          <button
            className="button_dossier text-blue border-blue hover:bg-blue/25 min-w-fit"
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              setStep((prev) => prev + 1)
            }}
          >
            {step > 2 ? 'terminer' : 'continue'}
          </button>
        </div>
      </form>
    </div>
  )
}
export default AjouterRapport
