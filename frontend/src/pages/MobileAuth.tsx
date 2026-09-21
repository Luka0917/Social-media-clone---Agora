import { useStore } from "../store/store";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import { LuMoon } from "react-icons/lu";
import { LuSun } from "react-icons/lu";

type MobileAuthProps = {
    isSignIn: boolean,
    toggleAuth: () => void;
};

export default function MobileAuth({ isSignIn, toggleAuth }: MobileAuthProps){
    const { theme, themeToggle } = useStore();

    return (
        <div className={`${theme === 'light' ? 'bg-[#f5f8fb]' : 'bg-[#080d14]'} flex flex-col justify-center items-start min-h-screen w-full px-6`}>
            <div className={`${theme === 'light' ? 'bg-[#1874ed]' : 'bg-[#4490fe]'} w-[50%] h-20 absolute top-0 left-[25%] blur-[200px] z-0 pointer-events-none`}></div>
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
            <div className="w-full max-w-sm">
                <h2 className="inline-block font text-2xl font-bold bg-[linear-gradient(115deg,oklch(0.58_0.2_258),oklch(0.79_0.14_200))] bg-clip-text text-transparent">Agora</h2>
                <div className="w-full mt-5">
                    {isSignIn ? (
                        <SignIn toggleAuth={toggleAuth} />
                    ) : (
                        <SignUp toggleAuth={toggleAuth} />
                    )}
                </div>
            </div>
        </div>
    )
}