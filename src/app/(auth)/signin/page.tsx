"use client";

import AuthForm from "@/components/auth/AuthForm";
import {useSearchParams} from "next/navigation";

export default function Login() {
    const params = useSearchParams();
    const rawType = params.get("type");
    const type: "signin" | "signup" = rawType === "signup" ? "signup" : "signin";

    return (<div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 to-white">
            <div className="absolute -top-60 -left-60 w-[600px] h-[600px] bg-gradient-to-br from-blue-400 to-blue-200 opacity-40 rounded-full filter blur-3xl" />
            <div className="absolute -bottom-60 -right-60 w-[500px] h-[500px] bg-gradient-to-tl from-blue-500 to-blue-300 opacity-30 rounded-full filter blur-2xl" />
            <AuthForm type={type}/>
        </div>);
}
