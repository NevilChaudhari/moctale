"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupCard() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const userData = {
      first_name: firstName,
      last_name: lastName,
      username,
      password,
      phone: phoneNo,
    };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Signup failed");
      return;
    }

    alert("Signup successful");
    router.push("/");
  };

  const [visible, setVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const allFilled =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    username.trim() !== "" &&
    phoneNo.trim() !== "" &&
    password.trim() !== "";

  return (
    <div className="bg-white rounded-lg flex flex-col justify-center items-center w-full md:w-[48%] h-auto p-5 md:max-w-90">
      <label className="text-black font-semibold text-2xl mb-3.5">
        Sign Up
      </label>

      <div className="flex gap-3">
        {/* First Name */}
        <div className="flex flex-col">
          <label className="text-black self-start text-sm mb-1 font-semibold">
            First Name
          </label>
          <input
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            value={firstName}
            type="text"
            className="mb-2.5 border border-gray-300 w-full px-2 rounded-md h-10 text-black placeholder:text-gray-400 focus:outline-0 focus:ring-1 focus:ring-black/10"
            placeholder="First Name"
          ></input>
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label className="text-black self-start text-sm mb-1 font-semibold">
            Last Name
          </label>
          <input
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            value={lastName}
            type="text"
            className="mb-2.5 border border-gray-300 w-full px-2 rounded-md h-10 text-black placeholder:text-gray-400 focus:outline-0 focus:ring-1 focus:ring-black/10"
            placeholder="Last Name"
          ></input>
        </div>
      </div>

      {/* Username */}
      <label className="text-black self-start text-sm mb-1 font-semibold">
        Username
      </label>
      <input
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        value={username}
        type="text"
        className="mb-2.5 border border-gray-300 w-full px-2 rounded-md h-10 text-black placeholder:text-gray-400 focus:outline-0 focus:ring-1 focus:ring-black/10"
        placeholder="Choose a username"
      ></input>

      {/* Password */}
      <label className="text-black self-start text-sm mb-1 font-semibold">
        Password
      </label>
      <div className="mb-2.5 w-full flex items-center border border-gray-300 rounded-md px-2 focus-within:ring-1 focus-within:ring-black/10">
        <input
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          type={`${visible ? "text" : "password"}`}
          className="border-0 w-full px-2 rounded-md h-10 text-black placeholder:text-gray-400 focus:outline-0"
          placeholder="Create a Password"
        ></input>
        {visible && (
          <i
            className="bi bi-eye text-gray-500 text-2xl cursor-pointer"
            onClick={() => {
              setVisible(!visible);
            }}
          ></i>
        )}
        {!visible && (
          <i
            className="bi bi-eye-slash text-gray-500 text-2xl cursor-pointer"
            onClick={() => {
              setVisible(!visible);
            }}
          ></i>
        )}
      </div>

      {/* Phone */}
      <label className="text-black self-start text-sm mb-1 font-semibold">
        Phone Number
      </label>
      <div className="mb-2.5 w-full flex items-center border border-gray-300 rounded-md px-2 focus-within:ring-1 focus-within:ring-black/10">
        <img src="./india.svg" alt="" className="object-contain w-6" />
        <div className="p-2 border-0 text-gray-500">+91</div>
        <input
          onChange={(e) => {
            setPhoneNo(e.target.value);
          }}
          value={phoneNo}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]{10}"
          className="no-spinner border-0 w-full px-2 rounded-r-md h-10 text-black placeholder:text-gray-400 focus:outline-0"
          placeholder="Enter Phone Number"
        ></input>
      </div>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      <button
        disabled={!allFilled || loading}
        className={`w-full rounded-full py-2 mt-8 text-md font-semibold cursor-pointer hover:opacity-90 ${
          allFilled && !loading
            ? "bg-linear-to-r from-[#B048FF] to-[#8F44F0]"
            : "bg-gray-400"
        }`}
        onClick={handleSubmit}
      >
        Sign Up
      </button>
    </div>
  );
}
