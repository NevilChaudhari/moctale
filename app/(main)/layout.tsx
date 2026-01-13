import "../globals.css";

import "bootstrap-icons/font/bootstrap-icons.css";
import TopProgressBar from "./TopProgressBar";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import NavBar from "@/Components/navbar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId");

  return (
    <>
      <NavBar userId={userId?.value} />
      <TopProgressBar />
      <div className="h-screen bg-black">{children}</div>
    </>
  );
}
