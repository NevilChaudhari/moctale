"use client";

import { useState, useEffect } from "react";

type AlertProps = {
  type: "error" | "success";
  message: string;
};

export default function TempAlert({ type, message }: AlertProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      const removeTimer = setTimeout(() => setVisible(false), 200); // match animation duration
      return () => clearTimeout(removeTimer);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  // Dynamic colors based on type
  const colors = {
    error: {
      text: "text-red-500",
      border: "border-red-500",
      bg: "bg-[#2f0f0f]",
      icon: "fa-circle-xmark",
    },
    success: {
      text: "text-green-500",
      border: "border-green-500",
      bg: "bg-[#0f2f0f]",
      icon: "fa-circle-check",
    },
  };

  const color = colors[type];

  return (
    <>
      <div
        className={`absolute right-0 m-3 px-3 py-3 gap-3 flex justify-center items-center rounded-md border ${color.border} ${color.text} ${color.bg} w-max select-none ${
          exiting ? "scale-out" : "scale-in"
        }`}
      >
        <i className={`w-5 h-5 text-xl fa-solid ${color.icon}`}></i>
        <span className="text-sm font-medium">{message}</span>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          0% {
            transform: scale(0);
            transform-origin: 50% 0%;
          }
          100% {
            transform: scale(1);
            transform-origin: 50% 0%;
          }
        }

        @keyframes scaleOut {
          0% {
            transform: scale(1);
            transform-origin: 50% 0%;
          }
          100% {
            transform: scale(0);
            transform-origin: 50% 0%;
          }
        }

        .scale-in {
          animation: scaleIn 0.2s ease forwards;
        }

        .scale-out {
          animation: scaleOut 0.2s ease forwards;
        }
      `}</style>
    </>
  );
}
