import BellSVG from '../assets/Bell.svg'
import BulbSVG from '../assets/BulbOutlined.svg'
import SettingSVG from '../assets/SettingOutlined.svg'
import SearchSVG from "../assets/Search.svg"

function NavBar() {
  return (
    <div className="h-[44px] w-full flex items-center justify-between bg-[#333333] px-5">
      <div className='flex w-[20%]'></div>
      <div className='flex justify-self-center justify-center items-center w-[440px] h-6 rounded border-[#ffffff33] border-[1px] bg-[#1C1E24] text-white font-poppins text-[13px]'><img src={SearchSVG}></img>Rechercher un étudiant</div>
      <div className='flex gap-[30px] w-[20%] justify-end'>
        <img src={BellSVG}></img>
        <img src={BulbSVG}></img>
        <img src={SettingSVG}></img>
      </div>
    </div>
  )
}
export default NavBar
