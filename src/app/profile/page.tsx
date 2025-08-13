"use client";

import {useSession} from "next-auth/react";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {FiFileText} from "react-icons/fi";
import {Progress} from "@/components/ui/progress";
import axios from "axios";
import {toast} from "react-hot-toast";
import Spinner from "@/components/shared/Spinner";
import Sidebar from "@/components/sections/FlowPage/Sidebar";

export default function ProfilePage() {

    const {data: session, status} = useSession();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [initialName, setInitialName] = useState("");
    const [loading, setLoading] = useState(false);
    const [planName, setPlanName] = useState("");
    const [activeSubs, setActiveSubs] = useState(0);
    const [designCount, setDesignCount] = useState(0);
    const [maxDesigns, setMaxDesigns] = useState(3);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/signin?type=signin")
        } else if (status === "authenticated") {
            (async ()=>{
                try {
                    const response = await axios.get(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/get-profile/${session.user.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${session.user.accessToken}`,
                            }
                        }
                    );

                    console.log("Response: ", response);

                    if (response.data.status) {
                        const user = response.data?.data || {};
                        const userName = user.name || "";
                        const userEmail = user.email || "";
                        const userPlan = user.plan.planType;
                        const designs = user.designs || [];
                        const designsAllowed = user.maxDesigns || 3;

                        if((userPlan as string).toLowerCase().includes("free")) {
                            setActiveSubs(0);
                        } else {
                            setActiveSubs(1);
                        }

                        setMaxDesigns(designsAllowed);
                        setDesignCount(designs.length);
                        setPlanName(userPlan);
                        setInitialName(userName);
                        setName(userName);
                        setEmail(userEmail);
                    } else {
                        console.log("Response not parsed correctly");
                    }

                } catch (error) {
                    console.error("Failed to fetch profile:", error);
                    toast.error("Failed to load profile data");
                }
            })();
        }
    }, [session, status, router]);

    const hasNameChanged = name !== initialName;

    const handleNameChange = async () => {
        setLoading(true);
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/update-profile/${session?.user.id}`, {
            name
        },{
            headers: {
                Authorization: `Bearer ${session?.user?.accessToken}`
            }
        });

        if(response.data.status==true) {
            setName(response.data.data.name);
            setInitialName(response.data.data.name);
            toast.success("Profile updated successfully.");
            setLoading(false);
        } else {
            toast.error("Could not update profile");
            setLoading(false);
        }
    }

    if (status === "loading") {
        return <div className="w-full h-screen flex items-center justify-center"><p>Loading...</p></div>;
    }

    return (
        <div className="w-full flex">
            <Sidebar />
            <div className="w-full min-h-screen flex justify-center py-8">
                <div className="w-full max-w-4xl flex flex-col gap-5 px-4">
                    <div className="personal-info-cards w-full flex flex-col gap-5">
                        <div className="w-full flex items-center justify-between">
                            <p className="font-bold text-xl text-blue-500">Personal Information</p>
                            <button onClick={handleNameChange}
                                    className={hasNameChanged ? "cta-btn rounded-xl cursor-pointer" : "cta-btn-disabled rounded-xl"}
                                    disabled={!hasNameChanged}
                            >
                                {loading ? <Spinner /> : <p>Save Changes</p>}
                            </button>
                        </div>
                        <div className="w-full flex flex-col gap-5">
                            <div>
                                <label htmlFor="email" className="text-sm text-gray-800 font-medium pl-1">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    disabled
                                    className="input input-shadow cursor-not-allowed hover:border-blue-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className="text-sm text-gray-800 font-medium pl-1">Your name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input input-shadow hover:border-blue-300"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="personal-info-cards w-full flex flex-col lg:flex-row lg:justify-between gap-8">
                        <div className="lg:w-1/3">
                            <p className="font-bold text-xl text-blue-500">Subscription</p>
                            <p className="text-xs text-gray-800 font-medium">View and manage your subscription details</p>
                        </div>
                        <main className="w-full lg:w-2/3 p-0 sm:p-0">
                            <div className="flex flex-col gap-4">

                                <div className="w-full rounded-xl p-5 bg-blue-50 backdrop-blur-md border-2 border-blue-200">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-600">{planName}</h3>
                                            <p className="text-blue-500/80 text-sm">{activeSubs === 0 ? "No active subscription" : "1 active subscription"}</p>
                                        </div>
                                        <button className="cursor-pointer px-5 py-2 border border-blue-500 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors duration-200 text-sm font-medium whitespace-nowrap">
                                            Manage Plan
                                        </button>
                                    </div>
                                </div>

                                <div className="w-full rounded-xl p-5 bg-blue-50 backdrop-blur-md border-2 border-blue-200">
                                    <h3 className="text-lg font-semibold text-blue-600">Usage</h3>
                                    <p className="text-blue-500/80 text-sm mb-4">Active projects and usage limits</p>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm text-blue-600">Projects</p>
                                        <p className="text-sm text-blue-500/80">{designCount} / {maxDesigns}</p>
                                    </div>
                                    <Progress value={designCount === 0 ? 0 : designCount/maxDesigns*100} />
                                </div>

                                <div className="w-full rounded-xl p-5 bg-blue-50 backdrop-blur-md border-2 border-blue-200">
                                    <h3 className="text-lg font-semibold text-blue-600 mb-4">Billing History</h3>
                                    <div className="border-b border-blue-200 mb-6">
                                        <div className="grid grid-cols-4 gap-4 text-sm text-blue-500/80 pb-2">
                                            <span>Date</span>
                                            <span className="text-left">Amount</span>
                                            <span className="text-left">Status</span>
                                            <span className="text-left">Invoice</span>
                                        </div>
                                    </div>
                                    <div className="text-center py-5 gap-2">
                                        <div className="flex justify-center">
                                            <FiFileText size={32} className="text-blue-500/80"/>
                                        </div>
                                        <p className="text-blue-500/80">No billing history available</p>
                                    </div>
                                </div>

                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    )
}