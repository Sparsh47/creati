"use client";

import React from "react";
import {useDesignResponse} from "@/context/DesignResponseContext";
import GenerateDesignSearch from "@/components/sections/FlowPage/GenerateDesignSearch";
import {TypewriterEffectSmooth} from "@/components/ui/typewriter-effect";

export default function Hero() {

    const {userPrompt, setUserPrompt} = useDesignResponse();

    const words = [
        {
            text: "What",
            className: "text-blue-500",
        },
        {
            text: "will",
            className: "text-blue-500",
        },
        {
            text: "you",
            className: "text-blue-500",
        },
        {
            text: "generate",
            className: "text-blue-500",
        },
        {
            text: "next?",
            className: "text-blue-500",
        },
    ];

    return (<div
        className="relative w-full h-screen flex items-center justify-center flex-col gap-10 bg-white overflow-hidden">
        <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
                backgroundImage: `
            radial-gradient(circle at 30% 20%, rgba(147,197,253,0.4) 0%, rgba(147,197,253,0) 40%),
            radial-gradient(circle at 80% 60%, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0) 35%)`,
            }}
        />

        <div className="relative z-10 flex flex-col items-center gap-5 px-4 w-full max-w-5xl">
            <TypewriterEffectSmooth words={words} />

            <div className="w-full flex flex-col items-center justify-center">
                <GenerateDesignSearch
                    placeholder="Create a comprehensive system architecture for a modern web application that includes microservices with API gateway, scalable database with caching, containerized deployment, real-time messaging, authentication systems, load balancing, monitoring infrastructure, and CI/CD pipeline targeting high availability and horizontal scalability."
                    search={userPrompt}
                    clearSearch={() => setUserPrompt("")}
                    onSearch={(e) => setUserPrompt(e.target.value)}
                />
            </div>
        </div>
    </div>);
}