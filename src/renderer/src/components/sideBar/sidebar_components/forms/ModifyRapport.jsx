import InputField from './InputField'
import axios from 'axios'

import useRapport from '../../../../zustand/Rapport/Rapport'
/*
steps
Error handling
custum on click functions
form info (zustand useRapport)
validation
*/

function ModifyRapport() {
  const niveaux = ['1 ING', '2 ING', 'L1', 'L2', 'L3', 'M1', 'M2', 'Doctorat']
  const accueilPage = useRef(null)
  const motif1 = [
    'Demande non fondée de double correction',
    'tentative de fraude ou fraude établie',
    "rufus d'obtempérer à des directives émanant de l'administration, du personnel enseignant ou de sécurité"
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
  const [dropMotif, setDropMotif] = useState(false)
  const [dropMotifValue, setDropMotifValue] = useState('')
  const [errorsStep1, setErrorsStep1] = useState({
    matriculeError: '',
    nomError: '',
    prenomError: '',
    niveauError: '',
    groupeError: '',
    sectionError: ''
  })
  const [errorsStep2, setErrorsStep2] = useState({
    nomError: '',
    prenomError: ''
  })
  const [errorsStep3, setErrorsStep3] = useState({
    lieuError: '',
    motifError: ''
  })

  const [step, setStep] = useState(1)

  const [rapport, setRapport] = useState({
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
  })

  const validateFormStep1 = (data) => {
    let errors = {}

    const que_les_nombres_regex = /^[0-9]+$/
    if (data.matriculeE.length == 0) {
      errors.matricule = 'matricule est vide!'
      setErrorsStep1((prev) => ({ ...prev, matriculeError: errors.matricule }))
      return errors
    } else if (!que_les_nombres_regex.test(data.matriculeE)) {
      errors.matricule = 'Uniquement les nombres'
      setErrorsStep1((prev) => ({ ...prev, matriculeError: errors.matricule }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, matriculeError: '' }))
    }

    if (data.nomE.length == 0) {
      errors.nom = 'nom est vide!'
      setErrorsStep1((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nomE.length < 3) {
      errors.nom = 'la longueur doit etre > 3'
      setErrorsStep1((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nomE.search(/^[a-zA-Z]*$/g)) {
      errors.nom = "Uniquement les caractères (pas d'espace)"
      setErrorsStep1((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, nomError: '' }))
    }

    if (data.prenomE.length == 0) {
      errors.prenom = 'Prenom est vide!'
      setErrorsStep1((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenomE.length < 3) {
      errors.prenom = 'la longueur doit etre > 3'
      setErrorsStep1((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenomE.search(/^[a-zA-Z\s]*$/g)) {
      errors.prenom = 'Uniquement les caractères'
      setErrorsStep1((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, prenomError: '' }))
    }

    if (data.niveauE.length == 0) {
      errors.niveau = 'Niveau est vide!'
      setErrorsStep1((prev) => ({ ...prev, niveauError: errors.niveau }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, niveauError: '' }))
    }

    if (data.groupeE.length == 0) {
      errors.groupe = 'groupe est vide!'
      setErrorsStep1((prev) => ({ ...prev, groupeError: errors.groupe }))
      return errors
    } else if (!que_les_nombres_regex.test(data.groupeE)) {
      errors.groupe = 'Uniquement les nombres'
      setErrorsStep1((prev) => ({ ...prev, groupeError: errors.groupe }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, groupeError: '' }))
    }

    if (data.sectionE == null || data.sectionE.length == 0) {
      errors.section = 'section est vide!'
      setErrorsStep1((prev) => ({ ...prev, sectionError: errors.section }))
      return errors
    } else if (!que_les_nombres_regex.test(data.sectionE)) {
      errors.section = 'Uniquement les nombres'
      setErrorsStep1((prev) => ({ ...prev, sectionError: errors.section }))
      return errors
    } else {
      setErrorsStep1((prev) => ({ ...prev, sectionError: '' }))
    }
    return errors
  }

  const validateFormStep2 = (data) => {
    let errors = {}

    if (data.nomP.length == 0) {
      errors.nom = 'nom est vide!'
      setErrorsStep2((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nomP.length < 3) {
      errors.nom = 'la longueur doit etre > 3'
      setErrorsStep2((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else if (data.nomP.search(/^[a-zA-Z]*$/g)) {
      errors.nom = "Uniquement les caractères (pas d'espace)"
      setErrorsStep2((prev) => ({ ...prev, nomError: errors.nom }))
      return errors
    } else {
      setErrorsStep2((prev) => ({ ...prev, nomError: '' }))
    }

    if (data.prenomP.length == 0) {
      errors.prenom = 'Prenom est vide!'
      setErrorsStep2((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenomP.length < 3) {
      errors.prenom = 'la longueur doit etre > 3'
      setErrorsStep2((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else if (data.prenomP.search(/^[a-zA-Z\s]*$/g)) {
      errors.prenom = 'Uniquement les caractères'
      setErrorsStep2((prev) => ({ ...prev, prenomError: errors.prenom }))
      return errors
    } else {
      setErrorsStep2((prev) => ({ ...prev, prenomError: '' }))
    }

    return errors
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRapport((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  useEffect(() => {
    setdropNiveauValue(currentViewedEtudiant.niveau_e)
  }, [currentViewedEtudiant.niveau_e])

  useEffect(() => {
    setRapport((prev) => ({
      ...prev,
      degreI: motif2.includes(currentViewedEtudiant.motif_i) ? '2' : '1'
    }))
  }, [currentViewedEtudiant.motif_i])

  useEffect(() => {
    setRapport((prev) => ({ ...prev, niveauE: dropNiveauValue }))
  }, [dropNiveauValue])

  useEffect(() => {
    if (dropMotifValue != 'autres...') {
      setRapport((prev) => ({ ...prev, motifI: dropMotifValue }))
    } else {
      setCurrentViewedEtudiant((prev) => ({ ...prev, motif_i: '' }))
      setRapport((prev) => ({ ...prev, motifI: '' }))
    }
  }, [dropMotifValue])

  let loadingBar = document.createElement('div')
  loadingBar.classList.add('loadingBar')
  loadingBar.classList.add('loadingBarAni')

  function addLoadingBar() {
    accueilPage.current.appendChild(loadingBar)
  }

  function RemoveLoadingBar() {
    loadingBar.remove()
  }

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
      {step === 4 && <div className="fullBgBlock"></div>}
      {step === 4 && (
        <div className="absolute flex flex-col justify-evenly text-xl items-center h-40 w-1/3 z-30 rounded-xl text-white dark:text-black bg-dark-gray dark:bg-white">
          Confirmer la modification du rapport
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
              onClick={async () => {
                setStep(1)
                addLoadingBar()
                const tache1 = await axios
                  .patch(api + '/rapport/edit', rapport)
                  .then((res) => console.log(res, res.data.sql ? res.data.sql : ''))
                  .catch((err) => console.log(err))
                RemoveLoadingBar()
              }}
              className="flex justify-center items-center border rounded-xl text-blue py-2 px-4 bg-0.08-blue"
            >
              confirmer
            </button>
          </div>
        </div>
      )}
      <form className="overflow-y-auto flex flex-col justify-center items-center rounded-xl bg-side-bar-white-theme-color dark:bg-dark-gray w-1/2 max-h-[84vh] min-w-[500px] ">
        <h1 className="text-[36px] py-4">Detail du rapport</h1>
        <hr className="w-full dark:text-gray"></hr>
        {step == 1 && (
          <div className="flex flex-col w-5/6">
            <label className="label_dossier">Etudiant</label>
            <div className="flex flex-col w-full gap-6 mb-4">
              <InputField name="matriculeE" label="Matricule" />
              <InputField name="nomE" label="Nom" />
              <InputField name="prenomE" label="Prenom" />
              <InputField name="niveauE" label="Niveau" />
              <InputField name="groupeE" label="Groupe" />
              <InputField name="sectionE" label="Section" />
            </div>
          </div>
        )}
        {step == 2 && (
          <div className="flex flex-col w-5/6 my-2">
            <label className="label_dossier">Plaignant</label>
            <div className="flex flex-col w-full gap-6 mb-4">
              <InputField name="nomP" label="Nom" />
              <InputField name="prenomP" label="Prenom" />
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
                  id="dateI"
                  type="date"
                  onChange={(e) => {
                    handleInputChange(e)
                    setCurrentViewedEtudiant((prev) => ({ ...prev, date_i: e.target.value }))
                  }}
                  value={currentViewedEtudiant.date_i.substring(0, 10)}
                  required
                ></input>
                <label
                  className="absolute -translate-x-4 -translate-y-9 scale-90 z-10 ml-4 mt-[13px]  text-dark-gray cursor-text dark:text-white h-fit w-fit bg-transparent"
                  htmlFor="dateI"
                >
                  Date
                </label>
              </div>
              <InputField name="lieuI" label="Lieu" />
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="motifI"
                  id="motifI"
                  onChange={(e) => {
                    console.log('dropMotifValue:', dropMotifValue)
                    if (dropMotifValue == 'autres...') {
                      handleInputChange(e)
                      setCurrentViewedEtudiant((prev) => ({ ...prev, motif_i: e.target.value }))
                      if (dropMotif) setDropMotif(false)
                    }
                  }}
                  onClick={() => {
                    if (!dropMotif && dropMotifValue != 'autres...') setDropMotif(true)
                  }}
                  value={
                    dropMotifValue == 'autres...' || dropMotifValue == ''
                      ? currentViewedEtudiant.motif_i
                      : dropMotifValue
                  }
                  required
                ></input>
                <label className="label_rapport" htmlFor="motifI">
                  Motif
                </label>
                {errorsStep3.motifError && (
                  <p className="absolute flex gap-2 text-yellow-700 px-4 py-2 bg-[#FFED8F]/50 top-7 left-3 animate-badInput z-10">
                    <img height="16" width="16" src={WarningSVG}></img>
                    {errorsStep3.motifError}
                  </p>
                )}
                {dropMotif && dropMotifdownItems}
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="degreI"
                  id="degreI"
                  value={motif2.includes(rapport.motifI) ? '2' : '1'}
                  required
                ></input>
                <label className="label_rapport" htmlFor="degreI">
                  Degré
                </label>
              </div>
              <InputField name="descI" label="Description" />
            </div>
          </div>
        )}
        <hr className="w-full dark:text-gray"></hr>
        <div className="flex justify-between w-5/6 py-6">
          <button
            className="button_dossier text-red min-w-fit hover:bg-0.36-red"
            onClick={(e) => {
              e.preventDefault()
              if (step == 1) {
                setModify(false)
              } else {
                setStep((prev) => prev - 1)
              }
              setTimeout(() => {
                setErrorsStep1({
                  matriculeError: '',
                  nomError: '',
                  prenomError: '',
                  niveauError: '',
                  groupeError: '',
                  sectionError: ''
                })
                setErrorsStep2({
                  nomError: '',
                  prenomError: ''
                })
                setErrorsStep3({
                  lieuError: '',
                  motifError: ''
                })
              }, 2000)
            }}
          >
            {step >= 2 ? 'retourner' : 'annuler'}
          </button>
          <button
            className="button_dossier text-blue min-w-fit hover:bg-0.08-blue"
            onClick={(e) => {
              e.preventDefault()
              if (step == 1) {
                const newErrors = validateFormStep1(rapport)
                if (Object.keys(newErrors).length === 0) {
                  setStep((prev) => prev + 1)
                }
              }
              if (step == 2) {
                const newErrors = validateFormStep2(rapport)
                if (Object.keys(newErrors).length === 0) {
                  setStep((prev) => prev + 1)
                }
              }
              if (step == 3) {
                const newErrors = validateFormStep3(rapport)
                if (Object.keys(newErrors).length === 0) {
                  setStep((prev) => prev + 1)
                }
              }
              setTimeout(() => {
                setErrorsStep1({
                  matriculeError: '',
                  nomError: '',
                  prenomError: '',
                  niveauError: '',
                  groupeError: '',
                  sectionError: ''
                })
                setErrorsStep2({
                  nomError: '',
                  prenomError: ''
                })
                setErrorsStep3({
                  lieuError: '',
                  motifError: ''
                })
              }, 2000)
            }}
          >
            {step > 2 ? 'modifier' : 'continuer'}
          </button>
        </div>
      </form>
    </div>
  )
}
