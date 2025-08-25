"use client"

import { useRouter } from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import useSWR from "swr";
import { authenticatedFetcher, fetcherOptions } from "@/lib/fetchers";
import Link from "next/link";
import { LuCirclePlus } from "react-icons/lu";
import { HiUsers } from "react-icons/hi2";
import { useSession } from "next-auth/react";
import CommunityDesignCard from "@/components/community/CommunityDesignCard";

export default function PublicDiagramsList() {

    const router = useRouter();
    const { data: session, status } = useSession();
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/signin?type=signin");
        }
    }, [router, session, status]);

    const { data, error, isLoading } = useSWR(
        session?.user.accessToken ? ["api/all-designs", session.user.accessToken] : null,
        authenticatedFetcher,
        fetcherOptions
    );

    const filteredData = useMemo(() => {
        if (!data?.data?.data) return [];
        if(search.trim().length<0) return [];
        const q = search.toLowerCase()
        return data.data.data.filter((design: any)=>design.title.toLowerCase().includes(q) || design.prompt.toLowerCase().includes(q))
    }, [data, search])

    if (status === "loading") return <div className="w-full h-screen flex items-center justify-center">Loading session...</div>;
    if (status === "unauthenticated") return <div className="w-full h-screen flex items-center justify-center">Redirecting to login...</div>;
    if (isLoading) return <div className="w-full h-screen flex items-center justify-center">Loading Diagrams...</div>;
    if (error) return <div className="w-full h-screen flex items-center justify-center">Failed to load diagrams: {error.message}</div>;

    return (
        <div className="w-full min-h-screen relative">
            {data.data.data.length ? (
                <div className="w-full min-h-screen">

                    <div className="w-full h-[60vh] flex items-center justify-center bg-white/30 backdrop-blur-md border-b shadow-2xl shadow-blue-300/20 border-blue-100 relative overflow-hidden">

                        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full bg-blue-400/30 blur-3xl animate-[pulse_6s_ease-in-out_infinite]"></div>

                        <div className="absolute top-10 right-20 w-[400px] h-[400px] rounded-full bg-blue-600/30 blur-3xl animate-[pulse_7s_ease-in-out_infinite] [animation-delay:2s]"></div>

                        <div className="absolute bottom-[-50px] left-1/3 w-[250px] h-[250px] rounded-full bg-cyan-400/30 blur-3xl animate-[pulse_8s_ease-in-out_infinite] [animation-delay:4s]"></div>

                        <div className="w-full flex flex-col items-center justify-center gap-10">
                            <div>
                                <h2 className="relative z-10 text-[80px] leading-[80px] font-extrabold bg-clip-text text-transparent bg-gradient-to-tl from-blue-800 via-blue-600 to-blue-400 text-center">
                                    Community<br /> Architectures
                                </h2>
                                <p className="text-xl text-blue-700 max-w-2xl text-center">Explore community-driven system architectures and get inspired by real-world designs shared by fellow creators.</p>
                            </div>
                            <div className="w-full max-w-xl flex items-center justify-center z-50">
                                <input value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full rounded-2xl border-2 border-blue-200 p-5 text-lg font-medium outline-blue-300 bg-white/50 backdrop-blur-md placeholder:text-blue-400 text-blue-600" type="search" placeholder="Search amazing designs" />
                            </div>
                        </div>
                    </div>

                    <div className="w-full min-h-screen bg-white grid grid-cols-4 p-8 gap-8">
                        {filteredData.map((design: any)=>(
                            <CommunityDesignCard key={design.id} id={design.id} image={design.images[0].secureUrl} title={design.title} description={design.prompt} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full h-screen flex flex-col gap-3 items-center justify-center">
                    <div className="rounded-full text-white p-3 bg-blue-500/90">
                        <HiUsers size={40} />
                    </div>
                    <div className="text-center max-w-md">
                        <h3 className="text-3xl font-bold text-blue-500">No public designs yet</h3>
                        <p className="text-gray-800 text-sm">
                            Be the first to share your creativity with the community. Upload your design and inspire others.
                        </p>
                    </div>
                    <Link href="/" className="cta-btn rounded-xl">
                        <LuCirclePlus size={20} /> <span className="font-medium">Create Your Design</span>
                    </Link>
                </div>
            )}
        </div>
    );
}
