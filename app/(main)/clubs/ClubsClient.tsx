'use client'
import { useEffect, useRef, useState } from "react"

interface Props {
    id: string;
    userId: any;
}
interface User {
    user_id: string;
    username: string;
    first_name?: string;
    last_name?: string;
    bio?: string;
    profile_url?: string;
    intrestedIn?: string;
}

export default function ClubsClient({ id, userId }: Props) {
    const [activeTab, setActiveTab] = useState("feed");
    const [postText, setPostText] = useState("");
    const [postContainSpoilers, setPostContainSpoilers] = useState(false);
    const [rulesExpanded, setRulesExpanded] = useState<number[]>([]);
    const [expanded, setExpanded] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [count, setCount] = useState(0);
    const handleInput = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = "auto"; // reset
        textarea.style.height = `${textarea.scrollHeight}px`; // grow

        setCount(textarea.value.length);
    };

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/getUser/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId }),
                });
                const data = await res.json();
                setUser(data.data ?? null);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };

        fetchUser();
    }, [userId]);
    return (
        <div className="px-32 py-8 flex bg-black text-white">

            {/* left Part */}
            <div className="w-[20%] h-full-sc">

                {/* Tabs */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('feed')}
                        className={`${activeTab === "feed" ? "bg-[#212121] text-white" : "text-white/60"} cursor-pointer hover:bg-[#212121] w-full rounded-md flex gap-2 px-3 py-3 items-center`}>
                        <i className={`bi ${activeTab === "feed" ? "bi-house-fill" : "bi-house"}`}></i>
                        <span>Feed</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('following')}
                        className={`${activeTab === "following" ? "bg-[#212121] text-white" : "text-white/60"} cursor-pointer hover:bg-[#212121] w-full rounded-md flex gap-2 px-3 py-3 items-center`}>
                        <i className={`bi ${activeTab === "following" ? "bi-person-fill-check" : "bi-person-check"}`}></i>
                        <span>Following</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('discover')}
                        className={`${activeTab === "discover" ? "bg-[#212121] text-white" : "text-white/60"} cursor-pointer hover:bg-[#212121] w-full rounded-md flex gap-2 px-3 py-3 items-center`}>
                        <i className={`bi ${activeTab === "discover" ? "bi-binoculars-fill" : "bi-binoculars"}`}></i>
                        <span>Discover</span>
                    </button>
                </div>

                {/* Clubs */}
                <div className="flex flex-col gap-2">
                    <span className="px-3 py-3 text-sm text-white/80 font-semibold">YOUR CLUBS</span>
                    <button
                        onClick={() => setActiveTab("1")}
                        className={`${activeTab === "1" ? "bg-[#212121] text-white" : "text-white/60"} cursor-pointer hover:bg-[#212121] w-full rounded-md flex gap-2 px-3 py-3 items-center`}>
                        <div className="w-8 h-8 rounded-md overflow-hidden">
                            <img src="/r1.jpg" alt="" className="w-full h-full object-cover" />
                        </div>
                        <span>Club 1</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("2")}
                        className={`${activeTab === "2" ? "bg-[#212121] text-white" : "text-white/60"} cursor-pointer hover:bg-[#212121] w-full rounded-md flex gap-2 px-3 py-3 items-center`}>
                        <div className="w-8 h-8 rounded-md overflow-hidden">
                            <img src="/r2.jpg" alt="" className="w-full h-full object-cover" />
                        </div>
                        <span>Club 2</span>
                    </button>
                </div>
            </div>
            {/* Middle Part */}
            <div className="w-[60%] h-full-sc flex flex-col gap-2 px-5">
                {/* Club Header */}
                <div className="bg-[#151515] rounded-2xl size-full h-auto">
                    <div className="w-full h-35 rounded-t-2xl overflow-hidden">
                        <img src="/L10.jpg" alt="Poster" className="object-cover w-full" />
                    </div>
                    <div className="p-5 flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden">
                            <img src="/L10.jpg" alt="Poster" className="object-cover w-full" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl">Club Name</span>
                            <span className="font-base text-sm text-[#B3B3B3]">Details of Club</span>
                        </div>
                        <div className="ml-auto flex flex-col">
                            <button className="cursor-pointer px-3 py-2 items-center flex gap-3 border border-[#404040] bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-md font-semibold text-sm">
                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 flex items-center justify-center"><div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"></div></div>
                                Member
                                <i className="text-xs bi bi-chevron-down"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="size-full h-auto">
                    <div className="flex flex-col bg-[#151515] items-center p-4 w-full h-auto rounded-lg">
                        {/* Header */}
                        <div className="flex flex-col items-center md:flex-row gap-5 md:gap-0 w-full">
                            <div className="flex items-center justify-start w-full">
                                {/* Profile Image */}
                                <div className="rounded-full flex justify-center items-center md:w-10 md:h-10 w-12 h-12 overflow-hidden">
                                    <img
                                        src={user?.profile_url || "/default-profile.png"}
                                        alt=""
                                        className="object-contain"
                                    />
                                </div>

                                {/* Username */}
                                <div className="ml-3">
                                    <span className="text-md text-[#B3B3B3]">@</span>
                                    <span className="text-md">{user?.username}</span>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex items-end w-full mt-5 text-[#B3B3B3] border-b whitespace-pre-wrap wrap-break-word">
                            <textarea
                                ref={textareaRef}
                                onInput={handleInput}
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                maxLength={500}
                                rows={3}
                                placeholder={`What's on your mind, ${user?.username}?`}
                                className="w-full text-sm md:text-base resize-none overflow-hidden focus:outline-0 text-white"
                            />
                            <div className="mt-1 text-bottom text-xs text-gray-500 w-15">
                                {count} / 500
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-4 w-full mt-3 text-xl">
                            <div className="flex gap-5 text-sm text-[#C6C6C6]">
                                <i className="hover:text-white cursor-pointer bi bi-film"></i>
                                <i
                                    onClick={() => setPostContainSpoilers(!postContainSpoilers)}
                                    className={`${postContainSpoilers ? 'text-orange-400 bi-exclamation-triangle-fill' : 'bi-exclamation-triangle hover:text-white'} cursor-pointer bi`}></i>
                            </div>
                            <button className="ml-auto bg-white hover:bg-white/90 text-black text-sm cursor-pointer px-5 py-2 rounded-full">
                                Post
                            </button>
                        </div>
                    </div>
                </div>

                {/* Post Template */}
                <div className="w-full h-auto flex flex-col gap-2 px-5 border-b border-[#212121] pb-5 pt-5">
                    {/* Header */}
                    <div className="flex flex-row items-start md:flex-row gap-5 md:gap-5 w-full">
                        {/* Profile Image */}
                        <div className="flex-row rounded-full flex justify-center items-center md:w-10 md:h-10 w-12 h-12 overflow-hidden">
                            <img
                                src={user?.profile_url || "/L6.jpg"}
                                alt=""
                                className="object-contain"
                            />
                        </div>

                        {/* Body */}
                        <div className="text-white text-sm md:text-base w-full">
                            {/* Username  and Options */}
                            <div className="flex items-center">
                                <div className="flex flex-col mb-2">
                                    <div>
                                        <span className="text-md text-[#B3B3B3]">@</span>
                                        <span className="text-md">{user?.username}</span>
                                    </div>
                                    <span className="text-xs text-[#B3B3B3]">Posted 2 mins ago</span>
                                </div>
                                <div className="ml-auto cursor-pointer hover:bg-[#212121] px-2 py-1.5 rounded-full text-xs text-white">
                                    <i className="bi bi-three-dots"></i>
                                </div>
                            </div>

                            {/* Post Content */}
                            This is a sample post content. It can include text, images, or other media.

                            {/* Likes and Comments */}
                            <div className="flex items-center gap-5 w-full mt-5 text-xl">
                                <div className="flex gap-2 cursor-pointer">
                                    <i className="bi bi-heart"></i>
                                    <span className=" hover:text-[#B3B3B3]">
                                        0
                                    </span>
                                </div>
                                <div className="flex gap-2 cursor-pointer">
                                    <i className="bi bi-chat"></i>
                                    <span className=" hover:text-[#B3B3B3]">
                                        0
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Right Part */}
            <div className="w-[20%] h-full-sc flex">
                <div className="w-full">
                    <div className="flex flex-col gap-2 mb-2">
                        <span className="text-xl text-white font-semibold">Rules</span>

                        {/* Rule template */}
                        {expanded && (<div className="font-semibold text-sm border-b cursor-pointer border-white/10 pb-2 flex flex-col gap-1">
                            <div
                                onClick={() =>
                                    setRulesExpanded(prev =>
                                        prev.includes(1)
                                            ? prev.filter(id => id !== 1)
                                            : [...prev, 1]
                                    )
                                }
                                className="flex gap-2 items-center">
                                <span className="text-white/60">1.</span>
                                <span>Rule Title</span>
                                {!rulesExpanded.includes(1) && (<i className="text-xs bi bi-chevron-down ml-auto"></i>)}
                                {rulesExpanded.includes(1) && (<i className="text-xs bi bi-chevron-up ml-auto"></i>)}
                            </div>

                            {/* Rule Context */}
                            {rulesExpanded.includes(1) && (<div className="pl-6">
                                <span className="text-white/60 font-base text-sm">This is the rule description.</span>
                            </div>)}
                        </div>)}
                    </div>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-sm font-semibold rounded-xl px-2 py-2 flex gap-3 items-center justify-center hover:bg-white/20 cursor-pointer bg-white/10 w-full">View Rules
                        {expanded ? (<i className="text-xs bi bi-chevron-up"></i>) : (<i className="text-xs bi bi-chevron-down"></i>)}
                    </button>
                </div>
            </div>
        </div>
    )
}