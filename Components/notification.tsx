"use client";

import { useState } from "react";

export default function Notification() {
  const [opened, setOpened] = useState("1");

  return (
    <div className="bg-black/30 backdrop-blur-sm h-auto w-100 fixed right-50 mt-3 rounded-md border-white/20 border">
      {/* Title */}
      <div className="px-5 py-3 flex place-content-between items-center border-b border-white/20">
        <label className="font-semibold text-lg text-white">Notification</label>
        <i className="text-[#707070] fa-solid fa-brush cursor-pointer"></i>
      </div>

      {/* Options */}
      <div className="w-full border-b border-white/20 mt-2 mb-1 grid grid-cols-3">
        <div
          onClick={() => setOpened("1")}
          className={`${
            opened == "1" ? "border-b" : "border-0"
          } py-1 border-white text-center cursor-pointer`}
        >
          <button
            className={`${
              opened == "1" ? "text-white" : "text-white/50"
            } font-semibold text-sm hover:text-white cursor-pointer`}
          >
            All
          </button>
        </div>
        <div
          onClick={() => setOpened("2")}
          className={`${
            opened == "2" ? "border-b" : "border-0"
          } py-1 border-white text-center cursor-pointer`}
        >
          <button
            className={`${
              opened == "2" ? "text-white" : "text-white/50"
            } font-semibold text-sm hover:text-white cursor-pointer`}
          >
            Updates
          </button>
        </div>
        <div
          onClick={() => setOpened("3")}
          className={`${
            opened == "3" ? "border-b" : "border-0"
          } py-1 border-white text-center cursor-pointer`}
        >
          <button
            className={`${
              opened == "3" ? "text-white" : "text-white/50"
            } font-semibold text-sm hover:text-white cursor-pointer`}
          >
            Activity
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="flex flex-col justify-center items-center p-20">
        <div className="justify-center flex">
          <i className="text-gray-50/40 text-3xl py-5 px-5 fa-regular fa-bell bg-white/10 rounded-full"></i>
        </div>
        <label className="text-gray-400 font-semibold text-sm text-center mt-2">
          No notifications here
        </label>
        <label className="text-[#707070] font-semibold text-xs text-center">
          Check back later for new updates.
        </label>
      </div>

      {/* Warning */}
      <div className="px-5 py-3 text-center flex place-content-between items-center border-t border-white/20">
        <label className="w-full font-semibold text-xs text-[#707070]">Notifications are automatically removed after 30 days</label>
      </div>
    </div>
  );
}
