"use client";

import { useRouter } from "next/navigation";

export default function ProfileOptions({
  userId,
  onClose,
}: {
  userId?: string | null;
  onClose: () => void;
}) {
  const router = useRouter();

  const Profile = async () => {
    router.push(`/user/${userId}/`);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      console.log("Logging out user:", userId);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="z-100 px-3 md:px-1 bg-black w-full h-full md:h-auto md:w-50 p-1 fixed md:right-30 mt-3 rounded-md md:border-white/20 md:border">

      <span className="text-lg md:hidden text-[#E2E2E2] font-semibold">Menu</span>
      <div
        onClick={() => {
          Profile();
          onClose();
        }}
        className="hidden md:flex w-full border md:border-0 md:bg-transparent border-[#252833] bg-[#171717] text-white px-3 py-2 text-xl gap-3 rounded font-semibold items-center md:hover:bg-gray-600/50 cursor-pointer"
      >
        <i className="bi bi-person text-xl md:text-sm"></i>
        <div className="text-sm md:text-xs">My Profile</div>
      </div>

      <div className="my-2 w-full border md:border-0 md:bg-transparent border-[#252833] bg-[#171717] text-white px-3 py-2 text-xl flex gap-3 rounded font-semibold items-center md:hover:bg-gray-600/50 cursor-pointer">
        <i className="bi bi-pencil-square text-xl md:text-sm"></i>
        <div className="text-sm md:text-xs">My Reviews</div>
      </div>

      <div className="my-2 w-full border md:border-0 md:bg-transparent border-[#252833] bg-[#171717] text-white px-3 py-2 text-xl flex gap-3 rounded font-semibold items-center md:hover:bg-gray-600/50 cursor-pointer">
        <i className="bi bi-person text-xl md:text-sm"></i>
        <div className="text-sm md:text-xs">My Collections</div>
      </div>

      <div className="my-2 w-full border md:border-0 md:bg-transparent border-[#252833] bg-[#171717] text-white px-3 py-2 text-xl flex gap-3 rounded font-semibold items-center md:hover:bg-gray-600/50 cursor-pointer">
        <i className="bi bi-bookmark text-xl md:text-sm"></i>
        <div className="text-sm md:text-xs">Saved Collections</div>
      </div>

      <div className="my-2 w-full border md:border-0 md:bg-transparent border-[#252833] bg-[#171717] text-white px-3 py-2 text-xl flex gap-3 rounded font-semibold items-center md:hover:bg-gray-600/50 cursor-pointer">
        <i className="bi bi-gear text-xl md:text-sm"></i>
        <div className="text-sm md:text-xs">Settings</div>
      </div>

      <div
        onClick={() => {
          logout();
          onClose();
        }}
        className="my-2 w-full border md:border-0 md:bg-transparent text-red-300 bg-[#1F1212] px-3 py-2 text-xl flex gap-3 rounded font-semibold items-center md:hover:bg-red-500/20 cursor-pointer"
      >
        <i className="bi bi-upload rotate-90 text-xl md:text-sm"></i>
        <div className="text-sm md:text-xs">Log Out</div>
      </div>
    </div>
  );
}
