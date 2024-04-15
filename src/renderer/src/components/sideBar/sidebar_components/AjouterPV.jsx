import { useRef } from 'react'
import useDark from '../../../zustand/dark'

import UpDownSVG from './../../../assets/UpDown.svg'
import UpDownGraySVG from './../../../assets/BlueSvgs/UpDownGray.svg'

function AjouterPV() {
  const { dark } = useDark()
  const ref = useRef(null)
  
  function handleRowChecked() {
    var label = ref.current
    label.click()
  }

  return (
    <table className="">
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
      </tr>
      <tr className="border-y dark:hover:bg-dark-gray" onClick={handleRowChecked}>
        <td className="border-x">
          <label className="" ref={ref} id="DossierCheck">
            <input className="mr-2" type="checkbox"></input>
            <span>1000</span>
          </label>
        </td>
        <td className="font-medium border-x">Aboura yacine</td>
        <td className="border-x">22 Jan 2023</td>
      </tr>
    </table>
  )
}
export default AjouterPV
