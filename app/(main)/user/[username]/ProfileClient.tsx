"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";

interface Props {
  userId: string;
}

interface User {
  user_id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  profile_url?: string;
  intrestedIn?: string;
}

interface Intrests {
  id: string;
  title: string;
  release_date: string;
  image_url: string;
  type: string;
}

interface comments {
  id: number;
  post_id: number;
  user_id: number;
  parent_id: number | null;
  content: string;
  created_at: string;
  category: string | null;
  likes: number;
  replies: string;
}

interface Media {
  id: number;
  type: string;
  title: string;
  release_date: string;
  image_url: string;
}

export default function LogoutButton({ userId }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [type, setType] = useState("Reviews");
  const [categories, setCategories] = useState("All");
  const [listView, setListView] = useState(true);
  const [liked, setLiked] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [intrests, setInterests] = useState<Intrests[]>([]);

  const handleClick = (item: any) => {
    console.log(item.id);
    router.push(`/content/${item.id}`);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/getUser/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        const data = await res.json();
        setUser(data.data ?? null);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, [userId]);

  const [comments, setComments] = useState<comments[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!userId) return;

      try {
        const res = await fetch("/api/comments/fetchUserComments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        const data = await res.json();
        setComments(data.comments ?? []);

        console.log(`comments:`, data.comments);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [userId]);

  const [media, setMedia] = useState<Record<number, Media>>({});

  useEffect(() => {
    if (!comments.length) return;

    const fetchMedia = async () => {
      try {
        const uniqueIds = Array.from(new Set(comments.map((c) => c.post_id)));

        const res = await fetch("/api/getMultipleMedia/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds: uniqueIds }),
        });

        const data = await res.json();

        if (!data.success) return;

        const mediaMap: Record<number, Media> = {};

        data.success.forEach((m: Media) => {
          mediaMap[m.id] = m;
        });
        setMedia(mediaMap);

        console.log(`media: ${mediaMap}`);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchMedia();
  }, [comments]);

  const [searchQuery, setSearchQuery] = useState("");

  // Fetch interests AFTER user is loaded
  useEffect(() => {
    if (!user?.intrestedIn) return;

    const fetchInterests = async () => {
      try {
        const res = await fetch("/api/getIntrests/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ intrestedIn: user.intrestedIn }),
        });

        const data = await res.json();

        // Ensure it's always an array
        setInterests(Array.isArray(data.data) ? data.data : [data.data]);

        console.log(intrests);
      } catch (err) {
        console.error("Failed to fetch interests:", err);
        setInterests([]); // fallback
      }
    };

    fetchInterests();
  }, [user]);

  return (
    <>
      <div className="bg-black h-auto text-white px-32 py-8 flex gap-6">
        {/* Profile Info */}
        <div className="bg-[#1b1b1b] w-[25%] p-5 border-[#252833] border h-full rounded-lg">
          <div className="items-center justify-center flex flex-col border-b border-gray-700 pb-5">
            {/* Profile Image */}
            <div className="w-35 h-35 overflow-hidden">
              <img
                src={user?.profile_url || "Loading"}
                className="w-full h-full object-cover rounded-full border-gray-50/40 border-2"
                alt=""
              />
            </div>

            {/* User Data */}
            <div className="mt-4 text-center">
              <h2 className="text-md font-semibold">
                {user?.first_name || "Loading..."} {user?.last_name || ""}
              </h2>
              <h2 className="text-xs font-semibold">
                @{user?.username || "Loading..."}
              </h2>
            </div>

            {/* User Info */}
            <div className="flex mt-5 text-center gap-10">
              <div className="flex flex-col text-center">
                <span className="text-md font-semibold">3</span>
                <span className="text-[10px] text-[#C6C6C6]">Reviews</span>
                <span className="text-[10px] text-[#C6C6C6]">Posted</span>
              </div>
              <div className="flex flex-col text-center">
                <span className="text-md font-semibold">4</span>
                <span className="text-[10px] text-[#C6C6C6]">Posts</span>
                <span className="text-[10px] text-[#C6C6C6]">Created</span>
              </div>
              <div className="flex flex-col text-center">
                <span className="text-md font-semibold">1</span>
                <span className="text-[10px] text-[#C6C6C6]">Public</span>
                <span className="text-[10px] text-[#C6C6C6]">Collections</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5 mb-5">
            <p className="text-sm text-[#C6C6C6]">{user?.bio}</p>
          </div>

          {/* Followers */}
          <div className="flex gap-3 mb-5">
            <i className="bi bi-people-fill"></i>
            <div className="flex items-center gap-1 cursor-pointer hover:text-white">
              <span className="text-sm text-[#E2E2E2] font-semibold">0</span>
              <span className="text-sm text-[#E2E2E2]">Followers</span>
            </div>
            <span className="jsx-7ea9b810749cb99b text-[#C6C6C6] text-sm">
              •
            </span>
            <div className="flex items-center gap-1 cursor-pointer">
              <span className="text-sm text-[#E2E2E2] font-semibold">0</span>
              <span className="text-sm text-[#E2E2E2]">Following</span>
            </div>
          </div>

          {/* Edit Profile */}
          <button
            onClick={() => {
              router.push("/accounts/edit");
            }}
            className="w-full bg-[#474747] hover:bg-[#5A5A5A] text-sm text-white py-2 rounded-md cursor-pointer"
          >
            Edit Profile
          </button>
        </div>

        {/* Reviews, Posts and Collections */}
        <div className="w-[50%] h-full flex flex-col rounded-lg">
          <div className="w-full h-12 p-1 bg-[#131313] rounded-2xl flex">
            <button
              onClick={() => setType("Reviews")}
              className={`${
                type === "Reviews"
                  ? "bg-[#474747] text-white"
                  : "text-[#C6C6C6]"
              } opacity-100 w-1/3 h-full cursor-pointer rounded-xl text-base font-semibold gap-2 flex items-center justify-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`lucide lucide-square-pen w-5 h-5 transition-colors duration-300 text-[#E2E2E2] ${
                  type === "Reviews" ? "opacity-100" : "opacity-60"
                }`}
              >
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
              </svg>
              Reviews
            </button>

            <button
              onClick={() => setType("Posts")}
              className={`${
                type === "Posts" ? "bg-[#474747] text-white" : "text-[#C6C6C6]"
              } opacity-100 w-1/3 h-full cursor-pointer rounded-xl text-base font-semibold gap-2 flex items-center justify-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`lucide lucide-message-square w-5 h-5 transition-colors duration-300 text-[#C6C6C6] ${
                  type === "Posts" ? "opacity-100" : "opacity-60"
                }`}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Posts
            </button>

            <button
              onClick={() => setType("Collections")}
              className={`${
                type === "Collections"
                  ? "bg-[#474747] text-white"
                  : "text-[#C6C6C6]"
              } opacity-100 w-1/3 h-full cursor-pointer rounded-xl text-base font-semibold gap-2 flex items-center justify-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`lucide lucide-list-video w-5 h-5 transition-colors duration-300 text-[#C6C6C6] ${
                  type === "Collections" ? "opacity-100" : "opacity-60"
                }`}
              >
                <path d="M12 12H3"></path>
                <path d="M16 6H3"></path>
                <path d="M12 18H3"></path>
                <path d="m16 12 5 3-5 3v-6Z"></path>
              </svg>
              Collections
            </button>
          </div>

          <div className="w-full flex items-center justify-between pt-5">
            {/* Categories */}
            {!isSearching && (
              <div className="bg-[#1b1b1b] h-8 rounded-2xl flex items-center px-1 py-1 gap-1">
                <button
                  onClick={() => setCategories("All")}
                  className={`${
                    categories === "All"
                      ? "bg-[#474747] text-white"
                      : "text-[#C6C6C6]"
                  } h-full px-3 rounded-2xl cursor-pointer text-sm font-semibold`}
                >
                  All
                </button>

                <button
                  onClick={() => setCategories("skip")}
                  className={`${
                    categories === "skip"
                      ? "bg-[#fe647e] text-black"
                      : "text-[#C6C6C6]"
                  } h-full px-3 rounded-2xl cursor-pointer text-sm font-semibold`}
                >
                  Skip
                </button>

                <button
                  onClick={() => setCategories("timepass")}
                  className={`${
                    categories === "timepass"
                      ? "bg-[#fcb700] text-black"
                      : "text-[#C6C6C6]"
                  } h-full px-3 rounded-2xl cursor-pointer text-sm font-semibold`}
                >
                  Timepass
                </button>

                <button
                  onClick={() => setCategories("goforit")}
                  className={`${
                    categories === "goforit"
                      ? "bg-[#00d391] text-black"
                      : "text-[#C6C6C6]"
                  } h-full px-3 rounded-2xl cursor-pointer text-sm font-semibold`}
                >
                  Go For It
                </button>

                <button
                  onClick={() => setCategories("perfection")}
                  className={`${
                    categories === "perfection"
                      ? "bg-[#b048ff] text-black"
                      : "text-[#C6C6C6]"
                  } h-full px-3 rounded-2xl cursor-pointer text-sm font-semibold`}
                >
                  Perfection
                </button>
              </div>
            )}

            {/* Search Box */}
            {isSearching && (
              <div className=" w-full mr-2 text-[#E2E2E2] border border-[#252833] rounded-xl bg-[#1b1b1b] flex justify-center items-center gap-3 px-2">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="w-full py-1 focus:outline-0"
                  placeholder="Search Reviews..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                />
              </div>
            )}

            {/* View Type */}
            <div className="h-8 rounded-2xl flex items-center mt-t">
              {!isSearching && (
                <button
                  onClick={() => setListView(true)}
                  className={`${
                    listView ? "bg-[#262626]" : "bg-[#1b1b1b]"
                  } p-3 rounded-l-md cursor-pointer`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-list w-4 h-4"
                  >
                    <path d="M3 12h.01"></path>
                    <path d="M3 18h.01"></path>
                    <path d="M3 6h.01"></path>
                    <path d="M8 12h13"></path>
                    <path d="M8 18h13"></path>
                    <path d="M8 6h13"></path>
                  </svg>
                </button>
              )}
              {!isSearching && (
                <button
                  onClick={() => setListView(false)}
                  className={`${
                    !listView ? "bg-[#262626]" : "bg-[#1b1b1b]"
                  } p-3 rounded-r-md cursor-pointer`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-layout-grid w-4 h-4"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                    <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                    <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                    <rect width="7" height="7" x="3" y="14" rx="1"></rect>
                  </svg>
                </button>
              )}
              <button
                onClick={() => {
                  setIsSearching(!isSearching);
                }}
                className={`bg-[#1b1b1b] px-3 py-2 rounded-full cursor-pointer ml-2`}
              >
                {!isSearching && <i className="bi bi-search"></i>}
                {isSearching && <i className="bi bi-x-lg"></i>}
              </button>
            </div>
          </div>

          {/* List */}
          <div
            className={`my-5 flex gap-1 ${
              listView ? "flex-col" : "grid grid-cols-4"
            }`}
          >
            {/* Movie Card */}
            {listView &&
              comments
                .filter((comment) => {
                  const mediaData = media[comment.post_id];
                  if (!mediaData) return false;

                  // Category filter
                  const categoryMatch =
                    categories === "All" || comment.category === categories;

                  if (!categoryMatch) return false;

                  // Search filter
                  if (!isSearching) return true;

                  return mediaData.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                })
                .map((comment: comments) => {
                  const mediaData = media[comment.post_id];
                  if (!mediaData) return null;

                  return (
                    <div
                      key={comment.id}
                      className="hover:bg-[#1f1f1f] flex rounded-md w-full gap-2 p-2"
                    >
                      <img
                        src={mediaData.image_url}
                        alt=""
                        className="rounded-sm w-30 h-auto"
                      />
                      <div className="flex flex-col pl-3 pt-3 w-full">
                        <div className="flex flex-row place-content-between">
                          <div className="flex flex-col w-full">
                            <h3
                              onClick={() => handleClick(mediaData)}
                              className="text-white hover:text-[#C6C6C6] cursor-pointer font-semibold text-lg truncate max-w-85"
                            >
                              {mediaData.title}
                            </h3>

                            <div className="flex gap-1 items-center">
                              <span className="text-[#C6C6C6] font-semibold text-sm">
                                {mediaData.type}
                              </span>
                              <span className="text-[#C6C6C6]">•</span>
                              <span className="text-[#C6C6C6] font-semibold text-sm">
                                {new Date(mediaData.release_date).getFullYear()}
                              </span>
                              <span className="text-[#C6C6C6]">•</span>
                              <span className="text-[#C6C6C6] font-semibold text-sm">
                                {new Date(
                                  comment.created_at,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="w-25 ml-auto text-end">
                            {comment.category === "skip" && (
                              <span className="w-auto px-2 py-1 rounded-full text-black text-sm bg-[#fe647e]">
                                Skip
                              </span>
                            )}
                            {comment.category === "timepass" && (
                              <span className="w-auto px-2 py-1 rounded-full text-black text-sm bg-[#fcb700]">
                                Timepass
                              </span>
                            )}
                            {comment.category === "goforit" && (
                              <span className="w-auto px-2 py-1 rounded-full text-black text-sm bg-[#00d391]">
                                Go for it
                              </span>
                            )}
                            {comment.category === "perfection" && (
                              <span className="w-auto px-2 py-1 rounded-full text-black text-sm bg-[#b048ff]">
                                Perfection
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-[#C6C6C6] mt-2">
                          <span>{comment.content}</span>
                        </div>
                        <div className="text-[#C6C6C6] mt-2 flex gap-4 text-xl place-content-between">
                          <div className="flex mt-2 place-content-between gap-4 text-xl">
                            {!liked ? (
                              <i
                                onClick={() => setLiked(!liked)}
                                className="bi bi-heart cursor-pointer"
                              ></i>
                            ) : (
                              <i
                                onClick={() => setLiked(!liked)}
                                className="bi bi-heart-fill cursor-pointer"
                              ></i>
                            )}
                            <i className="bi bi-chat-left cursor-pointer"></i>
                          </div>
                          <div
                            onClick={() => setShowOptions(!showOptions)}
                            className="relative flex mt-2 place-content-between gap-4 text-xl cursor-pointer justify-center items-center hover:bg-[#363636] px-2 py-1 rounded-full"
                          >
                            <i className="bi bi-three-dots"></i>
                            {showOptions && (
                              <div className="rounded-md py-2 text-sm mt-2 w-max absolute top-full right-0 bg-[#2A2A2A]">
                                <button className="w-full flex gap-2 items-center px-2 py-2 cursor-pointer hover:bg-white/5">
                                  <i className="bi bi-share"></i>
                                  Share - Story
                                </button>
                                <button className="w-full flex gap-2 items-center px-2 py-2 cursor-pointer hover:bg-white/5">
                                  <i className="bi bi-share"></i>
                                  Share - Classic
                                </button>
                                <button className="w-full flex gap-2 items-center px-2 py-2 cursor-pointer hover:bg-white/5">
                                  <i className="bi bi-flag"></i>
                                  Report
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

            {/* Movie Card */}
            {!listView &&
              comments
                .filter((comment) => {
                  const mediaData = media[comment.post_id];
                  if (!mediaData) return false;

                  // Category filter
                  const categoryMatch =
                    categories === "All" || comment.category === categories;

                  if (!categoryMatch) return false;

                  // Search filter
                  if (!isSearching) return true;

                  return mediaData.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                })
                .map((comment: comments) => {
                  const mediaData = media[comment.post_id];
                  if (!mediaData) return null;
                  const titleTooLong = mediaData.title.length > 20;
                  return (
                    <div
                      onClick={() => handleClick(mediaData)}
                      className="hover:bg-[#1f1f1f] flex flex-col rounded-md gap-2 p-2 cursor-pointer items-center group"
                    >
                      <img
                        src={mediaData.image_url}
                        alt=""
                        className="rounded-sm w-30 h-auto"
                      />
                      <div className="flex flex-col items-center w-full">
                        {/* Title container */}
                        <div className="relative w-28 overflow-hidden">
                          <h3
                            className={`text-[#E2E2E2] font-semibold text-sm whitespace-nowrap`}
                          >
                            {mediaData.title}
                          </h3>
                        </div>

                        {/* Type & Year */}
                        <div className="flex gap-1 items-center">
                          <span className="text-[#E2E2E2] font-semibold text-xs">
                            {mediaData.type}
                          </span>
                          <span className="text-[#E2E2E2]">•</span>
                          <span className="text-[#E2E2E2] font-semibold text-xs">
                            {new Date(mediaData.release_date).getFullYear()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

            {/* No Movie Card */}
            {comments.length <= 0 && (
              <div className="h-50 w-full bg-[#1b1b1b] rounded-xl items-center justify-center flex flex-col">
                <i className="text-3xl bi bi-pencil-square mb-5"></i>
                <span className="text-md">
                  You haven't posted any reviews yet
                </span>
                <span className="text-sm text-[#C6C6C6]">
                  Start sharing your opinions on movies and TV shows
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Intrested In */}
        <div className="w-[25%] h-full items-start justify-center flex flex-col gap-3 rounded-lg">
          <h2 className="text-white font-semibold text-xl mb-2">
            Intrested In
          </h2>

          {/* Movie Card */}
          {intrests.map((intrest) => (
            <div
              key={intrest.id}
              onClick={() => handleClick(intrest)}
              className="border border-[#252525] flex rounded-md w-full gap-2 p-2 hover:bg-[#171717] cursor-pointer"
            >
              <img
                src={intrest.image_url}
                alt=""
                className="rounded-sm w-10 h-auto"
              />
              <div className="w-full flex flex-col overflow-hidden">
                <h3 className="text-[#E2E2E2] font-semibold text-md truncate">
                  {intrest.title}
                </h3>
                <h3 className="text-[#C6C6C6] font-semibold text-[10px]">
                  {intrest.release_date
                    ? new Date(intrest.release_date).toLocaleDateString(
                        "en-US",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )
                    : "—"}
                </h3>
                <h3 className="text-[#C6C6C6] font-semibold text-[10px]">
                  {intrest.type.toUpperCase()}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
