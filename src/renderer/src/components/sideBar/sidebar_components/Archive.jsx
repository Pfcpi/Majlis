import { useState, useRef, Component, useEffect } from 'react'
import { useReactToPrint } from 'react-to-print'

import './sidebar_com_css/archives.css'

import useDark from '../../../zustand/dark'

import UpDownSVG from './../../../assets/UpDown.svg'
import BlueSearchSVG from './../../../assets/BlueSearch.svg'
import VoirDossierSVG from './../../../assets/VoirDossier.svg'
import ModifierDossierSVG from './../../../assets/ModifierDossier.svg'
import ModifierDossierGraySVG from './../../../assets/BlueSvgs/ModifierDossierGray.svg'
import PdfSVG from './../../../assets/pdf.svg'
import ImprimerSVG from './../../../assets/imprimer.svg'
import SupprimerSVG from './../../../assets/supprimer.svg'
import EnvoyerSVG from './../../../assets/Envoyer.svg'
import EnvoyerGraySVG from './../../../assets/BlueSvgs/EnvoyerGray.svg'
import GOBackSVG from './../../../assets/GoBack.svg'
import GOBackGraySVG from './../../../assets/BlueSvgs/GoBackGray.svg'
import axios from 'axios'

//Need to modify:
function Archive() {
  const win = ['rapport', 'pv', 'conseil', 'commission']
  const [currentWindow, setCurrentWindow] = useState(win[0])
  const [rapports, setRapports] = useState([])
  const [PVs, setPVs] = useState([])
  const [view, setView] = useState(false)
  const { dark } = useDark()
  const printComponent = useRef(null)

  const api = 'http://localhost:3000'

  async function fetchData() {
    const tache1 = await axios
      .get(api + '/archive/getrapport')
      .then((res) => {
        setRapports(res.data)
        console.log(res.data)
      })
      .catch((err) => console.log(err))

    const tache2 = await axios
      .get(api + '/archive/getpv')
      .then((res) => {
        console.log(res.data)
        setPVs(res.data)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchData()
  }, [])

  function handlePreview() {
    return new Promise(async () => {
      console.log('forwarding print preview request...')

      const pdfToPreview = await axios
        .get(api + '/archive/printrapport')
        .then((res) => {
          const result = window.electronAPI.getUrl()
          console.log(res)
          /*const datapdf = res.data
          const blob = new Blob([datapdf], { type: 'application/pdf' })
          const url = URL.createObjectURL(blob)
          console.log('url', url)

          window.electronAPI.previewComponent(url, (response) => {
            console.log('Main: ', response)
          })*/
        })
        .catch((err) => console.log(err))
      /*const data = printComponent.current.outerHTML
      console.log(printComponent)
      console.log(data)
      const blob = new Blob([data], { type: 'text/html' })
      const url = URL.createObjectURL(blob)

      window.electronAPI.previewComponent(url, (response) => {
        console.log('Main: ', response)
      })*/
    })
  }

  function handlePrint() {
    return new Promise(() => {
      console.log('forwarding print request to the main process...')

      const data = printComponent.current.outerHTML
      //console.log(data);
      let blob = new Blob([data], { type: 'text/html' })
      let url = URL.createObjectURL(blob)

      window.electronAPI.printComponent(url, (response) => {
        console.log('Main: ', response)
      })
      //console.log('Main: ', data);
    })
  }

  const tabRapports = Array.isArray(rapports) ? (
    rapports.map((m) => (
      <tr className="border-y-[1px] hover:bg-blue/5 dark:hover:bg-dark-gray">
        <td>
          <span>{m.num_r}</span>
        </td>
        <td>{[m.nom_e, ' ', m.prenom_e]}</td>
        <td>{m.date_i.slice(0, m.date_i.indexOf('T'))}</td>
        <td>
          <div className="w-full flex justify-evenly">
            <button className="" onClick={() => setView(true)}>
              <img src={VoirDossierSVG} alt=""></img>
            </button>
            <button>
              <img src={!dark ? ModifierDossierGraySVG : ModifierDossierSVG} alt=""></img>
            </button>
            <button>
              <img src={SupprimerSVG} alt=""></img>
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <></>
  )

  const tabPVs = Array.isArray(PVs) ? (
    PVs.map((m) => (
      <tr className="border-y-[1px] hover:bg-blue/5 dark:hover:bg-dark-gray">
        <td>
          <span>{m.num_pv}</span>
        </td>
        <td>{[m.nom_e, ' ', m.prenom_e]}</td>
        <td>{m.date_i.slice(0, m.date_i.indexOf('T'))}</td>
        <td>{m.date_pv.slice(0, m.date_i.indexOf('T'))}</td>
        <td>{m.libele_s}</td>
      </tr>
    ))
  ) : (
    <></>
  )

  function handlePrintNPM() {
    useReactToPrint({
      content: () => printComponent.current,
      documentTitle: 'PV',
      print: handlePrint()
    })
  }

  function handlePreviewNPM() {
    useReactToPrint({
      content: () => printComponent.current,
      documentTitle: 'PV',
      print: handlePreview()
    })
  }

  return (
    <div className="w-full h-full">
      {!view && (
        <div className="w-full h-full flex flex-col">
          <div className="flex w-full">
            <button
              data-rapportdossier={currentWindow == win[0]}
              className="w-1/2 text-2xl  py-4 rounded-xl data-[rapportDossier=true]:text-blue data-[rapportdossier=true]:bg-0.08-blue data-[rapportdossier=true]:border data-[rapportdossier=true]:border-blue"
              onClick={() => setCurrentWindow(win[0])}
            >
              Rapport
            </button>
            <button
              data-rapportdossier={currentWindow == win[1]}
              className="w-1/2 text-2xl py-4 rounded-xl data-[rapportDossier=true]:text-blue data-[rapportdossier=true]:bg-0.08-blue data-[rapportdossier=true]:border data-[rapportdossier=true]:border-blue"
              onClick={() => setCurrentWindow(win[1])}
            >
              PV
            </button>
            <button
              data-rapportdossier={currentWindow == win[2]}
              className="w-1/2 text-2xl py-4 rounded-xl data-[rapportDossier=true]:text-blue data-[rapportdossier=true]:bg-0.08-blue data-[rapportdossier=true]:border data-[rapportdossier=true]:border-blue"
              onClick={() => setCurrentWindow(win[2])}
            >
              Commission
            </button>
            <button
              data-rapportdossier={currentWindow == win[3]}
              className="w-1/2 text-2xl py-4 rounded-xl data-[rapportDossier=true]:text-blue data-[rapportdossier=true]:bg-0.08-blue data-[rapportdossier=true]:border data-[rapportdossier=true]:border-blue"
              onClick={() => setCurrentWindow(win[3])}
            >
              Conseils Discipline
            </button>
          </div>
          {currentWindow == win[0] && (
            <div className="flex px-4 justify-between h-16 items-center bg-side-bar-white-theme-color dark:bg-dark-gray">
              <button onClick={() => handlePreviewNPM()} className="text-blue">
                <div className="deletePdfImprimer border">
                  <img src={PdfSVG} alt="pdf icon"></img>PDF
                </div>
              </button>
              <div className="flex has-[:focus]:border-blue border dark:border-gray bg-white dark:bg-gray rounded-[10px]">
                <img className="imgp" src={BlueSearchSVG} alt="search icon"></img>
                <input
                  className="p-2 placeholder:text-blue  dark:bg-gray outline-none rounded-[10px]"
                  aria-label="search input"
                  type="search"
                  placeholder="Rapport"
                ></input>
              </div>
            </div>
          )}
          {currentWindow == win[1] && (
            <div className="h-16 px-4 flex items-center justify-between bg-side-bar-white-theme-color dark:bg-dark-gray">
              <div className="w-fit flex gap-4">
                <button onClick={() => handlePreviewNPM()} className="text-blue">
                  <div className="deletePdfImprimer border">
                    <img src={PdfSVG} alt="pdf icon"></img>PDF
                  </div>
                </button>
                <button className="text-pink">
                  <div className="deletePdfImprimer border">
                    <img src={SupprimerSVG} alt="supprimer icon"></img>Supprimer
                  </div>
                </button>
                <button className="text-blue">
                  <div className="deletePdfImprimer border">
                    <img src={VoirDossierSVG} alt=""></img>Voir
                  </div>
                </button>
              </div>
              <div className="flex has-[:focus]:border-blue border bg-white dark:border-gray dark:bg-gray rounded-[10px]">
                <img className="imgp" src={BlueSearchSVG} alt="search icon"></img>
                <input
                  className="p-2 placeholder:text-blue  dark:bg-gray outline-none rounded-[10px]"
                  aria-label="search input"
                  type="search"
                  placeholder="Dossier"
                ></input>
              </div>
            </div>
          )}
          <div className="w-full grow h-[50vh]">
            <div className="w-full max-h-full overflow-y-auto">
              <table className="w-full">
                <tr className="border-t-[1px]">
                  <th
                    data-rapportdossier={currentWindow == win[1]}
                    className="w-1/4 data-[rapportdossier=true]:w-1/5 "
                  >
                    <div>
                      {currentWindow == win[0] ? 'Rapport' : currentWindow == win[1] ? 'PV' : ''}
                    </div>
                  </th>
                  <th
                    data-rapportdossier={currentWindow == win[1]}
                    className="w-1/4 data-[rapportdossier=true]:w-1/5 "
                  >
                    <div>Nom Etudiant</div>
                  </th>
                  <th
                    data-rapportdossier={currentWindow == win[1]}
                    className="w-1/4 data-[rapportdossier=true]:w-1/5 "
                  >
                    <div>Date de l'infraction</div>
                  </th>
                  {currentWindow == win[0] && (
                    <th className="w-1/4">
                      <div>Action</div>
                    </th>
                  )}
                  {currentWindow == win[1] && (
                    <th className="w-1/5">
                      <div>Date de PV</div>
                    </th>
                  )}
                  {currentWindow == win[1] && (
                    <th className="w-1/5">
                      <div>Sanction </div>
                    </th>
                  )}
                </tr>
                {currentWindow == win[0] && tabRapports}
                {currentWindow == win[1] && tabPVs}
              </table>
            </div>
          </div>
        </div>
      )}
      {view && (
        <div className="w-full h-full flex">
          <div className="h-full w-1/2 bg-side-bar-white-theme-color dark:bg-dark-gray flex flex-col">
            <button
              className="w-10 aspect-square"
              onClick={() => {
                setView(false)
              }}
            >
              <img src={!dark ? GOBackGraySVG : GOBackSVG}></img>
            </button>
            <div className="overflow-y-auto max-h-[86vh] flex flex-col w-full h-auto px-8 gap-4">
              <h2 className="text-4xl">Details du Dossier </h2>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations de l'étudiant:</h3>
                <div className="flex flex-col gap-3">
                  <p>Matricule : 22220358439</p>
                  <p>Nom : Badache Radi</p>
                  <p>Filière : Informatique (ingénieur)</p>
                  <p>Groupe : 2</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations du plaignant</h3>
                <div className="flex flex-col gap-3">
                  <p>Matricule : 22220358439</p>
                  <p>Nom : Reguig Hichem</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations globales</h3>
                <div className="flex flex-col gap-3">
                  <p>Date de l’infraction : 22/03/2023</p>
                  <p>Lieu : Salle B</p>
                  <p>Motif : Tentative de fraude</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Description:</h3>
                <div className="flex flex-col gap-3">
                  <p>
                    l’etudiant a en plus manquer de respact a l’enseignt on disant le terme”sale
                    arabe” ou encore”مناطق الظل”
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/2 justify-center items-center [&>button]:w-1/3 [&>button]:min-w-fit gap-4">
            <button className="py-2 px-4 border rounded-xl flex gap-3 justify-center items-center">
              <img src={ImprimerSVG}></img>imprimer
            </button>
            <button className="py-2 px-4 border rounded-xl flex gap-3 justify-center items-center">
              <img src={PdfSVG}></img>enregistrer
            </button>
            <button className="py-2 px-4 border rounded-xl flex gap-3 justify-center items-center">
              <img src={dark ? EnvoyerSVG : EnvoyerGraySVG}></img>envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
export default Archive
