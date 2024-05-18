import useAccount from '../zustand/account'
import DarkLightTheme from '../components/DarkLightTheme/DarkLightTheme'
import useHelp from '../zustand/help'
import { useRef } from 'react'

function NavBar() {
  const { account } = useAccount()
  const { help, setHelp, ExitHelp } = useHelp()

  return (
    <div className="h-[44px] w-full flex items-center justify-between bg-[#DADADA] dark:bg-[#333333] px-5">
      <div></div>
      <h2 className="w-fit text-blue">
        {[
          'Bienvenue, M./Mme. ',
          account == 'chef' ? 'Chef de département' : 'Président du conseil'
        ]}
      </h2>
      <div className="flex gap-2 w-fit *:w-8 *:h-8 *:shadow-lg">
        <div className="flex justify-end ">
          <DarkLightTheme></DarkLightTheme>
        </div>
        <button
          onClick={() => {
            if (help) {
              ExitHelp()
            } else {
              setHelp()
            }
          }}
          className="bg-blue text-white z-30 rounded-md"
        >
          ?
        </button>
      </div>
    </div>
  )
}
export default NavBar
