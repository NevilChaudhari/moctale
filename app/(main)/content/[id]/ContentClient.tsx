"use client";

import { ChartRadialStacked } from "@/Components/chart";
import { useState, useEffect } from "react";

interface Props {
  id: string;
}
interface Dot {
  left: string;
  bottom: string;
  delay: string;
  size: string;
}

export default function ContentClient({ id }: Props) {
  const [content, setContent] = useState<any>(null);
  const [tags, setTags] = useState<any>(null);
  const [actors, setActors] = useState<any>(null);
  const [crew, setCrew] = useState<any>(null);
  const [studios, setStudios] = useState<any>(null);
  const [current_status, setCurrent_status] = useState<any>(null);

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

  const [intrests, setInterests] = useState<string[]>([]);
  const isIntrested = Array.isArray(intrests) && intrests.includes(String(id));

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const res = await fetch("/api/getIntrestedIn");
        const data = await res.json();

        if (data.intrestedIn) {
          setInterests(data.intrestedIn.split(","));
          console.log(`Intrests: ${data.intrestedIn}`);
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

  return (
    <div className="relative text-white bg-black">
      {modal2Open && (
        <div className="z-11 absolute w-full h-[90vh] bg-black/50 object-contain flex justify-center items-center">
          <i
            onClick={() => setModal2Open(false)}
            className="absolute top-5 right-5 text-3xl cursor-pointer bi bi-x-lg"
          ></i>
          <div className="h-[99%] w-auto">
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
            onClick={() => setModal1Open(false)}
            className="absolute top-5 right-5 text-3xl cursor-pointer bi bi-x-lg"
          ></i>
          <div className="w-[60%] h-[80%]">
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
      <div className="w-full h-[90vh] relative">
        {(content?.trailer_url && videoId) || content?.image_url ? (
          <img
            src={
              content?.trailer_url && videoId
                ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                : content?.image_url
            }
            alt="poster"
            className="object-cover w-full h-full opacity-80"
          />
        ) : null}

        <div
          onClick={() => setModal1Open(true)}
          className="z-10 hover:bg-black/90 top-1/3 left-1/2 w-15 h-15 bg-black/70 rounded-full flex items-center justify-center shadow-lg absolute cursor-pointer"
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

        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,1)_10%,rgba(237,221,83,0)_70%)]"></div>

        <div className="w-full absolute bottom-0 px-30 flex mb-10">
          <div
            onClick={() => setModal2Open(true)}
            className="relative rounded-lg h-70 w-50 overflow-hidden cursor-pointer group"
          >
            <div className="z-1 absolute group-hover:bg-black/50 w-full h-full"></div>
            <img
              src={content?.image_url}
              alt="poster"
              className="object-cover group-hover:scale-110 transition-transform duration-200"
            />
          </div>

          <div className="flex flex-col ml-10 justify-end">
            <div className="flex text-[#ABABAB] text-sm">
              <span>{content?.type}</span>
              <span>&nbsp;•&nbsp;</span>
              <span>
                {content?.release_date
                  ? new Date(content.release_date).getFullYear()
                  : "—"}
              </span>
            </div>
            <span className="text-3xl font-semibold">{content?.title}</span>
            <div className="flex text-[#ABABAB] text-sm mt-5 gap-10">
              <div className="flex flex-col">
                <span>Directed By</span>
                <button className="text-white font-bold">
                  {content?.director}
                </button>
              </div>

              <div className="flex flex-col">
                <span>Country</span>
                <button className="text-white font-bold">
                  {content?.country}
                </button>
              </div>

              <div className="flex flex-col">
                <span>language</span>
                <button className="text-white font-bold">
                  {content?.languages}
                </button>
              </div>
            </div>
          </div>

          <div className="justify-end ml-auto flex flex-col gap-3">
            {/* mark as intrested */}
            {current_status == "upcoming" && (
              <button
                onClick={handleIntrested}
                className="overflow-hidden relative rounded-full bg-linear-to-r from-[#B3261E] to-[#FF6233] py-3 px-23 font-semibold text-sm hover:opacity-90 cursor-pointer"
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
            {current_status == "Released" && (
              <button className="overflow-hidden relative rounded-full bg-purple-600 py-3 px-23 font-semibold text-sm hover:opacity-90 cursor-pointer">
                <i className="bi bi-eye mr-2"></i>
                Mark As Watched
                <div className="absolute inset-0 pointer-events-none"></div>
              </button>
            )}

            {/* Watched */}
            {current_status == "watched" && (
              <button className="overflow-hidden relative rounded-full bg-[#00b83d] py-3 px-23 font-semibold text-sm hover:opacity-90 cursor-pointer">
                <i className="fa-solid fa-check mr-2"></i>
                Watched
                <div className="absolute inset-0 pointer-events-none"></div>
              </button>
            )}
            <button className="rounded-full bg-white/10 py-3 px-23 font-semibold text-sm hover:bg-white/20 cursor-pointer">
              <i className="bi bi-bookmark mr-3"></i>
              Add to collection
            </button>
          </div>
        </div>

        <div className="flex gap-5">
          <div className="ml-30 my-10 w-[75%]">
            {/* Overview */}
            <div className="flex flex-col gap-5 border-b border-[#333333] pb-10">
              <span className="text-[#E2E2E2] text-2xl font-medium">
                Overview
              </span>
              <span className="text-[#B3B3B3] text-md font-medium">
                {content?.description}
              </span>
              <div className="flex gap-3">
                {tags &&
                  tags.map((tag: string, index: number) => (
                    <div
                      key={index}
                      className="bg-[#171717] hover:bg-[#1F1F1F] px-3 py-2 rounded-xl font-semibold text-sm"
                    >
                      {tag}
                    </div>
                  ))}
              </div>
            </div>

            {/* Cast */}
            <div className="flex flex-col py-15 border-b border-[#333333]">
              <div>
                <span className="text-[#E2E2E2] text-2xl font-medium">
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
                        <div className="rounded-full overflow-hidden w-30 h-30">
                          <img
                            src="https://i.ibb.co/7tKbDGFX/default-profile.jpg"
                            alt="Actor Image"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white">{actor}</span>
                          <span className="text-[#ABABAB] text-xs"></span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Crew */}
            <div className="flex flex-col py-15 border-b border-[#333333]">
              <div>
                <span className="text-[#E2E2E2] text-2xl font-medium">
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
                        <div className="rounded-full overflow-hidden w-30 h-30">
                          <img
                            src="https://i.ibb.co/7tKbDGFX/default-profile.jpg"
                            alt="Actor Image"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white">{crewMember}</span>
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
                <span className="text-[#E2E2E2] text-2xl font-medium">
                  Production House
                </span>
                <div className="flex mt-5 gap-5">
                  {/* Card */}
                  {studios &&
                    studios.map((studio: string, index: number) => (
                      <div
                        key={index}
                        className="border border-[#252833] px-3 py-2 rounded-md hover:bg-[#252525] cursor-pointer"
                      >
                        {studio}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Discussions */}
            <div className="flex flex-col py-15 border-b border-[#333333]">
              <div>
                <span className="text-[#E2E2E2] text-2xl font-medium">
                  Discussions
                </span>
                <div className="flex mt-5 gap-5">
                  <div className="flex justify-center w-full">
                    <span className="text-white/20 text-3xl font-bold">
                      Still working on that
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[25%] mr-30">
            <div className="bg-[#1b1b1b] border border-[#252833] rounded-xl">
              <ChartRadialStacked />
            </div>
            <div className="mt-5 p-5 bg-[#1b1b1b] border border-[#252833] rounded-xl">
              <span>Watch Online</span>
              <div></div>
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
