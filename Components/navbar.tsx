"use client";

import BrowseBy from "@/Components/browseBy";
import SearchBox from "@/Components/searchBox";
import Notification from "@/Components/notification";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProfileOptions from "./profileOptions";

export default function NavBar({ userId }: { userId?: string | null }) {
  const [opened, setOpened] = useState("");
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
    router.push(`/explore`);
  };

  const Schedule = () => {
    setOpened("Schedule");
    router.push(`/schedule`);
  };

  const Clubs = () => {
    setOpened("Clubs");
    router.push(`/clubs`);
  };

  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/explore")) {
      setOpened("Explore");
    }else if (pathname.startsWith("/schedule")) {
      setOpened("Schedule");
    } else if (pathname.startsWith("/clubs")) {
      setOpened("Clubs");
    } else {
      setOpened("");
    }
  }, [pathname]);

  return (
    <>
      <div className="backdrop-blur-xl transition-all duration-300 z-100 sticky top-0 lg:px-30 w-full h-15 bg-black/60 items-center flex place-content-between border-white/20 border-b">
        <div onClick={() => Explorer()} className="cursor-pointer">
          <img src="/moctale.png" alt="" className="h-auto w-40" />
        </div>
        <div className="right-0 gap-4 md:gap-8 flex items-center h-full overflow-hidden">
          <div
            onClick={() => Explorer()}
            className="hidden md:flex items-center"
          >
            <div className="cursor-pointer py-5 px-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`
                            ${opened == "Explorer" ? "text-white" : "text-gray-50/40"
                }
                                w-6 h-8 lg:w-5 lg:h-5 shrink-0 group-hover:text-white
                                `}><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path><circle cx="12" cy="12" r="10"></circle></svg>
            </div>
            {/* <i
              className={`${opened == "Explorer" ? "text-white" : "text-gray-50/40"
                } text-lg cursor-pointer py-5 px-2 hover:text-white fa-regular fa-compass`}
            ></i> */}
            {opened == "Explorer" && (
              <label className="text-white font-semibold slide">Explore</label>
            )}
          </div>

          <div
            onClick={() => Schedule()}
            className="hidden md:flex items-center"
          >
            <div className="cursor-pointer py-5 px-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`
                            ${opened == "Schedule" ? "text-white" : "text-gray-50/40"
                }
                                w-6 h-8 lg:w-5 lg:h-5 shrink-0 group-hover:text-white
                                `}><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
            </div>
            {/* <i
              className={`${opened == "Schedule" ? "text-white" : "text-gray-50/40"
                } text-lg cursor-pointer py-5 px-2 hover:text-white bi bi-calendar4`}
            ></i> */}
            {opened == "Schedule" && (
              <label className="text-white font-semibold slide">Schedule</label>
            )}
          </div>

          <div onClick={() => Clubs()} className="hidden md:flex items-center">
            <div className="cursor-pointer py-5 px-2 group">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className={` 
              ${opened == "Clubs" ? "text-white" : "text-gray-50/40"} w-6 h-8 lg:w-5 lg:h-5 shrink-0 group-hover:text-white`} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58A2.01 2.01 0 0 0 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0 0 20 14c-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zm-7.76-2.78c-1.17-.52-2.61-.9-4.24-.9-1.63 0-3.07.39-4.24.9A2.988 2.988 0 0 0 6 16.39V18h12v-1.61c0-1.18-.68-2.26-1.76-2.74zM8.07 16c.09-.23.13-.39.91-.69.97-.38 1.99-.56 3.02-.56s2.05.18 3.02.56c.77.3.81.46.91.69H8.07zM12 8c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1m0-2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>
            </div>
            {/* <i
              className={`${opened == "Clubs" ? "text-white" : "text-gray-50/40"
                } text-lg cursor-pointer py-5 px-2 hover:text-white fa-solid fa-users`}
            ></i> */}
            {opened == "Clubs" && (
              <label className="text-white font-semibold slide">Clubs</label>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setBrowse(!browse)}
              className="hidden md:flex items-center"
            >
              <div className="cursor-pointer py-5 px-2 group">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={`
                            ${browse ? "text-white" : "text-gray-50/40"
                  }
                                w-6 h-8 lg:w-5 lg:h-5 shrink-0 group-hover:text-white
                                `} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M14 4h6v6h-6z"></path><path d="M4 14h6v6h-6z"></path><path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M7 7m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path></svg>
              </div>
              {/* <i
                className={`${browse ? "text-white" : "text-gray-50/40"
                  } text-lg cursor-pointer py-5 px-2 hover:text-white bi bi-grid`}
              ></i> */}
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
