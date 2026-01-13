"Use Client";

import { useState } from "react";

export default function SearchBox() {
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("1");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

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

  return (
    <div className="absolute text-white px-30 bg-black w-full border-white/20 border-b z-20">
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

      <div className="h-100">
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

        {isSearching && (
          <div className="w-full">
            <div className="place-content-between w-full flex">
              <label className="font-medium text-sm text-white">
                SEARCH RESULTS
              </label>
            </div>
          </div>
        )}

        {searchHistory.length == 0 && !isSearching && (
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
