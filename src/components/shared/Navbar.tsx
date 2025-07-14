"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { HiOutlineSparkles } from "react-icons/hi2";
import ApiKeyInput from "@/components/shared/ApiKeyInput";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                !scrolled
                    ? "absolute top-5 left-0"
                    :
                    "fixed top-5 z-50",
                "w-full flex items-center justify-center p-2 transition-all duration-300 z-50"
            )}
        >
            <div className={cn("w-full max-w-5xl flex items-center justify-between p-2 rounded-2xl border border-transparent", scrolled && "bg-gray-50/80 border-gray-300 backdrop-blur-md")}>
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="creati.ai"
                        width={1000}
                        height={1000}
                        className="h-14 w-auto"
                    />
                    <h1 className="ml-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-tl from-blue-800 via-blue-600 to-blue-400">Creati.AI</h1>
                </Link>
            </div>
            <div className="flex items-center justify-center gap-5 font-medium">
                <Link href="" className="text-lg relative group">
                    <p className="group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-tr from-blue-800 via-blue-600 to-blue-400 ease-in-out transition-all duration-200">Login</p>
                    <div className="absolute w-0 h-[2px] bg-blue-500 group-hover:w-full ease-in-out transition-all duration-200"></div>
                </Link>
                <Link href="" className="flex items-center justify-center gap-2 bg-blue-500 rounded-xl text-white py-3 px-6 shadow-xl hover:shadow-lg shadow-blue-500/30 ease-in-out transition-all duration-200">
                    <p className="text-lg">Try Now</p>
                    <HiOutlineSparkles className="w-6 h-6" />
                </Link>
            </div>
            <ApiKeyInput />
        </nav>
    );
}
