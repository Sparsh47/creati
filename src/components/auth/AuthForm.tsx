"use client";

import Link from "next/link";
import { FaGoogle } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa6";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "@/context/AuthContext";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";

export default function AuthForm({ type }: { type: "signup" | "signin" }) {
    const [show, setShow] = useState<boolean>(false);
    const {isLoggedIn, setIsLoggedIn, setAuthInfo, authInfo} = useAuth();
    const router = useRouter();
    const emailRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(isLoggedIn) {
            router.replace("/");
        } else {
            return;
        }
    }, [isLoggedIn]);

    const handleShow = () => {
        setShow((prev) => !prev);
    };

    const signup = () => {
        if(emailRef.current && passRef.current) {
            const authData = {
                email: emailRef.current.value,
                password: passRef.current.value,
                isLoggedIn: false,
                accountCreated: true,
            }
            localStorage.setItem("authInfo", JSON.stringify(authData));
            setAuthInfo(authData);
            toast.success("Account created successfully.");
            router.replace("/signin?type=signin");
        }
    };

    const signin = (e: any) => {
        e.preventDefault();
        if(emailRef.current && passRef.current) {
            if(authInfo.accountCreated) {
                const email = emailRef.current.value;
                const password = passRef.current.value;
                if(email === authInfo.email) {
                    if(password === authInfo.password) {
                        const authData = {...authInfo, isLoggedIn: true};
                        localStorage.setItem("authInfo", JSON.stringify(authData));
                        setIsLoggedIn(true);
                        setAuthInfo(authData);
                        router.replace("/");
                        toast.success("User logged in successfully.");
                    } else {
                        toast.error("Incorrect password. Try again.");
                    }
                } else {
                    toast.error("User does not exist.");
                    return;
                }
            } else {
                toast.error("No account created for this email.");
                return;
            }
        }
    }

    return (
        <div
            className="w-full max-w-[30rem] flex flex-col items-center justify-around py-10 min-h-[70%]
                 shadow-xl shadow-blue-500/20 border border-blue-500/15 rounded-2xl
                 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-200/30 backdrop-blur-3xl"
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
                >
                    <FaGoogle size={24} className="text-blue-400" />
                    <p>Sign {type === "signin" ? "in" : "up"} with Google</p>
                </button>
                <p>or</p>
                <div className="w-full flex flex-col items-center justify-center gap-6">
                    <form onSubmit={type === "signup" ? ()=>signup() : (e)=>signin(e)} className="w-[85%] flex flex-col items-center justify-center gap-5">
                        <div className="w-full flex flex-col items-center justify-center gap-2.5">
                            <input
                                ref={emailRef}
                                required
                                type="text"
                                className="input-shadow input"
                            />
                            <div className="w-full rounded-xl relative z-50 input-shadow">
                                <input
                                    ref={passRef}
                                    required
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
                        <button className="cta-btn w-full cursor-pointer text-lg font-medium">
                            {type === "signup" ? "Sign Up" : "Sign In"}
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
