import { useEffect, useState } from "react";

interface Props {
    comment: any;
    user: any;
    userId: number;
}
interface comments {
    id: number;
    post_id: number;
    user_id: number;
    parent_id: number | null;
    content: string;
    created_at: string;
    category: string | null;
    likes: number;
    replies: string;
}
interface Users {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    bio: string | null;
    profile_url: string | null;
    intrestedIn: string | null;
}
interface userData {
    user_id: string;
    username: string;
    first_name?: string;
    last_name?: string;
    bio?: string;
    profile_url?: string;
    intrestedIn?: string;
}

export default function DetailedReviews({ comment, user, userId }: Props) {
    const [userData, setUserData] = useState<userData | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/getUser/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId }),
                });
                const data = await res.json();
                setUserData(data.data ?? null);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };

        fetchUser();
    }, [userId]);

    const [comments, setComments] = useState<comments[]>([]);
    const [users, setUsers] = useState<Record<number, Users>>({});
    const [reply, setReply] = useState('');
    const [options, setOptions] = useState<number[]>([]);

    const toggleOption = (id: number) => {
        setOptions(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };


    const postComments = async () => {
        if (!comment?.id) return;

        try {
            const res = await fetch("/api/comments/sendReply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    parent_id: comment?.id,
                    content: reply,
                }),
            });

            const data = await res.json();

            if (data.success) {
                await fetchComments();
            }

            setReply('');

        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    };

    const deleteComments = async (commentId: number) => {
        if (!comment?.id) return;

        try {
            const res = await fetch("/api/comments/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: commentId }),
            });

            const data = await res.json();

            if (data.success) {
                await fetchComments();
            }

            setReply('');

        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    };

    const fetchComments = async () => {
        if (!comment?.id) return;

        try {
            const res = await fetch("/api/comments/fetchSubComments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: comment?.id }),
            });

            if (!res.ok) throw new Error("Request failed");

            const data = await res.json();
            setComments(data.comments ?? []);

            console.log(data.comments.content);

        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    };

    useEffect(() => {
        if (!comment?.id) return;

        fetchComments();

        const interval = setInterval(fetchComments, 5000); // every 5s

        return () => clearInterval(interval);
    }, [comment?.id]);

    useEffect(() => {
        if (!comments.length) return;

        const fetchUsers = async () => {
            try {
                const uniqueIds = Array.from(new Set(comments.map((c) => c.user_id)));

                const res = await fetch("/api/getMultipleUser/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userIds: uniqueIds }),
                });

                const data = await res.json();

                if (!data.users) return;

                const usersMap: Record<number, Users> = {};

                data.users.forEach((user: Users) => {
                    usersMap[user.user_id] = user;
                });

                setUsers(usersMap);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            }
        };

        fetchUsers();
    }, [comments]);

    return (
        <div className="flex w-[75%] h-[85vh]">

            {/* Left Part */}
            <div className="w-1/2 bg-[#111111] border border-r-0 border-[#333333] rounded-l-lg p-5 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                    {/* Profile Picture */}
                    <div className="flex">
                        <img src={user?.profile_url || "/default-profile.png"} alt="Profile" className="w-15 h-15 rounded-full" />
                    </div>

                    {/* User Data */}
                    <div className="flex flex-col">
                        <span className="font-semibold text-xl">{user?.first_name || user?.username}</span>
                        <span className="font-semibold text-xs text-[#888888]">@ {user?.username}</span>
                    </div>

                    {/* Review Category */}
                    <div className="flex flex-col ml-auto">
                        {comment.category == "skip" && (
                            <div className="text-black text-sm font-bold rounded-full px-3 py-2 bg-[#fe647e]">
                                Skip
                            </div>
                        )}
                        {comment.category == "timepass" && (
                            <div className="text-black text-sm font-bold rounded-full px-3 py-2 bg-[#fcb700]">
                                Timepass
                            </div>
                        )}
                        {comment.category == "goforit" && (
                            <div className="text-black text-sm font-bold rounded-full px-3 py-2 bg-[#00d391]">
                                Go for it
                            </div>
                        )}
                        {comment.category == "perfection" && (
                            <div className="text-black text-sm font-bold rounded-full px-3 py-2 bg-[#b048ff]">
                                Perfection
                            </div>
                        )}
                    </div>
                </div>
                <div>{comment?.content}</div>
            </div>

            {/* Right Part */}
            <div className="w-1/2 bg-[#111111] border border-[#333333] rounded-r-lg flex flex-col gap-5">
                <div className="p-5 gap-5 flex flex-col overflow-y-auto h-[80%]">
                    {/* Sub Comments */}
                    {comments.length === 0 && (
                        <span className="text-sm text-center text-[#888888]">No comments yet. Be the first to reply!</span>
                    )}
                    {comments.map((comment) => {
                        const commentUser = users[comment.user_id];
                        return (
                            <div className="flex gap-3" key={comment.id}>
                                {options.includes(comment.id) && (
                                    <div className="fixed z-10 items-center justify-center inset-0 bg-black/10 backdrop-blur-xs flex flex-col">

                                        <button
                                            onClick={() => { commentUser.user_id == userId ? deleteComments(comment.id) : null }}
                                            className="text-md font-semibold cursor-pointer text-[#ED4956] hover:bg-[#4F4F4F] bg-[#262626] w-70 py-4 rounded-t-md border-b border-[#3F3F3F]">{commentUser.user_id == userId ? "Delete" : "Report"}</button>


                                        <button onClick={() => toggleOption(comment.id)} className="text-md font-semibold cursor-pointer text-white hover:bg-[#4F4F4F] bg-[#262626] w-70 py-4 rounded-b-md border-[#3F3F3F]">Cancel</button>

                                    </div>
                                )}
                                {/* Profile Image */}
                                <div className="flex">
                                    <img src={commentUser?.profile_url || "/default-profile.png"} alt="Profile" className="w-8 h-8 rounded-full" />
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex gap-3 w-full">
                                        {/* Comment Content */}
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">{commentUser?.username}</span>
                                            <span className="text-sm text-[#C6C6C6]">{comment.content}</span>
                                        </div>

                                        {/* like Reply */}
                                        <div className="ml-auto justify-center flex flex-col cursor-pointer">
                                            <i className="bi bi-heart"></i>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex gap-3">
                                        <span className="text-xs text-[#888888]">{new Date(comment.created_at).toLocaleDateString()}</span>
                                        <span className="text-xs text-[#888888] cursor-pointer hover:text-white">Reply</span>
                                        <span onClick={() => toggleOption(comment.id)} className="text-sm text-[#888888] cursor-pointer hover:text-white"><i className="bi bi-three-dots"></i></span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="w-full h-[20%] pl-5 border-t border-[#333333] flex flex-col justify-center gap-1">

                    {/* Likes and Replies */}
                    <div className="flex gap-3 items-center mb-1">
                        <div className="flex gap-1 items-center">
                            <i className="bi bi-heart"></i>
                            <span className="text-sm font-semibold mr-5">{comment.likes}</span>
                        </div>
                        <div className="flex gap-1 items-center">
                            <i className="bi bi-chat"></i>
                            <span className="text-sm font-semibold">{comments.length}</span>
                        </div>
                    </div>

                    {/* Date */}
                    <span className="text-xs text-[#8A8A8A]">{new Date(comment.created_at).toLocaleDateString()}</span>

                    {/* Input Box */}
                    <div className="flex gap-2 items-center">
                        <div className="flex w-10 h-10 rounded-full overflow-hidden">
                            <img src={userData?.profile_url || "/default-profile.png"} alt="Profile" className="w-full h-full object-cover" />
                        </div>

                        <input type="text"
                            className="w-[80%] h-auto rounded-b-lg p-4 resize-none focus:outline-none focus:ring-0"
                            placeholder="Add a comment..."
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                        />

                        <span
                            onClick={() => { postComments(); fetchComments(); }}
                            className={`${reply == '' ? 'text-[#8A8A8A]' : 'text-white'} cursor-pointer text-sm`}>Post</span>
                    </div>
                </div>
            </div>
        </div>
    );
}