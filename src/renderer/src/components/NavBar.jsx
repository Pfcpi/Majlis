import useAccount from '../zustand/account'
import DarkLightTheme from '../components/DarkLightTheme/DarkLightTheme'

function NavBar() {
  const { account } = useAccount()
  return (
    <div className="h-[44px] w-full flex items-center justify-between bg-[#DADADA] dark:bg-[#333333] px-5">
      <h2 className="w-fit text-blue">
        {account === 'chef'
          ? "Bonjour madam chef de département"
          : 'Bonjour Monsieur Président de Conseil de Discipline'}
      </h2>
      <div className="flex w-fit justify-end">
        <DarkLightTheme></DarkLightTheme>
      </div>
    </div>
  )
}
export default NavBar
