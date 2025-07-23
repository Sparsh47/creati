"use client";

import React, {useState} from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/shared/SearchBar";
import { LuSearch } from "react-icons/lu";
import {useDesignResponse} from "@/context/DesignResponseContext";
import {Progress} from "@/components/ui/progress";

export default function Hero() {

    const {userPrompt, setUserPrompt} = useDesignResponse();
    const [loading, setLoading] = useState<boolean>(false);
    const [loaderValue, setLoaderValue] = useState<number>(0);

    const suggestions = [
        {
            id: "1",
            label:
                "Website for Netflix in a modern style with dynamic carousels, dark mode support, and smooth animations",
        },
        {
            id: "2",
            label:
                "A responsive website for Slack.com showcasing real-time messaging, channel organization, and third-party integrations",
        },
        {
            id: "3",
            label:
                "A sleek platform for VU TV featuring interactive program guides, live streaming previews, and subscription management",
        },
    ];

    return (
        <>
            {loading ? (
                <div className="w-full h-screen flex items-center justify-center">
                    <Progress value={loaderValue} className="w-full max-w-3xl" />
                </div>
            ): (
                <div className="relative w-full min-h-screen flex items-center justify-center flex-col gap-10 bg-white overflow-hidden">
                    <div
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{
                            backgroundImage: `
            radial-gradient(circle at 30% 20%, rgba(147,197,253,0.4) 0%, rgba(147,197,253,0) 40%),
            radial-gradient(circle at 80% 60%, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0) 35%)`,
                        }}
                    />

                    <div className="relative z-10 flex flex-col items-center gap-12 px-4 w-full max-w-5xl">
                        <h2 className="text-center font-jetbrains text-7xl font-semibold leading-tight">
          <span className="gradient-text bg-gradient-to-tl">
            Design{" "}
          </span>
                            <span
                                className="outlined-text"
                                style={{
                                    background: "none",
                                    WebkitTextStroke: "2.5px #3b82f6",
                                }}
                            >
            Scalable
          </span>
                            <br />
                            <span className="gradient-text bg-gradient-to-tl">
            System Architectures
            <br />
            with{" "}
          </span>
                            <span
                                className="outlined-text"
                                style={{
                                    background: "none",
                                    WebkitTextStroke: "2.5px #3b82f6",
                                }}
                            >
            AI
          </span>
                            .
                        </h2>

                        <div className="w-full flex flex-col items-center justify-center">
                            <SearchBar
                                placeholder="Generate architecture for my e-commerce platform"
                                search={userPrompt}
                                clearSearch={()=>setUserPrompt("")}
                                onSearch={(e) => setUserPrompt(e.target.value)}
                                setLoading={setLoading}
                                setLoaderValue={setLoaderValue}
                            />

                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: {},
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.1,
                                        },
                                    },
                                }}
                                className="flex flex-wrap items-center justify-center gap-4 mt-4"
                            >
                                {suggestions.map(({ id, label }) => (
                                    <motion.button
                                        key={id}
                                        onClick={() => setUserPrompt(label)}
                                        variants={{
                                            hidden: { opacity: 0, y: 12 },
                                            visible: { opacity: 1, y: 0 },
                                        }}
                                        whileHover={{
                                            scale: 1.02,
                                            boxShadow: "0 6px 16px rgba(59, 130, 246, 0.2)",
                                        }}
                                        whileTap={{
                                            scale: 0.98,
                                            boxShadow: "inset 0 2px 4px rgba(59, 130, 246, 0.2)",
                                        }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        className="w-fit max-w-[350px] flex items-center justify-start gap-3 px-5 py-2 rounded-2xl bg-white/20 backdrop-blur-md border border-blue-200/50 text-blue-500/90 text-sm font-medium cursor-pointer shadow-[0_2px_6px_rgba(59,130,246,0.15)]"
                                    >
                                        <LuSearch className="w-10 h-10 text-blue-500" />
                                        <span className="line-clamp-1">{label}</span>
                                    </motion.button>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
