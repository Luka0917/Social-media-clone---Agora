import { useId, useState } from "react";
import { useStore } from "../store/store";
import { useNavigate } from "react-router";
import { authClient } from "../lib/auth-clients";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";

type SignInProps = {
    toggleAuth: () => void;
};

export default function SignIn({ toggleAuth }: SignInProps){
    const { theme } = useStore();
    const navigate = useNavigate();
    const emailId = useId();
    const passwordId = useId();
    const [showPassword, setShowPassword] = useState(false);

    async function SignInForm(e:any){
        e.preventDefault();

        const formData = new FormData(e.target);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { data, error } = await authClient.signIn.email({ email, password }, { onSuccess: () => navigate('/') })
        if(error) console.error(error);
        if(data) console.log(data);
    };

    return(
        <div className="slide-in-bottom-animation w-full max-w-sm">
            <h1 className={`${theme === 'light' ? 'text-[#0e141f]' : 'text-[#eef2f7]'} font text-4xl font-bold`}>Sign in</h1>
            <p className={`${theme === 'light' ? 'text-[#747d8b]' : 'text-[#9099a6]'} text-sm`}>A warmer place to share your world.</p>
            <form onSubmit={SignInForm} className="mt-8">
                <div className="flex flex-col">
                    <label htmlFor={emailId} className={`${theme === 'light' ? 'text-[#0e141f]' : 'text-[#eef2f7]'} text-sm font-medium`}>Email</label>
                    <input type="email" placeholder="example@domain.com" name="email" autoComplete="email" id={emailId} className={`${theme === 'light' ? 'border-[#dae0e8] ring-[#1e77ed] placeholder:text-[#9098a3]' : 'border-[#2b2e35] ring-[#4288ed] placeholder:text-[#7b848f] text-[#eef2f7]'} rounded-full h-9.5 placeholder:text-sm text-sm shadow-sm border pl-3 outline-none focus:ring-1`} />
                </div>
                <div className="flex flex-col mt-3">
                    <label htmlFor={passwordId} className={`${theme === 'light' ? 'text-[#0e141f]' : 'text-[#eef2f7]'} text-sm font-medium`}>Password</label>
                    <div className={`${theme === 'light' ? 'border-[#dae0e8] focus-within:ring-[#1e77ed]' : 'border-[#2b2e35] focus-within:ring-[#4288ed] text-[#eef2f7]'} flex items-center h-9.5 px-3 shadow-sm border rounded-full outline-none focus-within:ring-1`}>
                        <input type={showPassword ? 'text' : 'password'} name="password" id={passwordId}className="w-full outline-none text-sm bg-transparent" />
                        <button type="button" onClick={() => setShowPassword(prev => !prev)} className={`${theme === 'light' ? 'text-[#636d7b] hover:bg-[#eaf1f8] hover:text-[#4d94f0]' : 'text-[#9ca6b3] hover:bg-[#1d2430] hover:text-[#4490fe]'} p-1 rounded-full cursor-pointer transition-all duration-200`}>
                            {showPassword 
                                ? <LuEyeOff /> 
                                : <LuEye />
                            }
                        </button>
                    </div>
                </div>
                <button className={`${theme === 'light' ? 'text-[#eef2f7] bg-[#1874ed] hover:opacity-80' : 'text-[#0e141f] bg-[#4490fe] hover:opacity-80'} w-full mt-3 border rounded-full py-2 font-medium cursor-pointer transition-all duration-200`}>Sign in</button>
            </form>
            <p className={`${theme === 'light' ? 'text-[#7a828f]' : 'text-[#8c95a2]'} text-center mt-5 text-sm`}>
                Don't have an account?
                <span onClick={toggleAuth} className={`${theme === 'light' ? 'text-[#1874ed]' : 'text-[#4490fe]'} ml-1 font-medium hover:underline cursor-pointer`}>Sign up</span>
            </p>
        </div>
    )
}