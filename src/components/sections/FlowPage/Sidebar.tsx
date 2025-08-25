"use client";

import React, {Fragment, useEffect, useState} from 'react';
import {
    RiTeamLine,
} from 'react-icons/ri';
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import {FiLayers, FiLogOut} from "react-icons/fi";
import {GoPeople} from "react-icons/go";
import {HiOutlineSparkles} from "react-icons/hi2";
import {BsCreditCard} from "react-icons/bs";
import {FaRegUserCircle} from "react-icons/fa";
import axios from "axios";
import {toast} from "react-hot-toast";

const Sidebar = () => {
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const router = useRouter();

    const {data: session, status} = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/signin?type=signin")
        } else if (status === "authenticated") {
            (async ()=>{
                try {
                    const response = await axios.get(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/get-profile`,
                        {
                            headers: {
                                Authorization: `Bearer ${session.user.accessToken}`,
                            }
                        }
                    );

                    if (response.data.status) {
                        const user = response.data?.data || {};
                        const userName = user.name || "";
                        const userEmail = user.email || "";

                        setName(userName);
                        setEmail(userEmail);
                    }

                } catch (error) {
                    console.error("Failed to fetch profile:", error);
                    toast.error("Failed to load profile data");
                }
            })();
        }
    }, [session, status, router]);

    const menuItems = [
        { icon: HiOutlineSparkles, label: 'Generate', href: "/flow" },
        { icon: FiLayers, label: 'Designs', href: "/designs" },
        { icon: GoPeople, label: 'Community', href: "/community" },
        // { icon: RiTeamLine, label: 'Teams', href: "/teams" },
        { icon: BsCreditCard, label: 'Subscribe', href: "/subscription" },
    ];

    const dropdownItems = [
        { icon: FaRegUserCircle, label: 'Account', href: "/profile", type: "link" },
        { icon: BsCreditCard, label: 'Subscription', href: "/subscription", type: "link" },
        { icon: FiLogOut, label: 'Logout', type: "button" },
    ];

    const isActiveRoute = (href: string) => {
        if (href === "/flow") {
            return pathname === "/flow" || pathname.startsWith("/flow/");
        }
        return pathname === href;
    };

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await signOut({
            redirect: true,
            callbackUrl: "/"
        })
    };

    return (
        <div className="h-screen w-[300px] bg-white/30 backdrop-blur-md border-r border-blue-100 relative z-50">

            <div className="relative z-10 flex flex-col h-full">
                <div className="p-6 border-b border-blue-100">
                    <Link href="/flow" className="flex items-center space-x-2">
                        <Image src="/logo.png" alt="creati-ai" width={2000} height={2000} className="w-5 h-auto" />
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-tl from-blue-800 via-blue-600 to-blue-400">Creati AI</h1>
                    </Link>
                </div>

                <div className="flex-1 px-4 py-6">
                    <div className="mb-4">
                        <h2 className="text-xs font-medium text-blue-600/70 uppercase tracking-wider mb-3">
                            Main Menu
                        </h2>
                    </div>

                    <nav className="space-y-2">
                        {menuItems.map((item, index) => {
                            const IconComponent = item.icon;
                            const isActive = isActiveRoute(item.href);

                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={`
                                        flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                                        ${isActive
                                        ? 'bg-white/30 border border-blue-300/40 text-blue-500 shadow-lg shadow-blue-500/20 backdrop-blur-sm'
                                        : 'text-blue-600/80 hover:bg-blue-100/50 hover:text-blue-700 hover:backdrop-blur-sm'
                                    }
                                    `}
                                >
                                    <IconComponent
                                        size={18}
                                        className={`
                                            ${isActive ? 'text-blue-500' : 'text-blue-500/60 group-hover:text-blue-600'}
                                        `}
                                    />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="relative p-4 border-t border-blue-100">
                    <div
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/30 backdrop-blur-sm hover:bg-blue-200/30 transition-all duration-200 cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium shadow-lg overflow-hidden">
                            <div className="text-lg font-bold text-white">{name?.split(" ").map((el)=>el.charAt(0).toUpperCase()).join("")}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-blue-800 truncate">{name}</p>
                            <p className="text-xs text-blue-600/60 truncate">{email}</p>
                        </div>
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute left-4 right-4 bottom-[90%] mt-2 space-y-1 p-2 rounded-xl bg-white/40 backdrop-blur-sm border border-blue-200/30 shadow-lg z-[100]">
                            {dropdownItems.map((item, index) => {
                                const IconComponent = item.icon;
                                return (
                                    <Fragment key={index}>
                                        {item.type === "link" ? (
                                            <Link
                                                href={item.href as string}
                                                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-blue-600/80 hover:bg-blue-100/50 hover:text-blue-700 transition-all duration-200 group"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <IconComponent
                                                    size={16}
                                                    className="text-blue-500/60 group-hover:text-blue-600"
                                                />
                                                <span>{item.label}</span>
                                            </Link>
                                        ) : (
                                            <button
                                                className="w-full cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-blue-600/80 hover:bg-blue-100/50 hover:text-blue-700 transition-all duration-200 group"
                                                onClick={handleLogout}
                                            >
                                                <IconComponent
                                                    size={16}
                                                    className="text-blue-500/60 group-hover:text-blue-600"
                                                />
                                                <span>{item.label}</span>
                                            </button>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
