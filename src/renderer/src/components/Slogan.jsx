import Republic from './../assets/Republic.svg'
import RepubliqueArabe from './../assets/RepubliqueArabe.svg'
import UstoLogo from './../assets/USTO-MB_logo2.svg'

function Slogan() {
  return <div className="flex w-full justify-around bg-light-blue">
    <img src={Republic} alt="People's ..."></img>
    <img src={UstoLogo} alt="Uni logo"></img>
    <img src={RepubliqueArabe} alt="People's ..."></img>
  </div>
}

export default Slogan