"use client";

import Navbar from "@/components/shared/Navbar";
import {Toaster} from "react-hot-toast";
import DesignResponseProvider from "@/context/DesignResponseContext";
import Animator from "@/components/Animator";
import React, {ReactNode, useEffect} from "react";
import {SessionProvider, useSession} from "next-auth/react";
import {useAuthStore} from "@/stores/auth";

export default function ProviderLayout({session, children}: {session: any, children: ReactNode}) {

    return (
        <SessionProvider session={session}>
            <ProviderSync>
                {children}
            </ProviderSync>
        </SessionProvider>
    )
}

function ProviderSync({ children }: { children: ReactNode }) {
    const {data: sessionData, status} = useSession();

    useEffect(() => {
        useAuthStore.setState({status: status});

        if (status === "loading") {
            return;
        }

        const newToken = sessionData?.user?.accessToken;
        // @ts-ignore
        const currentToken = useAuthStore.getState().accessToken;

        if (newToken !== currentToken) {
            useAuthStore.setState({ accessToken: newToken || null });
        }
    }, [sessionData, status]);
    return (
        <>
            <Navbar />
            <Toaster position="top-right" />
            <DesignResponseProvider>
                <Animator>
                    {children}
                </Animator>
            </DesignResponseProvider>
        </>
    )
}