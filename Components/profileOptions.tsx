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
    <div className="z-100 bg-black w-50 p-1 fixed right-30 mt-3 rounded-md border-white/20 border">
      <div
        onClick={() => {
          Profile();
          onClose();
        }}
        className="w-full text-white px-2 py-2 text-xl flex gap-3 rounded font-semibold items-center hover:bg-gray-600/50 cursor-pointer"
      >
        <i className="bi bi-person text-sm"></i>
        <div className="text-xs">My Profile</div>
      </div>

      <div className="w-full text-white px-2 py-2 text-xl flex gap-3 rounded font-semibold items-center hover:bg-gray-600/50 cursor-pointer">
        <i className="bi bi-pencil-square text-sm"></i>
        <div className="text-xs">My Reviews</div>
      </div>

      <div className="w-full text-white px-2 py-2 text-xl flex gap-3 rounded font-semibold items-center hover:bg-gray-600/50 cursor-pointer">
        <i className="bi bi-person text-sm"></i>
        <div className="text-xs">My Collections</div>
      </div>

      <div className="w-full text-white px-2 py-2 text-xl flex gap-3 rounded font-semibold items-center hover:bg-gray-600/50 cursor-pointer">
        <i className="bi bi-bookmark text-sm"></i>
        <div className="text-xs">Saved Collections</div>
      </div>

      <div className="w-full text-white px-2 py-2 text-xl flex gap-3 rounded font-semibold items-center hover:bg-gray-600/50 cursor-pointer">
        <i className="bi bi-gear text-sm"></i>
        <div className="text-xs">Settings</div>
      </div>

      <div
        onClick={() => {
          logout();
          onClose();
        }}
        className="w-full text-red-300 px-2 py-2 text-xl flex gap-3 rounded font-semibold items-center hover:bg-red-500/20 cursor-pointer"
      >
        <i className="bi bi-upload text-sm rotate-90"></i>
        <div className="text-xs">Log Out</div>
      </div>
    </div>
  );
}
