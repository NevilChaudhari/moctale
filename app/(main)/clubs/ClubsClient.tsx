'use client'
import dayjs from "@/lib/dayjs";
import { use, useEffect, useRef, useState } from "react"

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
interface Clubs {
    id: number;
    club_name: string;
    club_banner: string;
    club_icon?: string;
    club_desc?: string;
    club_rules?: string;
}
interface Posts {
    id: number;
    user_id: number;
    club_id: number;
    content: string;
    is_spoiler?: boolean;
    likes?: number;
    comments?: number;
    updated_at: string;
    created_at: string;
}
interface UserClubs {
    id: number;
    club_name: string;
    club_icon: string;
}
interface Likes {
    id: number;
    userId: number;
    postId: number;
    tableName: string;
}

export default function ClubsClient({ id, userId }: Props) {
    const [activeTab, setActiveTab] = useState("feed");
    const [postText, setPostText] = useState("");
    const [postContainSpoilers, setPostContainSpoilers] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [openedClub, setOpenedClub] = useState<Clubs | null>(null);
    const [rules, setRules] = useState<string[]>([]);


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
        try {
            setRules(openedClub?.club_rules ? JSON.parse(openedClub.club_rules) : []);
        } catch {
            setRules([]);
        }
    }, [openedClub]);


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


    const [clubs, setClubs] = useState<Clubs[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/clubs/fetch/", {
                    method: "GET",
                });
                const data = await res.json();
                setClubs(data.clubs ?? null);
            } catch (err) {
                console.error("Failed to fetch clubs:", err);
            }
        };

        fetchUser();
    }, []);


    const handleLike = async (post: any) => {
        if (!post?.id) return;

        try {
            const res = await fetch("/api/likes/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    table: "Posts",
                    postId: post.id,
                    userLiked: false,
                }),
            });

            const data = await res.json();
            console.log("Likes Updated:", data.message);

            fetchLikes();
        } catch (err) {
            console.error("Failed to like post", err);
        }
    };

    const handleUnlike = async (post: any) => {
        if (!post?.id) return;
        try {
            const res = await fetch("/api/likes/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    table: "posts",
                    postId: post.id,
                    userLiked: true,
                }),
            });

            const data = await res.json();
            console.log("Likes Updated:", data.message);

            fetchLikes();
        } catch (err) {
            console.error("Failed to unlike post", err);
        }
    };

    const handlePost = async () => {
        // Post handling logic here

        if (!openedClub) {
            alert("Please select a club first.");
            return;
        }

        const postData = {
            user_id: userId,
            club_id: openedClub?.id,
            content: postText,
            is_spoiler: postContainSpoilers,
            clubId: openedClub?.id
        }
        // console.log(postData);
        const res = await fetch("/api/posts/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });

        const data = await res.json();
        console.log("Post created:", data.data);

        setPostText("");
        fetchPosts();
    }

    const [posts, setPosts] = useState<Posts[]>([]);
    const fetchPosts = async () => {
        try {
            let res;
            if (activeTab === "feed") {
                res = await fetch("/api/posts/fetch/", {
                    method: "POST",
                    body: JSON.stringify({ id: 'feed' }),
                    headers: { "Content-Type": "application/json" },
                });
            }
            else {
                res = await fetch("/api/posts/fetch/", {
                    method: "POST",
                    body: JSON.stringify({ id: openedClub?.id }),
                    headers: { "Content-Type": "application/json" },
                });
            }
            const data = await res.json();
            setPosts(data.posts ?? null);
            // alert(JSON.stringify(data.posts));
        } catch (err) {
            console.error("Failed to fetch posts:", err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [openedClub, activeTab]);


    const fetchLikes = async () => {
        try {
            const res = await fetch("/api/likes/fetch/", {
                method: "POST",
                body: JSON.stringify({ table_name: "Posts" }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            setLikes(data.data ?? null);
        } catch (err) {
            console.error("Failed to fetch likes:", err);
        }
    };


    const [likes, setLikes] = useState<Likes[]>([]);
    useEffect(() => {
        fetchLikes();
        fetchPosts();
    }, []);

    const [user_clubs, setUserClubs] = useState<UserClubs[]>([]);
    const joinedClub = user_clubs.map(item => item.id);
    const [leaveOption, setleaveOption] = useState(false);

    const fetchUserClubs = async () => {
        try {
            const res = await fetch("/api/clubs/clubs_users/fetch/", {
                method: "POST",
                body: JSON.stringify({ id: userId }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            setUserClubs(data.clubs ?? []);
            console.log(user_clubs);

        } catch (err) {
            console.error("Failed to fetch user clubs:", err);
        }
    };
    const addUserClubs = async (club_id: any) => {
        try {
            const res = await fetch("/api/clubs/clubs_users/add/", {
                method: "POST",
                body: JSON.stringify({ user_id: userId, club_id: club_id }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            console.log(user_clubs);
            fetchUserClubs();
        } catch (err) {
            console.error("Failed to fetch user clubs:", err);
        }
    };
    const deleteUserClubs = async (club_id: any) => {
        try {
            const res = await fetch("/api/clubs/clubs_users/delete/", {
                method: "POST",
                body: JSON.stringify({ user_id: userId, club_id: club_id }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            console.log(user_clubs);
            fetchUserClubs();
        } catch (err) {
            console.error("Failed to fetch user clubs:", err);
        }
    };

    useEffect(() => {
        fetchUserClubs();
    }, []);


    const [users, setUsers] = useState<Record<number, User>>({});
    useEffect(() => {
        if (!posts.length) return;

        const fetchUsers = async () => {
            try {
                const uniqueIds = Array.from(new Set(posts.map((c) => c.user_id)));

                const res = await fetch("/api/getMultipleUser/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userIds: uniqueIds }),
                });

                const data = await res.json();

                if (!data.users) return;

                const usersMap: Record<string, User> = {};

                data.users.forEach((user: User) => {
                    usersMap[user.user_id] = user;
                });

                setUsers(usersMap);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            }
        };

        fetchUsers();
    }, [posts]);


    const [mobilePost, setMobilePost] = useState(false);
    const [viewClub, setViewClub] = useState(false);
    const [openRules, setOpenRules] = useState(false);

    useEffect(() => {
        if (!mobilePost && !openRules) return;

        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = original;
        };
    }, [mobilePost, openRules]);


    return (
        <div className="relative lg:px-32 md:px-10 md:py-8 mt-2 md:mt-0 flex md:flex-row flex-col gap-2 md:gap-0 bg-black text-white">

            <div onClick={() => setMobilePost(!mobilePost)} className={`${mobilePost ? 'hidden' : ''} fixed bottom-20 right-5 w-13 h-13 items-center justify-center flex text-xl md:hidden bg-[#9745f6] z-100 rounded-xl`}><i className="bi bi-plus-lg"></i></div>

            {mobilePost && (<div className="z-999 mt-auto backdrop-blur-sm fixed overflow-hidden md:block size-full h-full">
                <div className="flex flex-col bg-[#0d0d0d] items-center p-4 w-full h-auto rounded-lg">
                    {/* Header */}
                    <div className="border-b border-[#333333] pb-2 flex flex-col items-center md:flex-row gap-5 md:gap-0 w-full">
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

                            {/* Close Button */}
                            <div className="ml-auto">
                                <button onClick={() => setMobilePost(false)} className="text-xl text-[#B3B3B3] hover:text-white">
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex items-end w-full h-auto mt-5 text-[#B3B3B3] border-b whitespace-pre-wrap wrap-break-word">
                        <textarea
                            ref={textareaRef}
                            onInput={handleInput}
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            maxLength={500}
                            rows={10}
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
                        <button
                            onClick={() => { handlePost(); setMobilePost(false); }}
                            className="ml-auto bg-white hover:bg-white/90 text-black text-sm cursor-pointer px-6 py-3 rounded-full">
                            Post
                        </button>
                    </div>
                </div>
            </div>)}

            {openRules && (<div className="z-999 mt-auto backdrop-blur-sm fixed overflow-hidden md:block size-full h-full">
                <div className="bg-[#1a1a1a] w-full h-auto md:w-1/2 md:h-auto p-5 rounded-xl mx-auto mt-20 relative">
                    <div className="absolute top-5 right-5 text-white cursor-pointer" onClick={() => setOpenRules(false)}><i className="bi bi-x-lg"></i></div>
                    <span className="text-xl font-semibold mb-10">Club Rules</span>
                    <div className="mt-10">
                        {rules.length === 0 && (<span className="text-sm text-white/60">No rules available for this club.</span>)}
                        {rules.map((rule, i) => {
                            return (
                                <div className={`font-semibold text-sm border-white/10 flex gap-1 h-10 items-center ${i !== rules.length - 1 ? 'border-b pb-2' : ''}`}>
                                    <span className="text-white/60">{i + 1}.</span>
                                    <span className="text-white/60">{rule}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>)}


            {/* left Part */}
            {!viewClub && (<div className="md:w-[20%] w-full h-full-sc flex md:flex-col overflow-x-auto gap-2 md:gap-0">

                {/* Tabs */}
                <div className="flex md:flex-col gap-2 ">
                    <button
                        onClick={() => setActiveTab('feed')}
                        className={`${activeTab === "feed" ? "bg-[#212121] text-white" : "text-white/60"} flex-col md:flex-row cursor-pointer md:hover:bg-[#212121] md:w-full md:h-auto w-20 h-auto rounded-md flex md:gap-2 px-3 py-3 items-center`}>
                        <i className={`bi ${activeTab === "feed" ? "bi-house-fill bg-[#383838] md:bg-transparent" : "bi-house bg-[#212121] md:bg-transparent"} md:text-base text-2xl md:px-0 md:py-0 px-3 py-2 rounded-xl`}></i>
                        <span className="text-sm md:text-base">Feed</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('following')}
                        className={`${activeTab === "following" ? "bg-[#212121] text-white" : "text-white/60"} flex-col md:flex-row cursor-pointer md:hover:bg-[#212121] md:w-full md:h-auto w-20 h-auto rounded-md flex md:gap-2 px-3 py-3 items-center`}>
                        <i className={`bi ${activeTab === "following" ? "bi-person-fill-check bg-[#383838] md:bg-transparent" : "bi-person-check bg-[#212121] md:bg-transparent"} md:text-base text-2xl md:px-0 md:py-0 px-3 py-2 rounded-xl`}></i>
                        <span className="text-sm md:text-base">Following</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('discover')}
                        className={`${activeTab === "discover" ? "bg-[#212121] text-white" : "text-white/60"} flex-col md:flex-row cursor-pointer md:hover:bg-[#212121] md:w-full md:h-auto w-20 h-auto rounded-md flex md:gap-2 px-3 py-3 items-center`}>
                        <i className={`bi ${activeTab === "discover" ? "bi-binoculars-fill bg-[#383838] md:bg-transparent" : "bi-binoculars bg-[#212121] md:bg-transparent"} md:text-base text-2xl md:px-0 md:py-0 px-3 py-2 rounded-xl`}></i>
                        <span className="text-sm md:text-base">Discover</span>
                    </button>
                </div>

                {/* Clubs */}
                <div className="flex md:flex-col gap-2">
                    <span className="hidden md:block px-3 py-3 text-sm text-white/80 font-semibold">YOUR CLUBS</span>
                    {(user_clubs.length === 0) && (<span className="px-3 py-3 text-sm text-white/60">No clubs joined yet.</span>
                    )}
                    {user_clubs.map((uc: any) => {
                        return (
                            <button
                                key={uc.id}
                                onClick={() => { setActiveTab(uc.club_name); setOpenedClub(uc); }}
                                className={`${activeTab === uc.club_name ? "bg-[#212121] text-white" : "text-white/60"} cursor-pointer md:hover:bg-[#212121] md:w-full md:h-auto w-20 h-auto rounded-md flex flex-col md:flex-row md:gap-2 justify-center md:justify-start md:px-3 md:py-3 items-center`}>
                                <div className="w-12 h-12 md:w-8 md:h-8 rounded-md overflow-hidden">
                                    <img src={uc.club_icon} alt={uc.club_name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-sm md:text-base">{uc.club_name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>)}
            {/* Middle Part */}
            <div className="order-2 md:order-1 md:w-[60%] w-full h-full-sc flex flex-col gap-2 md:px-5">
                {/* Club Header */}
                {openedClub && activeTab === openedClub.club_name && (<div className={`bg-[#151515] rounded-2xl size-full h-auto md:block ${viewClub ? '' : 'hidden'}`}>
                    <div className="w-full h-35 relative rounded-t-2xl overflow-hidden">
                        <div onClick={() => setViewClub(false)} className="absolute top-2 left-2 rounded-full flex justify-center items-center w-10 h-10 bg-black/50"><i className="bi bi-chevron-left"></i></div>
                        <img src={openedClub.club_banner} alt="Poster" className="object-cover w-full" />
                    </div>
                    <div className="p-5 flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden">
                            <img src={openedClub.club_icon} alt="Poster" className="object-cover w-full" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl">{openedClub.club_name}</span>
                            <span className="font-base text-sm text-[#B3B3B3]">{openedClub.club_desc}</span>
                        </div>
                        <div className="ml-auto flex flex-col relative">
                            {joinedClub.includes(openedClub.id) && (<button onClick={()=>setleaveOption(!leaveOption)} className="cursor-pointer px-3 py-2 items-center flex gap-3 border border-[#404040] bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-md font-semibold text-sm">
                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 flex items-center justify-center"><div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"></div></div>
                                Member
                                <i className="text-xs bi bi-chevron-down"></i>
                            </button>)}
                            {!joinedClub.includes(openedClub.id) && (<button onClick={()=>{addUserClubs(openedClub.id)}} className="cursor-pointer px-3 py-2 items-center flex gap-3 bg-white text-black justify-center rounded-md font-semibold text-sm">
                                Join
                            </button>)}
                            {leaveOption && (<button onClick={()=>{deleteUserClubs(openedClub.id); setleaveOption(!leaveOption);}} className="absolute -bottom-10 cursor-pointer px-3 py-2 w-full items-center justify-center flex gap-3 border border-[#404040] bg-white/5 text-red-400 hover:text-red-300 hover:bg-[#3A3A3A] rounded-md font-semibold text-sm">
                                Leave Club
                            </button>)}

                        </div>
                    </div>
                </div>)}

                {/* Discover Data */}
                {activeTab === 'discover' && (<div className="w-full">
                    <div className="flex flex-col gap-2 mb-2">
                        <span className="text-2xl font-bold">Discover</span>
                        <span className="text-sm text-[#B3B3B3] font-semibold mb-5">Explore new communities and trending content</span>
                        <div className="grid grid-cols-2 gap-2">
                            {clubs.map((club, index) => {
                                const isJoined = joinedClub.includes(club.id);
                                return (
                                    <div key={index} className="flex flex-col border border-[#252833] rounded-2xl hover:bg-[#1f1f1f] cursor-pointer" onClick={() => { setActiveTab(club.club_name); setOpenedClub(club); }}>
                                        <div className="relative">
                                            <img src={club.club_banner} alt="" className="rounded-t-2xl w-full h-32 object-cover" />
                                            <div className="relative">
                                                <img src={club.club_icon} alt="" className="w-auto h-13 object-cover absolute -bottom-6 left-3 rounded-md border border-[#252833]" />
                                            </div>
                                        </div>
                                        <div className="px-3 pb-3">
                                            <div className="font-bold pt-8 pb-0">{club.club_name}</div>
                                            <div className="pt-1 text-sm text-[#C6C6C6] h-15">{club.club_desc}</div>
                                            {!isJoined && (<button onClick={() => addUserClubs(club.id)} className="w-full h-10 mt-5 cursor-pointer bg-white text-black rounded-md flex gap-2 items-center justify-center"><i className="bi bi-plus-lg"></i>Join Club</button>)}
                                            <div className="group">
                                                {isJoined && (<button className="w-full h-10 mt-5 cursor-pointer group-hover:hidden bg-[#2A2A2A] border border-[#404040] text-white rounded-md flex gap-2 items-center justify-center"><i className="bi bi-check-lg"></i>Joined</button>)}
                                                {isJoined && (<button onClick={() => { deleteUserClubs(club.id) }} className="w-full h-10 mt-5 cursor-pointer hidden group-hover:flex bg-red-600/90 border border-[#404040] text-white rounded-md gap-2 items-center justify-center"><i className="bi bi-x-lg"></i>Leave</button>)}
                                            </div>
                                        </div>
                                    </div>)
                            })}
                        </div>
                    </div>
                </div>
                )}

                {/* Post */}
                {(activeTab === 'feed' || activeTab === openedClub?.club_name) && (<div className="hidden md:block size-full h-auto">
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
                            <button
                                onClick={handlePost}
                                className="ml-auto bg-white hover:bg-white/90 text-black text-sm cursor-pointer px-5 py-2 rounded-full">
                                Post
                            </button>
                        </div>
                    </div>
                </div>)}

                {/* WIP */}
                {activeTab === 'following' && (<div className="w-full">
                    <div className="flex flex-col gap-2 mb-2">
                        <span className="text-sm text-white">This Tab is still W.I.P. Please wait for some time</span>
                    </div>
                </div>
                )}


                {/* Clubs Data */}
                {/* Post Template */}
                {(activeTab === openedClub?.club_name || activeTab === 'feed') && posts.map((post, index) => {
                    const postUser = users[post.user_id];
                    const postLikes = likes.filter((like) => like.postId == post.id);
                    const userLiked = !!postLikes.find((like) => like.userId == userId);
                    return (
                        <div
                            key={index}
                            className="w-full h-auto flex flex-col gap-2 px-5 border-b border-[#212121] pb-5 pt-5">
                            {/* Header */}
                            <div className="flex flex-row items-start md:flex-row gap-5 md:gap-5 w-full">
                                {/* Profile Image */}
                                <div className="rounded-full overflow-hidden w-12 h-12 md:w-10 md:h-10 shrink-0">
                                    <img
                                        src={postUser?.profile_url || "/L6.jpg"}
                                        alt=""
                                        className="object-cover"
                                    />
                                </div>

                                {/* Body */}
                                <div className="text-white text-sm md:text-base w-full">
                                    {/* Username  and Options */}
                                    <div className="flex items-center">
                                        <div className="flex flex-col mb-2">
                                            <div>
                                                <span className="text-md text-[#B3B3B3]">@</span>
                                                <span className="text-md">{postUser?.username}</span>
                                            </div>
                                            <span className="text-xs text-[#B3B3B3]">{dayjs(post.created_at).fromNow()}</span>
                                        </div>
                                        <div className="ml-auto cursor-pointer hover:bg-[#212121] px-2 py-1.5 rounded-full text-xs text-white">
                                            <i className="bi bi-three-dots"></i>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <span className={`${post.is_spoiler ? 'blur-xs cursor-pointer' : ''} text-white`}>{post.content}</span>

                                    {/* Likes and Comments */}
                                    <div className="flex items-center gap-5 w-full mt-5 text-xl">
                                        <div className="flex gap-2 cursor-pointer">
                                            <i
                                                onClick={() => { userLiked ? handleUnlike(post) : handleLike(post) }}
                                                className={`bi ${userLiked ? 'bi-heart-fill text-red-500' : 'bi-heart'}`}
                                            ></i>
                                            <span className=" hover:text-[#B3B3B3]">
                                                {postLikes.length || 0}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 cursor-pointer">
                                            <i className="bi bi-chat"></i>
                                            <span className=" hover:text-[#B3B3B3]">
                                                {post.comments || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* Right Part */}
            <div className="order-1 md:order-2 md:w-[20%] w-full h-full-sc flex">
                {openedClub && activeTab === openedClub.club_name && !viewClub && (<div className="w-full">
                    <div className="flex flex-col gap-2 mb-2">
                        <span className="hidden md:block text-xl text-white font-semibold">Rules</span>

                        {/* Rule template */}
                        {expanded && (
                            rules.map((rule, i) => {
                                return (
                                    <div className="font-semibold text-sm border-b border-white/10 pb-2 flex gap-1">
                                        <span className="text-white/60">{i + 1}.</span>
                                        <span>{rule}</span>
                                    </div>
                                )
                            })
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewClub(true)}
                            className="md:hidden text-sm font-semibold rounded-xl px-2 py-2 flex gap-3 items-center justify-center hover:bg-white/20 cursor-pointer bg-white/10 w-full">Visit Club
                        </button>
                        {openedClub && (
                            <button
                                onClick={() => setOpenRules(true)}
                                className="md:hidden text-sm font-semibold rounded-xl px-2 py-2 flex gap-3 items-center justify-center hover:bg-white/20 cursor-pointer bg-white/10 w-full">{openedClub.club_rules ? "View Rules" : "No Rules Available"}
                            </button>
                        )}
                        {openedClub && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="hidden text-sm font-semibold rounded-xl px-2 py-2 md:flex gap-3 items-center justify-center hover:bg-white/20 cursor-pointer bg-white/10 w-full">{openedClub.club_rules ? "Show Rules" : "No Rules Available"}
                                {expanded ? (<i className="text-xs bi bi-chevron-up"></i>) : (<i className="text-xs bi bi-chevron-down"></i>)}
                            </button>
                        )}
                    </div>
                </div>)}
            </div>
        </div>
    )
}