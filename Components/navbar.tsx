"use client";

import BrowseBy from "@/Components/browseBy";
import SearchBox from "@/Components/searchBox";
import Notification from "@/Components/notification";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileOptions from "./profileOptions";

export default function NavBar({ userId }: { userId?: string | null }) {
  const [opened, setOpened] = useState("Explorer");
  const [search, setSearch] = useState(false);
  const [browse, setBrowse] = useState(false);
  const [profile, setProfile] = useState(false);
  const [notification, setNotification] = useState(false);
  const [profile_url, setProfile_url] = useState("");
  const [error, setError] = useState("");
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
        setError((err as Error).message);
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
  return (
    <>
      <div className="z-100 sticky top-0 lg:px-30 w-full h-15 bg-black items-center flex place-content-between border-white/20 border-b">
        <div onClick={() => Explorer()} className="cursor-pointer">
          <img src="/moctale.png" alt="" className="h-auto w-40" />
        </div>
        <div className="right-0 gap-4 md:gap-8 flex items-center h-full overflow-hidden">
          <div
            onClick={() => Explorer()}
            className="hidden md:flex items-center"
          >
            <i
              className={`${opened == "Explorer" ? "text-white" : "text-gray-50/40"
                } text-lg cursor-pointer py-5 px-2 hover:text-white fa-regular fa-compass`}
            ></i>
            {opened == "Explorer" && (
              <label className="text-white font-semibold slide">Explore</label>
            )}
          </div>

          <div
            onClick={() => Schedule()}
            className="hidden md:flex items-center"
          >
            <i
              className={`${opened == "Schedule" ? "text-white" : "text-gray-50/40"
                } text-lg cursor-pointer py-5 px-2 hover:text-white bi bi-calendar4`}
            ></i>
            {opened == "Schedule" && (
              <label className="text-white font-semibold slide">Schedule</label>
            )}
          </div>

          <div onClick={() => Clubs()} className="hidden md:flex items-center">
            <i
              className={`${opened == "Clubs" ? "text-white" : "text-gray-50/40"
                } text-lg cursor-pointer py-5 px-2 hover:text-white fa-solid fa-users`}
            ></i>
            {opened == "Clubs" && (
              <label className="text-white font-semibold slide">Clubs</label>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setBrowse(!browse)}
              className="hidden md:flex items-center"
            >
              <i
                className={`${browse ? "text-white" : "text-gray-50/40"
                  } text-lg cursor-pointer py-5 px-2 hover:text-white bi bi-grid`}
              ></i>
            </button>
            {browse && (
              <div className="absolute right-50 top-10">
                <BrowseBy />
              </div>
            )}
          </div>
          <div className="relative order-2 md:order-1">
            <button onClick={() => { setNotification(!notification); setSearch(false) }}>
              {!notification && (<i
                className={`${notification ? "text-white" : "text-gray-50/40"
                  } text-lg cursor-pointer py-5 px-2 hover:text-white fa-regular fa-bell`}
              ></i>)}
              {notification && (
                <i className="text-white md:text-gray-50/40 hover:text-white text-2xl cursor-pointer py-5 px-2 fa-solid fa-xmark"></i>
              )}
            </button>
            {notification && (
              <div className="md:absolute md:right-50 hidden md:block">
                <Notification />
              </div>
            )}
          </div>

          <button
            onClick={() => { setSearch(!search); setNotification(false) }}
            className="order-1 md:order-2"
          >
            {!search && (
              <i className="text-gray-50/40 text-lg cursor-pointer py-5 px-2 hover:text-white fa-solid fa-magnifying-glass"></i>
            )}
            {search && (
              <i className="text-white md:text-gray-50/40 hover:text-white text-2xl cursor-pointer py-5 px-2 fa-solid fa-xmark"></i>
            )}
          </button>

          <button
            onClick={() => setProfile(!profile)}
            className="order-last md:hidden"
          >
            <i className="text-gray-50/40 text-lg cursor-pointer py-5 px-2 hover:text-white bi bi-three-dots-vertical"></i>
          </button>

          <div
            className="w-9 h-9 hidden md:flex overflow-hidden cursor-pointer order-last items-center"
            onClick={() => setProfile(!profile)}
          >
            {profile_url ? (<img
              src={profile_url}
              className="w-full h-full object-cover rounded-full border-gray-50/40 border-2"
              alt=""
            />) : null}
          </div>
        </div>
      </div>

      {/* {browse && <BrowseBy />} */}
      {/* {notification && <Notification />} */}
      {search && (<SearchBox />)}
      {notification && (<div className="md:hidden"><Notification /></div>)}
      {profile && (
        <ProfileOptions
          userId={userId}
          onClose={() => {
            setProfile(false);
            setOpened("Profile");
          }}
        />
      )}
    </>
  );
}
