import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import HomeClient from "./HomeClient";

export default async function Page() {
  const userId = (await cookies()).get("userId");

  if (!userId) {
    redirect("/login");
  }

  // return (<HomeClient userId={userId.value}/>);
  redirect("/explore");
}
