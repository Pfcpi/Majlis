import './sidebar_com_css/ajouterRapport.css'

function AjouterRapport() {
  return (
    <div className="text-white h-full w-full flex flex-col justify-center items-center font-poppins">
      <form className="flex flex-col justify-center items-center rounded-xl dark:bg-dark-gray w-1/2">
        <h1 className="text-[36px] py-4">Detail du rapport</h1>
        <hr className="w-full dark:text-gray"></hr>
        <div className="flex flex-col w-5/6 my-6">
          <lable className="label_dossier">Etudiant</lable>
          <div className="flex flex-col w-full gap-6 mb-4">
            <input className="input_dossier" placeholder="Nom et prenom" required></input>
            <input className="input_dossier" placeholder="email" type="email" required></input>
            <input className="input_dossier" placeholder="Niveau" required></input>
          </div>
          <lable className="label_dossier">Plaignant</lable>
          <div className="flex flex-col w-full gap-6">
            <input className="input_dossier" placeholder="Nom et prenom" required></input>
            <textarea
              className="min-h-[80px] resize-none input_dossier"
              placeholder="Description"
              required
            ></textarea>
          </div>
        </div>
        <hr className="w-full dark:text-gray"></hr>
        <div className="flex justify-between w-5/6 py-6">
          <button className="button_dossier text-red-900" type="reset">
            Annuler
          </button>
          <button className="button_dossier text-blue" type="submit">
            Créer
          </button>
        </div>
      </form>
    </div>
  )
}
export default AjouterRapport
