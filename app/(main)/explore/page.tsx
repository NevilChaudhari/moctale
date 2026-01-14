import ExploreClient from "./ExploreClient";

async function getMedia() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/media`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch media");
  return res.json();
}

export default async function Explore() {
  const media = await getMedia();

  return <ExploreClient media={media} />;
}
