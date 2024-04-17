import BellSVG from '../assets/Bell.svg'
import BulbSVG from '../assets/BulbOutlined.svg'
import SettingSVG from '../assets/SettingOutlined.svg'
import SearchSVG from '../assets/Search.svg'

import DarkLightTheme from '../components/DarkLightTheme/DarkLightTheme'

function NavBar() {
  return (
    <div className="h-[44px] w-full flex items-center justify-between bg-[#DADADA] dark:bg-[#333333] px-5">
      <div className="flex w-[20%]"></div>
      <label htmlFor='RechercherDossier' className='flex items-center justify-center px-6 w-[440px] h-6 rounded-xl bg-white dark:bg-[#1C1E24] dark:text-white font-poppins text-[13px]'>
        <img src={SearchSVG}></img>
        <input
          className="outline-none w-full dark:bg-[#1C1E24]"
          type="search"
          id='RechercherDossier'
          placeholder="Rechercher un dossier"
        ></input>
      </label>

      <div className="flex gap-[30px] w-[20%] justify-end">
        <img src={SettingSVG}></img>
        <DarkLightTheme></DarkLightTheme>
      </div>
    </div>
  )
}
export default NavBar