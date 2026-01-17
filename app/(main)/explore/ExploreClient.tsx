// app/explore/ExploreClient.tsx  (Client Component)
"use client";
import { useRouter } from "next/navigation";
interface ExploreClientProps {
  media: any[];
}

export default function ExploreClient({ media }: ExploreClientProps) {
  const router = useRouter();
  const upcomingMovies = media.filter(
    (item) => item.current_status === "upcoming"
  );
  const featuredMovie = upcomingMovies[0];

  const handleCardClick = (item: any) => {
    router.push(`/content/${item.id}`);
  };

  return (
    <div className="px-30 py-10 flex gap-5 h-screen text-white">
      {/* Left Part */}
      <div className="h-full w-[70%]">
        <div className="w-full mb-6">
          <span className="text-[#E2E2E2] text-[20px] font-bold">
            Talk Of The Town
          </span>
        </div>
        <div className="w-full grid grid-cols-5 gap-2">
          {/* Movie Card */}
          {media.length > 0 ? (
            media.map((item) => (
              <div
                onClick={() => handleCardClick(item)}
                key={item.id || item.title} // always add a key!
                className="flex flex-col items-center hover:bg-[#171717] mb-5 p-2 rounded-xl cursor-pointer"
              >
                <img
                  className="rounded-xl w-40 h-60 bg-cover object-cover"
                  src={item.image_url}
                  alt={item.title}
                />
                <span className="px-2 mt-2 w-full opacity-80 text-left">
                  {item.title}
                </span>
                <span className="px-2 w-full font-normal text-left text-xs">
                  {item.current_status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-5">No items available</p>
          )}
        </div>
      </div>

      {/* Right Part */}
      <div className="h-full w-[30%]">
        <div className="w-full mb-6 flex gap-2">
          <i className="bi bi-fire"></i>
          <span className="text-[#E2E2E2] text-[20px] font-bold">
            Talk Of The Town
          </span>
        </div>
        <div className="w-full flex flex-col gap-2">
          {/* Movie Card */}
          {upcomingMovies.map((item, index) => (
            <div onClick={()=>{handleCardClick(item)}} key={item.id} className="gap-2 w-full flex border border-[#252525] items-center hover:bg-[#111111] mb-5 p-2 rounded-xl cursor-pointer py-2 px-3">
              <span className="text-[80px] font-black text-transparent bg-clip-text bg-linear-to-b from-[#E2E2E2] to-[#6B6B6B] select-none leading-none">
                {index + 1}
              </span>
              <img
                alt={item.title}
                className="h-auto w-15 rounded-md"
                src={item.image_url}
              />
              <div className="ml-5 h-full items-start flex flex-col justify-center gap-1">
                <span className="font-bold">{item.title}</span>
                <div className="flex gap-1">
                  <span className="font-bold text-[#808080] text-[11px]">
                    {item.release_date
                      ? new Date(item.release_date).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </span>
                  <span className="text-[#808080] text-[11px]">•</span>
                  <span className="font-bold text-[#808080] text-[11px]">
                    {featuredMovie.current_status}
                  </span>
                </div>
                <div className="flex gap-1">
                  <i className="bi bi-fire text-sm text-[#FF6233]"></i>
                  <span className="font-bold text-sm text-[#FF6233]">
                    {featuredMovie.interested || "0"}K
                  </span>
                  <span className="font-bold text-sm text-[#FF6233]">
                    Interested
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
