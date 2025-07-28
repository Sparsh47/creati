"use client";

import Navbar from "@/components/shared/Navbar";
import {Toaster} from "react-hot-toast";
import DesignResponseProvider from "@/context/DesignResponseContext";
import Animator from "@/components/Animator";
import AuthProvider from "@/context/AuthContext";
import React, {ReactNode} from "react";
import {SessionProvider} from "next-auth/react";

export default function ProviderLayout({session, children}: {session: any, children: ReactNode}) {

    return (
        <SessionProvider session={session}>
            <AuthProvider>
                <Navbar />
                <Toaster position="top-right" />
                <DesignResponseProvider>
                    <Animator>
                        {children}
                    </Animator>
                </DesignResponseProvider>
            </AuthProvider>
        </SessionProvider>
    )
}