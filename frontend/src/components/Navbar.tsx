import { useStore } from "../store/store";
import useWinowWidth from "../hooks/useWindowWidth";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { authClient } from "../lib/auth-clients";
import MobileNavbar from "./MobileNavbar";
import TabletNavbar from "./TabletNavbar";
import { LuMoon } from "react-icons/lu";
import { LuSun } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";
import { LuSearch } from "react-icons/lu";

export default function Navbar(){
    const width = useWinowWidth();
    const { theme, themeToggle } = useStore();
    const navigate = useNavigate();
    const { data: session} = authClient.useSession();

    async function signOut(){
        await authClient.signOut({ 
            fetchOptions: {
                onSuccess: () => {
                    navigate('/auth');
                }
            }
        })
    };

    if(width < 768) return <MobileNavbar />

    if(width < 1024) return <TabletNavbar />

    return (
        <div className={`${theme === 'light' ? 'bg-[#f5f8fb] text-[#0e141f] border-[#dae0e8]' : 'bg-[#080d14] text-[#eef2f7] border-[#222a35]'} flex justify-between items-center py-2 px-5 border-b sticky top-0 z-10`}>
            <div className="flex justify-center items-center gap-5">
                <Link to={'/'} className="font text-2xl font-bold bg-[linear-gradient(115deg,oklch(0.58_0.2_258),oklch(0.79_0.14_200))] bg-clip-text text-transparent">Agora</Link>
                <div className={`${theme === 'light' ? 'bg-[#eef3f9] border-[#dae0e8] ring-[#9ac2f6]' : 'bg-[#141a25] border-[#222a35] ring-[#224477]'} border rounded-full py-1.5 px-2 flex justify-start items-center w-100 focus-within:ring-2 transition-all duration-200`}>
                    <LuSearch size={18} className={theme === 'light' ? 'text-[#636d7b]' : 'text-[#9ca6b3]'} />
                    <input type="text" placeholder="Search..." className={`${theme === 'light' ? 'placeholder:text-[#7d838d]' : 'placeholder:text-[#81868f]'} w-full focus:outline-none pl-3`} />
                </div>
            </div>
            <div className="flex justify-center items-center gap-3">
                <button onClick={themeToggle} className={`${theme === 'light' ? 'hover:bg-[#eaf1f8] hover:text-[#1874ed]' : 'hover:bg-[#1d2430] hover:text-[#4490fe]'} rounded-full p-2 cursor-pointer transition-all duration-200`}>{theme === 'light' ? <LuMoon size={20} /> : <LuSun size={20} />}</button>
                <Link to={'/'} className={`${theme === 'light' ? 'hover:bg-[#eaf1f8] hover:text-[#1874ed]' : 'hover:bg-[#1d2430] hover:text-[#4490fe]'} rounded-full p-2 cursor-pointer transition-all duration-200`}><LuSettings size={20} /></Link>
                <button 
                    onClick={signOut} 
                    className={`
                        ${theme === 'light' ? 'hover:bg-[#eaf1f8] hover:text-[#1874ed]' : 'hover:bg-[#1d2430] hover:text-[#4490fe]'} 
                        rounded-full p-2 cursor-pointer transition-all duration-200
                    `}
                    >
                        <LuLogOut size={20} />
                </button>
                <Link to={'/profile'} className={`${theme === 'light' ? 'border-[#dae0e8] bg-[#f0f4fa] hover:bg-[#deeaf9]' : 'border-[#2b3038] bg-[#131822] hover:bg-[#0e192b]'} flex justify-center items-center gap-2 border rounded-full p-0.5 pr-3 transition-all duration-200`}>
                    <img src="../../public/pfp.svg" alt="pfp" className={`${theme === 'light' ? 'border-[#9bc1f5]' : 'border-[#29497c]'} border-2 rounded-full w-10 h-10`} />
                    <span className={`${theme === 'light' ? 'text-[#0e141f]' : 'text-[#eef2f7]'} text-sm font-medium`}>{session?.user.email}</span>
                </Link>
            </div>
        </div>
    )
};