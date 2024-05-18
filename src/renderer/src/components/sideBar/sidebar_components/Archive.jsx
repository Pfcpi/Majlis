import { useState, useRef, useEffect, useMemo } from 'react'

import './sidebar_com_css/archives.css'

import useDark from '../../../zustand/dark'
import useApi from '../../../zustand/api'
import useAccount from '../../../zustand/account'

import BlueSearchSVG from './../../../assets/BlueSearch.svg'
import VoirDossierSVG from './../../../assets/VoirDossier.svg'
import ModifierDossierSVG from './../../../assets/ModifierDossier.svg'
import ModifierDossierGraySVG from './../../../assets/BlueSvgs/ModifierDossierGray.svg'
import PdfSVG from './../../../assets/pdf.svg'
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
  const [currentViewedRapport, setCurrentViewedRappport] = useState({})
  const [query, setQuery] = useState('')

  const [commissions, setCommissions] = useState([])
  const [selectedMem, setSelectedMem] = useState([])
  const [queryCom, setQueryCom] = useState('')

  const [PVs, setPVs] = useState([])
  const [currentViewedPV, setCurrentViewedPV] = useState({})
  const [selectedPVs, setSelectedPVs] = useState([])
  const [queryPV, setQueryPV] = useState('')

  const [conseils, setConseils] = useState([])
  const [currentViewedCD, setCurrentViewedCD] = useState({})
  const [selectedCon, setSelectedCon] = useState([])
  const [queryCon, setQueryCon] = useState('')

  const [view, setView] = useState(false)

  const { dark } = useDark()
  const { api } = useApi()
  const { account } = useAccount()

  const archivePage = useRef(null)

  async function fetchData() {
    addLoadingBar()
    const tache1 = await axios
      .get(api + '/archive/getrapport')
      .then((res) => {
        setRapports(res.data)
      })
      .catch((err) => console.log(err))

    const tache2 = await axios
      .get(api + '/archive/getpv')
      .then((res) => {
        setPVs(res.data)
      })
      .catch((err) => console.log(err))

    const tache3 = await axios
      .get(api + '/archive/getcommission')
      .then((res) => {
        setCommissions(res.data)
      })
      .catch((err) => console.log(err))

    const tache4 = await axios
      .get(api + '/archive/getcd')
      .then((res) => {
        setConseils(res.data)
        console.log('/archive/getcd:', res.data)
      })
      .catch((err) => console.log(err))
    RemoveLoadingBar()
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setSelectedCon([])
    setSelectedMem([])
    setSelectedPVs([])
  }, [currentWindow])

  let loadingBar = document.createElement('div')
  loadingBar.classList.add('loadingBar')
  loadingBar.classList.add('loadingBarAni')

  function addLoadingBar() {
    archivePage.current.appendChild(loadingBar)
  }

  function RemoveLoadingBar() {
    loadingBar.remove()
  }

  const supprimerImage = (
    <svg
      width="18"
      height="24"
      viewBox="0 0 18 24"
      fill="none"
      className={
        selectedPVs.length != 0
          ? '[&>path]:fill-red duration-100'
          : '[&>path]:fill-dark-gray/25 dark:[&>path]:fill-white/25 duration-100'
      }
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.25 20.75C1.25 21.413 1.51339 22.0489 1.98223 22.5178C2.45107 22.9866 3.08696 23.25 3.75 23.25H13.75C14.413 23.25 15.0489 22.9866 15.5178 22.5178C15.9866 22.0489 16.25 21.413 16.25 20.75V5.75H1.25V20.75ZM3.75 8.25H13.75V20.75H3.75V8.25ZM13.125 2L11.875 0.75H5.625L4.375 2H0V4.5H17.5V2H13.125Z" />
    </svg>
  )

  const modifierImage = (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      className={
        selectedPVs.length == 1 || selectedCon.length == 1 || selectedMem.length == 1
          ? '[&>path]:fill-blue duration-100'
          : '[&>path]:fill-dark-gray/25 dark:[&>path]:fill-white/25 duration-100'
      }
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 20.5044H6V4.50439H13V9.50439H18V12.6044L20 10.6044V8.50439L14 2.50439H6C4.9 2.50439 4 3.40439 4 4.50439V20.5044C4 21.6044 4.9 22.5044 6 22.5044H10V20.5044ZM20.2 13.5044C20.3 13.5044 20.5 13.6044 20.6 13.7044L21.9 15.0044C22.1 15.2044 22.1 15.6044 21.9 15.8044L20.9 16.8044L18.8 14.7044L19.8 13.7044C19.9 13.6044 20 13.5044 20.2 13.5044ZM20.2 17.4044L14.1 23.5044H12V21.4044L18.1 15.3044L20.2 17.4044Z"
        fill-opacity="0.78"
      />
    </svg>
  )

  const voirDossierImage = (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      className={
        selectedPVs.length == 1 || selectedCon.length == 1 || selectedMem.length == 1
          ? '[&>path]:fill-blue duration-100'
          : '[&>path]:fill-dark-gray/25 dark:[&>path]:fill-white/25 duration-100'
      }
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17 18.5044C17.56 18.5044 18 18.9444 18 19.5044C18 20.0644 17.56 20.5044 17 20.5044C16.44 20.5044 16 20.0644 16 19.5044C16 18.9444 16.44 18.5044 17 18.5044ZM17 15.5044C14.27 15.5044 11.94 17.1644 11 19.5044C11.94 21.8444 14.27 23.5044 17 23.5044C19.73 23.5044 22.06 21.8444 23 19.5044C22.06 17.1644 19.73 15.5044 17 15.5044ZM17 22.0044C16.337 22.0044 15.7011 21.741 15.2322 21.2722C14.7634 20.8033 14.5 20.1674 14.5 19.5044C14.5 18.8414 14.7634 18.2055 15.2322 17.7366C15.7011 17.2678 16.337 17.0044 17 17.0044C17.663 17.0044 18.2989 17.2678 18.7678 17.7366C19.2366 18.2055 19.5 18.8414 19.5 19.5044C19.5 20.1674 19.2366 20.8033 18.7678 21.2722C18.2989 21.741 17.663 22.0044 17 22.0044ZM9.27 20.5044H6V4.50439H13V9.50439H18V13.5744C18.7 13.6544 19.36 13.8244 20 14.0644V8.50439L14 2.50439H6C5.46957 2.50439 4.96086 2.71511 4.58579 3.09018C4.21071 3.46525 4 3.97396 4 4.50439V20.5044C4 21.0348 4.21071 21.5435 4.58579 21.9186C4.96086 22.2937 5.46957 22.5044 6 22.5044H10.5C9.99562 21.9006 9.58132 21.2269 9.27 20.5044Z" />
    </svg>
  )

  const PdfImage = (
    <svg
      width="23"
      height="24"
      viewBox="0 0 23 24"
      className={
        selectedPVs.length == 1 || selectedCon.length == 1 || selectedMem.length == 1
          ? '[&>path]:fill-blue duration-100'
          : '[&>path]:fill-dark-gray/25 dark:[&>path]:fill-white/25 duration-100'
      }
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 0.75H2.5C1.125 0.75 0 1.875 0 3.25V20.75C0 22.125 1.125 23.25 2.5 23.25H20C21.375 23.25 22.5 22.125 22.5 20.75V3.25C22.5 1.875 21.375 0.75 20 0.75ZM8.125 11.375C8.125 12.375 7.25 13.25 6.25 13.25H5V15.75H3.125V8.25H6.25C7.25 8.25 8.125 9.125 8.125 10.125V11.375ZM14.375 13.875C14.375 14.875 13.5 15.75 12.5 15.75H9.375V8.25H12.5C13.5 8.25 14.375 9.125 14.375 10.125V13.875ZM19.375 10.125H17.5V11.375H19.375V13.25H17.5V15.75H15.625V8.25H19.375V10.125ZM11.25 10.125H12.5V13.875H11.25V10.125ZM5 10.125H6.25V11.375H5V10.125Z" />
    </svg>
  )

  function handlePreview(num, rapport_ou_pv) {
    return new Promise(async () => {
      let path = await window.electronAPI.getPath()
      if (rapport_ou_pv == win[0]) {
        console.log('in rapport')
        const pdfToPreview = await axios
          .post(api + '/archive/printrapport', { numR: num, path: path })
          .then((res) => {
            const result = window.electronAPI.getUrl()
          })
          .catch((err) => console.log(err))
      } else {
        console.log('in pv')
        const pdfToPreview = await axios
          .post(api + '/archive/printpv', { numPV: num, path: path })
          .then((res) => {
            const result = window.electronAPI.getUrl()
          })
          .catch((err) => console.log(err))
      }
    })
  }

  async function handleDetailedViewRapport(numR) {
    setView(true)
    const tache1 = await axios
      .post(api + '/rapport/gets', { numR: numR })
      .then((res) => {
        setCurrentViewedRappport({ ...res.data[0], num_r: numR })
      })
      .catch((err) => console.log(err))
  }

  function handleModifyRapport() {}

  async function handleViewPV() {
    addLoadingBar()
    setView(true)
    console.log('selected pv: ', selectedPVs)
    const tache1 = await axios
      .post(api + '/archive/getspv', { numPV: selectedPVs[0].num_pv })
      .then((res) => {
        console.log(res.data)
        setCurrentViewedPV({ ...res.data, numPV: selectedPVs[0].num_pv })
        console.log('the object', { ...res.data, numPV: selectedPVs[0].num_pv })
      })
      .catch((err) => console.log(err))
    RemoveLoadingBar()
  }

  async function handleViewCD() {
    addLoadingBar()
    const tache = await axios
      .post(api + '/archive/getscd', { numCD: selectedCon[0].num_cd })
      .then((res) => {
        console.log(res)
        setCurrentViewedCD(res.data)
      })
      .catch((err) => console.log(err))
    RemoveLoadingBar()
  }

  const filteredEtudiants = useMemo(() => {
    return Array.isArray(rapports)
      ? rapports.filter((etudiant) => {
          return etudiant.nom_e
            .toLowerCase()
            .concat(' ')
            .concat(etudiant.prenom_e.toLowerCase())
            .includes(query.toLowerCase())
        })
      : ''
  }, [rapports, query])

  const tabRapports = Array.isArray(filteredEtudiants) ? (
    filteredEtudiants.map((m) => (
      <tr className="border-y-[1px]">
        <td>
          <span>{m.num_r}</span>
        </td>
        <td>{[m.nom_e, ' ', m.prenom_e]}</td>
        <td>{m.date_i.slice(0, m.date_i.indexOf('T'))}</td>
        <td>
          <div className="w-full flex justify-evenly">
            <button
              onClick={() => {
                handleDetailedViewRapport(m.num_r)
              }}
            >
              <img src={VoirDossierSVG} alt=""></img>
            </button>
            {account == 'chef' && (
              <button onClick={() => handleModifyRapport()}>
                <img src={!dark ? ModifierDossierGraySVG : ModifierDossierSVG} alt=""></img>
              </button>
            )}
          </div>
        </td>
      </tr>
    ))
  ) : (
    <></>
  )

  const filteredPVs = useMemo(() => {
    return Array.isArray(PVs)
      ? PVs.filter((etudiant) => {
          return etudiant.nom_e
            .toLowerCase()
            .concat(' ')
            .concat(etudiant.prenom_e.toLowerCase())
            .includes(queryPV.toLowerCase())
        })
      : ''
  }, [PVs, queryPV])

  const tabPVs = Array.isArray(filteredPVs) ? (
    filteredPVs.map((m) => (
      <tr
        className={
          selectedPVs.findIndex((el) => el == m) == -1
            ? 'border-y duration-150 ease-linear hover:bg-side-bar-white-theme-color dark:hover:bg-dark-gray'
            : 'border-y duration-150 ease-linear bg-blue/25'
        }
        onClick={() => {
          const found = selectedPVs.findIndex((el) => el == m)
          if (found == -1) setSelectedPVs((prev) => [...prev, m])
          else {
            setSelectedPVs((prev) => prev.slice(0, found).concat(prev.slice(found + 1)))
          }
        }}
      >
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

  const filteredMembers = useMemo(() => {
    return Array.isArray(commissions)
      ? commissions.filter((m) => {
          return m.nom_m
            .toLowerCase()
            .concat(' ')
            .concat(m.prenom_m.toLowerCase())
            .includes(queryCom.toLowerCase())
        })
      : ''
  }, [commissions, queryCom])

  const tabComs = Array.isArray(filteredMembers) ? (
    filteredMembers.map((m) => (
      <tr
        className={
          selectedMem.findIndex((el) => el == m) == -1
            ? 'border-y duration-150 ease-linear hover:bg-side-bar-white-theme-color dark:hover:bg-dark-gray'
            : 'border-y duration-150 ease-linear bg-blue/25'
        }
        onClick={() => {
          const found = selectedMem.findIndex((el) => el == m)
          if (found == -1) setSelectedMem((prev) => [...prev, m])
          else {
            setSelectedMem((prev) => prev.slice(0, found).concat(prev.slice(found + 1)))
          }
        }}
      >
        <td>
          <span>{m.id_m}</span>
        </td>
        <td>{[m.nom_m, ' ', m.prenom_m]}</td>
        <td>{m.date_debut_c.slice(0, m.date_debut_c.indexOf('T'))}</td>
        <td>{m.date_fin_c.slice(0, m.date_fin_c.indexOf('T'))}</td>
        <td>{m.role_m}</td>
      </tr>
    ))
  ) : (
    <></>
  )

  const tabCons = Array.isArray(conseils) ? (
    conseils.map((m) => (
      <tr
        className={
          selectedCon.findIndex((el) => el == m) == -1
            ? 'border-y duration-150 ease-linear hover:bg-side-bar-white-theme-color dark:hover:bg-dark-gray'
            : 'border-y duration-150 ease-linear bg-blue/25'
        }
        onClick={() => {
          const found = selectedCon.findIndex((el) => el == m)
          if (found == -1) setSelectedCon((prev) => [...prev, m])
          else {
            setSelectedCon((prev) => prev.slice(0, found).concat(prev.slice(found + 1)))
          }
        }}
      >
        <td>
          <span>{m.num_cd}</span>
        </td>
        <td>{m.date_cd.slice(0, m.date_cd.indexOf('T'))}</td>
      </tr>
    ))
  ) : (
    <></>
  )
  return (
    <div ref={archivePage} className="w-full h-full">
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
              Conseil de Discipline
            </button>
          </div>
          {currentWindow == win[0] && (
            <div className="flex px-4 justify-end h-16 items-center bg-side-bar-white-theme-color dark:bg-dark-gray">
              <div className="searchDiv">
                <img className="imgp" src={BlueSearchSVG} alt="search icon"></img>
                <input
                  className="searchInput"
                  aria-label="search input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Rapport"
                ></input>
              </div>
            </div>
          )}
          {currentWindow == win[1] && (
            <div className="h-16 px-4 flex items-center justify-between bg-side-bar-white-theme-color text-[18px] dark:bg-dark-gray">
              <div className="w-fit flex gap-4">
                <button
                  onClick={() => {
                    if (selectedPVs.length == 1) {
                      handlePreview(selectedPVs[0].num_pv, win[1])
                    }
                  }}
                  className="text-blue"
                >
                  <div
                    className={selectedPVs.length == 1 ? 'button_active_blue' : 'button_inactive'}
                  >
                    {PdfImage}PDF
                  </div>
                </button>
                {account == 'president' && (
                  <button>
                    <div
                      className={selectedPVs.length == 1 ? 'button_active_blue' : 'button_inactive'}
                    >
                      {modifierImage}Modifier
                    </div>
                  </button>
                )}
                <button className="text-blue">
                  <div
                    className={selectedPVs.length == 1 ? 'button_active_blue' : 'button_inactive'}
                    onClick={() => {
                      if (selectedPVs.length == 1) {
                        handleViewPV()
                      }
                    }}
                  >
                    {voirDossierImage}Voir
                  </div>
                </button>
              </div>
              <div className="searchDiv">
                <img className="imgp" src={BlueSearchSVG} alt="search icon"></img>
                <input
                  className="searchInput"
                  aria-label="search input"
                  value={queryPV}
                  onChange={(e) => setQueryPV(e.target.value)}
                  type="search"
                  placeholder="Dossier"
                ></input>
              </div>
            </div>
          )}
          {currentWindow == win[2] && (
            <div className="h-16 px-4 flex items-center justify-between bg-side-bar-white-theme-color text-[18px] dark:bg-dark-gray">
              <div className="w-fit flex gap-4">
                <button>
                  <div
                    className={selectedMem.length == 1 ? 'button_active_blue' : 'button_inactive'}
                  >
                    {modifierImage}Modifier
                  </div>
                </button>
              </div>
              <div className="searchDiv">
                <img className="imgp" src={BlueSearchSVG} alt="search icon"></img>
                <input
                  className="searchInput"
                  aria-label="search input"
                  value={queryCom}
                  onChange={(e) => setQueryCom(e.target.value)}
                  type="search"
                  placeholder="Membre"
                ></input>
              </div>
            </div>
          )}
          {currentWindow == win[3] && (
            <div className="h-16 px-4 flex items-center justify-between bg-side-bar-white-theme-color text-[18px] dark:bg-dark-gray">
              <div className="w-fit flex gap-4">
                <button
                  onClick={() => {
                    if (selectedCon.length == 1) {
                      handlePreview()
                    }
                  }}
                  className="text-blue"
                >
                  <div
                    className={selectedCon.length == 1 ? 'button_active_blue' : 'button_inactive'}
                  >
                    {PdfImage}PDF
                  </div>
                </button>
                <button>
                  <div
                    className={selectedCon.length == 1 ? 'button_active_blue' : 'button_inactive'}
                  >
                    {modifierImage}Modifier
                  </div>
                </button>
                <button className="text-blue">
                  <div
                    className={selectedCon.length == 1 ? 'button_active_blue' : 'button_inactive'}
                    onClick={() => {
                      if (selectedCon.length == 1) {
                        handleViewCD()
                      }
                    }}
                  >
                    {voirDossierImage}Voir
                  </div>
                </button>
              </div>
              <div className="searchDiv">
                <img className="imgp" src={BlueSearchSVG} alt="search icon"></img>
                <input
                  className="searchInput"
                  aria-label="search input"
                  value={queryCon}
                  onChange={(e) => setQueryCon(e.target.value)}
                  type="search"
                  placeholder="Conseil"
                ></input>
              </div>
            </div>
          )}
          <div className="w-full grow h-[50vh]">
            <div className="w-full max-h-full overflow-y-auto">
              <table className="w-full">
                <tr className="border-t-[1px]">
                  {currentWindow == win[0] && (
                    <>
                      <th className="w-1/4">
                        <div>Rapport</div>
                      </th>
                      <th className="w-1/4 ">
                        <div>Nom Etudiant</div>
                      </th>
                      <th className="w-1/4">
                        <div>Date de l'infraction</div>
                      </th>
                      <th className="w-1/4">
                        <div>Action</div>
                      </th>
                    </>
                  )}
                  {currentWindow == win[1] && (
                    <>
                      <th className="w-1/5 ">
                        <div>PV</div>
                      </th>
                      <th className="w-1/5">
                        <div>Nom Etudiant</div>
                      </th>
                      <th className="w-1/5 ">
                        <div>Date de l'infraction</div>
                      </th>
                      <th className="w-1/5">
                        <div>Date de PV</div>
                      </th>
                      <th className="w-1/5">
                        <div>Sanction </div>
                      </th>
                    </>
                  )}
                  {currentWindow == win[2] && (
                    <>
                      <th className="w-1/5">
                        <div>Membre</div>
                      </th>
                      <th className="w-1/5 ">
                        <div>Nom Membre</div>
                      </th>
                      <th className="w-1/5 ">
                        <div>Date de debut</div>
                      </th>
                      <th className="w-1/5">
                        <div>Date de fin</div>
                      </th>
                      <th className="w-1/5">
                        <div>Role </div>
                      </th>
                    </>
                  )}
                  {currentWindow == win[3] && (
                    <>
                      <th className="w-1/5">
                        <div>Conseild Discipline</div>
                      </th>
                      <th className="w-1/5 ">
                        <div>Date</div>
                      </th>
                    </>
                  )}
                </tr>
                {currentWindow == win[0] && tabRapports}
                {currentWindow == win[1] && tabPVs}
                {currentWindow == win[2] && tabComs}
                {currentWindow == win[3] && tabCons}
              </table>
            </div>
          </div>
        </div>
      )}
      {view && currentWindow == win[0] && (
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
                  <p>matricule: {currentViewedRapport.matricule_e}</p>
                  <p>Nom: {[currentViewedRapport.nom_e, ' ', currentViewedRapport.prenom_e]}</p>
                  <p>Niveau: {currentViewedRapport.niveau_e}</p>
                  <p>Section: {currentViewedRapport.section_e}</p>
                  <p>Groupe: {currentViewedRapport.groupe_e}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations du plaignant</h3>
                <div className="flex flex-col gap-3">
                  <p>Nom: {[currentViewedRapport.nom_p, ' ', currentViewedRapport.prenom_p]}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations globales</h3>
                <div className="flex flex-col gap-3">
                  {currentViewedRapport.date_i && (
                    <p>
                      Date de l’infraction:
                      {currentViewedRapport.date_i.slice(
                        0,
                        currentViewedRapport.date_i.indexOf('T')
                      )}
                    </p>
                  )}
                  {currentViewedRapport.date_r && (
                    <p>
                      Date de Rapport:
                      {currentViewedRapport.date_r.slice(
                        0,
                        currentViewedRapport.date_r.indexOf('T')
                      )}
                    </p>
                  )}
                  <p>Lieu: {currentViewedRapport.lieu_i}</p>
                  <p>Motif: {currentViewedRapport.motif_i}</p>
                  <p>Degre: {currentViewedRapport.degre_i}</p>
                  {currentViewedRapport.description_i && (
                    <p>Description: {currentViewedRapport.description_i}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/2 justify-center items-center [&>button]:w-1/3 [&>button]:min-w-fit gap-4">
            <button
              onClick={() => {
                handlePreview(currentViewedRapport.num_r, win[0])
              }}
              className="modify_rapport_button"
            >
              <img src={PdfSVG}></img>
              PDF
            </button>
            <button className="modify_rapport_button">
              <img src={dark ? EnvoyerSVG : EnvoyerGraySVG}></img>envoyer
            </button>
          </div>
        </div>
      )}
      {view && currentWindow == win[1] && (
        <div className="w-full h-full flex">
          <div className="h-full w-1/2 bg-side-bar-white-theme-color dark:bg-dark-gray flex flex-col">
            <button
              className="w-10 aspect-square"
              onClick={() => {
                setView(false)
                setSelectedPVs([])
              }}
            >
              <img src={!dark ? GOBackGraySVG : GOBackSVG}></img>
            </button>
            <div className="overflow-y-auto max-h-[86vh] flex flex-col w-full h-auto px-8 gap-4">
              <h2 className="text-4xl">Details du PV</h2>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations de l'étudiant:</h3>
                <div className="flex flex-col gap-3">
                  <p>matricule: {currentViewedPV.matriculeE}</p>
                  <p>Nom: {[currentViewedPV.nomE, ' ', currentViewedPV.prenomE]}</p>
                  <p>Niveau: {currentViewedPV.niveauE}</p>
                  <p>Section: {currentViewedPV.sectionE}</p>
                  <p>Groupe: {currentViewedPV.groupeE}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations du plaignant</h3>
                <div className="flex flex-col gap-3">
                  <p>Nom: {[currentViewedPV.nomP, ' ', currentViewedPV.prenomP]}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-blue text-2xl">Informations du l'infraction</h3>
                <div className="flex flex-col gap-3">
                  <p>Date: {currentViewedPV.dateI ? currentViewedPV.dateI.slice(0, 10) : ''}</p>
                  <p>Lieu: {currentViewedPV.lieuI}</p>
                  <p>Motif: {currentViewedPV.motifI}</p>
                  {/* <p>Degre: {currentViewedPV.degre_i}</p> */}
                  <p>Description: {currentViewedPV.descriptionI}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-full w-1/2 bg-side-bar-white-theme-color dark:bg-dark-gray flex flex-col">
            <div className="w-full grow h-[50vh]">
              <div className="w-full h-full overflow-y-auto">
                <div className="flex flex-col gap-4">
                  <h3 className="text-blue text-2xl">Informations du Conseil discipline</h3>
                  <div className="flex flex-col gap-3">
                    <p>Date: {currentViewedPV.dateCd ? currentViewedPV.dateCd.slice(0, 10) : ''}</p>
                    <div>
                      membres:{' '}
                      <div className="w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
                        {Array.isArray(currentViewedPV.membres) &&
                          currentViewedPV.membres.length != 0 &&
                          currentViewedPV.membres.map((t) => (
                            <div className="flex justify-between *:w-1/3 border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray">
                              <div>{t.role}</div>
                              <div>{t.nom}</div>
                              <div>{t.prenom}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-blue text-2xl">Informations du PV</h3>
                  <div className="flex flex-col gap-3">
                    <p>Sanction: {currentViewedPV.libeleS}</p>
                    <p>Date: {currentViewedPV.datePV ? currentViewedPV.datePV.slice(0, 10) : ''}</p>

                    <p>
                      temoins:{' '}
                      <div className="w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
                        {Array.isArray(currentViewedPV.temoins) &&
                          currentViewedPV.temoins.length != 0 &&
                          currentViewedPV.temoins.map((t) => (
                            <div className="flex justify-between *:w-1/3 border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray">
                              <div>{t.role}</div>
                              <div>{t.nom}</div>
                              <div>{t.prenom}</div>
                            </div>
                          ))}
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Archive
