import { useStore } from "../store/store";
import { Link } from "react-router";
import { LuMoon } from "react-icons/lu";
import { LuSun } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";

export default function MobileNavbar(){
    const { theme, themeToggle } = useStore();

    return (
        <div className={`${theme === 'light' ? 'bg-[#eef4fa] text-[#0e141f] border-[#dae0e8]' : 'bg-[#0b121e] text-[#eef2f7] border-[#222a35]'} flex justify-between items-center py-2 px-4 border-b relative z-10`}>
            <Link to={'/'} className="font text-2xl font-bold bg-[linear-gradient(115deg,oklch(0.58_0.2_258),oklch(0.79_0.14_200))] bg-clip-text text-transparent">Agora</Link>
            <div className="flex justify-center items-center gap-3">
                <button onClick={themeToggle} className={`${theme === 'light' ? 'hover:bg-[#eaf1f8] hover:text-[#1874ed]' : 'hover:bg-[#1d2430] hover:text-[#4490fe]'} rounded-full p-2 cursor-pointer transition-all duration-200`}>{theme === 'light' ? <LuMoon size={20} /> : <LuSun size={20} />}</button>
                <Link to={'/'} className={`${theme === 'light' ? 'hover:bg-[#eaf1f8] hover:text-[#1874ed]' : 'hover:bg-[#1d2430] hover:text-[#4490fe]'} rounded-full p-2 cursor-pointer transition-all duration-200`}><LuSettings size={20} /></Link>
                <button className={`${theme === 'light' ? 'hover:bg-[#eaf1f8] hover:text-[#1874ed]' : 'hover:bg-[#1d2430] hover:text-[#4490fe]'} rounded-full p-2 cursor-pointer transition-all duration-200`}><LuLogOut size={20} /></button>
                <Link to={'/'} className="border-3 border-[#9cc3f6] rounded-full">
                    <img src="../../public/pfp.svg" alt="pfp" className="rounded-full w-10 h-10" />
                </Link>
            </div>
        </div>
    )
}