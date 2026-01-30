"use client";

import { ChartRadialStacked } from "@/Components/chart";
import DetailedReviews from "@/Components/DetailedReviews";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface Props {
  id: string;
  userId: any;
}
interface Dot {
  left: string;
  bottom: string;
  delay: string;
  size: string;
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

interface User {
  user_id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  profile_url?: string;
  intrestedIn?: string;
}

interface Users {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  bio: string | null;
  profile_url: string | null;
  intrestedIn: string | null;
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // "auto" for instant jump
  });
};

export default function ContentClient({ id, userId }: Props) {
  const [content, setContent] = useState<any>(null);
  const [tags, setTags] = useState<any>(null);
  const [actors, setActors] = useState<any>(null);
  const [crew, setCrew] = useState<any>(null);
  const [studios, setStudios] = useState<any>(null);
  const [platforms, setPlatforms] = useState<any>(null);
  const [current_status, setCurrent_status] = useState<any>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showReReplies, setShowReReplies] = useState(false);
  const [selfReReplies, setSelfReReplies] = useState(false);

  const handleIntrested = async () => {
    try {
      const res = await fetch("/api/markIntrested/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (data.success) {
        // Add to local state immediately
        setInterests((prev) => [...prev, String(id)]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    if (!id) return;

    try {
      const res = await fetch("/api/comments/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setComments(data.comments ?? []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState("timepass");
  const [review, setReview] = useState("");
  const [selectedUpdatedCategory, setSelectedUpdatedCategory] =
    useState("timepass");
  const [updatedReview, setUpdatedReview] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [count, setCount] = useState(0);
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto"; // reset
    textarea.style.height = `${textarea.scrollHeight}px`; // grow

    setCount(textarea.value.length);
  };

  const reviewData = {
    user_id: userId,
    post_id: id,
    parent_id: null,
    content: review,
    category: selectedCategory,
  };

  const handlePostReview = async () => {
    try {
      const res = await fetch("/api/comments/send/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      const data = await res.json();

      if (data.success) {
        setReview(""); // clear textarea
        setCount(0);
        await fetchComments();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const [editing, setEditing] = useState(false);
  const [commentId, setCommentId] = useState(0);

  const updatedReviewData = {
    id: commentId,
    content: updatedReview,
    category: selectedUpdatedCategory,
  };

  const handlePostEdit = async () => {
    try {
      const res = await fetch("/api/comments/edit/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedReviewData),
      });

      const data = await res.json();

      if (data.success) {
        setReview(""); // clear textarea
        setCount(0);
        await fetchComments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostDelete = async (commentId: number) => {
    try {
      const res = await fetch("/api/comments/delete/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: commentId }),
      });

      const data = await res.json();

      if (data.success) {
        setReview(""); // clear textarea
        setCount(0);
        await fetchComments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [comments, setComments] = useState<comments[]>([]);
  const hasUserCommented = comments.some(
    (comment) => comment.user_id.toString() === userId,
  );

  useEffect(() => {
    if (!id) return;

    fetchComments();

    const interval = setInterval(fetchComments, 5000); // every 5s

    return () => clearInterval(interval);
  }, [id]);

  const [user, setUser] = useState<User | null>(null);

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

  const [users, setUsers] = useState<Record<number, Users>>({});

  useEffect(() => {
    if (!comments.length) return;

    const fetchUsers = async () => {
      try {
        const uniqueIds = Array.from(new Set(comments.map((c) => c.user_id)));

        const res = await fetch("/api/getMultipleUser/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds: uniqueIds }),
        });

        const data = await res.json();

        if (!data.users) return;

        const usersMap: Record<number, Users> = {};

        data.users.forEach((user: Users) => {
          usersMap[user.user_id] = user;
        });

        setUsers(usersMap);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, [comments]);

  const [intrests, setInterests] = useState<string[]>([]);
  const isIntrested = Array.isArray(intrests) && intrests.includes(String(id));

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const res = await fetch("/api/getIntrestedIn");
        const data = await res.json();

        if (data.intrestedIn) {
          setInterests(data.intrestedIn.split(","));
        } else if (data.error) {
          console.error("Failed to fetch interests:", data.error);
        }
      } catch (err) {
        console.error("Error fetching interests:", err);
      }
    };

    fetchInterests();
  }, []);

  function getYouTubeVideoId(url: string | URL) {
    try {
      const parsed = new URL(url);

      // youtu.be/VIDEO_ID
      if (parsed.hostname === "youtu.be") {
        return parsed.pathname.slice(1);
      }

      // youtube.com/watch?v=VIDEO_ID
      if (parsed.searchParams.has("v")) {
        return parsed.searchParams.get("v");
      }

      // youtube.com/embed/VIDEO_ID
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1];
      }

      return null;
    } catch {
      return null;
    }
  }

  const videoId = getYouTubeVideoId(content?.trailer_url);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/content/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id }),
        });

        const data = await res.json();

        setContent(data.success[0]);
        setTags(
          data.success[0]?.tags.split(",").map((tag: string) => tag.trim()),
        );
        setActors(
          data.success[0]?.cast.split(",").map((actor: string) => actor.trim()),
        );
        setCrew(
          data.success[0]?.director
            .split(",")
            .map((crewMember: string) => crewMember.trim()),
        );
        setStudios(
          data.success[0]?.studios
            .split(",")
            .map((studio: string) => studio.trim()),
        );
        setPlatforms(
          data.success[0]?.streaming_platform
            .split(",")
            .map((studio: string) => studio.trim()),
        );
        setCurrent_status(
          data.success[0]?.current_status
            .split(",")
            .map((studio: string) => studio.trim()),
        );
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [id]);

  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    const count = Math.floor(Math.random() * 5) + 8; // 8-12 dots
    const segmentWidth = 100 / count; // divide button width into segments

    const generatedDots: Dot[] = Array.from({ length: count }).map((_, idx) => {
      // Random position inside segment
      const left = idx * segmentWidth + Math.random() * segmentWidth;

      return {
        left: `${left}%`,
        bottom: `${Math.random() * 20}px`, // random vertical start
        delay: `${Math.random() * 1.5}s`, // random delay
        size: `${Math.random() * 8 + 3}px`, // random size
      };
    });

    setDots(generatedDots);
  }, []);

  const [modal1Open, setModal1Open] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  useEffect(() => {
    if (modal2Open || modal1Open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modal2Open, modal1Open]);

  useEffect(() => {
    if (showReReplies) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showReReplies]);

  const openReview = () => {
    setShowReReplies(!showReReplies);
  }

  const visitProfile = async ({ userId }: { userId: string }) => {
    router.push(`/user/${userId}/`);
  };
  const router = useRouter();

  return (
    <div className="relative text-white bg-black">
      {modal2Open && (
        <div className="z-11 absolute w-full h-[85vh] bg-black/80 object-contain flex justify-center items-center">
          <i
            onClick={() => {
              setModal2Open(false);
              scrollToTop();
            }}
            className="absolute top-2 right-2 text-3xl cursor-pointer bi bi-x-lg"
          ></i>
          <div className="h-[85%] md:h-[99%] w-auto rounded-2xl overflow-hidden">
            <img
              src={content?.image_url}
              alt=""
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}

      {modal1Open && (
        <div className="z-11 absolute w-full h-[90vh] bg-black/50 object-contain flex justify-center items-center">
          <i
            onClick={() => {
              setModal1Open(false);
              scrollToTop();
            }}
            className="absolute top-5 right-5 text-3xl cursor-pointer bi bi-x-lg"
          ></i>
          <div className="w-[90%] h-[40%] rounded-2xl overflow-hidden md:w-[60%] md:h-[80%]">
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}

      {/* BG-Poster */}
      <div className="h-full w-full">

        {/* Background Image/Video */}
        <div className="relative w-full h-110 md:h-auto md:mb-10">
          <div className="relative">
            {/* Play Button */}
            <div
              onClick={() => {
                setModal1Open(true);
                scrollToTop();
              }}
              className="absolute top-1/3 left-1/2 w-16 h-16 bg-black/70 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-black/90 z-10"
            >
              {/* Play triangle as SVG */}
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5v14l11-7z" />
              </svg>

            </div>
            <img
              src={
                content?.trailer_url && videoId
                  ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                  : content?.image_url
              }
              alt="poster"
              className="object-contain md:object-cover w-full h-full md:h-[80vh] object-top opacity-80"
            />
            <div className="absolute w-full h-auto inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,1)_10%,rgba(237,221,83,0)_70%)]"></div>
          </div>

          {/* Main Poster and Data*/}
          <div className="absolute bottom-0 w-full flex md:flex-row flex-col h-auto px-4 md:px-30">
            <div className="flex">
              {/* Main Poster */}
              <div
                onClick={() => {
                  setModal2Open(true);
                  scrollToTop();
                }}
                className="w-[30%] h-40 md:h-auto md:w-auto overflow-hidden rounded-md group">
                <img
                  src={content?.image_url}
                  alt="poster"
                  className="object-cover md:h-70 md:w-50 h-full w-full group-hover:scale-110 cursor-pointer transition-transform duration-200"
                />
              </div>

              {/* Data */}
              <div className="flex flex-col ml-5 md:ml-10 justify-end w-[70%]">
                <div className="flex text-[#ABABAB] text-xs md:text-sm">
                  <span>{content?.type}</span>
                  <span>&nbsp;•&nbsp;</span>
                  <span>
                    {content?.release_date
                      ? new Date(content.release_date).getFullYear()
                      : "—"}
                  </span>
                </div>
                <span className="text-md md:text-3xl font-semibold">{content?.title}</span>
                <div className="flex flex-col md:flex-row text-[#ABABAB] text-xs md:text-sm mt-5 md:gap-10 gap-3">
                  <div className="flex gap-3">
                    <div className="flex flex-col overflow-hidden max-w-30">
                      <span>Directed By</span>
                      <button className="text-white font-bold truncate">
                        {content?.director}
                      </button>
                    </div>

                    <div className="flex flex-col">
                      <span>Country</span>
                      <button className="text-white font-bold">
                        {content?.country}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-start">
                    <span>language</span>
                    <button className="text-white font-bold">
                      {content?.languages}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="justify-end md:ml-auto flex pt-5 flex-col gap-3">
              {/* mark as intrested */}
              {current_status == "upcoming" && (
                <button
                  onClick={handleIntrested}
                  className="overflow-hidden relative rounded-full bg-linear-to-r from-[#B3261E] to-[#FF6233] py-2 px-23 font-semibold text-sm hover:opacity-90 cursor-pointer"
                >
                  <i
                    className={`bi ${!isIntrested ? "bi-fire" : "bi-check-lg"} mr-2`}
                  ></i>
                  {!isIntrested ? "Mark As Intrested" : "Intrested"}
                  <div className="absolute inset-0 pointer-events-none">
                    {dots.map((dot, idx) => (
                      <i
                        key={idx}
                        className="bi bi-dot absolute animate-slideTop"
                        style={{
                          left: dot.left,
                          bottom: dot.bottom,
                          width: dot.size,
                          height: dot.size,
                          animationDelay: dot.delay,
                        }}
                      />
                    ))}
                  </div>
                </button>
              )}

              {/* mark as watched */}
              {current_status == "released" && (
                <button className="overflow-hidden relative rounded-full bg-purple-600 py-2 px-23 font-semibold text-sm hover:opacity-90 cursor-pointer">
                  <i className="bi bi-eye mr-2"></i>
                  Mark As Watched
                  <div className="absolute inset-0 pointer-events-none"></div>
                </button>
              )}

              {/* Watched */}
              {current_status == "watched" && (
                <button className="overflow-hidden relative rounded-full bg-[#00b83d] py-2 px-23 font-semibold text-sm hover:opacity-90 cursor-pointer">
                  <i className="fa-solid fa-check mr-2"></i>
                  Watched
                  <div className="absolute inset-0 pointer-events-none"></div>
                </button>
              )}
              <button className="rounded-full bg-[#474747] md:bg-white/10 w-full py-2 px-23 font-semibold text-sm hover:bg-white/20 cursor-pointer">
                <i className="bi bi-bookmark mr-3"></i>
                Add to collection
              </button>
            </div>
          </div>
        </div>



        {/* Details */}
        <div className="flex gap-5">
          <div className="ml-3 mr-3 md:mr-0 md:ml-30 my-10 w-full md:w-[75%]">
            {/* Overview */}
            <div className="flex flex-col gap-5 border-b border-[#333333] pb-10">
              <span className="text-[#E2E2E2] text-xl md:text-2xl font-medium">
                Overview
              </span>
              <span className="text-[#B3B3B3] text-sm md:text-md font-medium">
                {content?.description}
              </span>
              <div className="flex gap-3">
                {tags &&
                  tags.map((tag: string, index: number) => (
                    <div
                      key={index}
                      className="bg-[#171717] hover:bg-[#1F1F1F] px-3 py-2 md:rounded-xl rounded-md font-semibold md:text-sm text-xs"
                    >
                      {tag}
                    </div>
                  ))}
              </div>
            </div>

            {/* Cast */}
            <div className="flex flex-col py-15 border-b border-[#333333]">
              <div>
                <span className="text-[#E2E2E2] text-xl md:text-2xl font-medium">
                  Cast
                </span>
                <div className="flex mt-5 gap-5 overflow-x-auto">
                  {/* Actor Profile */}
                  {actors &&
                    actors.map((actor: string, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="rounded-full overflow-hidden w-25 h-25 md:w-30 md:h-30">
                          <img
                            src="https://i.ibb.co/7tKbDGFX/default-profile.jpg"
                            alt="Actor Image"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs md:text-base text-white">{actor}</span>
                          <span className="text-[#ABABAB] text-xs">actor</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Crew */}
            <div className="flex flex-col py-15 border-b border-[#333333]">
              <div>
                <span className="text-[#E2E2E2] text-xl md:text-2xl font-medium">
                  Crew
                </span>
                <div className="flex mt-5 gap-5 overflow-x-auto">
                  {/* Crew Profile */}
                  {crew &&
                    crew.map((crewMember: string, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="rounded-full overflow-hidden w-25 h-25 md:w-30 md:h-30">
                          <img
                            src="https://i.ibb.co/7tKbDGFX/default-profile.jpg"
                            alt="Actor Image"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs md:text-base text-white">{crewMember}</span>
                          <span className="text-[#ABABAB] text-xs"></span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Production House */}
            <div className="flex flex-col py-15 border-b border-[#333333]">
              <div>
                <span className="text-[#E2E2E2] text-xl md:text-2xl font-medium">
                  Production House
                </span>
                <div className="flex mt-5 gap-5">
                  {/* Card */}
                  {studios &&
                    studios.map((studio: string, index: number) => (
                      <div
                        key={index}
                        className="border text-sm md:text-base border-[#252833] px-3 py-2 rounded-md hover:bg-[#252525] cursor-pointer"
                      >
                        {studio}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="flex flex-col py-15">
              <div>
                <span className="text-[#E2E2E2] text-xl md:text-2xl font-medium">
                  Reviews
                </span>
                <div className="flex mt-5 gap-5">
                  <div className="flex flex-col gap-5 w-full">
                    {/* Send Review */}
                    {!hasUserCommented && (
                      <div className="flex flex-col bg-[#151515] items-center px-3 md:px-4 py-3 w-full h-full rounded-lg border-b border-[#333333]">
                        {/* Header */}
                        <div className="flex flex-col items-center md:flex-row gap-5 md:gap-0 w-full">
                          <div className="flex items-center justify-start w-full">
                            {/* Profile Image */}
                            <div className="rounded-full flex justify-center items-center md:w-15 md:h-15 w-12 h-12 overflow-hidden">
                              <img
                                src={user?.profile_url}
                                alt=""
                                className="object-contain"
                              />
                            </div>

                            {/* Username */}
                            <div className="ml-3">
                              <span className="text-md">@</span>
                              <span className="text-md">{user?.username}</span>
                            </div>
                          </div>

                          {/* Categories */}
                          <div className="md:ml-auto bg-[#1F1F1F] border-[#474747] border md:h-12 h-10 rounded-full flex items-center px-1 py-1 gap-1">
                            <button
                              onClick={() => setSelectedCategory("skip")}
                              className={`truncate ${selectedCategory == "skip" ? "bg-[#fe647e] text-black" : "bg-none text-white"} h-full px-4 py-0 md:px-6 rounded-full cursor-pointer text-xs md:text-sm `}
                            >
                              Skip
                            </button>
                            <button
                              onClick={() => setSelectedCategory("timepass")}
                              className={`truncate ${selectedCategory == "timepass" ? "bg-[#fcb700] text-black" : "bg-none text-white"} h-full px-4 py-0 md:px-6 rounded-full cursor-pointer text-xs md:text-sm `}
                            >
                              Timepass
                            </button>
                            <button
                              onClick={() => setSelectedCategory("goforit")}
                              className={`truncate ${selectedCategory == "goforit" ? "bg-[#00d391] text-black" : "bg-none text-white"} h-full px-4 py-0 md:px-6 rounded-full cursor-pointer text-xs md:text-sm `}
                            >
                              Go for it
                            </button>
                            <button
                              onClick={() => setSelectedCategory("perfection")}
                              className={`truncate ${selectedCategory == "perfection" ? "bg-[#b048ff] text-black" : "bg-none text-white"} h-full px-4 py-0 md:px-6 rounded-full cursor-pointer text-xs md:text-sm `}
                            >
                              Perfection
                            </button>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="flex items-end w-full mt-5 text-[#B3B3B3] border-b whitespace-pre-wrap wrap-break-word">
                          <textarea
                            ref={textareaRef}
                            onInput={handleInput}
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            maxLength={1000}
                            rows={3}
                            placeholder="Write your review here..."
                            className="w-full text-sm md:text-base resize-none overflow-hidden focus:outline-0 text-white"
                          />
                          <div className="mt-1 text-bottom text-xs text-gray-500 w-15">
                            {count} / 1000
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-4 w-full mt-5 text-xl">
                          <button
                            onClick={handlePostReview}
                            className="ml-auto bg-white hover:bg-white/90 text-black text-sm cursor-pointer px-4 py-2 rounded-full"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}

                    {editing && (
                      <div className="flex flex-col bg-[#151515] items-center px-4 py-3 w-full h-full rounded-lg border-b border-[#333333]">
                        {/* Header */}
                        <div className="flex items-center w-full">
                          {/* Profile Image */}
                          <div className="rounded-full flex justify-center items-center w-15 h-15 overflow-hidden">
                            <img
                              src={user?.profile_url}
                              alt=""
                              className="object-contain"
                            />
                          </div>

                          {/* Username */}
                          <div className="ml-3">
                            <span className="text-md">@</span>
                            <span className="text-md">{user?.username}</span>
                          </div>

                          {/* Categories */}
                          <div className="ml-auto bg-[#1F1F1F] border-[#474747] border h-12 rounded-full flex items-center px-1 py-1 gap-1">
                            <button
                              onClick={() => setSelectedUpdatedCategory("skip")}
                              className={`${selectedUpdatedCategory == "skip" ? "bg-[#fe647e] text-black" : "bg-none text-white"} h-full px-6 rounded-full cursor-pointer text-sm `}
                            >
                              Skip
                            </button>
                            <button
                              onClick={() =>
                                setSelectedUpdatedCategory("timepass")
                              }
                              className={`${selectedUpdatedCategory == "timepass" ? "bg-[#fcb700] text-black" : "bg-none text-white"} h-full px-6 rounded-full cursor-pointer text-sm `}
                            >
                              Timepass
                            </button>
                            <button
                              onClick={() =>
                                setSelectedUpdatedCategory("goforit")
                              }
                              className={`${selectedUpdatedCategory == "goforit" ? "bg-[#00d391] text-black" : "bg-none text-white"} h-full px-6 rounded-full cursor-pointer text-sm `}
                            >
                              Go for it
                            </button>
                            <button
                              onClick={() =>
                                setSelectedUpdatedCategory("perfection")
                              }
                              className={`${selectedUpdatedCategory == "perfection" ? "bg-[#b048ff] text-black" : "bg-none text-white"} h-full px-6 rounded-full cursor-pointer text-sm `}
                            >
                              Perfection
                            </button>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="flex items-end w-full mt-5 text-[#B3B3B3] border-b whitespace-pre-wrap wrap-break-word">
                          <textarea
                            ref={textareaRef}
                            onInput={handleInput}
                            value={updatedReview}
                            onChange={(e) => setUpdatedReview(e.target.value)}
                            maxLength={1000}
                            rows={3}
                            placeholder="Write your review here..."
                            className="w-full resize-none overflow-hidden focus:outline-0 text-white"
                          />
                          <div className="mt-1 text-bottom text-xs text-gray-500 w-15">
                            {count} / 1000
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-4 w-full mt-5 text-xl">
                          <div className="flex gap-2 ml-auto">
                            <button
                              onClick={() => setEditing(false)}
                              className="ml-aut text-white hover:bg-[#2a2a2a] text-sm cursor-pointer px-4 py-2 rounded-full"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                handlePostEdit();
                                setEditing(false);
                              }}
                              className="ml-auto bg-white hover:bg-white/90 text-black text-sm cursor-pointer px-4 py-2 rounded-full"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Card Template */}
                    {comments.map((comment) => {
                      const commentUser = users[comment.user_id];
                      return (
                        !editing &&
                        comment.user_id == userId && (
                          <div
                            key={comment.id}
                            className={`${comment.user_id == userId ? "bg-[#151515]" : ""} flex flex-col items-center px-4 py-3 w-full h-full rounded-lg border-b border-[#333333]`}
                          >
                            {selfReReplies && (
                              <div className="fixed z-10 items-center flex justify-center inset-0 bg-black/10 backdrop-blur-sm">
                                <DetailedReviews comment={comment} user={commentUser} userId={userId} />
                                <div className="absolute top-4 right-4 cursor-pointer text-white text-xl" onClick={() => setSelfReReplies(false)}><i className="bi bi-x-lg"></i></div>
                              </div>
                            )}
                            {/* Header */}
                            <div className="flex items-center w-full">
                              {/* Profile Image */}
                              <div className="cursor-pointer rounded-full flex justify-center items-center w-15 h-15 overflow-hidden">
                                <img
                                  src={
                                    commentUser?.profile_url ??
                                    "https://i.ibb.co/7tKbDGFX/default-profile.jpg"
                                  }
                                  alt=""
                                  className="object-contain"
                                />
                              </div>

                              {/* Username and Date */}
                              <div className="flex flex-col ml-3">
                                <span className="text-md">
                                  {commentUser?.username ?? "User"}
                                </span>
                                <span className="text-[#B3B3B3] text-sm">
                                  {new Date(
                                    comment.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              {/* Review Category */}
                              <div className="flex flex-col ml-auto">
                                {comment.category == "skip" && (
                                  <div className="text-black text-xs font-bold rounded-full px-2 py-1 bg-[#fe647e]">
                                    Skip
                                  </div>
                                )}
                                {comment.category == "timepass" && (
                                  <div className="text-black text-xs font-bold rounded-full px-2 py-1 bg-[#fcb700]">
                                    Timepass
                                  </div>
                                )}
                                {comment.category == "goforit" && (
                                  <div className="text-black text-xs font-bold rounded-full px-2 py-1 bg-[#00d391]">
                                    Go for it
                                  </div>
                                )}
                                {comment.category == "perfection" && (
                                  <div className="text-black text-xs font-bold rounded-full px-2 py-1 bg-[#b048ff]">
                                    Perfection
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Body */}
                            <div className="flex items-center w-full mt-5 text-[#B3B3B3] whitespace-pre-wrap wrap-break-word">
                              <span>{comment.content}</span>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center gap-4 w-full mt-5 text-xl">
                              <div className="flex gap-2 cursor-pointer">
                                <i className="bi bi-heart"></i>
                                <span className=" hover:text-[#B3B3B3]">
                                  {comment.likes}
                                </span>
                              </div>
                              <div className="flex gap-2 cursor-pointer" onClick={() => setSelfReReplies(true)}>
                                <i className="bi bi-chat"></i>
                                <span className=" hover:text-[#B3B3B3]">
                                  {comment.replies}
                                </span>
                              </div>
                              <div
                                onClick={() => setShowOptions(!showOptions)}
                                className="relative hover:bg-[#212121] cursor-pointer rounded-full px-2 py-1 text-center ml-auto"
                              >
                                <i className="bi bi-three-dots"></i>
                                {showOptions && (
                                  <div className="rounded-md py-2 text-sm mt-2 w-max absolute top-full right-0 bg-[#2A2A2A]">
                                    <button
                                      onClick={() => {
                                        setEditing(true);
                                        setCommentId(comment.id);
                                        setUpdatedReview(comment.content);
                                        setSelectedUpdatedCategory(
                                          comment.category ?? "timepass",
                                        );
                                      }}
                                      className="w-30 flex gap-3 items-center px-2 py-2 cursor-pointer hover:bg-white/5"
                                    >
                                      <i className="bi bi-pencil-square"></i>
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => {
                                        handlePostDelete(comment.id);
                                      }}
                                      className="hover:bg-[#fe647e]/5 text-[#fe647e] w-30 flex gap-3 items-center px-2 py-2 cursor-pointer"
                                    >
                                      <i className="bi bi-trash text-sm"></i>
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      );
                    })}
                    {comments.map((comment) => {
                      const commentUser = users[comment.user_id];
                      return (
                        comment.user_id != userId && (
                          <div
                            key={comment.id}
                            className={`${comment.user_id == userId ? "bg-[#151515]" : ""} flex flex-col items-center px-4 py-3 w-full h-full rounded-lg border-b border-[#333333]`}
                          >
                            {showReReplies && (
                              <div className="fixed z-10 items-center flex justify-center inset-0 bg-black/10 backdrop-blur-sm">
                                <DetailedReviews comment={comment} user={commentUser} userId={userId} />
                                <div className="absolute top-4 right-4 cursor-pointer text-white text-xl" onClick={() => setShowReReplies(false)}><i className="bi bi-x-lg"></i></div>
                              </div>
                            )}
                            {/* Header */}
                            <div className="flex items-center w-full">
                              {/* Profile Image */}
                              <div
                                onClick={() => visitProfile({ userId: String(commentUser?.user_id) })}
                                className="relative cursor-pointer rounded-full flex justify-center items-center w-15 h-15 overflow-hidden">
                                <div className="hover:bg-black/40 w-full h-full absolute" />
                                <img
                                  src={
                                    commentUser?.profile_url ??
                                    "https://i.ibb.co/7tKbDGFX/default-profile.jpg"
                                  }
                                  alt=""
                                  className="object-contain"
                                />
                              </div>

                              {/* Username and Date */}
                              <div className="flex flex-col ml-3">
                                <span className="text-md">
                                  {commentUser?.username ?? "User"}
                                </span>
                                <span className="text-[#B3B3B3] text-sm">
                                  {new Date(
                                    comment.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              {/* Review Category */}
                              <div className="flex flex-col ml-auto">
                                {comment.category == "skip" && (
                                  <div className="text-black text-xs font-bold rounded-full px-2 py-1 bg-[#fe647e]">
                                    Skip
                                  </div>
                                )}
                                {comment.category == "timepass" && (
                                  <div className="text-black text-xs font-bold rounded-full px-2 py-1 bg-[#fcb700]">
                                    Timepass
                                  </div>
                                )}
                                {comment.category == "goforit" && (
                                  <div className="text-black text-xs font-bold rounded-full px-2 py-1 bg-[#00d391]">
                                    Go for it
                                  </div>
                                )}
                                {comment.category == "perfection" && (
                                  <div className="text-black text-xs font-bold rounded-full px-2 py-1 bg-[#b048ff]">
                                    Perfection
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Body */}
                            <div className="flex items-center w-full mt-5 text-[#B3B3B3] whitespace-pre-wrap wrap-break-word">
                              <span>{comment.content}</span>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center gap-4 w-full mt-5 text-xl">
                              <div className="flex gap-2 cursor-pointer">
                                <i className="bi bi-heart"></i>
                                <span className=" hover:text-[#B3B3B3]">
                                  {comment.likes}
                                </span>
                              </div>
                              <div
                                onClick={openReview}
                                className="flex gap-2 cursor-pointer">
                                <i className="bi bi-chat"></i>
                                <span className=" hover:text-[#B3B3B3]">
                                  {comment.replies}
                                </span>
                              </div>
                              <div className="hover:bg-[#212121] cursor-pointer rounded-full px-2 py-1 text-center ml-auto">
                                <i className="bi bi-three-dots"></i>
                              </div>
                            </div>
                          </div>
                        )
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block md:w-[25%] mr-30">
            <div className="bg-[#1b1b1b] border border-[#252833] rounded-xl">
              <ChartRadialStacked />
            </div>
            <div className="mt-5 p-5 bg-[#1b1b1b] border border-[#252833] rounded-xl">
              <span>Watch Online</span>
              <div className="flex mt-3 px-1 py-3 cursor-pointer hover:bg-[#474747] bg-[#1b1b1b] rounded-md">
                <div>{platforms}</div>
                <div className="ml-auto">
                  <i className="bi bi-arrow-up-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideTop {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-100px);
          }
        }
        .animate-slideTop {
          animation: slideTop 1.5s ease infinite;
        }
      `}</style>
    </div>
  );
}
