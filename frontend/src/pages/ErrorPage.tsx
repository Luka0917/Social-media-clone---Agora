import { Link, useNavigate } from "react-router";
import { useStore } from "../store/store"

export default function ErrorPage(){
    const { theme } = useStore();
    const navigate = useNavigate();

    return (
        <div className={`${theme === 'light' ? 'bg-[#f6f9fc]' : 'bg-[#080c14]'} relative min-h-screen overflow-hidden flex justify-center items-center`}>
            <div className="absolute -top-32 -left-32 w-100 h-100 rounded-full bg-[oklch(0.66_0.18_258/0.18)] blur-3xl" />
            <div className={`${theme === 'light' ? 'bg-[#1874ed]' : 'bg-[#4490fe]'} w-[50%] h-20 absolute top-0 left-[25%] blur-[250px] z-0 pointer-events-none`}></div>
            <div className="absolute top-50 right-120 w-70 h-70 rounded-full bg-[oklch(0.82_0.13_199/0.12)] blur-3xl" />
            <div className="absolute -bottom-40 -right-20 w-120 h-120 rounded-full bg-[oklch(0.82_0.13_199/0.18)] blur-3xl" />

            <div className="slide-in-bottom-animation flex flex-col items-center justify-center">
                <div className="flex justify-center items-center gap-3">
                    <span className='font text-[150px] font-bold bg-[linear-gradient(115deg,oklch(0.58_0.2_258),oklch(0.79_0.14_200))] bg-clip-text text-transparent'>4</span>
                    <span className="scale-and-move-animation inline-flex h-32 w-32 rounded-full bg-[linear-gradient(115deg,oklch(0.58_0.2_258),oklch(0.79_0.14_200))] p-1">
                        <span className={`${theme === "light" ? "bg-white" : "bg-[#121721]"} flex h-full w-full items-center justify-center rounded-full text-6xl`}>
                            🛰️
                        </span>
                    </span>
                    <span className='font text-[150px] font-bold bg-[linear-gradient(115deg,oklch(0.58_0.2_258),oklch(0.79_0.14_200))] bg-clip-text text-transparent'>4</span>
                </div>
                <div className="slide-in-bottom-animation flex flex-col justify-center items-center">
                    <p className={`${theme === 'light' ? 'text-[#636d7b]' : 'text-[#9ca6b3]'} text-xs uppercase tracking-[5px]`}>Error 404 — lost in the feed</p>
                    <h1 className={`${theme === 'light' ? 'text-black' : 'text-white'} font text-4xl font-bold my-3`}>Page not found</h1>
                    <p className={`${theme === 'light' ? 'text-[#636d7b]' : 'text-[#9ca6b3]'} w-100`}>The page you're looking for doesn't exist, was moved, or never had its moment. Let's get you back to the action.</p>
                    <div className="flex justify-center items-center gap-3 mt-7">
                        <Link
                            to={'/'} 
                            className={`
                                ${theme === 'light' 
                                    ? 'text-white' 
                                    : 'text-black'
                                } bg-[linear-gradient(115deg,oklch(0.58_0.2_258),oklch(0.79_0.14_200))] px-5 py-2 text-sm font-medium rounded-full cursor-pointer hover:scale-105 transition-all duration-200
                            `}
                        >
                            Back to feed
                        </Link>
                        <button
                            onClick={() => navigate(-1)} 
                            className={`
                                ${theme === 'light' 
                                    ? 'bg-[#fbfdfe] text-black border-[#dae0e8] hover:bg-[#d1f2f5] hover:text-[#25303d]' 
                                    : 'bg-[#0e131c] text-white border-[#262a32] hover:bg-[#0f2b33] hover:text-[#0a1019]'
                                } px-5 py-2 text-sm font-medium border rounded-full cursor-pointer transition-all duration-200
                            `}
                        >
                            Go back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}