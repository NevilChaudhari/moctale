"use client";

import { useRouter  } from "next/navigation";
import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  image_url: string | null;
  release_date: string;
  type: string;
}
interface Cast {
  id: number;
  name: string;
  profile_path: string | null;
}
interface User {
  id: number;
  name: string;
  username: string;
  profile_path: string | null;
}

export default function SearchBox() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("1");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [cast, setCast] = useState<Cast[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!search.trim()) return;
    const fetchData = async () => {
      try {
        const res = await fetch("/api/search/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search: search }),
        });

        const data = await res.json();

        setMovies(data.movies ?? []);
        setCast(data.cast ?? []);
        setUsers(data.users ?? []);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    const timeout = setTimeout(() => {
      fetchData();
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const isSearching = search.trim() !== "";

  const setHistory = () => {
    const value = search.trim();
    if (!value) return;

    setSearchHistory((prev) => [...prev, value]);
  };

  const removeItem = (indexToRemove: number) => {
    setSearchHistory((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleCardClick = (item: any) => {
    console.log(item.id);
    router.push(`/content/${item.id}`);
  };

  return (
    <div className="fixed text-white px-30 bg-black w-full border-white/20 border-b z-20">
      {/* <div className="border border-white/20 rounded-md my-4 px-2 flex bg-[#171717]"> */}
      <form
        onSubmit={(e) => {
          e.preventDefault(); // prevent page reload
          setHistory();
        }}
        className="w-full border border-white/20 rounded-md my-4 px-2 flex bg-[#171717]"
      >
        <button type="submit">
          <i className="text-gray-50/40 text-lg py-5 px-2 fa-solid fa-magnifying-glass"></i>
        </button>
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="py-3 w-full border-0 bg-[#171717] rounded-md focus:outline-0"
          placeholder="Search for Movies, Shows, Anime, Cast, & Crew or Users..."
        />
      </form>
      {/* </div> */}

      <div className="h-100 overflow-y-auto">
        <div className="w-full border-b border-white/20 mt-2 mb-8">
          <button
            onClick={() => setSearchType("1")}
            className={`${
              searchType == "1" ? "text-white  border-b-2" : "text-gray-400"
            } font-semibold text-sm cursor-pointer hover:text-white`}
          >
            Content
          </button>
          <button
            onClick={() => setSearchType("2")}
            className={`${
              searchType == "2" ? "text-white  border-b-2" : "text-gray-400"
            } font-semibold text-sm cursor-pointer hover:text-white mx-8`}
          >
            Cast & Crew
          </button>
          <button
            onClick={() => setSearchType("3")}
            className={`${
              searchType == "3" ? "text-white  border-b-2" : "text-gray-400"
            } font-semibold text-sm cursor-pointer hover:text-white`}
          >
            Users
          </button>
        </div>

        {searchHistory.length != 0 && !isSearching && (
          <div className="w-full">
            <div className="place-content-between w-full flex mb-3">
              <label className="font-medium text-sm text-white">
                RECENT SEARCHES
              </label>
              <button
                onClick={() => {
                  setSearchHistory([]);
                }}
              >
                <label className="font-semibold text-xs cursor-pointer hover:text-white text-white/50">
                  Clear History
                </label>
              </button>
            </div>
            <div>
              <div className="flex gap-2">
                {searchHistory.map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#171717] rounded-full px-5 py-1 items-center justify-center place-content-between"
                  >
                    {item}
                    <button
                      onClick={() => {
                        removeItem(index);
                      }}
                    >
                      <i className="text-gray-50/40 hover:text-white text-xs ml-3 cursor-pointer bi bi-x-lg"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {searchType == "1" && isSearching && movies.length > 0 && (
          <div className="w-full">
            <div className="place-content-between w-full flex">
              <label className="font-medium text-sm text-white">
                SEARCH RESULTS
              </label>
            </div>
            <div className="grid grid-cols-4 mt-5 gap-3">
              {/* Movie Card */}
              {movies.map((item) => (
                <div
                  key={item.id || item.title}
                  onClick={() => {
                    handleCardClick(item);
                  }}
                  className=" bg-[#171717] hover:bg-[#1F1F1F] cursor-pointer rounded-lg p-3 flex gap-3"
                >
                  <div className="w-20 h-auto rounded-xl overflow-hidden">
                    <img
                      src={`${item.image_url}`}
                      alt=""
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[#E2E2E2] font-medium">
                      {item.title}
                    </span>
                    <div className="text-[#A0A0A0] text-xs">
                      <span>
                        {item.release_date
                          ? new Date(item.release_date).getFullYear()
                          : "N/A"}
                      </span>
                      <span> • </span>
                      <span>{item.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchType == "2" && isSearching && cast.length > 0 && (
          <div className="w-full">
            <div className="place-content-between w-full flex">
              <label className="font-medium text-sm text-white">
                SEARCH RESULTS
              </label>
            </div>
            <div className="grid grid-cols-7 mt-5 gap-3">
              {/* Movie Card */}
              {cast.map((item) => (
                <div
                  key={item.id || item.name}
                  className=" bg-[#171717] hover:bg-[#1F1F1F] justify-center items-center cursor-pointer rounded-lg p-3 flex flex-col gap-3"
                >
                  <div className="w-30 h-30 flex justify-center items-center rounded-full overflow-hidden">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${item.profile_path}`}
                      alt=""
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[#E2E2E2] font-medium">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchType == "3" && isSearching && users.length > 0 && (
          <div className="w-full">
            <div className="place-content-between w-full flex">
              <label className="font-medium text-sm text-white">
                SEARCH RESULTS
              </label>
            </div>
            <div className="grid grid-cols-7 mt-5 gap-3">
              {/* Movie Card */}
              {users.map((item) => (
                <div
                  key={item.id || item.username}
                  className=" bg-[#171717] hover:bg-[#1F1F1F] justify-center items-center cursor-pointer rounded-lg p-3 flex flex-col gap-3"
                >
                  <div className="w-30 h-30 flex justify-center items-center rounded-full overflow-hidden">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${item.profile_path}`}
                      alt=""
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[#E2E2E2] font-medium">
                    {item.username}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {movies.length == 0 && isSearching && searchType=='1' &&(
          <NoResultsUI />
        )}
        {cast.length == 0 && isSearching && searchType=='2' &&(
          <NoResultsUI />
        )}
        {users.length == 0 && isSearching && searchType=='3' &&(
          <NoResultsUI />
        )}

        {searchHistory.length == 0 && !isSearching && search.length <= 0 && (
          <div className="flex flex-col justify-center items-center p-20">
            <div className="justify-center flex">
              <i className="text-gray-50/40 text-3xl py-5 px-5 fa-solid fa-magnifying-glass bg-white/10 rounded-full"></i>
            </div>
            <label className="text-gray-400 font-semibold text-sm text-center mt-2">
              No recent searches
            </label>
            <label className="text-[#707070] font-semibold text-xs text-center">
              Your search history will appear here
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

function NoResultsUI() {
  return (
    <div className="flex flex-col justify-center items-center p-20">
      <div className="justify-center flex">
        <i className="text-gray-50/40 text-3xl py-5 px-5 fa-solid fa-magnifying-glass bg-white/10 rounded-full"></i>
      </div>
      <div className="flex gap-1 mt-2">
        <label className="text-[#707070] font-semibold text-sm text-center">
          No result found — check spelling or
        </label>
        <label className="text-white font-bold text-sm text-center hover:underline cursor-pointer">
          request content
        </label>
      </div>
    </div>
  );
}