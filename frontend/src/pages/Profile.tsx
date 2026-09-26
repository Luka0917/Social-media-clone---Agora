import { useState, useId, useEffect, useRef } from "react";
import { useStore } from "../store/store";
// TODO import useWinowWidth from "../hooks/useWindowWidth";
import axios from "axios";
import { API_URL } from "../lib/constants";
import { authClient } from "../lib/auth-clients";
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
    const usernameId = useId();
    const firstNameId = useId();
    const lastNameId = useId();
    const bioId = useId();
    const dateOfBirthId = useId();
    const genderId = useId();
    const statusId = useId();
    const { data: session} = authClient.useSession();
    type Profile = {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
        bio: string | null;
        avatar: string | null;
        avatarSmall: string | null;
        banner: string | null;
        status: string | null;
        occupation: string | null;
        education: string | null;
        dateOfBirth: string | null;
        gender: string | null;
    };
    const [profile, setProfile] = useState<Profile | null>(null);
    const [profileError, setProfileError] = useState<string | null>(null);

    //* Avatar
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarError, setAvatarError] = useState<string | null>(null);
    const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

    //* Banner
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const [bannerUploading, setBannerUploading] = useState(false);
    const [bannerError, setBannerError] = useState<string | null>(null);
    const MAX_BANNER_SIZE = 8 * 1024 * 1024 // 8MB

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    //TODO const width = useWinowWidth();

    async function updateProfile(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const raw = {
            username: formData.get('username'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            bio: formData.get('bio'),
            dateOfBirth: formData.get('dateOfBirth'),
            gender: formData.get('gender'),
            status: formData.get('status')
        };

        const username = (raw.username as string).trim();
        const firstName = (raw.firstName as string).trim();
        const lastName = (raw.lastName as string).trim();

        if(!username || !firstName || !lastName){
            setProfileError('Username, first name, and last name cannot be empty.');
            return;
        }

        const payload: Record<string, unknown> = { username, firstName, lastName };

        const optionalFields: Array<keyof typeof raw> = ['bio', 'dateOfBirth', 'gender', 'status'];
        for(const key of optionalFields){
            const value = raw[key];
            const trimmed = typeof value === 'string' ? value.trim() : '';
            payload[key] = trimmed === '' ? null : trimmed;
        }

        setProfileError(null);

        try{
            await axios.patch(`${API_URL}/users/me/profile`, payload, { withCredentials: true });
            setEditProfile(false);
            fetchProfile();
        }catch(err: any){
            console.error('STATUS:', err.response?.status);
            console.error('BODY:', err.response?.data);
            setProfileError(err.response?.data?.message || 'Something went wrong updating your profile.');
        }
    }

    async function fetchProfile(){
        try{
            const { data } = await axios.get(`${API_URL}/users/me/profile`, { withCredentials: true });
            setProfile(data);
        }catch(err){
            console.error(err);
        }
    }

    useEffect(() => {
        if(session) fetchProfile();
    }, [session?.user.id]);

    const genderLabels: Record<string, string> = {
        male: 'Male',
        female: 'Female',
        other: 'Other',
    };

    const statusLabels: Record<string, string> = {
        single: 'Single',
        in_a_relationship: 'In a relationship',
        engaged: 'Engaged',
        married: 'Married',
        in_a_civil_union: 'In a civil union',
        its_complicated: "It's complicated",
        in_a_domestic_partnership: 'In a domestic partnership',
        in_an_open_relationship: 'In an open relationship',
        widowed: 'Widowed',
        separated: 'Separated',
        divorced: 'Divorced',
    };

    async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0];
        if(!file) return;

        e.target.value = '';
        
        if(avatarUploading) return;

        if(!ALLOWED_TYPES.includes(file.type)){
            setAvatarError('Please upload a JPEG, PNG, or Webp image.');
            return;
        }
        if(file.size > MAX_AVATAR_SIZE){
            setAvatarError('Image must be smaller than 5MB.');
            return;
        }
        
        setAvatarError(null);
        setAvatarUploading(true);

        try{
            const { data } = await axios.post(`${API_URL}/users/me/avatar/presign`, { contentType: file.type }, { withCredentials: true });
            const upload = await fetch(data.presignUrl, { method: 'PUT', body: file, headers: {'Content-Type': file.type} });
            if(!upload.ok) throw new Error('upload failed!');
            await axios.post(`${API_URL}/users/me/avatar`, { publicUrl: data.publicUrl, contentType: file.type }, { withCredentials: true });
            setProfile(prev => prev ? { ...prev, avatar: `${data.publicUrl}?t=${Date.now()}` } : prev);
        }catch(err){
            console.error(err);
            setAvatarError('Something went wrong uploading your avatar. Please try again.');
        }finally{
            setAvatarUploading(false);
        }
    }

    async function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0];
        if(!file) return;

        e.target.value = '';

        if(bannerUploading) return;

        if(!ALLOWED_TYPES.includes(file.type)){
            setBannerError('Please upload a JPEG, PNG, or WebP image.');
            return;
        }
        if(file.size > MAX_BANNER_SIZE){
            setBannerError('Image must be smaller than 8MB.');
            return;
        }

        setBannerError(null);
        setBannerUploading(true);

        try{
            const { data } = await axios.post(`${API_URL}/users/me/banner/presign`, { contentType: file.type }, { withCredentials: true });
            const upload = await fetch(data.presignUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
            if(!upload.ok) throw new Error('Upload failed!');
            await axios.post(`${API_URL}/users/me/banner`, { publicUrl: data.publicUrl }, { withCredentials: true });
            setProfile(prev => prev ? { ...prev, banner: `${data.publicUrl}?t=${Date.now()}` } : prev);
        }catch(err){
            console.error(err);
            setBannerError('Something went wrong uploading your banner. Please try again.');
        }finally{
            setBannerUploading(false);
        }
    }

    //TODO if(width < 768) return <MobileProfile />

    //TODO if(width < 1024) return <TabletProfile />

    return (
        <div className={`${theme === 'light' ? 'bg-[#f6f9fc]' : 'bg-[#080c14]'} min-h-screen flex flex-col`}>
            <div className={`${theme === 'light' ? 'bg-[#1874ed]' : 'bg-[#4490fe]'} w-[50%] h-20 absolute top-0 left-[25%] blur-[250px] z-0 pointer-events-none`}></div>
            <Navbar />

            <div className="h-full flex items-start justify-between">
                <Sidebar />
                <div className={`${theme === 'light' ? 'bg-white border-[#dae0e7]' : 'bg-[#121721] border-[#292f38]'} slide-in-bottom-animation w-full max-w-250 h-fit border rounded-3xl mt-8 z-10`}>
                    <div 
                        className="h-45 w-full flex justify-end items-end rounded-tl-3xl rounded-tr-3xl relative bg-[linear-gradient(115deg,oklch(0.58_0.2_258),oklch(0.79_0.14_200))]"
                        style={profile?.banner ? { backgroundImage: `url(${profile.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                    >
                        <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent ${theme === 'light' ? 'to-white' : 'to-[#121721]'}`}></div>
                        {!profile?.banner && (<span className="font absolute inset-0 flex items-center justify-center text-5xl font-bold text-white">Agora</span>)}
                        <button 
                            type="button"
                            onClick={() => bannerInputRef.current?.click()}
                            disabled={bannerUploading}
                            className={`
                                ${theme === 'light' 
                                    ? 'text-black bg-[#eaf1f8] hover:bg-transparent'
                                    : 'text-white bg-[#1d2430] hover:bg-transparent'
                                }
                                relative z-10 text-xs font-medium rounded-full px-3 py-1.5 mr-4 mb-2 shadow-lg hover:text-[#3d83e2] cursor-pointer transition-all duration-200
                            `}
                        >
                            {bannerUploading ? 'Uploading...' : 'Change banner'}
                        </button>
                        <input
                            ref={bannerInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleBannerChange}
                            disabled={bannerUploading}
                        />
                    </div>
                    {bannerError && (<p className="text-xs text-red-500 mt-1">{bannerError}</p>)}
                    <div className="relative -mt-10 px-4 mb-5">
                        <div className="flex justify-between items-end">
                            <label htmlFor="pfp-upload" className="cursor-pointer hover:scale-105 transition-all duration-300">
                                <img
                                    src={profile?.avatar || "../../public/pfp.svg"}
                                    alt="pfp"
                                    className={`${theme === 'light' ? 'border-[#9bc1f5]' : 'border-[#29497c]'} border-4 rounded-full w-20 h-20 object-cover`}
                                />
                                <input
                                    id="pfp-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                    disabled={avatarUploading}
                                />
                            </label>
                            {avatarUploading && (<p className="text-xs text-gray-400 mt-1">Uploading...</p>)}
                            {avatarError && (<p className="text-xs text-red-500 mt-1">{avatarError}</p>)}
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
                            <h1 className={`${theme === 'light' ? 'text-black' : 'text-white'} font text-lg font-medium`}>{profile?.firstName} {profile?.lastName}</h1>
                            <span className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} font text-xs`}>@{profile?.username}</span>
                        </div>
                        <p className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm mt-3`}>{profile?.bio}</p>
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
                            <form onSubmit={updateProfile} className="mt-5 slide-in-bottom-animation">
                                <div className="flex flex-col">
                                    <label htmlFor={usernameId} className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm font-medium`}>Username</label>
                                    <input type="text" defaultValue={profile?.username} name="username" id={usernameId} className={`${theme === 'light' ? 'border-[#dae0e8] focus:outline-[#1874ed]' : 'border-[#333840] focus:outline-[#4490fe] text-white'} border rounded-2xl bg-transparent px-2 py-1.5 shadow-sm focus:outline-1`} />
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor={firstNameId} className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm font-medium`}>First name</label>
                                        <input type="text" defaultValue={profile?.firstName} name="firstName" id={firstNameId} className={`${theme === 'light' ? 'border-[#dae0e8] focus:outline-[#1874ed]' : 'border-[#333840] focus:outline-[#4490fe] text-white'} border rounded-2xl bg-transparent px-2 py-1.5 shadow-sm focus:outline-1`} />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor={lastNameId} className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm font-medium`}>Last name</label>
                                        <input type="text" defaultValue={profile?.lastName} name="lastName" id={lastNameId} className={`${theme === 'light' ? 'border-[#dae0e8] focus:outline-[#1874ed]' : 'border-[#333840] focus:outline-[#4490fe] text-white'} border rounded-2xl bg-transparent px-2 py-1.5 shadow-sm focus:outline-1`} />
                                    </div>
                                </div>
                                <div className="flex flex-col mt-2">
                                    <label htmlFor={bioId} className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm font-medium`}>Bio</label>
                                    <textarea defaultValue={profile?.bio ?? ''} name="bio" id={bioId} className={`${theme === 'light' ? 'border-[#dae0e8] focus:outline-[#1874ed]' : 'border-[#333840] focus:outline-[#4490fe] text-white'} border rounded-2xl bg-transparent min-h-17 px-2 py-1.5 shadow-sm focus:outline-1`}></textarea>
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor={dateOfBirthId} className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm font-medium`}>Date of birth</label>
                                        <input defaultValue={profile?.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : ''} type="date" name="dateOfBirth" id={dateOfBirthId} className={`${theme === 'light' ? 'border-[#dae0e8] focus:outline-[#1874ed]' : 'border-[#333840] focus:outline-[#4490fe] text-white'} border rounded-2xl bg-transparent px-2 py-1.5 shadow-sm focus:outline-1`} />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor={genderId} className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm font-medium`}>Gender</label>
                                        <select defaultValue={profile?.gender ?? ''} name="gender" id={genderId} className={`${theme === 'light' ? 'border-[#dae0e8] focus:outline-[#1874ed]' : 'border-[#333840] focus:outline-[#4490fe] text-white'} border rounded-2xl bg-transparent px-2 py-1.5 shadow-sm focus:outline-1 ${theme === 'dark' ? '[&>option]:bg-black [&>option]:text-white' : ''}`}>
                                            <option value=''>Not set</option>
                                            <option value='male'>Male</option>
                                            <option value='female'>Female</option>
                                            <option value='other'>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col mt-2 w-1/2">
                                    <label htmlFor={statusId} className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-sm font-medium`}>Relationship status</label>
                                    <select defaultValue={profile?.status ?? ''} name="status" id={statusId} className={`${theme === 'light' ? 'border-[#dae0e8] focus:outline-[#1874ed]' : 'border-[#333840] focus:outline-[#4490fe] text-white'} border rounded-2xl bg-transparent px-2 py-1.5 shadow-sm focus:outline-1 ${theme === 'dark' ? '[&>option]:bg-black [&>option]:text-white' : ''}`}>
                                        <option value=''>Not set</option>
                                        <option value='single'>Single</option>
                                        <option value='in_a_relationship'>In a relationship</option>
                                        <option value='engaged'>Engaged</option>
                                        <option value='married'>Married</option>
                                        <option value='in_a_civil_union'>In a civil union</option>
                                        <option value='its_complicated'>It's complicated</option>
                                        <option value='in_a_domestic_partnership'>In a domestic partnership</option>
                                        <option value="in_an_open_relationship">In an open relationship</option>
                                        <option value='widowed'>Widowed</option>
                                        <option value='separated'>Separated</option>
                                        <option value='divorced'>Divorced</option>
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

                                {profileError && (
                                    <p className="text-xs text-red-500 mt-2">{profileError}</p>
                                )}
                            </form>
                        ) : (
                            <div className="mt-5 slide-in-bottom-animation">
                                <h2 className={`${theme === 'light' ? 'text-black' : 'text-white'} font text-sm font-semibold`}>About</h2>
                                <dl className="grid grid-cols-2 gap-2 mt-2">
                                    {profile?.dateOfBirth && (
                                        <div className={`${theme === 'light' ? 'bg-[#f7f9fc] border-[#dae0e8]' : 'bg-[#171c27] border-[#2e323d]'} border rounded-3xl p-2 flex items-center gap-2`}>
                                            <LuCake size={18} className={`${theme === 'light' ? 'text-[#1874ed]' : 'text-[#4490fe]'}`} />
                                            <div>
                                                <dt className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-xs`}>Date of birth</dt>
                                                <dd className={`${theme === 'light' ? 'text-black' : 'text-white'} text-sm font-medium`}>{profile?.dateOfBirth && new Date(profile.dateOfBirth).toLocaleDateString()}</dd>
                                            </div>
                                        </div>
                                    )}
                                    {profile?.gender && (
                                        <div className={`${theme === 'light' ? 'bg-[#f7f9fc] border-[#dae0e8]' : 'bg-[#171c27] border-[#2e323d]'} border rounded-3xl p-2 flex items-center gap-2`}>
                                            <LuUserRound size={18} className={`${theme === 'light' ? 'text-[#1874ed]' : 'text-[#4490fe]'}`} />
                                            <div>
                                                <dt className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-xs`}>Gender</dt>
                                                <dd className={`${theme === 'light' ? 'text-black' : 'text-white'} text-sm font-medium`}>{profile?.gender && genderLabels[profile.gender]}</dd>
                                            </div>
                                        </div>
                                    )}
                                    {profile?.status && (
                                        <div className={`${theme === 'light' ? 'bg-[#f7f9fc] border-[#dae0e8]' : 'bg-[#171c27] border-[#2e323d]'} border rounded-3xl p-2 flex items-center gap-2`}>
                                            <LuHeart size={18} className={`${theme === 'light' ? 'text-[#1874ed]' : 'text-[#4490fe]'}`} />
                                            <div>
                                                <dt className={`${theme === 'light' ? 'text-[#6a7381]' : 'text-[#98a1ae]'} text-xs`}>Relationship status</dt>
                                                <dd className={`${theme === 'light' ? 'text-black' : 'text-white'} text-sm font-medium`}>{profile?.status && statusLabels[profile.status]}</dd>
                                            </div>
                                        </div>
                                    )}
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