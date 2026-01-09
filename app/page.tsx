"use client";

import LoginCard from "@/Components/loginCard";
import SignupCard from "@/Components/signupCard";
import PostersScroller from "@/Components/postersScroller";
import Image from 'next/image'
import { useState } from "react";

export default function Page() {

    const [login, setlogin] = useState(true);

    return (
        <div className="flex h-screen text-white bg-black overflow-hidden">
            <div className="flex h-screen text-white bg-black overflow-hidden w-full">
                <div className="flex-1 h-full lg:flex hidden">
                    <PostersScroller />
                </div>

                <div className="flex-1 flex flex-col items-center overflow-y-auto min-h-0 pt-10">

                    <Image
                        src="/moctale.png"
                        alt="logo"
                        width={150}
                        height={150}
                        className="w-60 h-auto mb-7.5"
                        priority
                    />

                    {login && (<LoginCard />)}
                    {!login && (<SignupCard />)}

                    <label className="mt-3.5 text-2x1 font-medium">
                        Don&apos;t have an account?{' '}
                        <label className="hover:underline font-bold cursor-pointer" onClick={() => { setlogin(!login) }}>{login ? "Sign Up" : "Log In"}</label>
                    </label>
                </div>
            </div>
        </div>
    )
}
