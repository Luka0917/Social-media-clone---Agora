import { useState } from "react";
import { useStore } from "../store/store";
import useWinowWidth from "../hooks/useWindowWidth";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import MobileAuth from "./MobileAuth";
import TabletAuth from "./TabletAuth";
import { LuMoon } from "react-icons/lu";
import { LuSun } from "react-icons/lu";
import { LuCamera } from "react-icons/lu";
import { LuMessagesSquare } from "react-icons/lu";
import { LuSparkles } from "react-icons/lu";

export default function Auth(){
    const { theme, themeToggle } = useStore();
    const [isSignIn, setIsSignIn] = useState(true);
    const width = useWinowWidth();

    const toggleAuth = () => setIsSignIn(prev => !prev);

    if(width < 768) return <MobileAuth isSignIn={isSignIn} toggleAuth={toggleAuth} />

    if(width < 1024) return <TabletAuth isSignIn={isSignIn} toggleAuth={toggleAuth} />

    return(
        <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
            <section className={`${theme === 'light' ? 'bg-[#f2f5fa]' : 'bg-[#11151f]'} relative overflow-hidden`}>
                <div className={`${theme === "light" ? "bg-[linear-gradient(to_right,rgb(226,229,234)_1px,transparent_1px),linear-gradient(to_bottom,rgb(226,229,234)_1px,transparent_1px)]" : "bg-[linear-gradient(to_right,rgb(33,37,46)_1px,transparent_1px),linear-gradient(to_bottom,rgb(33,37,46)_1px,transparent_1px)]"} pointer-events-none absolute inset-0 bg-size-[calc(100%/18)_calc(100%/17)]`}></div>
                <div className={`${theme === "light" ? "bg-cyan-400/25" : "bg-cyan-500/25"} pointer-events-none absolute -top-40 -left-40 size-140 rounded-full blur-[75px]`}></div>
                <div className={`${theme === "light" ? "bg-blue-400/20" : "bg-cyan-400/20"} pointer-events-none absolute -right-40 -bottom-40 size-130 rounded-full blur-[140px]`}></div>
                <div className="relative z-10 min-h-screen flex justify-between flex-col pl-10 py-10">
                    <span className="inline-block font text-2xl font-bold bg-[linear-gradient(115deg,oklch(0.58_0.2_258),oklch(0.79_0.14_200))] bg-clip-text text-transparent">Agora</span>
                    <div className="flex flex-col gap-5 w-fit">
                        <h2 className={`${theme === 'light' ? 'text-[#0e141f]' : 'text-[#eef2f7]'} font slide-in-bottom-animation text-4xl font-bold`}>Where your people are.</h2>
                        <p className={`${theme === 'light' ? 'text-[#939ba5]' : 'text-[#7a838f]'} slide-in-bottom-animation text-lg w-121`}>Share photos, videos and thoughts. Follow friends, jump into group chats and never miss a moment.</p>
                        <ul className="flex flex-col gap-3">
                            <li className={`${theme === 'light' ? 'bg-[#f9fbfd] border-[#dae0e8]' : 'bg-[#121721] border-[#292e37]'} slide-in-bottom-animation border rounded-3xl py-3 px-5 w-full flex items-center gap-3`}>
                                <span className={`${theme === 'light' ? 'bg-[#d7e8fa] text-[#1874ed]' : 'bg-[#182941] text-[#4490fe]'} rounded-full p-2`}><LuCamera /></span>
                                <span className={`${theme === 'light' ? 'text-[#0e141f]' : 'text-[#eef2f7]'} text-sm font-medium`}>Stories that disappear in 24 hours</span>
                            </li>
                            <li className={`${theme === 'light' ? 'bg-[#f9fbfd] border-[#dae0e8]' : 'bg-[#121721] border-[#292e37]'} slide-in-bottom-animation border rounded-3xl py-3 px-5 w-full flex items-center gap-3`}>
                                <span className={`${theme === 'light' ? 'bg-[#d7e8fa] text-[#1874ed]' : 'bg-[#182941] text-[#4490fe]'} rounded-full p-2`}><LuMessagesSquare /></span>
                                <span className={`${theme === 'light' ? 'text-[#0e141f]' : 'text-[#eef2f7]'} text-sm font-medium`}>Real-time chats and group rooms</span>
                            </li>
                            <li className={`${theme === 'light' ? 'bg-[#f9fbfd] border-[#dae0e8]' : 'bg-[#121721] border-[#292e37]'} slide-in-bottom-animation border rounded-3xl py-3 px-5 w-full flex items-center gap-3`}>
                                <span className={`${theme === 'light' ? 'bg-[#d7e8fa] text-[#1874ed]' : 'bg-[#182941] text-[#4490fe]'} rounded-full p-2`}><LuSparkles /></span>
                                <span className={`${theme === 'light' ? 'text-[#0e141f]' : 'text-[#eef2f7]'} text-sm font-medium`}>Follow, like, comment and share</span>
                            </li>
                        </ul>
                    </div>
                    <div className="flex items-center">
                        <img src="../../public/pfp1.png" alt="pfp1" className={`${theme === 'light' ? 'border-[#f6f9fc]' : 'border-[#080c14]'} border-2 rounded-full w-9 h-9`} />
                        <img src="../../public/pfp2.png" alt="pfp2" className={`${theme === 'light' ? 'border-[#f6f9fc]' : 'border-[#080c14]'} border-2 rounded-full w-9 h-9 relative right-3`} />
                        <img src="../../public/pfp3.png" alt="pfp3" className={`${theme === 'light' ? 'border-[#f6f9fc]' : 'border-[#080c14]'} border-2 rounded-full w-9 h-9 relative right-6`} />
                        <img src="../../public/pfp4.png" alt="pfp4" className={`${theme === 'light' ? 'border-[#f6f9fc]' : 'border-[#080c14]'} border-2 rounded-full w-9 h-9 relative right-9`} />
                        <span className={`${theme === 'light' ? 'text-[#939ba5]' : 'text-[#7a838f]'} text-sm relative right-5`}>Photos, videos, thoughts and stories — with real conversations, group chats and the people you actually care about.</span>
                    </div>
                </div>
            </section>
            <section className={`${theme === 'light' ? 'bg-[#f5f8fb]' : 'bg-[#080d14]'} flex justify-center items-center`}>
                <div className={`${theme === 'light' ? 'bg-[#1874ed]' : 'bg-[#4490fe]'} w-[40%] h-20 absolute top-0 blur-[200px] z-0 pointer-events-none`}></div>
                <button
                    onClick={themeToggle} 
                    className={`
                        ${theme === 'light' 
                            ? 'text-[#0e141f] bg-[#f5f8fd] border-[#dae0e8] hover:bg-[#eaf1f8] hover:text-[#1874ed]' 
                            : 'text-[#eef2f7] bg-[#101825] border-[#282f3b] hover:bg-[#1d2430] hover:text-[#4490fe]'
                        } 
                        border rounded-full p-2 absolute top-5 right-5 cursor-pointer transition-all duration-200
                    `}
                    >
                        {theme === 'light' ? <LuMoon size={20} /> : <LuSun size={20} />}
                </button>
                {isSignIn ? (
                    <SignIn toggleAuth={toggleAuth} />
                ) : (
                    <SignUp toggleAuth={toggleAuth} />
                )}
            </section>
        </div>
    )
}