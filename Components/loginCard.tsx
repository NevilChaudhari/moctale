"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginCard() {
  const router = useRouter();

  const [usernameLogin, setUsernameLogin] = useState(true);
  const [phoneLogin, setPhoneLogin] = useState(false);
  const [visible, setVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const allFilled =
    (usernameLogin ? username.trim() !== "" : phoneNo.trim() !== "") &&
    password.trim() !== "";

  const [error, setError] = useState("");

  const userData = {
    username: username,
    password: password,
    phone: phoneNo,
    isPhone: phoneLogin,
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    setError(data.error);

    alert("Login Successfull");
    router.push("/");
  };

  return (
    <div className="bg-white rounded-lg flex flex-col justify-center items-center w-[48%] h-auto p-5 md:max-w-90">
      <label className="text-black font-semibold text-2xl mb-3.5">Login</label>

      <div className="bg-gray-100 rounded-lg w-full p-1 flex mb-4">
        <button
          className={`cursor-pointer border-0 rounded-md flex-1 py-2 text-sm font-medium ${
            usernameLogin ? "bg-white text-black shadow-sm" : "text-gray-500"
          }`}
          onClick={() => {
            setUsernameLogin(true);
            setPhoneLogin(false);
          }}
        >
          Username
        </button>
        <button
          className={`cursor-pointer bg-none border-0 rounded-md flex-1 py-2 text-sm font-medium ${
            !usernameLogin ? "bg-white text-black shadow-sm" : "text-gray-500"
          }`}
          onClick={() => {
            setUsernameLogin(false);
            setPhoneLogin(true);
          }}
        >
          Phone
        </button>
      </div>

      {/* Username */}
      {usernameLogin && (
        <label className="text-black self-start text-sm mb-1 font-semibold">
          Username
        </label>
      )}
      {usernameLogin && (
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="mb-2.5 border border-gray-300 w-full px-2 rounded-md h-10 text-black placeholder:text-gray-400 focus:outline-0 focus:ring-1 focus:ring-black/10"
          placeholder="Enter Your Username"
        ></input>
      )}

      {/* Phone */}
      {phoneLogin && (
        <label className="text-black self-start text-sm mb-1 font-semibold">
          Phone Number
        </label>
      )}
      {phoneLogin && (
        <div className="mb-2.5 w-full flex items-center text-black">
          <div className="bg-gray-100 p-2 border-r-0 border-l border-t border-b rounded-l-md border-gray-300">
            +91
          </div>
          <input
            type="number"
            min={0}
            max={9}
            onChange={(e) => setPhoneNo(e.target.value)}
            value={phoneNo}
            className="no-spinner border border-gray-300 w-full px-2 rounded-r-md h-10 text-black placeholder:text-gray-400 focus:outline-0 focus:ring-1 focus:ring-black/10"
            placeholder="Enter Your 10-digit number"
          ></input>
        </div>
      )}

      {/* Password */}
      <label className="text-black self-start text-sm mb-1 font-semibold">
        Password
      </label>
      <div className="mb-2.5 w-full flex items-center border border-gray-300 rounded-md px-2 focus-within:ring-1 focus-within:ring-black/10">
        <input
          type={`${visible ? "text" : "password"}`}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
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

      {error && <p className="text-red-600 text-sm mt-2">{error.toString()}</p>}

      <button
        disabled={!allFilled}
        onClick={handleLogin}
        className={`w-full rounded-full py-2 mt-8 text-md font-semibold cursor-pointer hover:opacity-90 ${
          allFilled
            ? "bg-linear-to-r from-[#B048FF] to-[#8F44F0]"
            : "bg-gray-400"
        }`}
      >
        Login
      </button>
      <label className="underline text-gray-700 font-medium text-sm mt-3 cursor-pointer">
        Forgot Password?
      </label>
      <style jsx>{`
        /* Chrome, Safari, Edge, Opera */
        input.no-spinner::-webkit-outer-spin-button,
        input.no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        /* Firefox */
        input.no-spinner[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
