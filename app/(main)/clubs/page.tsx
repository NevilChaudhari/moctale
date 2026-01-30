import ClubsClient from "./ClubsClient";
import { cookies } from "next/headers";

interface ProfilePageProps {
    params: { id: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { id } = await params;
    const userId = (await cookies()).get("userId");

    return <ClubsClient id={id} userId={userId?.value.toString()} />;
}
