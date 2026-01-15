"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
interface ExploreClientProps {
  media: any[];
}

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export default function ExploreClient({ media }: ExploreClientProps) {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
        );

        if (!res.ok) throw new Error("Failed to fetch movies");

        const data = await res.json();
        setMovies(data.results);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      }
    };

    fetchMovies();
  }, []);
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
          {movies.length > 0 ? (
            movies.map((item) => (
              <div
                onClick={() => handleCardClick(item)}
                key={item.id || item.title} // always add a key!
                className="flex flex-col items-center hover:bg-[#171717] mb-5 p-2 rounded-xl cursor-pointer"
              >
                <img
                  className="rounded-xl w-40 h-60 bg-cover object-cover"
                  src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                  alt={item.title}
                />
                <span className="px-2 mt-2 w-full opacity-80 text-left">
                  {item.title}
                </span>
                <span className="px-2 w-full font-normal text-left text-xs">
                  {item.release_date}
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
          <div className="gap-2 w-full flex border border-[#252525] items-center hover:bg-[#111111] mb-5 p-2 rounded-xl cursor-pointer py-2 px-3">
            <span className="text-[80px] font-black text-transparent bg-clip-text bg-linear-to-b from-[#E2E2E2] to-[#6B6B6B] select-none leading-none">
              10
            </span>
            <img
              alt="Avengers: Doomsday"
              className="h-auto w-15 rounded-md -top-11.25 -left-9"
              src="/R1.jpg"
            />
            <div className="ml-5 h-full items-start flex flex-col justify-center gap-1">
              <span className="font-bold">Movie Name</span>
              <div className="flex gap-1">
                <span className="font-bold text-[#808080] text-[11px]">
                  18 Dec, 2026
                </span>
                <span className="text-[#808080] text-[11px]">•</span>
                <span className="font-bold text-[#808080] text-[11px]">
                  Movie Status
                </span>
              </div>
              <div className="flex gap-1">
                <i className="bi bi-fire text-sm text-[#FF6233]"></i>
                <span className="font-bold text-sm text-[#FF6233]">24.5K</span>
                <span className="font-bold text-sm text-[#FF6233]">
                  Intrested
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
