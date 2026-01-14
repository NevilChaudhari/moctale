import ContentClient from "./ContentClient";

interface ProfilePageProps {
  params: { id: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;

  return <ContentClient id={id} />;
}
