import { useState } from "react";
import { useStore } from "../store/store";
import { LuCrown } from "react-icons/lu";

export default function MostFollowedbar(){
    const { theme } = useStore();
    const [chosen, setChosen] = useState('weekly');
    
    const activeClass = `
        ${theme === "light"
            ? "bg-[#1874ed] text-white"
            : "bg-[#4490fe] text-black"
        }
        text-xs font-medium px-4 py-1 rounded-full cursor-pointer
        transition-all duration-200
    `;

    const inactiveClass = `
        ${theme === "light"
            ? "text-[#6a7481] hover:text-black"
            : "text-[#97a1ae] hover:text-white"
        }
        text-xs font-medium px-4 py-1 rounded-full cursor-pointer
        transition-all duration-200
    `;

    return (
        <div className={`${theme === 'light' ? 'bg-white border-[#dae0e7]' : 'bg-[#121721] border-[#2a2e37]'} flex flex-col border rounded-3xl p-4 mr-6 mt-8 z-10`}>
            <div className="flex items-center gap-2">
                <span className={`${theme === 'light' ? 'bg-[#e3eefc] text-[#1874ed]' : 'bg-[#18253b] text-[#4490fe]'} rounded-full p-1`}>
                    <LuCrown />
                </span>
                <h2 className={`${theme === 'light' ? 'text-black' : 'text-white'} text-sm font-medium`}>Most followed</h2>
            </div>
            <div className={`${theme === 'light' ? 'bg-[#f3f7fb]' : 'bg-[#191f2a]'} flex items-center gap-1 w-full rounded-full p-1 mt-3`}>
                <button onClick={() => setChosen("weekly")} className={chosen === "weekly" ? activeClass : inactiveClass}>Weekly</button>
                <button onClick={() => setChosen("monthly")} className={chosen === "monthly" ? activeClass : inactiveClass}>Monthly</button>
                <button onClick={() => setChosen("yearly")} className={chosen === "yearly" ? activeClass : inactiveClass}>Yearly</button>
            </div>
            <ul className="flex justify-center mt-3">
                <span className=" text-sm font-medium text-[#737c88]">No data</span>
            </ul>
        </div>
    )
}