// app/home/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const userId = (await cookies()).get("userId");  

  if (!userId) {
    redirect("/");
  }

  return <HomeClient userId={userId.value}/>;
}