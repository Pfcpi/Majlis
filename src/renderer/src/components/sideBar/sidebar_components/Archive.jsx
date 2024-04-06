import { useState, useRef, Component } from 'react'
import { useReactToPrint } from 'react-to-print'

import './sidebar_com_css/archives.css'

import UpDownSVG from './../../../assets/UpDown.svg'
import BlueSearchSVG from './../../../assets/BlueSearch.svg'
import SearchSVG from './../../../assets/Search.svg'
import VoirDossierSVG from './../../../assets/VoirDossier.svg'
import ModifierDossierSVG from './../../../assets/ModifierDossier.svg'
import PdfSVG from './../../../assets/pdf.svg'
import ImprimerSVG from './../../../assets/imprimer.svg'
import SupprimerSVG from './../../../assets/supprimer.svg'

//Need to modify:
//Clicking on modify and review will enable the checkmark
function Archive() {
  //false for rapport, true for Dossier
  const [rapportdossier, setRapportDossier] = useState(false)
  const ref = useRef(null)
  const printComponent = useRef(null)
  function handleRowChecked() {
    var label = ref.current
    label.click()
  }

  const handlePrint = () => {
    return new Promise(() => {
      console.log('forwarding print request to the main process...')

      let data = printComponent.current
      console.log(data)
      var blob = new Blob([data], { type: 'text/html' })
      var url = URL.createObjectURL(blob)

      window.electronAPI.printComponent(url, (response) => {
        console.log('Main: ', response)
      })
    })
  }

  const handlePreview = () => {
    return new Promise(() => {
      console.log('forwarding print preview request...')

      const data = printComponent.current
      console.log(data)
      const blob = new Blob([data], { type: 'text/html' })
      const url = URL.createObjectURL(blob)

      window.electronAPI.previewComponent(url, (response) => {
        console.log('Main: ', response)
      })
    })
  }

  return (
    <div ref={printComponent} className="flex flex-col font-poppins">
      <div className="flex w-full">
        <button
          data-rapportdossier={rapportdossier}
          className="w-1/2 text-2xl  py-4 rounded-xl data-[rapportDossier=false]:text-blue data-[rapportdossier=false]:bg-0.08-blue data-[rapportdossier=false]:border data-[rapportdossier=false]:border-blue"
          onClick={() => setRapportDossier(false)}
        >
          Rapport
        </button>
        <button
          data-rapportdossier={rapportdossier}
          className="w-1/2 text-2xl py-4 rounded-xl data-[rapportDossier=true]:text-blue data-[rapportdossier=true]:bg-0.08-blue data-[rapportdossier=true]:border data-[rapportdossier=true]:border-blue"
          onClick={() => setRapportDossier(true)}
        >
          Dossier
        </button>
      </div>
      {!rapportdossier && (
        <div className="flex px-4 justify-between h-16 items-center bg-side-bar-white-theme-color dark:bg-dark-gray">
          <button className="text-blue">Tout</button>
          <div className="flex has-[:focus]:border-blue border dark:border-gray bg-white dark:bg-gray rounded-[10px]">
            <img className="*:fill-blue imgp" src={BlueSearchSVG} alt="search icon"></img>
            <input
              className="p-2 placeholder:text-blue  dark:bg-gray outline-none rounded-[10px]"
              aria-label="search input"
              type="search"
              placeholder="Rapport"
            ></input>
          </div>
        </div>
      )}
      {rapportdossier && (
        <div className="h-16 px-4 flex items-center justify-between bg-side-bar-white-theme-color dark:bg-dark-gray">
          <div className="w-1/2 flex justify-between">
            <button onClick={handlePrint} className="text-blue">
              <div className="deletePdfImprimer">
                <img className="imgp" src={ImprimerSVG} alt="imprimer icon"></img>Imprimer
              </div>
            </button>
            <button onClick={handlePreview} className="text-blue">
              <div className="deletePdfImprimer">
                <img className="imgp" src={PdfSVG} alt="pdf icon"></img>Enregistrer PDF
              </div>
            </button>
            <button className="text-pink">
              <div className="deletePdfImprimer bg-brown">
                <img className="imgp" src={SupprimerSVG} alt="supprimer icon"></img>Supprimer
              </div>
            </button>
          </div>
          <div className="flex has-[:focus]:border-blue border bg-white dark:border-gray dark:bg-gray rounded-[10px]">
            <img className="*:fill-blue imgp" src={BlueSearchSVG} alt="search icon"></img>
            <input
              className="p-2 placeholder:text-blue  dark:bg-gray outline-none rounded-[10px]"
              aria-label="search input"
              type="search"
              placeholder="Dossier"
            ></input>
          </div>
        </div>
      )}
      <table className="w-full">
        <tr className="border-t-[1px]">
          <th
            data-rapportdossier={rapportdossier}
            className="w-1/4 data-[rapportdossier=true]:w-1/5 data-[rapportdossier=false]:border-x-[1px]"
          >
            <div>
              Rapport
              <img className="imgp" src={UpDownSVG} alt="filter"></img>
            </div>
          </th>
          <th
            data-rapportdossier={rapportdossier}
            className="w-1/4 data-[rapportdossier=true]:w-1/5 data-[rapportdossier=false]:border-x-[1px]"
          >
            <div>
              Nom Etudiant
              <img className="imgp" src={UpDownSVG} alt="filter"></img>
            </div>
          </th>
          <th
            data-rapportdossier={rapportdossier}
            className="w-1/4 data-[rapportdossier=true]:w-1/5 data-[rapportdossier=false]:border-x-[1px]"
          >
            <div>
              Date de l'infraction
              <img className="imgp" src={UpDownSVG} alt="filter"></img>
            </div>
          </th>
          {!rapportdossier && (
            <th className="w-1/4 border-x-[1px]">
              <div>Action</div>
            </th>
          )}
          {rapportdossier && (
            <th className="w-1/5">
              <div>
                Date de Conseil<img className="imgp" src={UpDownSVG} alt="filter"></img>
              </div>
            </th>
          )}
          {rapportdossier && (
            <th className="w-1/5">
              <div>
                Sanction<img className="imgp" src={UpDownSVG} alt="filter"></img>
              </div>
            </th>
          )}
        </tr>
        <tr
          data-rapportdossier={rapportdossier}
          className="border-y-[1px] data-[rapportdossier=true]:has-[:checked]:border-blue dark:hover:bg-dark-gray"
          onClick={handleRowChecked}
        >
          <td
            data-rapportdossier={rapportdossier}
            className="data-[rapportdossier=false]:border-x-[1px]"
          >
            <label className="" ref={ref} id="DossierCheck">
              <input className="mr-2" type="checkbox"></input>
              <span>1000</span>
            </label>
          </td>
          <td
            data-rapportdossier={rapportdossier}
            className="data-[rapportdossier=false]:border-x-[1px]"
          >
            Aboura yacine
          </td>
          <td
            data-rapportdossier={rapportdossier}
            className="data-[rapportdossier=false]:border-x-[1px]"
          >
            22 Jan 2023
          </td>
          {!rapportdossier && (
            <td className="border-x-[1px]">
              <button className="mr-10">
                <img src={VoirDossierSVG} alt="voir dossier icon"></img>
              </button>
              <button>
                <img src={ModifierDossierSVG} alt="modifier dossier icon"></img>
              </button>
            </td>
          )}
          {rapportdossier && <td>22 Jan 2023</td>}
          {rapportdossier && <td>Blame ecrit</td>}
        </tr>
      </table>
    </div>
  )
}
export default Archive
