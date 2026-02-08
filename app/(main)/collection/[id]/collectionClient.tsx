'use client'
import { useEffect, useState } from "react";

interface Props {
    id: number;
    userId: any;
}

interface Collection {
    id: number;
    name: string;
    description: string;
    type: string;
    user_id: string;
}

interface UserCollection {
    user_id: number;
    media_id: number;
    collection_id: number;
}

interface Media {
    id: number;
    type: string;
    title: string;
    release_date: string;
    image_url: string;
}

export default function ({ id, userId }: Props) {
    const [searchColection, setSearchCollection] = useState('')
    const [selectedCollectionType, setSelectedCollectionType] = useState('all')
    const [selectedCollection, setSelectedCollection] = useState<number>(id)
    const [selectedMediaType, setSelectedMediaType] = useState('all')

    const [userCollection, setUserCollection] = useState<Collection[]>([]);
    const [userCollectionMedia, setUserCollectionMedia] = useState<UserCollection[]>([]);

    const activeCollection = userCollection.find(
        (c) => c.id === selectedCollection
    );


    const fetchCollection = async () => {
        const res = await fetch('/api/collection/fetch/', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId }),
        });

        const data = await res.json();

        setUserCollection(data.collection);
    }

    useEffect(() => {
        fetchCollection();
        fetchUserCollection();
    }, []);

    const fetchUserCollection = async () => {
        const res = await fetch('/api/collection/fetchCollection/', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, collection_id: selectedCollection }),
        });

        const data = await res.json();
        setUserCollectionMedia(data.collection);
    }

    const [media, setMedia] = useState<Record<number, Media>>({});

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                if (userCollectionMedia.length === 0) return;

                const uniqueIds = Array.from(
                    new Set(userCollectionMedia.map(c => c.media_id))
                );

                const res = await fetch("/api/getMultipleMedia", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ mediaIds: uniqueIds }),
                });

                if (!res.ok) {
                    console.error("Failed:", await res.text());
                    return;
                }

                const data = await res.json();
                if (!data.success) return;

                const mediaMap: Record<number, Media> = {};
                data.success.forEach((m: Media) => {
                    mediaMap[m.id] = m;
                });

                setMedia(mediaMap);
            } catch (err) {
                console.error("Failed to fetch media:", err);
            }
        };

        fetchMedia();
    }, [userCollectionMedia, selectedCollection]);

    return (
        <div className="px-30 w-full h-full flex">

            {/* Left Part */}
            <div className="w-[30%] flex flex-col gap-5 py-5 px-3 h-full border-r border-white/20">

                {/* Header */}
                <div className="flex items-center justify-center">
                    <span className="text-xl font-semibold">My Collections</span>
                    <button className="ml-auto bg-purple-500 w-10 h-10 rounded-xl"><i className="bi bi-plus-lg"></i></button>
                </div>

                {/* Search Box */}
                <div className="w-full mr-2 text-[#E2E2E2] rounded-full bg-[#2C2C2C] flex justify-center items-center gap-3 px-3">
                    <i className="bi bi-search"></i>
                    <input
                        type="text"
                        className="w-full py-1 focus:outline-0"
                        placeholder="Search Reviews..."
                        onChange={(e) => setSearchCollection(e.target.value)}
                        value={searchColection}
                    />
                </div>

                {/* Collection Type */}
                <div className="flex items-center justify-between gap-2">
                    <button onClick={() => setSelectedCollectionType('all')} className={`px-5 py-2 text-xs ${selectedCollectionType == 'all' ? 'bg-[#474747]' : 'bg-[#1B1B1B]'} cursor-pointer rounded-xl`}>All</button>
                    <button onClick={() => setSelectedCollectionType('public')} className={`px-5 py-2 w-full text-xs ${selectedCollectionType == 'public' ? 'bg-[#474747]' : 'bg-[#1B1B1B]'} cursor-pointer rounded-xl flex gap-2 items-center justify-center`}><i className="bi bi-globe2"></i>Public</button>
                    <button onClick={() => setSelectedCollectionType('private')} className={`px-5 py-2 w-full text-xs ${selectedCollectionType == 'private' ? 'bg-[#474747]' : 'bg-[#1B1B1B]'} cursor-pointer rounded-xl flex gap-2 items-center justify-center`}><i className="bi bi-lock"></i>Private</button>
                </div>

                {/* User's Collections */}
                <div className="flex flex-col gap-2">
                    {userCollection.map((c, i) => {
                        return (
                            <div key={i} onClick={() => setSelectedCollection(c.id)} className={`${selectedCollection == c.id ? "border bg-[#171717]" : "bg-transparent"} flex items-center px-4 cursor-pointer border-[#252833] hover:bg-[#171717] rounded-xl h-15`}>
                                <i className="bi bi-grip-vertical"></i>
                                <span className="ml-3">{c.name}</span>
                                <div className="flex ml-auto gap-2">
                                    {c.type == 'public' && (<div className="flex items-center justify-center rounded-full"><i className="bi bi-globe2"></i></div>)}
                                    {c.type == 'private' && (<div className="flex items-center justify-center rounded-full"><i className="bi bi-lock"></i></div>)}
                                    <div className="w-7 h-7 hover:bg-[#252833] cursor-pointer flex items-center justify-center rounded-full"><i className="bi bi-three-dots-vertical"></i></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Right Part */}
            <div className="w-[70%] h-full px-3 py-5">
                <div className="relative">
                    {/* Upload banner */}
                    <div className="absolute z-10 top-3 right-3 bg-black/70 cursor-pointer h-10 w-10 rounded-full flex items-center justify-center"><i className="bi bi-image"></i></div>

                    {/* gradient Overlay */}
                    <div className="absolute h-full w-full bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_100%)]"></div>

                    {/* Banner */}
                    <div className="w-full h-100 rounded-xl overflow-hidden">
                        <img src="../defaultCollectionBanner.svg" alt="" className="w-full h-full object-cover" />
                    </div>

                    {/* Add Content Button */}
                    <button className="absolute flex gap-2 bottom-0 right-0 mb-10 mr-10 px-2 py-2 rounded bg-[linear-gradient(90deg,rgba(147,51,234,1)_0%,rgba(79,70,229,1)_100%)] cursor-pointer"><i className="bi bi-plus-lg"></i>Add Content</button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{activeCollection?.name}</span>
                    <div className="flex text-xs bg-gray-100/10 px-2 py-1 text-gray-300 border border-gray-600/30 rounded-full items-center justify-center gap-2"><i className="bi bi-globe2"></i>Public</div>
                </div>
                <div className="bg-[#1F1F1F] rounded-lg w-60 p-1 flex mt-4">
                    <button
                        className={`items-center justify-center cursor-pointer border-0 rounded-md flex-1 py-2 text-sm font-medium ${selectedMediaType == 'all' ? "bg-[#474747] text-white shadow-sm" : "text-gray-500"}`}
                        onClick={() => { setSelectedMediaType('all'); }}
                    >
                        All
                    </button>
                    <button
                        className={`items-center justify-center cursor-pointer bg-none border-0 rounded-md flex-1 py-2 text-sm font-medium ${selectedMediaType == 'movies' ? "bg-[#474747] text-white shadow-sm" : "text-gray-400"}`}
                        onClick={() => { setSelectedMediaType('movies'); }}
                    >
                        Movies
                    </button>
                    <button
                        className={`items-center justify-center cursor-pointer bg-none border-0 rounded-md flex-1 py-2 text-sm font-medium ${selectedMediaType == 'series' ? "bg-[#474747] text-white shadow-sm" : "text-gray-400"}`}
                        onClick={() => { setSelectedMediaType('series'); }}
                    >
                        Series
                    </button>
                </div>

                <div className="grid grid-cols-5 mt-10">
                    {userCollectionMedia
                        .filter((UC) => !!media[UC.media_id])
                        .map((UC) => {
                            const mediaData = media[UC.media_id];
                            return (
                                <div
                                    key={UC.media_id}
                                    className="flex flex-col items-center hover:bg-[#171717] mb-5 p-2 rounded-xl cursor-pointer"
                                >
                                    <img
                                        className="rounded-xl w-40 h-60 bg-cover object-cover"
                                        src={mediaData.image_url ?? "../L5.jpg"}
                                        alt={mediaData.title}
                                    />

                                    <span className="mt-2 w-full opacity-80 text-left">
                                        {mediaData.title}
                                    </span>

                                    <div className="flex w-full items-start gap-1 text-xs opacity-70">
                                        <span>{mediaData.type}</span>
                                        <span>•</span>
                                        <span>{new Date(mediaData.release_date).getFullYear()}</span>
                                    </div>
                                </div>
                            );
                        })}
                </div>

            </div>
        </div>
    )
}