import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'

import './sidebar_com_css/archives.css'

import useDark from '../../../zustand/dark'

import UpDownSVG from './../../../assets/UpDown.svg'
import UpDownGraySVG from './../../../assets/BlueSvgs/UpDownGray.svg'
import ModifierDossierSVG from './../../../assets/ModifierDossier.svg'
import ModifierDossierGraySVG from './../../../assets/BlueSvgs/ModifierDossierGray.svg'

//Tasks:
//make the skeleton
//Responsiveness
//fetch data
function AjouterPV() {
  const { dark } = useDark()

  const [rapports, setRapports] = useState()
  const [currentSelectedRapports, setCurrentSelectedRapports] = useState([])
  const [query, setQuery] = useState('')
  const [supprimer, setSupprimer] = useState(false)
  const [addPV, setAddPV] = useState(false)
  const [members, setMembers] = useState([])
  const [membersForCurrentPV, setMembersForCurrentPV] = useState([])

  //VALID
  // Add a pv
  /* Body being in the format of :
  {
	 "dateCd": string value in the format of 'YYYY-MM-DD',
   "idM": [
    "1": int value,
    "2": int value or null,
    "3": int value or null,
    "4": int value or null,
    "5": int value or null
   ],
   "libeleS": string value,
   "temoin": {
    "1": {
    "nomT": string value,
    "prenomT": string value,
    "roleT": string value
    } or null,
    "2": {
    "nomT": string value,
    "prenomT": string value,
    "roleT": string value
    } or null,
    "3": {
    "nomT": string value,
    "prenomT": string value,
    "roleT": string value
    } or null
  },
   "numR": int value
  }
*/

  const [pv, setPv] = useState({
    dateCd: new Date().toISOString().slice(0, 19).replace('T', ' '),
    idM: [],
    libeleS: '',
    temoin: [
      { nomT: 'amir', prenomT: 'madjour', roleT: 'etudiant' },
      { nomT: 'hichem', prenomT: 'guerid', roleT: 'prof' }
    ],
    numR: 0
  })

  const api = 'http://localhost:3000'

  useEffect(() => {
    axios
      .get(api + '/rapport/get')
      .then((res) => {
        setRapports(res.data)
      })
      .catch((err) => console.log(err))
  }, [])

  const filteredRapports = useMemo(() => {
    return Array.isArray(rapports)
      ? rapports.filter((rapport) => {
          return rapport.nom_e
            .toLowerCase()
            .concat(' ')
            .concat(rapport.prenom_e.toLowerCase())
            .includes(query.toLowerCase())
        })
      : ''
  }, [rapports, query])

  const tableRapport = Array.isArray(filteredRapports) ? (
    filteredRapports.map((rapport) => (
      <tr
        className={
          currentSelectedRapports.findIndex((el) => el == rapport) == -1
            ? 'border-y duration-150 ease-linear hover:bg-side-bar-white-theme-color dark:hover:bg-dark-gray'
            : 'border-y duration-150 ease-linear bg-blue/25'
        }
        onClick={() => {
          const found = currentSelectedRapports.findIndex((el) => el == rapport)
          if (found == -1) setCurrentSelectedRapports((prev) => [...prev, rapport])
          else {
            setCurrentSelectedRapports((prev) => prev.slice(0, found).concat(prev.slice(found + 1)))
          }
        }}
      >
        <td className="border-x">
          <span>{rapport.num_r}</span>
        </td>
        <td className="font-medium border-x">{[rapport.nom_e, ' ', rapport.prenom_e]}</td>
        <td className="border-x">{rapport.date_i.slice(0, rapport.date_i.indexOf('T'))}</td>
        <td className="border-x">
          <button
            onClick={() => {
              setAddPV(true)
              setPv((prev) => ({ ...prev, numR: rapport.num_r }))
            }}
          >
            <img src={dark ? ModifierDossierSVG : ModifierDossierGraySVG}></img>
          </button>
        </td>
      </tr>
    ))
  ) : (
    <></>
  )

  const supprimerImage = (
    <svg
      width="18"
      height="24"
      viewBox="0 0 18 24"
      fill="none"
      className={
        currentSelectedRapports.length != 0
          ? '[&>path]:fill-red duration-100'
          : '[&>path]:fill-dark-gray/25 dark:[&>path]:fill-white/25 duration-100'
      }
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.25 20.75C1.25 21.413 1.51339 22.0489 1.98223 22.5178C2.45107 22.9866 3.08696 23.25 3.75 23.25H13.75C14.413 23.25 15.0489 22.9866 15.5178 22.5178C15.9866 22.0489 16.25 21.413 16.25 20.75V5.75H1.25V20.75ZM3.75 8.25H13.75V20.75H3.75V8.25ZM13.125 2L11.875 0.75H5.625L4.375 2H0V4.5H17.5V2H13.125Z" />
    </svg>
  )

  const enregistrerImage = (
    <svg
      className={
        currentSelectedRapports.length == 1
          ? '[&>path]:fill-blue duration-100'
          : '[&>path]:fill-dark-gray/25 dark:[&>path]:fill-white/25 duration-100'
      }
      width="23"
      height="24"
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 0.75H2.5C1.125 0.75 0 1.875 0 3.25V20.75C0 22.125 1.125 23.25 2.5 23.25H20C21.375 23.25 22.5 22.125 22.5 20.75V3.25C22.5 1.875 21.375 0.75 20 0.75ZM8.125 11.375C8.125 12.375 7.25 13.25 6.25 13.25H5V15.75H3.125V8.25H6.25C7.25 8.25 8.125 9.125 8.125 10.125V11.375ZM14.375 13.875C14.375 14.875 13.5 15.75 12.5 15.75H9.375V8.25H12.5C13.5 8.25 14.375 9.125 14.375 10.125V13.875ZM19.375 10.125H17.5V11.375H19.375V13.25H17.5V15.75H15.625V8.25H19.375V10.125ZM11.25 10.125H12.5V13.875H11.25V10.125ZM5 10.125H6.25V11.375H5V10.125Z" />
    </svg>
  )

  const imprimerImage = (
    <svg
      className={
        currentSelectedRapports.length == 1
          ? '[&>path]:fill-blue duration-100'
          : '[&>path]:fill-dark-gray/25 dark:[&>path]:fill-white/25 duration-100'
      }
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.25 7C23.325 7 25 8.675 25 10.75V18.25H20V23.25H5V18.25H0V10.75C0 8.675 1.675 7 3.75 7H5V0.75H20V7H21.25ZM7.5 3.25V7H17.5V3.25H7.5ZM17.5 20.75V15.75H7.5V20.75H17.5ZM20 15.75H22.5V10.75C22.5 10.0625 21.9375 9.5 21.25 9.5H3.75C3.0625 9.5 2.5 10.0625 2.5 10.75V15.75H5V13.25H20V15.75ZM21.25 11.375C21.25 12.0625 20.6875 12.625 20 12.625C19.3125 12.625 18.75 12.0625 18.75 11.375C18.75 10.6875 19.3125 10.125 20 10.125C20.6875 10.125 21.25 10.6875 21.25 11.375Z"
        fill="#068EE7"
      />
    </svg>
  )

  const RechercherSvg = (
    <svg
      className={'[&>path]:fill-dark-gray dark:[&>path]:fill-white duration-100 ml-2'}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.9007 15.7086C11.9649 15.7086 12.9464 15.3677 13.7493 14.7996L16.77 17.7917C16.9102 17.9306 17.0951 18 17.2926 18C17.7069 18 18 17.6844 18 17.2804C18 17.091 17.9363 16.9079 17.7961 16.7754L14.7945 13.7959C15.4254 12.9753 15.8014 11.959 15.8014 10.8543C15.8014 8.18411 13.5964 6 10.9007 6C8.21136 6 6 8.1778 6 10.8543C6 13.5245 8.20499 15.7086 10.9007 15.7086ZM10.9007 14.6607C8.79766 14.6607 7.05789 12.9374 7.05789 10.8543C7.05789 8.77117 8.79766 7.04787 10.9007 7.04787C13.0037 7.04787 14.7435 8.77117 14.7435 10.8543C14.7435 12.9374 13.0037 14.6607 10.9007 14.6607Z"
        fill-opacity="0.6"
      />
    </svg>
  )

  const handleAnuuler = (e) => {
    e.preventDefault()
    setAddPV({
      dateCd: new Date().toISOString().slice(0, 19).replace('T', ' '),
      idM: [],
      libeleS: '',
      temoin: [],
      numR: 0
    })
    setAddPV(false)
  }

  const handleAjouter = async (e) => {
    e.preventDefault()
    const tache = await axios
      .post(api + '/pv/add', pv)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))

    setAddPV({
      dateCd: new Date().toISOString().slice(0, 19).replace('T', ' '),
      idM: [],
      libeleS: '',
      temoin: [],
      numR: 0
    })

    const tache1 = await axios
      .get(api + '/rapport/get')
      .then((res) => {
        setRapports(res.data)
      })
      .catch((err) => console.log(err))
    setAddPV(false)
  }

  async function handleSupprimer() {
    if (currentSelectedRapports.length != 0) {
      currentSelectedRapports.map(async (sr) => {
        const tache = await axios
          .delete(api + '/rapport/delete', { data: { numR: sr.num_r } })
          .then((res) => console.log(res))
          .catch((err) => console.log(err))
      })

      const tache1 = await axios
        .get(api + '/rapport/get')
        .then((res) => {
          setRapports(res.data)
          console.log(res.data)
        })
        .catch((err) => console.log(err))

      setSupprimer(false)
    }
  }

  const handleInputChange = async (e) => {
    const { name, value } = e.target
    setPv((prevState) => ({
      ...prevState,
      [name]: value
    }))

    if (name == 'dateCd') {
      const tache = await axios
        .get(api + '/archive/getcommission')
        .then((res) => {
          setMembers(res.data)
          setMembersForCurrentPV([res.data[0], res.data[1], res.data[2], res.data[3], res.data[4]])
          console.log(res.data)
        })
        .catch((err) => console.log(err))
    }
    setPv((prev) => ({ ...prev, idM: [1, 2, 3, 4, 5] }))
  }

  return (
    <div className="flex w-full h-full">
      {addPV && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-blue/25 z-10">
          <form className="w-1/2 overflow-y-auto flex flex-col justify-between items-center rounded-xl bg-side-bar-white-theme-color dark:bg-dark-gray min-h-fit min-w-[500px]">
            <h1 className="text-[36px] py-4">Détails du PV</h1>
            <hr className="w-full text-dark-gray/50 dark:text-gray"></hr>
            <div className="flex w-5/6 flex-col gap-6 my-4">
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="dateCd"
                  onChange={handleInputChange}
                  value={pv.dateCd}
                  type="date"
                  required
                ></input>
              </div>
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="libeleS"
                  id="libeleS"
                  onChange={handleInputChange}
                  value={pv.libeleS}
                  required
                ></input>
                <label className="label_rapport" htmlFor="libeleS">
                  libele
                </label>
              </div>
              <div className="container_input_rapport">
                <h2>Membres présents au conseil</h2>
                <div className="w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
                  {membersForCurrentPV.map((p) => (
                    <div className="flex justify-between *:w-1/3 border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray">
                      <div>{p.role_m}</div>
                      <div>{p.nom_m}</div>
                      <div>{p.prenom_m}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="container_input_rapport">
                <h2>les témoins</h2>
                <div className="w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
                  {pv.temoin.map((t) => (
                    <div className="flex justify-between *:w-1/3 border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray">
                      <div>{t.roleT}</div>
                      <div>{t.nomT}</div>
                      <div>{t.prenomT}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between py-4 w-5/6">
              <button
                className="button_dossier text-red border-red hover:bg-red/25"
                onClick={handleAnuuler}
              >
                Annuler
              </button>
              <button
                className="button_dossier text-blue border-blue hover:bg-blue/25"
                type="submit"
                onClick={handleAjouter}
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      )}
      {!addPV && (
        <div className="flex flex-col w-full h-full">
          {supprimer && (
            <div className="absolute flex items-center justify-center w-full h-full bg-[rgba(0,0,0,0.6)] top-0 left-0 z-20">
              <div className="flex flex-col justify-evenly text-xl items-center h-40 w-1/3 z-30 rounded-xl text-white dark:text-black bg-dark-gray dark:bg-white">
                Confirmer la suppression du rapport
                <div className="flex w-full justify-between px-8">
                  <button
                    onClick={() => {
                      setSupprimer(false)
                    }}
                    className="flex justify-center items-center border rounded-xl text-red py-2 px-4 bg-0.36-red"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSupprimer}
                    className="flex justify-center items-center border rounded-xl text-blue py-2 px-4 bg-0.08-blue"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex w-full justify-between py-3">
            <div className="flex gap-6 px-6">
              <button
                className={
                  currentSelectedRapports.length == 1
                    ? 'flex border py-2 px-4 rounded-xl gap-2 border-blue text-blue bg-blue/25 duration-100'
                    : 'flex border py-2 px-4 rounded-xl gap-2 border-table-border-white-theme-color text-dark-gray/25 dark:text-white/25 dark:border-white/25 cursor-not-allowed'
                }
              >
                {imprimerImage}
                Imprimer
              </button>
              <button
                className={
                  currentSelectedRapports.length == 1
                    ? 'flex border py-2 px-4 rounded-xl gap-2 border-blue text-blue bg-blue/25 duration-100'
                    : 'flex border py-2 px-4 rounded-xl gap-2 border-table-border-white-theme-color text-dark-gray/25 dark:text-white/25 dark:border-white/25 cursor-not-allowed'
                }
              >
                {enregistrerImage}
                Enregistrer pdf
              </button>
              <button
                className={
                  currentSelectedRapports.length != 0
                    ? 'flex border py-2 px-4 rounded-xl gap-2 bg-red/25 dark:bg-brown text-red duration-100'
                    : 'flex border py-2 px-4 rounded-xl gap-2 text-dark-gray/25 dark:text-white/25 duration-100 cursor-not-allowed'
                }
                onClick={() => {
                  setSupprimer(true)
                }}
              >
                {supprimerImage}
                supprimer
              </button>
            </div>
            <div className="flex bg-side-bar-white-theme-color justify-center items-center dark:bg-light-gray rounded-lg mx-3">
              {RechercherSvg}
              <input
                className="flex justify-start items-center w-[240px] h-10 px-2 py-1 rounded-lg bg-transparent outline-none  dark:text-white"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Rechercher"
              ></input>
            </div>
          </div>
          <table className="w-full">
            <tr className="border-t">
              <th className="w-1/4 border-x">
                <div>
                  Rapport
                  <img className="imgp" src={dark ? UpDownSVG : UpDownGraySVG} alt="filter"></img>
                </div>
              </th>
              <th className="w-1/4 border-x">
                <div>
                  Nom Etudiant
                  <img className="imgp" src={dark ? UpDownSVG : UpDownGraySVG} alt="filter"></img>
                </div>
              </th>
              <th className="w-1/4 border-x">
                <div>
                  Date de l'infraction
                  <img className="imgp" src={dark ? UpDownSVG : UpDownGraySVG} alt="filter"></img>
                </div>
              </th>
              <th className="w-1/4 border-x">
                <div>Action</div>
              </th>
            </tr>
            {tableRapport}
          </table>
        </div>
      )}
    </div>
  )
}
export default AjouterPV
