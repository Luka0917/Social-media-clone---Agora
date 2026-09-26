import { useStore } from "./store/store"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar";
import MostFollowedbar from "./components/MostFollowedbar";

function App() {
  const { theme } = useStore();

  return (
    <div className={`${theme === 'light' ? 'bg-[#f6f9fc]' : 'bg-[#080c14]'} min-h-screen`}>
      <div className={`${theme === 'light' ? 'bg-[#1874ed]' : 'bg-[#4490fe]'} w-[50%] h-20 absolute top-0 left-[25%] blur-[250px] z-0 pointer-events-none`}></div>
      <Navbar />

      <div className="h-full flex items-start justify-between">
        <Sidebar />
        <div className={`${theme === 'light' ? 'bg-white border-[#dae0e7]' : 'bg-[#121721] border-[#2a2e37]'} w-full max-w-5xl h-40 border rounded-3xl mt-8 z-10`}>

        </div>
        <MostFollowedbar />
      </div>

      <div className="w-100 h-100 bg-red-500 mt-170"></div>
      <div className="w-100 h-100 bg-red-500"></div>
      <div className="w-100 h-100 bg-red-500"></div>
      <div className="w-100 h-100 bg-red-500"></div>
      <div className="w-100 h-100 bg-red-500"></div>
    </div>
  )
}
export default App