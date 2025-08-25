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
import Link from "next/link";
import {FaInfinity} from "react-icons/fa6";

export default function ProfilePage() {

    const {data: session, status} = useSession();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [initialName, setInitialName] = useState("");
    const [loading, setLoading] = useState(false);
    const [planName, setPlanName] = useState("FREE");
    const [activeSubs, setActiveSubs] = useState(0);
    const [designCount, setDesignCount] = useState(0);
    const [maxDesigns, setMaxDesigns] = useState(3);
    const [currPlanId, setCurrPlanId] = useState("");
    const [subscriptionDetails, setSubscriptionDetails] = useState([]);

    const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);
    const [cancellingPlan, setCancellingPlan] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/signin?type=signin")
        } else if (status === "authenticated") {
            (async ()=>{
                try {
                    const response = await axios.get(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/get-profile`,
                        {
                            headers: {
                                Authorization: `Bearer ${session.user.accessToken}`,
                            }
                        }
                    );

                    console.log(response);

                    if (response.data.status) {
                        const user = response.data?.data || {};
                        const userName = user.name || "";
                        const userEmail = user.email || "";
                        const userPlan = user.plan.planType;
                        const designs = user.designs || [];
                        const designsAllowed = user.maxDesigns || 3;

                        const planCancelAtPeriodEnd = user.plan.cancelAtPeriodEnd || false;
                        const planExpiresAt = user.plan.expiresAt ? new Date(user.plan.expiresAt) : null;

                        if(user.plan.stripePriceId) {
                            setCurrPlanId(user.plan.stripePriceId);
                        }

                        if(user.subscriptions.length) {
                            setSubscriptionDetails(user.subscriptions);
                        }

                        if((userPlan as string).toLowerCase().includes("free")) {
                            setActiveSubs(0);
                        } else {
                            setActiveSubs(1);
                        }

                        if (planCancelAtPeriodEnd && planExpiresAt) {
                            setPlanName(`${userPlan} (Cancelling)`);
                        } else {
                            setPlanName(userPlan);
                        }

                        setCancelAtPeriodEnd(planCancelAtPeriodEnd);
                        setExpiresAt(planExpiresAt);

                        setMaxDesigns(designsAllowed);
                        setDesignCount(designs.length);
                        setInitialName(userName);
                        setName(userName);
                        setEmail(userEmail);
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
        try {
            setLoading(true);
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/update-profile`, {
                name
            },{
                headers: {
                    Authorization: `Bearer ${session?.user?.accessToken}`
                }
            });

            console.log("Response:", response.data.data);

            if(response.data.status==true) {
                setName(response.data.data.name);
                setInitialName(response.data.data.name);
                toast.dismiss();
                toast.success("Profile updated successfully.");
                setLoading(false);
            } else {
                toast.dismiss();
                toast.error("Could not update profile");
                setLoading(false);
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Error updating profile");
            return;
        }
    }

    const handleCancelPlan = async () => {
        try {
            setCancellingPlan(true);
            toast.loading("Cancelling your plan...");

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/cancel-plan`, {
                priceId: currPlanId
            }, {
                headers: {
                    Authorization: `Bearer ${session?.user?.accessToken}`
                }
            });

            if (response.data.status) {
                toast.dismiss();
                toast.success(response.data.message || "Plan cancelled successfully");

                setCancelAtPeriodEnd(true);
                setExpiresAt(response.data.data?.expiresAt ? new Date(response.data.data.expiresAt) : null);
                setPlanName(prev => prev.includes('(Cancelling)') ? prev : `${prev.split(' (')[0]} (Cancelling)`);

                setTimeout(() => window.location.reload(), 1500);
            } else {
                toast.dismiss();
                toast.error(response.data.message || "Error cancelling plan");
            }

        } catch (error: any) {
            console.error("Cancel plan error:", error);
            toast.dismiss();
            toast.error(error.response?.data?.message || "Error cancelling plan. Try again later.");
        } finally {
            setCancellingPlan(false);
        }
    }

    const handleReactivatePlan = async () => {
        try {
            toast.loading("Reactivating your plan...");

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/reactivate-plan`, {
                priceId: currPlanId
            }, {
                headers: {
                    Authorization: `Bearer ${session?.user?.accessToken}`
                }
            });

            if (response.data.status) {
                toast.dismiss();
                toast.success("Plan reactivated successfully!");

                window.location.reload();
            } else {
                toast.dismiss();
                toast.error("Error reactivating plan");
            }

        } catch (error: any) {
            console.error("Reactivate plan error:", error);
            toast.dismiss();
            toast.error("Error reactivating plan. Try again later.");
        }
    }

    if (status === "loading") {
        return <div className="w-full h-screen flex items-center justify-center"><Spinner /></div>;
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

                                <div className="w-full rounded-xl p-4 bg-blue-50 backdrop-blur-md border-2 border-blue-200">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-600">{planName}</h3>
                                            <p className="text-blue-500/80 text-sm">{activeSubs === 0 ? "No active subscription" : "1 active subscription"}</p>
                                        </div>
                                        <div className="flex items-center justify-center gap-3">
                                            <Link href="/subscription" className="cursor-pointer px-5 py-2 border border-blue-500 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors duration-200 text-sm font-medium whitespace-nowrap">
                                                Manage Plan
                                            </Link>

                                            {planName.toLowerCase().includes("free") ? null : (
                                                cancelAtPeriodEnd ? (
                                                    <button
                                                        onClick={handleReactivatePlan}
                                                        className="cursor-pointer px-5 py-2 border border-green-500 rounded-lg text-green-500 hover:bg-green-100 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                                                    >
                                                        Reactivate Plan
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={handleCancelPlan}
                                                        disabled={cancellingPlan}
                                                        className="cursor-pointer px-5 py-2 border border-red-500 rounded-lg text-red-600 hover:bg-red-100 transition-colors duration-200 text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {cancellingPlan ? <Spinner /> : "Cancel Plan"}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    {cancelAtPeriodEnd && expiresAt && (
                                        <div className="mt-2 p-3 bg-white/80 backdrop-blur-md border border-blue-200 rounded-lg">
                                            <p className="text-blue-800 text-sm">
                                                <strong>⚠Subscription Ending:</strong> Your plan will end on{' '}
                                                <strong>{expiresAt.toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</strong>.
                                                You'll keep access until then.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="w-full rounded-xl p-4 bg-blue-50 backdrop-blur-md border-2 border-blue-200">
                                    <h3 className="text-lg font-semibold text-blue-600">Usage</h3>
                                    <p className="text-blue-500/80 text-sm mb-4">Active projects and usage limits</p>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm text-blue-600">Projects</p>
                                        <p className="text-sm text-blue-500/80">{designCount} / {maxDesigns}</p>
                                    </div>
                                    <Progress value={designCount === 0 ? 0 : designCount/maxDesigns*100} />
                                </div>

                                <div className="w-full rounded-xl p-4 bg-blue-50 backdrop-blur-md border-2 border-blue-200">
                                    <h3 className="text-lg font-semibold text-blue-600 mb-4">Subscription History</h3>
                                    <div className="border-b border-blue-200 mb-4">
                                        <div className="grid grid-cols-4 gap-4 text-sm text-blue-500/80 pb-2 font-medium">
                                            <span>Date</span>
                                            <span>Plan Type</span>
                                            <span>Status</span>
                                            <span>Period</span>
                                        </div>
                                    </div>

                                    <div className="max-h-[150px] overflow-y-auto">
                                        {subscriptionDetails && subscriptionDetails.length > 0 ? (
                                            <div className="space-y-2">
                                                {subscriptionDetails.map((subscription: any) => (
                                                    <div
                                                        key={subscription.id}
                                                        className="grid grid-cols-4 gap-4 text-sm py-3 border-b border-blue-100 hover:bg-blue-100/50 transition-colors"
                                                    >
                                                        <div className="text-blue-700">
                                                            {new Date(subscription.createdAt).toLocaleDateString('en-GB', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric'
                                                            })}
                                                        </div>

                                                        <div className="font-medium text-blue-800">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                                subscription.planType === 'FREE'
                                    ? 'bg-gray-100 text-gray-700'
                                    : subscription.planType === 'PLUS'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-purple-100 text-purple-700'
                            }`}>
                                {subscription.planType}
                            </span>
                                                        </div>

                                                        <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                subscription.status === 'ACTIVE'
                                    ? 'bg-green-100 text-green-700'
                                    : subscription.status === 'CANCELLED'
                                        ? 'bg-red-100 text-red-700'
                                        : subscription.status === 'EXPIRED'
                                            ? 'bg-gray-100 text-gray-700'
                                            : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {subscription.status}
                            </span>
                                                        </div>

                                                        <div className="text-blue-600 text-xs">
                                                            {subscription.expiresAt ? (
                                                                <>
                                                                    Until {new Date(subscription.expiresAt).toLocaleDateString('en-GB', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric'
                                                                })}
                                                                </>
                                                            ) : subscription.planType === 'FREE' ? (
                                                                <FaInfinity className="text-blue-600" />
                                                            ) : (subscription.currentPeriodStart && subscription.currentPeriodEnd) ? (
                                                                <>
                                                                    {new Date(subscription.currentPeriodStart).toLocaleDateString('en-GB', {
                                                                        day: '2-digit',
                                                                        month: '2-digit',
                                                                        year: 'numeric'
                                                                    })}
                                                                    {' - '}
                                                                    {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-GB', {
                                                                        day: '2-digit',
                                                                        month: '2-digit',
                                                                        year: 'numeric'
                                                                    })}
                                                                </>
                                                            ) : (
                                                                'N/A'
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="flex justify-center mb-3">
                                                    <FiFileText size={32} className="text-blue-500/80"/>
                                                </div>
                                                <p className="text-blue-500/80">No subscription history available</p>
                                            </div>
                                        )}
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
