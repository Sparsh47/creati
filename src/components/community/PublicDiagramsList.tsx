"use client"

import {useAuthStore} from "@/stores/auth";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import useSWR from "swr";
import {authenticatedFetcher} from "@/lib/fetchers";
import Image from "next/image";
import {IoMdRefresh} from "react-icons/io";

export default function PublicDiagramsList() {

    const auth = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if(auth.status === "unauthenticated") {
            router.replace("/signin?type=signin");
        }
    }, [router, auth]);

    const {data, error, isLoading, mutate} = useSWR(
        auth.accessToken ? ["api/all-designs", auth.accessToken] : null,
        authenticatedFetcher,
        {
            refreshInterval: 60000,
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 5000,
            errorRetryCount: 3,
            errorRetryInterval: 1000
        }
    )

    if (auth.status === "loading") return <div className="w-full h-screen flex items-center justify-center">Loading session...</div>;
    if (auth.status === "unauthenticated") return <div className="w-full h-screen flex items-center justify-center">Redirecting to login...</div>;
    if (isLoading) return <div className="w-full h-screen flex items-center justify-center">Loading Diagrams...</div>;
    if (error) return <div className="w-full h-screen flex items-center justify-center">Failed to load diagrams: {error.message}</div>;

    console.log("Data: ", data.data);

    return (<div>

        <div className="w-full h-screen flex items-center justify-center">
            {data.data.data.length ? data.data.data.map((d, i) => (
                <div>Diagram {i}</div>
            )) : <p className="text-xl font-semibold">No Designs Found</p>}
        </div>
    </div>
);
}