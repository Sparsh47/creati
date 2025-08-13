import Link from "next/link";
import React from "react";

export default function CTA() {
    return (
        <section className="w-full py-24 flex items-center justify-center">
            <div className="w-full max-w-5xl rounded-2xl py-16 bg-white backdrop-blur-md border-2 border-blue-200/80 shadow-xl shadow-blue-500/30 overflow-hidden">
                <div className="w-full flex flex-col items-center justify-center gap-6 z-[100] relative">
                    <h2
                        className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-tl from-blue-800 via-blue-600 to-blue-400 relative z-20 p-2"
                        style={{
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                            WebkitTextStrokeWidth: "0.5px",
                            WebkitTextStrokeColor: "rgba(255,255,255,0.2)",
                            strokeWidth: "2px",
                        }}
                    >
                        Elevate Your Experience
                    </h2>


                    <p className="w-full max-w-lg text-center text-blue-600 font-medium text-lg">
                        Discover the best features tailored to your needs with our AI-powered system design tool. Get started now!
                    </p>

                    <Link href={{
                        pathname: "/signin",
                        query: "type=signin"
                    }} className="py-3 px-6 text-lg bg-gradient-to-tl from-blue-800 via-blue-600 to-blue-400 text-white rounded-xl shadow-xl shadow-blue-500/50 hover:from-blue-400 hover:to-blue-800 hover:bg-gradient-to-b duration-200 ease-in-out transition-all">
                        Get Started
                    </Link>
                </div>

                <Ripple />
            </div>
        </section>
    )
}

function Ripple() {
    return (
        <div className="relative left-1 -bottom-[200px] rotate-180 opacity-85">
            <div className="w-[1250px] h-[1250px] rounded-full shadow-xl shadow-blue-500/30 bg-white absolute z-10 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"></div>
            <div className="w-[1100px] h-[1100px] rounded-full shadow-xl shadow-blue-500/30 bg-blue-50 absolute z-10 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"></div>
            <div className="w-[950px] h-[950px] rounded-full shadow-xl shadow-blue-500/30 bg-blue-100 absolute z-10 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"></div>
            <div className="w-[800px] h-[800px] rounded-full shadow-xl shadow-blue-500/30 bg-blue-200 absolute z-10 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"></div>
            <div className="w-[650px] h-[650px] rounded-full shadow-xl shadow-blue-500/30 bg-blue-300 absolute z-20 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"></div>
            <div className="w-[500px] h-[500px] rounded-full shadow-xl shadow-blue-500/30 bg-blue-400 absolute z-30 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"></div>
            <div className="w-[350px] h-[350px] rounded-full shadow-xl shadow-blue-500/30 bg-blue-500 absolute z-40 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"></div>
            <div className="w-[200px] h-[200px] rounded-full shadow-xl shadow-blue-500/30 bg-blue-600 absolute z-50 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"></div>
        </div>
    )
}