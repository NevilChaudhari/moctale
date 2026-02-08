import { cookies } from "next/headers";
import CollectionClient from "./collectionClient";

interface ProfilePageProps {
    params: { id: number };
    }

    export default async function ProfilePage({ params }: ProfilePageProps) {
    const { id } = await params;
    const userId = (await cookies()).get("userId");

    return <CollectionClient id={id} userId={userId?.value.toString()} />;
}
