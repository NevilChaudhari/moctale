import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EditPage from "./EditPageClient";

export default async function ProfilePage() {
  const userId = (await cookies()).get("userId");

  if (!userId) {
    redirect("/");
  }
  return <EditPage userId={userId.value} />;
}
