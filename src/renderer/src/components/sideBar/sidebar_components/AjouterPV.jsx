import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'

import './sidebar_com_css/archives.css'

import useDark from '../../../zustand/dark'
import useApi from '../../../zustand/api'

import UpDownSVG from './../../../assets/UpDown.svg'
import UpDownGraySVG from './../../../assets/BlueSvgs/UpDownGray.svg'

function AjouterPV() {
  const { dark } = useDark()
  const { api } = useApi()

  const [rapports, setRapports] = useState()
  const [currentSelectedRapports, setCurrentSelectedRapports] = useState([])
  const [query, setQuery] = useState('')
  const [supprimer, setSupprimer] = useState(false)
  const [pv, setPv] = useState({ numCD: '', libeleS: '', temoin: '', numR: '' })
  const [cd, setCd] = useState({ dateCd: '', id: '' })
  const [members, setMembers] = useState([])
  const [creerConseilState, setCreerConseildState] = useState(false)
  const [isAddingTemoin, setIsAddingTemoin] = useState(false)
  const [temoinBuffer, setTemoinBuffer] = useState({ nomT: '', prenomT: '', roleT: '' })
  const [temoinArray, setTemoinArray] = useState([])

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
    setCd({ id: '', dateCd: '' })
    setCurrentSelectedRapports([])
    setMembers([])
  }

  const handleAjouter = async (e) => {
    e.preventDefault()
    const tache = await axios
      .post(api + '/pv/addPV', {
        numR: pv.numR,
        libeleS: pv.libeleS,
        numCD: pv.numCD,
        temoin: temoinArray
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))

    if (currentSelectedRapports.length > 1) {
      setPv((prev) => ({ ...prev, numR: currentSelectedRapports[1].num_r }))
    }
    if (currentSelectedRapports.length == 1) {
      setMembers([])
    }
    setCurrentSelectedRapports(currentSelectedRapports.slice(1))
    const tache1 = await axios
      .get(api + '/rapport/get')
      .then((res) => {
        setRapports(res.data)
      })
      .catch((err) => console.log(err))
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

  const handleInputTemoinChange = async (e) => {
    const { name, value } = e.target
    setTemoinBuffer((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  return (
    <div className="flex w-full h-full">
      {creerConseilState && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-blue/25 z-10">
          <form className="w-1/2 overflow-y-auto flex flex-col justify-between items-center rounded-xl bg-side-bar-white-theme-color dark:bg-dark-gray min-h-fit min-w-[500px]">
            <h1 className="text-[36px] py-4">Creation d'un CONSEIL DISCIPLINE</h1>
            <hr className="w-full text-dark-gray/50 dark:text-gray"></hr>
            <div className="flex w-5/6 flex-col gap-6 my-4">
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="dateCd"
                  onChange={async (e) => {
                    setCd((prev) => ({ ...prev, dateCd: e.target.value }))
                    const tache = await axios
                      .post(api + '/pv/getActiveCommissionAndMembersByData', {
                        date: e.target.value
                      })
                      .then((res) => {
                        setMembers(res.data)
                        console.log(res.data)
                      })
                      .catch((err) => console.log(err))
                  }}
                  value={cd.dateCd}
                  type="date"
                  required
                ></input>
              </div>
              <div className="container_input_rapport">
                <h2>Membres présents au conseil</h2>
                <div className="w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
                  {members.map((p) => (
                    <div className="flex border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray">
                      <div className="w-5/12">{p.role_m}</div>
                      <div className="w-3/12">{p.nom_m}</div>
                      <div className={members.length > 5 ? 'w-3/12' : 'w-1/3'}>{p.prenom_m}</div>
                      {members.length > 5 && (
                        <button
                          className="flex justify-end w-1/12"
                          onClick={(e) => {
                            e.preventDefault()
                            setMembers(members.filter((item) => item !== p))
                          }}
                        >
                          <div>{supprimerImage}</div>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between py-4 w-5/6">
              <button
                className="button_dossier text-red border-red hover:bg-red/25"
                onClick={(e) => {
                  e.preventDefault()
                  setCreerConseildState(false)
                  setMembers([])
                }}
              >
                Annuler
              </button>
              <button
                className="button_dossier text-blue border-blue hover:bg-blue/25"
                type="submit"
                onClick={async (e) => {
                  e.preventDefault()
                  const tache = await axios
                    .post(api + '/pv/addCD', {
                      dateCd: cd.dateCd,
                      idM: members.map((obj) => obj.id_m)
                    })
                    .then((res) => {
                      console.log(res)
                      setCd((prev) => ({ ...prev, id: res.data[0].num_cd }))
                      setPv((prev) => ({
                        ...prev,
                        numCD: res.data[0].num_cd,
                        numR: currentSelectedRapports[0].num_r
                      }))
                    })
                    .catch((err) => console.log(err))
                  setCreerConseildState(false)
                }}
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      )}
      {cd.id && currentSelectedRapports != 0 && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-blue/25 z-10">
          <form className="w-1/2 overflow-y-auto flex flex-col justify-between items-center rounded-xl bg-side-bar-white-theme-color dark:bg-dark-gray min-h-fit min-w-[500px]">
            <h1 className="text-[36px] py-4">
              Détails du PV de {currentSelectedRapports[0].nom_e}
            </h1>
            <hr className="w-full text-dark-gray/50 dark:text-gray"></hr>
            <div className="flex w-5/6 flex-col gap-6 my-4">
              <div className="container_input_rapport">
                <input
                  className="input_dossier"
                  name="libeleS"
                  id="libeleS"
                  onChange={(e) => {
                    setPv((prev) => ({ ...prev, libeleS: e.target.value }))
                  }}
                  value={pv.libeleS}
                  required
                ></input>
                <label className="label_rapport" htmlFor="libeleS">
                  libele
                </label>
              </div>
              {!isAddingTemoin && temoinArray.length < 3 && (
                <div className="flex w-full justify-between items-center">
                  <div>Ajouter un temoin</div>
                  <button className="bg-blue" onClick={() => setIsAddingTemoin(true)}>
                    A
                  </button>
                </div>
              )}
              {isAddingTemoin && (
                <div className="flex">
                  <div className="container_input_rapport ">
                    <input
                      className="input_dossier rounded-r-none"
                      name="roleT"
                      id="roleT"
                      onChange={handleInputTemoinChange}
                      value={temoinBuffer.roleT}
                      required
                    ></input>
                    <label className="label_rapport" htmlFor="roleT">
                      Role
                    </label>
                  </div>
                  <div className="container_input_rapport">
                    <input
                      className="input_dossier rounded-none"
                      name="nomT"
                      id="nomT"
                      onChange={handleInputTemoinChange}
                      value={temoinBuffer.nomT}
                      required
                    ></input>
                    <label className="label_rapport" htmlFor="nomT">
                      nom
                    </label>
                  </div>
                  <div className="container_input_rapport">
                    <input
                      className="input_dossier rounded-l-none"
                      name="prenomT"
                      id="prenomT"
                      onChange={handleInputTemoinChange}
                      value={temoinBuffer.prenomT}
                      required
                    ></input>
                    <label className="label_rapport" htmlFor="prenomT">
                      Prenom
                    </label>
                  </div>
                  <button
                    className="bg-green-400"
                    onClick={(e) => {
                      e.preventDefault()
                      setTemoinArray((prev) => [...prev, temoinBuffer])
                      setIsAddingTemoin(false)
                      setTemoinBuffer({ nomT: '', prenomT: '', roleT: '' })
                    }}
                  >
                    Aj
                  </button>
                </div>
              )}
              <div className="container_input_rapport">
                <h2>les témoins</h2>
                <div className="w-full h-fit flex top-[62px] flex-col border border-light-gray/50 [&>*:first-child]:border-none [&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl rounded-xl bg-white dark:bg-dark-gray z-20">
                  {Array.isArray(temoinArray) &&
                    temoinArray.length != 0 &&
                    temoinArray.map((t) => (
                      <div className="flex justify-between *:w-1/3 border-t border-light-gray/50 py-1 px-4 hover:font-semibold hover:bg-side-bar-white-theme-color dark:hover:bg-gray">
                        <div>{t.roleT}</div>
                        <div>{t.nomT}</div>
                        <div>{t.prenomT}</div>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            setTemoinArray(temoinArray.filter((item) => item !== t))
                          }}
                        >
                          {supprimerImage}
                        </button>
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
      {(!cd.id || currentSelectedRapports.length == 0) && (
        <div className="flex flex-col w-full h-full">
          {supprimer && (
            <div className="absolute flex items-center justify-center w-full h-full bg-[rgba(0,0,0,0.6)] top-0 left-0 z-20">
              <div className="flex flex-col justify-evenly text-xl items-center h-40 w-1/3 z-30 rounded-xl text-white dark:text-black bg-dark-gray dark:bg-white">
                Confirmer la suppression du PV
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
                  currentSelectedRapports.length != 0
                    ? 'flex border py-2 px-4 rounded-xl gap-2 border-blue text-blue bg-blue/25 duration-100'
                    : 'flex border py-2 px-4 rounded-xl gap-2 border-table-border-white-theme-color text-dark-gray/25 dark:text-white/25 dark:border-white/25 cursor-not-allowed'
                }
                onClick={() => {
                  setCreerConseildState(true)
                }}
              >
                Creer Conseil
              </button>
              <button
                className={
                  currentSelectedRapports.length == 1
                    ? 'flex border py-2 px-4 rounded-xl gap-2 border-blue text-blue bg-blue/25 duration-100'
                    : 'flex border py-2 px-4 rounded-xl gap-2 border-table-border-white-theme-color text-dark-gray/25 dark:text-white/25 dark:border-white/25 cursor-not-allowed'
                }
              >
                {enregistrerImage}
                Voir PDF
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
              <th className="w-1/3 border-x">
                <div>
                  Rapport
                  <img className="imgp" src={dark ? UpDownSVG : UpDownGraySVG} alt="filter"></img>
                </div>
              </th>
              <th className="w-1/3 border-x">
                <div>
                  Nom Etudiant
                  <img className="imgp" src={dark ? UpDownSVG : UpDownGraySVG} alt="filter"></img>
                </div>
              </th>
              <th className="w-1/3 border-x">
                <div>
                  Date de l'infraction
                  <img className="imgp" src={dark ? UpDownSVG : UpDownGraySVG} alt="filter"></img>
                </div>
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
