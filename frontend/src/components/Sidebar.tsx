import { useStore } from "../store/store";
import { NavLink } from "react-router";
import { LuHouse } from "react-icons/lu";
import { LuBell } from "react-icons/lu";
import { LuMessageCircle } from "react-icons/lu";
import { LuUser } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";

export default function Sidebar(){
    const { theme } = useStore();

    const links = [
        { nameEng: "Home", nameGeo: "მთავარი", icon: LuHouse, path: "/" },
        { nameEng: "Notifications", nameGeo: "შეტყობინებები", icon: LuBell, path: "/notifications" },
        { nameEng: "Messages", nameGeo: "შეტყობინებები", icon: LuMessageCircle, path: "/messages" },
        { nameEng: "Profile", nameGeo: "პროფილი", icon: LuUser, path: "/profile" },
        { nameEng: "Settings", nameGeo: "პარამეტრები", icon: LuSettings, path: "/settings" }
    ];

    const linkClass = `flex items-center gap-2 p-2 w-55 font-medium text-sm rounded-full cursor-pointer hover:translate-x-0.5 transition-all duration-100`;

    return (
        <nav className={`${theme === 'light' ? 'bg-white border-[#dae0e7]' : 'bg-[#121721] border-[#2a2e37]'} flex flex-col gap-1 border rounded-3xl w-fit p-2 ml-6 mt-8 z-10`}>
            {links.map((el, i) => (
                <NavLink 
                    key={i} 
                    to={el.path} 
                    className={({ isActive }) => `${linkClass} 
                        ${isActive 
                            ? theme === 'light' 
                                ? 'bg-[#e3eefc] text-[#1874ed]' 
                                : 'bg-[#18253b] text-[#4490fe]' 
                            : theme === 'light'
                                ? 'text-[#737c88] hover:bg-[#eaf1f8] hover:text-black hover:translate-x-0.5'
                                : 'text-[#929ca8] hover:bg-[#1d2430] hover:text-white hover:translate-x-0.5'
                        }
                    `}
                    >
                        <el.icon size={20} />
                        {el.nameEng} {/* make it work on Geo! */}
                </NavLink>
            ))}
        </nav>
    )
}