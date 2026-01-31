import Profile from "./ProfileClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const userId = (await cookies()).get("userId");

  if (!userId) {
    redirect("/");
  }
  return <Profile userId={username} isMe={userId.value == username} />;
}
