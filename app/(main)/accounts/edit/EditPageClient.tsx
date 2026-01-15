"use client";
import { useEffect, useState } from "react";

interface Props {
  userId: string;
}

export default function EditPage({ userId }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [profile_url, setProfile_url] = useState("");

  const API_KEY = "712e9653c1453f9d5da0b5893fe3ec25"; // ← replace with your ImgBB API key

  // Upload image to ImgBB
  const uploadImage = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const base64 = await toBase64(file);
      const formData = new FormData();
      formData.append("image", base64.split(",")[1]);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      setProfile_url(data.data.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  // Convert file to base64
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

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

        setUsername(data.data.username || "");
        setFirstName(data.data.first_name || "");
        setLastName(data.data.last_name || "");
        setBio(data.data.bio || "");
        setProfile_url(data.data.profile_url || "");
      } catch (err) {
        setError((err as Error).message);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      userId,
      username,
      firstName,
      lastName,
      bio,
      profile_url,
    };
    console.log("Submitting:", formData);

    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      alert("Profile updated successfully!");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="mx-30 my-10 flex gap-5">
      {/* Left Side */}
      <div className="h-full rounded-xl w-[25%] border border-[#252833] pt-5 bg-[#1b1b1b] flex flex-col">
        <label className="text-lg font-semibold px-8">Settings</label>
        <div className="w-full mt-5">
          {/* Buttons */}
          <div className="text-[#C6C6C6] border-b border-[#252833] hover:bg-[#252525] cursor-pointer">
            <button className="px-8 py-2 cursor-pointer flex gap-2 items-center">
              <i className="bi bi-person text-xl"></i>
              <label className="text-sm">Edit Profile</label>
            </button>
          </div>
          <div className="text-[#C6C6C6] border-b border-[#252833] hover:bg-[#252525] cursor-pointer">
            <button className="px-8 py-2 cursor-pointer flex gap-2 items-center">
              <i className="bi bi-heart-pulse text-xl"></i>
              <label className="text-sm">Profile health</label>
            </button>
          </div>
          <div className="text-[#C6C6C6] border-b border-[#252833] hover:bg-[#252525] cursor-pointer">
            <button className="px-8 py-2 cursor-pointer flex gap-2 items-center">
              <i className="bi bi-lock text-xl"></i>
              <label className="text-sm">Change Password</label>
            </button>
          </div>

          <div className="border-b border-[#252833] bg-[#0d0d0d] text-[#939297] py-2 cursor-pointer">
            <label className="text-xs px-8">MORE</label>
          </div>
          {/* Buttons */}
          <div className="text-[#C6C6C6] border-b border-[#252833] hover:bg-[#252525] cursor-pointer">
            <button className="px-8 py-2 cursor-pointer flex gap-2 items-center">
              <i className="bi bi-discord text-xl"></i>
              <label className="text-sm">Join Discord</label>
            </button>
          </div>
          {/* Buttons */}
          <div className="text-[#C6C6C6] border-b border-[#252833] hover:bg-[#252525] cursor-pointer">
            <button className="px-8 py-2 cursor-pointer flex gap-2 items-center">
              <i className="bi bi-whatsapp text-xl"></i>
              <label className="text-sm">Join Whatsapp</label>
            </button>
          </div>
          {/* Buttons */}
          <div className="text-[#C6C6C6] border-b border-[#252833] hover:bg-[#252525] cursor-pointer">
            <button className="px-8 py-2 cursor-pointer flex gap-2 items-center">
              <i className="bi bi-instagram text-xl"></i>
              <label className="text-sm">Follow on Instagram</label>
            </button>
          </div>
          {/* Buttons */}
          <div className="text-[#C6C6C6] border-b border-[#252833] hover:bg-[#252525] cursor-pointer">
            <button className="px-8 py-2 cursor-pointer flex gap-2 items-center">
              <i className="bi bi-exclamation-triangle text-xl"></i>
              <label className="text-sm">Your Issues</label>
            </button>
          </div>
          {/* Buttons */}
          <div className="text-[#C6C6C6] border-b border-[#252833] hover:bg-[#252525] cursor-pointer">
            <button className="px-8 py-2 cursor-pointer flex gap-2 items-center">
              <i className="bi bi-chat text-xl"></i>
              <label className="text-sm">Give Feedback</label>
            </button>
          </div>
          {/* Buttons */}
          <div className="text-[#C6C6C6] border-b border-[#252833] hover:bg-[#252525] cursor-pointer">
            <button className="px-8 py-2 cursor-pointer flex gap-2 items-center">
              <i className="bi bi-shield text-xl"></i>
              <label className="text-sm">Privacy Policy</label>
            </button>
          </div>
          {/* Buttons */}
          <div className="text-[#C6C6C6] border-b border-[#252833] hover:bg-[#252525] cursor-pointer">
            <button className="px-8 py-2 cursor-pointer flex gap-2 items-center">
              <i className="bi bi-file-earmark-text text-xl"></i>
              <label className="text-sm">Terms of Services</label>
            </button>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="h-screen rounded-xl w-[75%] border px-8 border-[#252833] bg-[#1b1b1b]">
        <div className="pt-5">
          <label className="text-xl font-semibold">Edit Profile</label>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-5">
          {/* Profile Pic Upload */}
          <div className="flex gap-5 items-center">
            <div className="relative rounded-full overflow-hidden w-24 h-24 bg-gray-700 flex justify-center items-center">
              {profile_url ? (
                <img
                  src={profile_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white/40">No Image</span>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files?.[0]) uploadImage(e.target.files[0]);
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="">Profile photo</span>
              <span className="text-sm text-white/40">
                Click to upload a new profile photo
              </span>
              {uploading && (
                <span className="text-xs text-blue-400">Uploading...</span>
              )}
              {error && <span className="text-xs text-red-400">{error}</span>}
            </div>
          </div>

          {/* Username */}
          <div className="flex w-full items-center gap-3">
            <span className="text-sm w-[15%]">Username</span>
            <input
              type="text"
              className="w-full bg-[#202020] border border-[#252833] text-sm px-2 py-2 rounded-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {/* First Name */}
          <div className="flex w-full items-center gap-3">
            <span className="text-sm w-[15%]">First Name</span>
            <input
              type="text"
              className="w-full bg-[#202020] border border-[#252833] text-sm px-2 py-2 rounded-lg"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* Last Name */}
          <div className="flex w-full items-center gap-3">
            <span className="text-sm w-[15%]">Last Name</span>
            <input
              type="text"
              className="w-full bg-[#202020] border border-[#252833] text-sm px-2 py-2 rounded-lg"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* Bio */}
          <div className="flex w-full items-center gap-3">
            <span className="text-sm w-[15%]">Bio</span>
            <div className="flex flex-col w-full gap-1">
              <textarea
                rows={4}
                className="w-full resize-none bg-[#202020] border border-[#252833] text-sm px-2 py-2 rounded-lg"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <span className="text-xs text-white/40">
                Write a short bio to tell people more about yourself.
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 bg-white hover:bg-white/80 text-black px-4 py-2 rounded-lg ml-auto w-auto cursor-pointer"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
