"use client";

import DesignCard from "@/components/DesignCard";
import {useSession} from "next-auth/react";
import {useEffect, useMemo, useState} from "react";
import {DesignCardType} from "@/types/designs";
import useSWR from "swr";
import {authenticatedFetcher, fetcherOptions} from "@/lib/fetchers";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {GoPlus} from "react-icons/go";
import {LuCirclePlus} from "react-icons/lu";
import Sidebar from "@/components/sections/FlowPage/Sidebar";

export default function DesignsPage() {

    const {data: session, status} = useSession();
    const router = useRouter();
    const [query, setQuery] = useState("");
    const {data: designs, isLoading, error, mutate} = useSWR(
        session?.user.accessToken ? ["/api/design", session.user.accessToken] : null,
        authenticatedFetcher,
        fetcherOptions
    )

    useEffect(() => {
        if(status === "unauthenticated") {
            router.replace("/signin?type=signin");
        }
        mutate();
    }, [router, session]);

    const filteredDesigns = useMemo(()=>{
        if(!designs?.data) return [];
        const q = query.toLowerCase()
        return designs.data.filter((design: DesignCardType)=>design.title.toLowerCase().includes(q) || design.prompt.toLowerCase().includes(q));
    }, [designs, query]);

    if (status === "loading") return <div className="w-full h-screen flex items-center justify-center">Loading session...</div>;
    if (status === "unauthenticated") return <div className="w-full h-screen flex items-center justify-center">Redirecting to login...</div>;
    if (isLoading) return <div className="w-full h-screen flex items-center justify-center">Loading Diagrams...</div>;
    if (error) return <div className="w-full h-screen flex items-center justify-center">Failed to load diagrams: {error.message}</div>;

    return (
        <div className="w-full flex">
            <Sidebar />
            <div className="w-full">
                {designs.data.length>0 && <div className="w-full p-3 flex items-center justify-between border-b border-blue-100">
                    <p className="text-xl font-semibold text-blue-500">Designs (<span>{filteredDesigns.length}</span>)</p>
                    <input value={query} onChange={(e)=>setQuery(e.target.value)} type="search" placeholder="Search Designs..." className="input w-[400px]"/>
                    <Link href="/flow"
                        className="w-44 font-medium text-blue-500 flex items-center justify-center gap-2 px-6 py-3 border border-blue-500 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white duration-200 ease-in-out transition-all">
                        <LuCirclePlus size={20}/>
                        <p>New Design</p>
                    </Link>
                </div>}
                <div className="w-full p-6 mx-auto">
                    {filteredDesigns.length > 0 ? (
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredDesigns.map((design: DesignCardType) => (
                                <DesignCard
                                    key={design.id}
                                    id={design.id}
                                    images={design.images}
                                    createdAt={design.createdAt}
                                    title={design.title}
                                    prompt={design.prompt}
                                    visibility={design.visibility}
                                    onChangeAction={mutate}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-[calc(100vh-50px)] flex flex-col gap-3 items-center justify-center">
                            <div className="rounded-full text-white p-3 bg-blue-500/90"><GoPlus size={40} /></div>
                            <div className="text-center max-w-md">
                                <h3 className="text-3xl font-bold text-blue-500">Create your first project</h3>
                                <p className="text-gray-800 text-sm">You're just one step away from turning your ideas into reality. Let's get started.</p>
                            </div>
                            <Link href="/" className="cta-btn rounded-xl"><LuCirclePlus size={20} /> <span className="font-medium">Create New Design</span></Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
