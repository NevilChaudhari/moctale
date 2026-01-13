"use client";

import BrowseBy from "@/Components/browseBy";
import SearchBox from "@/Components/searchBox";
import Notification from "@/Components/notification";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileOptions from "./profileOptions";

export default function NavBar({ userId }: { userId?: string | null }) {
  const [opened, setOpened] = useState("Explorer");
  const [search, setSearch] = useState(false);
  const [browse, setBrowse] = useState(false);
  const [profile, setProfile] = useState(false);
  const [notification, setNotification] = useState(false);
  const router = useRouter();

  const Profile = () => {
    setOpened("Profile");
    // router.push(`/user/${userId}/`);
  };

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
      <div className="z-100 sticky top-0 px-30 w-full h-15 bg-black items-center flex place-content-between border-white/20 border-b">
        <div onClick={() => Explorer()} className="cursor-pointer">
          <img src="/moctale.png" alt="" className="h-auto w-40" />
        </div>
        <div className="right-0 gap-8 flex items-center h-full overflow-hidden">
          <div onClick={() => Explorer()}>
            <i
              className={`${
                opened == "Explorer" ? "text-white" : "text-gray-50/40"
              } text-lg cursor-pointer py-5 px-2 hover:text-white fa-regular fa-compass`}
            ></i>
            {opened == "Explorer" && (
              <label className="text-white font-semibold slide">Explore</label>
            )}
          </div>

          <div onClick={() => Schedule()}>
            <i
              className={`${
                opened == "Schedule" ? "text-white" : "text-gray-50/40"
              } text-lg cursor-pointer py-5 px-2 hover:text-white bi bi-calendar4`}
            ></i>
            {opened == "Schedule" && (
              <label className="text-white font-semibold slide">Schedule</label>
            )}
          </div>

          <div onClick={() => Clubs()}>
            <i
              className={`${
                opened == "Clubs" ? "text-white" : "text-gray-50/40"
              } text-lg cursor-pointer py-5 px-2 hover:text-white fa-solid fa-users`}
            ></i>
            {opened == "Clubs" && (
              <label className="text-white font-semibold slide">Clubs</label>
            )}
          </div>

          <div className="relative">
            <button onClick={() => setBrowse(!browse)}>
              <i
                className={`${
                  browse ? "text-white" : "text-gray-50/40"
                } text-lg cursor-pointer py-5 px-2 hover:text-white bi bi-grid`}
              ></i>
            </button>
            {browse && (
              <div className="absolute right-50 top-10">
                <BrowseBy />
              </div>
            )}
          </div>
          {/* <div ref={notificationRef} className="relative">
            <button onClick={() => setNotification(!notification)}>
              <i
                className={`${
                  notification ? "text-white" : "text-gray-50/40"
                } text-lg cursor-pointer py-5 px-2 hover:text-white fa-regular fa-bell`}
              ></i>
            </button>
            {browse && (
              <div className="absolute right-50 top-10">
                <BrowseBy />
              </div>
            )}
          </div> */}
          <div className="relative">
            <button onClick={() => setNotification(!notification)}>
              <i
                className={`${
                  notification ? "text-white" : "text-gray-50/40"
                } text-lg cursor-pointer py-5 px-2 hover:text-white fa-regular fa-bell`}
              ></i>
            </button>
            {notification && (
              <div className="absolute right-50">
                <Notification />
              </div>
            )}
          </div>

          <button onClick={() => setSearch(!search)}>
            {!search && (
              <i className="text-gray-50/40 text-lg cursor-pointer py-5 px-2 hover:text-white fa-solid fa-magnifying-glass"></i>
            )}
            {search && (
              <i className="text-gray-50/40 hover:text-white text-2xl cursor-pointer py-5 px-2 fa-solid fa-xmark"></i>
            )}
          </button>

          <div>
            {
              <div
                className="w-9 h-9 overflow-hidden cursor-pointer"
                onClick={() => setProfile(!profile)}
              >
                <img
                  src="/R1.jpg"
                  className="w-full h-full object-cover rounded-full border-gray-50/40 border-2"
                  alt=""
                />
              </div>
            }
          </div>
        </div>
      </div>

      {/* {browse && <BrowseBy />} */}
      {/* {notification && <Notification />} */}
      {search && <SearchBox />}
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
