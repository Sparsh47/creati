"use client"

import {useAuthStore} from "@/stores/auth";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import useSWR from "swr";
import {authenticatedFetcher, fetcherOptions} from "@/lib/fetchers";
import Link from "next/link";
import {LuCirclePlus} from "react-icons/lu";
import {HiUsers} from "react-icons/hi2";

export default function PublicDiagramsList() {

    const auth = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if(auth.status === "unauthenticated") {
            router.replace("/signin?type=signin");
        }
    }, [router, auth]);

    const {data, error, isLoading} = useSWR(
        auth.accessToken ? ["api/all-designs", auth.accessToken] : null,
        authenticatedFetcher,
        fetcherOptions
    )

    if (auth.status === "loading") return <div className="w-full h-screen flex items-center justify-center">Loading session...</div>;
    if (auth.status === "unauthenticated") return <div className="w-full h-screen flex items-center justify-center">Redirecting to login...</div>;
    if (isLoading) return <div className="w-full h-screen flex items-center justify-center">Loading Diagrams...</div>;
    if (error) return <div className="w-full h-screen flex items-center justify-center">Failed to load diagrams: {error.message}</div>;

    return (<div>
        <div className="w-full h-screen flex items-center justify-center">
            {data.data.data.length ? data.data.data.map((d, i) => (
                <div>Diagram {i}</div>
            )) : <div className="w-full h-[calc(100vh-200px)] flex flex-col gap-3 items-center justify-center">
                <div className="rounded-full text-white p-3 bg-blue-500/90"><HiUsers size={40} /></div>
                <div className="text-center max-w-md">
                    <h3 className="text-3xl font-bold text-blue-500">No public designs yet</h3>
                    <p className="text-gray-800 text-sm">Be the first to share your creativity with the community. Upload your design and inspire others.</p>
                </div>
                <Link href="/" className="cta-btn"><LuCirclePlus size={20} /> <span className="font-medium">Create Your Design</span></Link>
            </div>
            }
        </div>
    </div>
);
}