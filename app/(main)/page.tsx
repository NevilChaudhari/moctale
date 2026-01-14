import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {
  const userId = (await cookies()).get("userId");

  if (!userId) {
    redirect("/login");
  }

  redirect("/explore");
}
