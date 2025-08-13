"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HiOutlineSparkles } from "react-icons/hi2";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (open && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, [open]);

    return (
        <nav
            className={cn(
                !scrolled ? "absolute top-5 left-0" : "fixed top-5 z-50",
                "w-full flex items-center justify-center p-2 transition-all duration-300 z-50"
            )}
        >
            <div
                className={cn(
                    "w-full max-w-6xl flex items-center justify-between p-5 rounded-3xl border border-transparent",
                    scrolled && "bg-blue-50/30 border-2 border-blue-100 backdrop-blur-md shadow-2xl shadow-blue-500/30"
                )}
            >
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Creati.AI"
                        width={1000}
                        height={1000}
                        className="h-14 w-auto"
                    />
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-tl from-blue-800 via-blue-600 to-blue-400">
                        Creati.AI
                    </h1>
                </Link>
                    <div className="flex items-center gap-5 font-medium">
                        <Link
                            href={{ pathname: "/signin", query: "type=signin" }}
                            className="text-lg relative group"
                        >
                            <p className="group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-tr from-blue-800 via-blue-600 to-blue-400 transition-all duration-200">
                                Login
                            </p>
                            <div className="absolute w-0 h-[2px] bg-blue-500 group-hover:w-full transition-all duration-200" />
                        </Link>

                        <Link
                            href={{ pathname: "/signin", query: "type=signup" }}
                            className="cta-btn rounded-xl flex items-center gap-1"
                        >
                            <p className="text-lg">Try Now</p>
                            <HiOutlineSparkles className="w-6 h-6" />
                        </Link>
                    </div>
            </div>
        </nav>
    );
}
