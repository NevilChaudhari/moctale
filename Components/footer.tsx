"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Footer({ userId }: { userId?: string | null }) {
    const [opened, setOpened] = useState("Explorer");
    const [browse, setBrowse] = useState(false);
    const [profile_url, setProfile_url] = useState("");

    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/getUser`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId }),
                });

                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to fetch user");

                setProfile_url(data.data.profile_url || "");
            } catch (err) {
                console.log((err as Error).message);
            }
        };

        if (userId) fetchUser();
    }, [userId]);

    const Explorer = () => {
        setOpened("Explorer");
        router.push(`/`);
    };

    const Schedule = () => {
        setOpened("Schedule");
        router.push(`/schedule`);
    };

    const Clubs = () => {
        setOpened("Clubs");
        router.push(`/clubs`);
    };

    const Profile = async () => {
        router.push(`/user/${userId}/`);
    };
    return (
        <>
            <div className="border-white/20 border-t fixed bg-black h-50px flex place-content-around w-full z-100 bottom-0">

                {/* Explore Button */}
                <div className="right-0 gap-4 md:gap-8 justify-center flex items-center h-full overflow-hidden">
                    <div
                        onClick={() => Explorer()}
                        className="md:hidden flex items-center flex-col group"
                    >
                        <i
                            className={`${opened == "Explorer" ? "text-white" : "text-gray-50/40"
                                } text-lg cursor-pointer py-1 px-2 group-hover:text-white fa-regular fa-compass`}
                        ></i>
                        <label className={`${opened == "Explorer" ? "text-white" : "text-gray-50/40"
                            } group-hover:text-white text-sm font-semibold slide`}>Explore</label>
                    </div>
                </div>

                {/* Schedule Button */}
                <div className="right-0 gap-4 md:gap-8 justify-center flex items-center h-full overflow-hidden">
                    <div
                        onClick={() => Schedule()}
                        className="md:hidden flex items-center flex-col group"
                    >
                        <i
                            className={`${opened == "Schedule" ? "text-white" : "text-gray-50/40"
                                } text-lg cursor-pointer py-1 px-2 group-hover:text-white bi bi-calendar4`}
                        ></i>
                        <label className={`${opened == "Schedule" ? "text-white" : "text-gray-50/40"
                            } group-hover:text-white text-sm font-semibold slide`}>Schedule</label>
                    </div>
                </div>

                {/* Browse Button */}
                <div className="right-0 gap-4 md:gap-8 justify-center flex items-center h-full overflow-hidden">
                    <div
                        onClick={() => setBrowse(!browse)}
                        className="md:hidden flex items-center flex-col group"
                    >
                        <i
                            className={`${browse ? "text-white" : "text-gray-50/40"
                                } text-lg cursor-pointer py-1 px-2 group-hover:text-white bi bi-grid`}
                        ></i>
                        <label className={`${browse ? "text-white" : "text-gray-50/40"
                            } group-hover:text-white text-sm font-semibold slide`}>Browse</label>
                    </div>
                </div>

                {/* Clubs Button */}
                <div className="right-0 gap-4 md:gap-8 justify-center flex items-center h-full overflow-hidden group">
                    <div
                        onClick={() => Clubs()}
                        className="md:hidden flex items-center flex-col"
                    >
                        <i
                            className={`${opened == "Clubs" ? "text-white" : "text-gray-50/40"
                                } text-lg cursor-pointer py-1 px-2 group-hover:text-white fa-solid fa-users`}
                        ></i>
                        <label className={`${opened == "Clubs" ? "text-white" : "text-gray-50/40"
                            } group-hover:text-white text-sm font-semibold slide`}>Clubs</label>
                    </div>
                </div>

                {/* Profile Button */}
                <div
                    className="w-9 h-9 md:hidden flex overflow-hidden cursor-pointer order-last items-center"
                    onClick={() => Profile()}
                >
                    {profile_url ? (<img
                        src={profile_url}
                        className="w-full h-full object-cover rounded-full border-gray-50/40 border-2"
                        alt=""
                    />): null}
                </div>
            </div>
        </>
    )
}