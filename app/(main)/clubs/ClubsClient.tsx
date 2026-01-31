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
            const res = await fetch("/api/posts/fetch/", {
                method: "POST",
                body: JSON.stringify({ id: openedClub?.id }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            setPosts(data.posts ?? null);
            // alert(JSON.stringify(data.posts));
        } catch (err) {
            console.error("Failed to fetch posts:", err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [openedClub]);


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
                    {(clubs.length === 0) && (<span className="px-3 py-3 text-sm text-white/60">No clubs joined yet.</span>
                    )}
                    {clubs.map((club: any) => {
                        return (
                            <button
                                key={club.id}
                                onClick={() => { setActiveTab(club.club_name); setOpenedClub(club); }}
                                className={`${activeTab === club.club_name ? "bg-[#212121] text-white" : "text-white/60"} cursor-pointer hover:bg-[#212121] w-full rounded-md flex gap-2 px-3 py-3 items-center`}>
                                <div className="w-8 h-8 rounded-md overflow-hidden">
                                    <img src={club.club_icon} alt={club.club_name} className="w-full h-full object-cover" />
                                </div>
                                <span>{club.club_name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
            {/* Middle Part */}
            <div className="w-[60%] h-full-sc flex flex-col gap-2 px-5">
                {/* Club Header */}
                {openedClub && (<div className="bg-[#151515] rounded-2xl size-full h-auto">
                    <div className="w-full h-35 rounded-t-2xl overflow-hidden">
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
                        <div className="ml-auto flex flex-col">
                            <button className="cursor-pointer px-3 py-2 items-center flex gap-3 border border-[#404040] bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-md font-semibold text-sm">
                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 flex items-center justify-center"><div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"></div></div>
                                Member
                                <i className="text-xs bi bi-chevron-down"></i>
                            </button>
                        </div>
                    </div>
                </div>)}

                {/* Post */}
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
                            <button
                                onClick={handlePost}
                                className="ml-auto bg-white hover:bg-white/90 text-black text-sm cursor-pointer px-5 py-2 rounded-full">
                                Post
                            </button>
                        </div>
                    </div>
                </div>

                {/* Post Template */}
                {posts.map((post, index) => {
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
                                    {post.content}

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
            <div className="w-[20%] h-full-sc flex">
                {openedClub && (<div className="w-full">
                    <div className="flex flex-col gap-2 mb-2">
                        <span className="text-xl text-white font-semibold">Rules</span>

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
                    {openedClub && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-sm font-semibold rounded-xl px-2 py-2 flex gap-3 items-center justify-center hover:bg-white/20 cursor-pointer bg-white/10 w-full">{openedClub.club_rules ? "Show Rules" : "No Rules Available"}
                            {expanded ? (<i className="text-xs bi bi-chevron-up"></i>) : (<i className="text-xs bi bi-chevron-down"></i>)}
                        </button>
                    )}
                </div>)}
            </div>
        </div>
    )
}