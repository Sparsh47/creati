"use client";

import DesignCard from "@/components/DesignCard";
import {useSession} from "next-auth/react";
import {useEffect} from "react";
import {DesignCardType} from "@/types/designs";
import useSWR from "swr";
import {authenticatedFetcher, fetcherOptions} from "@/lib/fetchers";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {GoPlus} from "react-icons/go";
import {LuCirclePlus} from "react-icons/lu";

export default function DesignsPage() {

    const {data: session, status} = useSession();
    const router = useRouter();
    const {data: designs, isLoading, error, mutate} = useSWR(
        session?.user.accessToken ? ["/api/design", session.user.accessToken] : null,
        authenticatedFetcher,
        fetcherOptions
    )

    useEffect(() => {
        if(status === "unauthenticated") {
            router.replace("/signin?type=signin");
        }
    }, [router, session]);

    if (status === "loading") return <div className="w-full h-screen flex items-center justify-center">Loading session...</div>;
    if (status === "unauthenticated") return <div className="w-full h-screen flex items-center justify-center">Redirecting to login...</div>;
    if (isLoading) return <div className="w-full h-screen flex items-center justify-center">Loading Diagrams...</div>;
    if (error) return <div className="w-full h-screen flex items-center justify-center">Failed to load diagrams: {error.message}</div>;

    return (
        <div className="w-full min-h-screen pt-40 px-6 pb-6 max-w-7xl mx-auto">
            {designs.data.length>0 && <div className="mb-6 flex justify-end">
                <button
                    onClick={() => mutate()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors duration-200 flex items-center gap-2"
                    aria-label="Refresh designs"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Refresh
                </button>
            </div>}

            {designs.data.length > 0 ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {designs.data.map((design: DesignCardType) => (
                        <DesignCard
                            key={design.id}
                            id={design.id}
                            images={design.images}
                            createdAt={design.createdAt}
                            prompt={design.prompt}
                            visibility={design.visibility}
                        />
                    ))}
                </div>
            ) : (
                <div className="w-full h-[calc(100vh-200px)] flex flex-col gap-3 items-center justify-center">
                    <div className="rounded-full text-white p-3 bg-blue-500/90"><GoPlus size={40} /></div>
                    <div className="text-center max-w-md">
                        <h3 className="text-3xl font-bold text-blue-500">Create your first project</h3>
                        <p className="text-gray-800 text-sm">You're just one step away from turning your ideas into reality. Let's get started.</p>
                    </div>
                    <Link href="/" className="cta-btn"><LuCirclePlus size={20} /> <span className="font-medium">Create New Design</span></Link>
                </div>
            )}
        </div>
    )
}
