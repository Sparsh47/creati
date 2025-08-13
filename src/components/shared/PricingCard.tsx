import React, { useState } from 'react';
import { FaCircleCheck } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export type PricingCardProps = {
    selected: boolean;
    price: string;
    priceId: string;
    duration: 'month' | 'year';
    description: string;
    features: string[];
    onAction?: () => void;
    highlight?: boolean;
};

export default function PricingCard({
                                        selected,
                                        price,
                                        priceId,
                                        duration,
                                        description,
                                        features,
                                        onAction,
                                        highlight = false,
                                    }: PricingCardProps) {

    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscription = async () => {
        try {
            if (status === "unauthenticated") {
                toast.error("Login is required.");
                return;
            }

            setIsLoading(true);
            toast.loading("Processing plan change...");

            // **First, try direct plan change**
            const changeResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/change`,
                { targetPriceId: priceId },
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`
                    }
                }
            );

            if (changeResponse.data.status) {
                toast.dismiss();
                toast.success("Plan changed successfully!");
                if (onAction) onAction();
                // Optionally refresh the page or update state
                window.location.reload();
                return;
            }

        } catch (error: any) {
            toast.dismiss();

            // **If payment method required, redirect to checkout**
            if (error.response?.data?.error === 'PAYMENT_METHOD_REQUIRED') {
                toast.loading("Redirecting to secure payment...");

                try {
                    // Create checkout session for plan change
                    const checkoutResponse = await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/create-plan-checkout`,
                        { targetPriceId: priceId },
                        {
                            headers: {
                                Authorization: `Bearer ${session?.user.accessToken}`
                            }
                        }
                    );

                    const stripe = await stripePromise;
                    if (!stripe) {
                        toast.dismiss();
                        toast.error('Stripe failed to load');
                        return;
                    }

                    // Redirect to checkout
                    const { error } = await stripe.redirectToCheckout({
                        sessionId: checkoutResponse.data.sessionId
                    });

                    if (error) {
                        toast.dismiss();
                        toast.error(`Redirect Error: ${error.message}`);
                    }

                } catch (checkoutError: any) {
                    toast.dismiss();
                    toast.error("Failed to create payment session");
                    console.error("Checkout error:", checkoutError);
                }
            } else {
                // Handle other errors
                const errorMessage = error.response?.data?.message || "Error changing plan";
                toast.error(errorMessage);
                console.error("Plan change error:", error.response?.data);
            }
        } finally {
            setIsLoading(false);
        }
    }

    console.log("Selected Plan: ", selected, description);

    return (
        <div
            className={cn(
                'relative flex flex-col justify-between h-full rounded-2xl p-6 backdrop-blur-xl border border-white/20 ring-2 ring-blue-200/30',
                'bg-white/20',
                'shadow-lg shadow-blue-500/30',
                highlight ? 'scale-110' : '',
                'transition-transform duration-300'
            )}
        >
            {highlight && (
                <p className="absolute text-xs right-5 top-5 font-medium text-blue-500 border border-blue-500 rounded-full px-3 py-1">
                    Most Popular
                </p>
            )}

            <div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-[#0066FF]">${price}</span>
                    <span className="text-sm font-medium text-blue-400">/ {duration}</span>
                </div>
                <p className="mt-2 text-sm text-blue-500">{description}</p>
            </div>

            <button
                disabled={selected || isLoading}
                onClick={handleSubscription}
                className="cursor-pointer mt-4 w-full flex items-center justify-center py-2 rounded-lg font-semibold text-white bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 shadow-md shadow-blue-500/50 transition-transform duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? "Processing..." : (selected ? "Subscribed" : "Subscribe")}
            </button>

            <ul className="mt-6 space-y-3">
                {features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-blue-700">
                        <svg width={20} height={20}>
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: "rgb(0, 123, 255)", stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: "rgb(0, 204, 255)", stopOpacity: 1 }} />
                                </linearGradient>
                            </defs>
                            <FaCircleCheck size={20} style={{ fill: 'url(#grad1)' }} className="text-transparent" />
                        </svg>
                        <span className="text-sm">{feat}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
