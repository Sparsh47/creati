'use client';

import SectionHeader from "@/components/shared/SectionHeader";
import ToggleButton from "@/components/shared/ToggleButton";
import {useEffect, useState} from "react";
import PricingCard from "@/components/shared/PricingCard";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "react-hot-toast";

export type Plan = {
    id: string;
    title: string;
    price: {
        priceId: {
            monthly: string;
            yearly: string;
        };
        monthly: string;
        yearly: string;
    };
    description: string;
    features: string[];
    highlight?: boolean;
};

export const pricingPlans: Plan[] = [
    // {
    //     id: 'FREE',
    //     title: 'Starter',
    //     price: {
    //         priceId: {
    //             monthly: "price_1Rv04OSsg21IEsaK7P0UvyZV",
    //             yearly: "price_1Rv04OSsg21IEsaK7P0UvyZV"
    //         },
    //         monthly: '0',
    //         yearly: '0'
    //     },
    //     description: 'Free Plan',
    //     features: [
    //         '3 private designs',
    //         '2-user collaboration',
    //         'Auto-save & versions',
    //         'Basic templates',
    //         '5 exports/mo',
    //         'Mobile-responsive UI',
    //     ],
    // },
    {
        id: 'PLUS',
        title: 'Plus',
        price: {
            priceId: {
                monthly: "price_1Rs5IOSsg21IEsaKPQhRl4aX",
                yearly: "price_1Rs5QcSsg21IEsaKymrRCdNw"
            },
            monthly: '20',
            yearly: '200'
        },
        description: 'Plus Plan',
        highlight: true,
        features: [
            'Everything in Starter',
            '20 private designs',
            '5-user collaboration',
            '10 versions/design',
            'Full templates',
            'Unlimited exports',
        ],
    },
    {
        id: 'PRO_PLUS',
        title: 'Pro Plus',
        price: {
            priceId: {
                monthly: "price_1Rs5OqSsg21IEsaKMvE6F6dZ",
                yearly: "price_1Rs5RCSsg21IEsaKpbAWq3Du"
            },
            monthly: '80',
            yearly: '800'
        },
        description: 'Pro Plus Plan',
        features: [
            'Everything in Plus',
            'Unlimited private designs',
            'Unlimited users',
            'Unlimited versions',
            'Premium templates',
            'All-format exports',
        ],
    },
];

export default function SubscriptionSection() {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
    const {data: session, status} = useSession();
    const router = useRouter();
    const [planName, setPlanName] = useState("");

    useEffect(() => {
        (async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/current-plan`, {
                headers: {
                    Authorization: `Bearer ${session?.user.accessToken}`
                }
            });

            if(response.data.status) {
                const plan = response.data.data.currentPlan
                if(plan === "FREE") {
                    setPlanName("FREE");
                } else if(plan === "PLUS") {
                    setPlanName("PLUS")
                } else {
                    setPlanName("PRO_PLUS")
                }
            } else {
                toast.error("Failed to get user plan details");
            }
        })();
    }, [session, status, router]);

    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center">
            <SectionHeader
                title="Choose Your Perfect Plan"
                description="Unlock the power of AI-driven design generation with plans tailored for everyone, from startups to enterprises."
            />
            <div className="w-full max-w-5xl p-5 flex flex-col items-center justify-center gap-14">
                <ToggleButton onToggle={setBillingPeriod} />
                <div className="w-[70%] grid grid-cols-1 sm:grid-cols-2 auto-rows-fr gap-8">
                    {pricingPlans.map((plan) => {
                        const displayPrice =
                            billingPeriod === 'monthly' ? plan.price.monthly : plan.price.yearly;
                        const displayDuration = billingPeriod === 'monthly' ? 'month' : 'year';
                        const pricingId = billingPeriod === 'monthly' ? plan.price.priceId.monthly : plan.price.priceId.yearly

                        return (
                            <PricingCard
                                key={plan.id}
                                selected={plan.id === planName}
                                priceId={pricingId}
                                price={displayPrice}
                                duration={displayDuration}
                                description={plan.description}
                                features={plan.features}
                                highlight={plan.highlight}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};