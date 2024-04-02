import Republic from './../assets/Republic.svg'
import RepubliqueArabe from './../assets/RepubliqueArabe.svg'
import UstoLogo from './../assets/USTO-MB_logo2.svg'

function Slogan() {
  return (
    <div className="flex w-full justify-around bg-light-blue">
      <img className="w-1/3" src={Republic} alt=""></img>
      <img className="w-1/12" src={UstoLogo} alt=""></img>
      <img className="w-1/3" src={RepubliqueArabe} alt=""></img>
    </div>
  )
}

export default Slogan
