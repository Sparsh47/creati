"use client";

import Link from "next/link";
import { FaGoogle } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa6";
import React, {useEffect, useRef, useState} from "react";
import {getCsrfToken, signIn} from "next-auth/react";
import axios from "axios";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";
import Spinner from "@/components/shared/Spinner";
import {cn} from "@/lib/utils";

export default function AuthForm({ type }: { type: "signup" | "signin" }) {
    const [show, setShow] = useState<boolean>(false);
    const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getCsrfToken().then((token)=>setCsrfToken(token));
    }, []);

    const handleShow = () => {
        setShow((prev) => !prev);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const name     = nameRef.current?.value;
        const email    = emailRef.current!.value;
        const password = passRef.current!.value;

        if (type === "signup") {
            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
                    { name, email, password }
                );
            } catch (err: any) {
                setError(
                    err.response?.data?.message ||
                    "Registration failed. Please check your details and try again."
                );
                return;
            }
        }

        const result = await signIn("credentials", {
            redirect:    false,
            email,
            password,
            csrfToken,
            callbackUrl: "/",
        });

        if(type === "signup") {
            nameRef.current!.value = "";
        }

        emailRef.current!.value = "";
        passRef.current!.value = "";

        if (result?.error) {
            setLoading(false);
            setError("Invalid email or password");
        } else {
            toast.success("User logged in successfully");
            router.push(result?.url || "/");
            setLoading(false);
        }
    };

    return (
        <div
            className={cn("w-full max-w-[32rem] flex flex-col items-center justify-between py-8 min-h-[70%] shadow-xl shadow-blue-500/20 border border-blue-500/15 rounded-2xl bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-200/30 backdrop-blur-3xl",
                type === "signin" && "justify-around"
                )}
        >
            <div className="w-full flex flex-col items-center justify-center gap-1">
                <h2 className="bg-clip-text text-transparent bg-gradient-to-tr from-blue-800 via-blue-600 to-blue-400 text-3xl font-bold">
                    {type === "signin" ? "Welcome back" : "Let's get started"}
                </h2>
                <p className="text-base">
                    {type === "signin"
                        ? "Choose how you want to sign in"
                        : "Create your dream website/app instantly"}
                </p>
            </div>
            <div className="w-full flex flex-col items-center justify-center gap-6">
                <button
                    className="oauth-btn"
                    onClick={()=>signIn("google", {callbackUrl: "/"})}
                >
                    <FaGoogle size={24} className="text-blue-400" />
                    <p>Sign {type === "signin" ? "in" : "up"} with Google</p>
                </button>
                <p>or</p>
                <div className="w-full flex flex-col items-center justify-center gap-6">
                    <form onSubmit={handleSubmit} className="w-[85%] flex flex-col items-center justify-center gap-5">
                        <div className="w-full flex flex-col items-center justify-center gap-2.5">
                            {type === "signup" && <input
                                ref={nameRef}
                                required
                                type="text"
                                placeholder="Full Name"
                                className="input-shadow input"
                            />}
                            <input
                                ref={emailRef}
                                required
                                type="text"
                                placeholder="email@example.com"
                                className="input-shadow input"
                            />
                            <div className="w-full rounded-xl relative z-50 input-shadow">
                                <input
                                    ref={passRef}
                                    required
                                    placeholder="••••••••"
                                    type={show ? "text" : "password"}
                                    className="input"
                                />
                                {show ? (
                                    <FaRegEyeSlash
                                        onClick={handleShow}
                                        size={24}
                                        className="absolute right-5 bottom-3.5 cursor-pointer"
                                    />
                                ) : (
                                    <IoEyeSharp
                                        onClick={handleShow}
                                        size={24}
                                        className="absolute right-5 bottom-3.5 cursor-pointer"
                                    />
                                )}
                            </div>
                        </div>
                        <button type="submit" className="cta-btn w-full cursor-pointer text-lg font-medium">
                            {!loading ? type === "signup" ? "Sign Up" : "Sign In" : <Spinner />}
                        </button>
                    </form>
                </div>
            </div>
            <div className="w-full flex flex-col items-center justify-center gap-2">
                {type === "signup" && (
                    <p className="text-sm">
                        By continuing, you agree to our{" "}
                        <Link className="text-blue-600 hover:text-blue-500" href="/terms">
                            Terms
                        </Link>{" "}
                        and{" "}
                        <Link
                            className="text-blue-600 hover:text-blue-500"
                            href="/privacy-policy"
                        >
                            Privacy Policy
                        </Link>
                    </p>
                )}
                <p>or</p>
                <div className="text-base">
                    {type === "signin" ? (
                        <p>
                            Don't have an account?{" "}
                            <Link
                                className="text-blue-600 hover:text-blue-500"
                                href={{
                                    pathname: "/signin",
                                    query: "type=signup",
                                }}
                            >
                                Sign Up
                            </Link>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <Link
                                className="text-blue-600 hover:text-blue-500"
                                href={{
                                    pathname: "/signin",
                                    query: "type=signin",
                                }}
                            >
                                Sign In
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
