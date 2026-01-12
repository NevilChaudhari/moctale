"use client";

import BrowseBy from "@/Components/browseBy";
import SearchBox from "@/Components/searchBox";
import Notification from "@/Components/notification";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeClient({ userId }: { userId: string }) {
  const [opened, setOpened] = useState("Explorer");
  const [search, setSearch] = useState(false);
  const [browse, setBrowse] = useState(false);
  const [notification, setNotification] = useState(false);

  const router = useRouter();

  const Profile = async () => {
    // const res = await fetch("/api/profile/", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(userId),
    // });

    // const data = await res.json();
    // const username = data.success;
    // console.log(username);
    router.push(`/user/${userId}/`);
  };

  return (
    <>
      <div className="min-h-screen overflow-hidden bg-black relative">
        {/* Navbar */}
        <div className="px-30 w-full h-15 bg-black items-center flex place-content-between border-white/20 border-b">
          <img src="./moctale.png" alt="" className="h-auto w-40" />
          <div className="right-0 gap-8 flex items-center h-full overflow-hidden">
            <div onClick={() => setOpened("Explorer")}>
              <i
                className={`${
                  opened == "Explorer" ? "text-white" : "text-gray-50/40"
                } text-lg cursor-pointer py-5 px-2 hover:text-white fa-regular fa-compass`}
              ></i>
              {opened == "Explorer" && (
                <label className="text-white font-semibold slide">
                  Explore
                </label>
              )}
            </div>

            <div onClick={() => setOpened("Schedule")}>
              <i
                className={`${
                  opened == "Schedule" ? "text-white" : "text-gray-50/40"
                } text-lg cursor-pointer py-5 px-2 hover:text-white bi bi-calendar4`}
              ></i>
              {opened == "Schedule" && (
                <label className="text-white font-semibold slide">
                  Schedule
                </label>
              )}
            </div>

            <div onClick={() => setOpened("Clubs")}>
              <i
                className={`${
                  opened == "Clubs" ? "text-white" : "text-gray-50/40"
                } text-lg cursor-pointer py-5 px-2 hover:text-white fa-solid fa-users`}
              ></i>
              {opened == "Clubs" && (
                <label className="text-white font-semibold slide">Clubs</label>
              )}
            </div>

            <button onClick={() => setBrowse(!browse)}>
              <i
                className={`${
                  browse ? "text-white" : "text-gray-50/40"
                } text-lg cursor-pointer py-5 px-2 hover:text-white bi bi-grid`}
              ></i>
            </button>
            <button onClick={() => setNotification(!notification)}>
              <i
                className={`${
                  notification ? "text-white" : "text-gray-50/40"
                } text-lg cursor-pointer py-5 px-2 hover:text-white fa-regular fa-bell`}
              ></i>
            </button>

            <div onClick={() => setSearch(!search)}>
              {!search && (
                <i className="text-gray-50/40 text-lg cursor-pointer py-5 px-2 hover:text-white fa-solid fa-magnifying-glass"></i>
              )}
              {search && (
                <i className="text-gray-50/40 hover:text-white text-2xl cursor-pointer py-5 px-2 fa-solid fa-xmark"></i>
              )}
            </div>

            <div>
              {(
                <div
                  className="w-9 h-9 overflow-hidden cursor-pointer"
                  onClick={() => Profile()}
                >
                  <img
                    src="./R1.jpg"
                    className="w-full h-full object-cover rounded-full border-gray-50/40 border-2"
                    alt=""
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {search && <SearchBox />}
        {browse && <BrowseBy />}
        {notification && <Notification />}

        {/* Content */}
        <div className="px-30 w-full h-full bg-gray-950 text-white">
          {/* Main Content */}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes reveal {
          from {
            clip-path: inset(0 100% 0 0);
          }
          to {
            clip-path: inset(0 0 0 0);
          }
        }

        .slide {
          display: inline-block;
          clip-path: inset(0 100% 0 0);
          animation: reveal 0.1s ease-out forwards;
        }
      `}</style>
    </>
  );
}
