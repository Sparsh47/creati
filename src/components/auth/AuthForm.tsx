"use client";

import Link from "next/link";
import { FaGoogle } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa6";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import React, {useEffect, useRef, useState} from "react";
import {getCsrfToken, signIn, useSession} from "next-auth/react";
import axios from "axios";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";
import Spinner from "@/components/shared/Spinner";
import {cn} from "@/lib/utils";

interface PasswordValidation {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
}

export default function AuthForm({ type }: { type: "signup" | "signin" }) {
    const [show, setShow] = useState<boolean>(false);
    const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [password, setPassword] = useState("");
    const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });
    const [showValidation, setShowValidation] = useState(false);

    const {update} = useSession();
    const router = useRouter();
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);

    const validationRules = [
        { key: 'minLength', text: 'At least 8 characters' },
        { key: 'hasUppercase', text: 'One uppercase letter' },
        { key: 'hasLowercase', text: 'One lowercase letter' },
        { key: 'hasNumber', text: 'One number' },
        { key: 'hasSpecialChar', text: 'One special character' },
    ];

    useEffect(() => {
        getCsrfToken().then((token)=>setCsrfToken(token));
    }, []);

    const validatePassword = (password: string): PasswordValidation => {
        return {
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
    };

    const isPasswordValid = (validation: PasswordValidation): boolean => {
        return Object.values(validation).every(Boolean);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        if (type === "signup") {
            const validation = validatePassword(newPassword);
            setPasswordValidation(validation);
            setShowValidation(newPassword.length > 0);
        }
    };

    const handleShow = () => {
        setShow((prev) => !prev);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const name     = nameRef.current?.value;
        const email    = emailRef.current!.value;
        const password = passRef.current!.value;

        if (type === "signup" && !isPasswordValid(passwordValidation)) {
            setError("Please ensure your password meets all requirements");
            return;
        }

        setLoading(true);

        if (type === "signup") {
            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
                    { name, email, password }
                );
            } catch (err: any) {
                setLoading(false);
                setError(
                    err.response?.data?.message ||
                    "Registration failed. Please check your details and try again."
                );
                return;
            }
        }

        const result = await signIn("credentials", {
            email,
            password,
            csrfToken,
            callbackUrl: "/flow"
        });

        if(type === "signup") {
            nameRef.current!.value = "";
        }
        emailRef.current!.value = "";
        passRef.current!.value = "";
        setPassword("");
        setShowValidation(false);

        if (result?.error) {
            setLoading(false);
            setError("Invalid email or password");
        } else if (result?.ok) {
            await update();
            toast.success("User logged in successfully");
            router.push("/flow");
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        toast("Redirecting to Google sign-in...");

        try {
            await signIn("google", {callbackUrl: "/flow"});
            await update();

        } catch (error) {
            console.error('Google sign-in failed:', error);
            setError("Google sign-in failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
        <div className="flex items-center gap-2">
            {isValid ? (
                <IoCheckmarkCircle className="text-blue-500" size={16} />
            ) : (
                <IoCloseCircle className="text-red-500" size={16} />
            )}
            <span className={cn("text-sm", isValid ? "text-blue-600" : "text-red-600")}>
                {text}
            </span>
        </div>
    );

    return (
        <div
            className={cn("w-full max-w-[30rem] flex flex-col items-center justify-center gap-8 py-8 shadow-xl shadow-blue-500/20 border border-blue-500/15 rounded-2xl bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-200/30 backdrop-blur-3xl",
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

            {error && (
                <div className="w-[85%] p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <div className="w-full flex flex-col items-center justify-center gap-6">
                {/*<button*/}
                {/*    className="oauth-btn"*/}
                {/*    onClick={handleGoogleSignIn}*/}
                {/*    disabled={loading}*/}
                {/*>*/}
                {/*    {loading ? (*/}
                {/*        <Spinner />*/}
                {/*    ) : (*/}
                {/*        <>*/}
                {/*            <FaGoogle size={24} className="text-blue-400" />*/}
                {/*            <p>Sign {type === "signin" ? "in" : "up"} with Google</p>*/}
                {/*        </>*/}
                {/*    )}*/}
                {/*</button>*/}
                {/*<p>or</p>*/}
                <div className="w-full flex flex-col items-center justify-center gap-6">
                    <form onSubmit={handleSubmit} className="w-[85%] flex flex-col items-center justify-center gap-5">
                        <div className="w-full flex flex-col items-center justify-center gap-6">
                            {type === "signup" && (
                                <div className="w-full flex flex-col">
                                    <label htmlFor="name" className="text-lg font-medium text-blue-500 pl-2">Full Name</label>
                                    <input
                                        id="name"
                                        ref={nameRef}
                                        required
                                        type="text"
                                        placeholder="Full Name"
                                        className="input-shadow input"
                                        disabled={loading}
                                    />
                                </div>
                            )}
                            <div className="w-full flex flex-col">
                                <label htmlFor="email" className="text-lg font-medium text-blue-500 pl-2">Email</label>
                                <input
                                    id="email"
                                    ref={emailRef}
                                    required
                                    type="email"
                                    placeholder="email@example.com"
                                    className="input-shadow input"
                                    disabled={loading}
                                />
                            </div>
                            <div className="w-full relative z-50">
                                <div className="w-full flex flex-col">
                                    <label htmlFor="password" className="text-lg font-medium text-blue-500 pl-2">Password</label>
                                    <input
                                        id="password"
                                        ref={passRef}
                                        required
                                        placeholder="••••••••"
                                        type={show ? "text" : "password"}
                                        className="input input-shadow rounded-xl"
                                        disabled={loading}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
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

                            {type === "signup" && showValidation && (
                                <div className="w-full">
                                    <div className="space-y-2">
                                        {validationRules.map((rule) => (
                                            <ValidationItem
                                                key={rule.key}
                                                isValid={passwordValidation[rule.key as keyof PasswordValidation]}
                                                text={rule.text}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className={cn(
                                "cta-btn rounded-xl w-full cursor-pointer text-lg font-medium",
                                type === "signup" && showValidation && !isPasswordValid(passwordValidation) &&
                                "opacity-50 cursor-not-allowed"
                            )}
                            disabled={loading || (type === "signup" && showValidation && !isPasswordValid(passwordValidation))}
                        >
                            {loading ? <Spinner /> : type === "signup" ? "Sign Up" : "Sign In"}
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
