import { useState, useRef, Component } from 'react'
import { useReactToPrint } from 'react-to-print'

import './sidebar_com_css/archives.css'

import useDark from '../../../zustand/dark'

import UpDownSVG from './../../../assets/UpDown.svg'
import BlueSearchSVG from './../../../assets/BlueSearch.svg'
import SearchSVG from './../../../assets/Search.svg'
import VoirDossierSVG from './../../../assets/VoirDossier.svg'
import ModifierDossierSVG from './../../../assets/ModifierDossier.svg'
import PdfSVG from './../../../assets/pdf.svg'
import ImprimerSVG from './../../../assets/imprimer.svg'
import SupprimerSVG from './../../../assets/supprimer.svg'
import EnvoyerSVG from './../../../assets/Envoyer.svg'
import EnvoyerGraySVG from './../../../assets/BlueSvgs/EnvoyerGray.svg'
import GOBackSVG from './../../../assets/GoBack.svg'
import GOBackGraySVG from './../../../assets/BlueSvgs/GoBackGray.svg'

//Need to modify:
function Archive() {
  //false for rapport, true for Dossier
  const [rapportdossier, setRapportDossier] = useState(false)
  const [view, setView] = useState(false)
  const { dark } = useDark()
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
    <>
      {' '}
      {!view && (
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
                  <button className="mr-10" onClick={() => setView(true)}>
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
    </>
  )
}
export default Archive
