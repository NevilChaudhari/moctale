"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
}

interface User {
  user_id: string;
  username: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export default function LogoutButton({ userId }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });

        const data = await res.json();
        setUser(data.success[0] ?? null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [userId]);

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
    <div>
      <h1>{user?.username ?? "Loading..."}</h1>
      <button className="border m-5" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
