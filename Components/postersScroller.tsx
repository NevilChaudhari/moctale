export default function postersScroller() {
    return (
        <div className="w-full h-full bg-black px-10">
          <div className="z-1 fixed bg-linear-to-t from-[#000000] to-[#00000000] w-[50%] h-80 bottom-0"></div>
            {/* LeftPosters */}
            <div className="flex flex-row">
                <div className="mx-3 animate-scroll-up">
                    <img src="./L1.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./L2.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./L3.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./L4.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./L5.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./L6.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./L7.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./L8.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./L9.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./L10.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./L11.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                </div>
                <div className="mx-3 animate-scroll-down">
                    <img src="./C1.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./C2.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./C3.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./C4.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./C5.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./C6.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./C7.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./C8.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./C9.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./C10.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./C11.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                </div>
                <div className="mx-3 animate-scroll-up">
                    <img src="./R1.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./R2.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./R3.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./R4.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./R5.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./R6.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./R7.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./R8.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./R9.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./R10.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                    <img src="./R11.jpg" alt="" className="w-50 h-auto rounded-lg my-9" />
                </div>
            </div>
            {/* Custom CSS animation */}
            <style jsx>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }

        .animate-scroll-up {
          animation: scroll-up 25s linear infinite;
        }

        .animate-scroll-down {
          animation: scroll-down 25s linear infinite;
        }
      `}</style>
        </div>
    )
}