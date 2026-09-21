import { useState } from "react";
import { useStore } from "../store/store";
// TODO import useWinowWidth from "../hooks/useWindowWidth";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MostFollowedbar from "../components/MostFollowedbar";
import { LuCalendarDays } from "react-icons/lu";
import { LuCake } from "react-icons/lu";
import { LuUserRound } from "react-icons/lu";
import { LuHeart } from "react-icons/lu";

export default function Profile(){
    const { theme } = useStore();
    const [editProfile, setEditProfile] = useState(false);
    //TODO const width = useWinowWidth();

    //TODO if(width < 768) return <MobileProfile />

    //TODO if(width < 1024) return <TabletProfile />

    return (
        <div className={`${theme === 'light' ? 'bg-[#f6f9fc]' : 'bg-[#080c14]'} min-h-screen flex flex-col`}>
            <div className={`${theme === 'light' ? 'bg-[#1874ed]' : 'bg-[#4490fe]'} w-[50%] h-20 absolute top-0 left-[25%] blur-[250px] z-0 pointer-events-none`}></div>
            <Navbar />

            <div className="h-full flex items-start justify-between">
                <Sidebar />
                <div className={`${theme === 'light' ? 'bg-white border-[#dae0e7]' : 'bg-[#121721] border-[#292f38]'} slide-in-bottom-animation w-full max-w-250 h-fit border rounded-3xl mt-8 z-10`}>
                    <div className="h-45 w-full flex justify-end items-end rounded-tl-3xl rounded-tr-3xl relative bg-[linear-gradient(115deg,oklch(0.58_0.2_258),oklch(0.79_0.14_200))]">
                        <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent ${theme === 'light' ? 'to-white' : 'to-[#121721]'}`}></div>
                        <span className="absolute top-15 left-95 text-5xl font-bold text-white font">Agora</span>
                        <button 
                            className={`
                                ${theme === 'light' 
                                    ? 'text-black bg-[#eaf1f8] hover:bg-transparent'
                                    : 'text-white bg-[#1d2430] hover:bg-transparent'
                                }
                                relative z-10 text-xs font-medium rounded-full px-3 py-1.5 mr-4 mb-2 shadow-lg hover:text-[#3d83e2] cursor-pointer transition-all duration-200
                            `}
                        >
                            Change banner
                        </button>
                    </div>
                    <div className="relative -mt-10 px-4 mb-5">
                        <div className="flex justify-between items-end">
                            <img src="../../public/pfp.svg" alt="pfp" className={`${theme === 'light' ? 'border-[#9bc1f5]' : 'border-[#29497c]'} border-4 rounded-full w-20 h-20`} />
                            <button
                                onClick={() => setEditProfile(true)}
                                className={`
                                    ${theme === 'light'
                                        ? 'text-black bg-[#eaf1f8] hover:bg-[#ddeafd] hover:text-[#2c80ef]'
                                        : 'text-white bg-[#1d2430] hover:bg-[#192a42] hover:text-[#4088ee]'
                                    }
                                    text-sm font-medium rounded-full px-3 py-1.5 cursor-pointer transition-all duration-200
                                `}
                            >
                                Edit profile
                            </button>
                        </div>
                        <div className="leading-2.5">
                            <h1 className={`${theme === 'light' ? 'text-black' : 'text-white'} font text-lg font-medium`}>Full name</h1>
                            <span className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} font text-xs`}>@Username</span>
                        </div>
                        <p className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm mt-3`}>Bio...</p>
                        <div className="flex justify-between items-center gap-3 w-full mt-5">
                            <div className={`${theme === 'light' ? 'bg-[#f7f9fc] border-[#dae0e8]' : 'bg-[#171c27] border-[#2e323d]'} border rounded-3xl w-full flex-1 py-1 text-center`}>
                                <p className={`${theme === 'light' ? 'text-black' : 'text-white'} font font-semibold`}>0</p>
                                <p className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} uppercase text-xs`}>posts</p>
                            </div>
                            <div className={`${theme === 'light' ? 'bg-[#f7f9fc] border-[#dae0e8]' : 'bg-[#171c27] border-[#2e323d]'} border rounded-3xl w-full flex-1 py-1 text-center`}>
                                <p className={`${theme === 'light' ? 'text-black' : 'text-white'} font font-semibold`}>0</p>
                                <p className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} uppercase text-xs`}>followers</p>
                            </div>
                            <div className={`${theme === 'light' ? 'bg-[#f7f9fc] border-[#dae0e8]' : 'bg-[#171c27] border-[#2e323d]'} border rounded-3xl w-full flex-1 py-1 text-center`}>
                                <p className={`${theme === 'light' ? 'text-black' : 'text-white'} font font-semibold`}>0</p>
                                <p className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} uppercase text-xs`}>following</p>
                            </div>
                        </div>
                        {editProfile ? (
                            <form className="mt-5 slide-in-bottom-animation">
                                <div className="flex flex-col">
                                    <label className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm font-medium`}>Username</label>
                                    <input type="text" className={`${theme === 'light' ? 'border-[#dae0e8] focus:outline-[#1874ed]' : 'border-[#333840] focus:outline-[#4490fe] text-white'} border rounded-2xl bg-transparent px-2 py-1.5 shadow-sm focus:outline-1`} />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor="" className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm font-medium`}>First name</label>
                                        <input type="text" className={`${theme === 'light' ? 'border-[#dae0e8] focus:outline-[#1874ed]' : 'border-[#333840] focus:outline-[#4490fe] text-white'} border rounded-2xl bg-transparent px-2 py-1.5 shadow-sm focus:outline-1`} />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor="" className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm font-medium`}>Last name</label>
                                        <input type="text" className={`${theme === 'light' ? 'border-[#dae0e8] focus:outline-[#1874ed]' : 'border-[#333840] focus:outline-[#4490fe] text-white'} border rounded-2xl bg-transparent px-2 py-1.5 shadow-sm focus:outline-1`} />
                                    </div>
                                </div>
                                <div className="flex flex-col mt-2">
                                    <label htmlFor="" className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm font-medium`}>Bio</label>
                                    <textarea name="" id="" className={`${theme === 'light' ? 'border-[#dae0e8] focus:outline-[#1874ed]' : 'border-[#333840] focus:outline-[#4490fe] text-white'} border rounded-2xl bg-transparent min-h-17 px-2 py-1.5 shadow-sm focus:outline-1`}></textarea>
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor="" className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm font-medium`}>Date of birth</label>
                                        <input type="date" className={`${theme === 'light' ? 'border-[#dae0e8] focus:outline-[#1874ed]' : 'border-[#333840] focus:outline-[#4490fe] text-white'} border rounded-2xl bg-transparent px-2 py-1.5 shadow-sm focus:outline-1`} />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor="" className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm font-medium`}>Gender</label>
                                        <select className={`${theme === 'light' ? 'border-[#dae0e8] focus:outline-[#1874ed]' : 'border-[#333840] focus:outline-[#4490fe] text-white'} border rounded-2xl bg-transparent px-2 py-1.5 shadow-sm focus:outline-1 ${theme === 'dark' ? '[&>option]:bg-black [&>option]:text-white' : ''}`} defaultValue="Not set">
                                            <option>Not set</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col mt-2 w-1/2">
                                    <label htmlFor="" className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm font-medium`}>Relationship status</label>
                                    <select className={`${theme === 'light' ? 'border-[#dae0e8] focus:outline-[#1874ed]' : 'border-[#333840] focus:outline-[#4490fe] text-white'} border rounded-2xl bg-transparent px-2 py-1.5 shadow-sm focus:outline-1 ${theme === 'dark' ? '[&>option]:bg-black [&>option]:text-white' : ''}`} defaultValue="Not set">
                                        <option>Not set</option>
                                        <option>Single</option>
                                        <option>In a relationship</option>
                                        <option>Engaged</option>
                                        <option>Married</option>
                                        <option>In a civil union</option>
                                        <option>It's complicated</option>
                                        <option>In a domestic partnership</option>
                                        <option>Widowed</option>
                                        <option>Separated</option>
                                        <option>Divorced</option>
                                    </select>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        className={`
                                            ${theme === 'light' 
                                                ? 'bg-[#1874ed] text-white hover:bg-[#4690f1]'
                                                : 'bg-[#4490fe] text-black hover:bg-[#3a78d2]'
                                            }
                                            rounded-full py-1.5 px-4 font-medium cursor-pointer transition-all duration-200
                                        `}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditProfile(false)}
                                        className={`
                                            ${theme === 'light'
                                                ? 'text-black hover:bg-[#eaf1f8] hover:text-[#1874ed]'
                                                : 'text-white hover:bg-[#1d2430] hover:text-[#4490fe]'
                                            }
                                            rounded-full py-1.5 px-4 font-medium cursor-pointer transition-all duration-200
                                        `}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="mt-5 slide-in-bottom-animation">
                                <h2 className={`${theme === 'light' ? 'text-black' : 'text-white'} font text-sm font-semibold`}>About</h2>
                                <dl className="grid grid-cols-2 gap-2 mt-2">
                                    <div className={`${theme === 'light' ? 'bg-[#f7f9fc] border-[#dae0e8]' : 'bg-[#171c27] border-[#2e323d]'} border rounded-3xl p-2 flex items-center gap-2`}>
                                        <LuCake size={18} className={`${theme === 'light' ? 'text-[#1874ed]' : 'text-[#4490fe]'}`} />
                                        <div>
                                            <dt className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-xs`}>Date of birth</dt>
                                            <dd className={`${theme === 'light' ? 'text-black' : 'text-white'} text-sm font-medium`}>0001-01-01</dd>
                                        </div>
                                    </div>

                                    <div className={`${theme === 'light' ? 'bg-[#f7f9fc] border-[#dae0e8]' : 'bg-[#171c27] border-[#2e323d]'} border rounded-3xl p-2 flex items-center gap-2`}>
                                        <LuUserRound size={18} className={`${theme === 'light' ? 'text-[#1874ed]' : 'text-[#4490fe]'}`} />
                                        <div>
                                            <dt className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-xs`}>Gender</dt>
                                            <dd className={`${theme === 'light' ? 'text-black' : 'text-white'} text-sm font-medium`}>Male</dd>
                                        </div>
                                    </div>

                                    <div className={`${theme === 'light' ? 'bg-[#f7f9fc] border-[#dae0e8]' : 'bg-[#171c27] border-[#2e323d]'} border rounded-3xl p-2 flex items-center gap-2`}>
                                        <LuHeart size={18} className={`${theme === 'light' ? 'text-[#1874ed]' : 'text-[#4490fe]'}`} />
                                        <div>
                                            <dt className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-xs`}>Relationship status</dt>
                                            <dd className={`${theme === 'light' ? 'text-black' : 'text-white'} text-sm font-medium`}>Single</dd>
                                        </div>
                                    </div>

                                    <div className={`${theme === 'light' ? 'bg-[#f7f9fc] border-[#dae0e8]' : 'bg-[#171c27] border-[#2e323d]'} border rounded-3xl p-2 flex items-center gap-2`}>
                                        <LuCalendarDays size={18} className={`${theme === 'light' ? 'text-[#1874ed]' : 'text-[#4490fe]'}`} />
                                        <div>
                                            <dt className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-xs`}>Joined</dt>
                                            <dd className={`${theme === 'light' ? 'text-black' : 'text-white'} text-sm font-medium`}>September 2026</dd>
                                        </div>
                                    </div>
                                </dl>
                            </div>
                        )}
                    </div>
                </div>
                <MostFollowedbar />
            </div>


            <div className="w-100 h-100 bg-red-500 mt-150"></div>
            <div className="w-100 h-100 bg-red-500"></div>
            <div className="w-100 h-100 bg-red-500"></div>
            <div className="w-100 h-100 bg-red-500"></div>
            <div className="w-100 h-100 bg-red-500"></div>
        </div>
    )
}