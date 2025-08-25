'use client';

import SectionHeader from "@/components/shared/SectionHeader";
import { FaMoneyCheck } from "react-icons/fa";
import ToggleButton from "@/components/shared/ToggleButton";
import { useState } from "react";
import PricingCard from "@/components/shared/PricingCard";

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
    duration: 'month' | 'year';
    description: string;
    features: string[];
    highlight?: boolean;
};

export const pricingPlans: Plan[] = [
    // {
    //     id: 'starter',
    //     title: 'Starter',
    //     price: {
    //         priceId: {
    //             monthly: "price_1RsK2JSsg21IEsaK7V0VcxZX",
    //             yearly: "price_1RsK2tSsg21IEsaK5e0JJOZJ"
    //         },
    //         monthly: '0',
    //         yearly: '0'
    //     },
    //     duration: 'month',
    //     description: 'Free Plan',
    //     features: [
    //         '3 architecture designs',
    //         '2-user collaboration',
    //         'Auto-save & versions',
    //         'Basic templates',
    //         '5 exports/mo',
    //         'Mobile-responsive UI',
    //     ],
    // },
    {
        id: 'professional',
        title: 'Professional',
        price: {
            priceId: {
                monthly: "price_1Rs5IOSsg21IEsaKPQhRl4aX",
                yearly: "price_1Rs5QcSsg21IEsaKymrRCdNw"
            },
            monthly: '20',
            yearly: '200'
        },
        duration: 'month',
        description: 'Premium Plan',
        highlight: true,
        features: [
            'Everything in Starter',
            '20 architecture designs',
            '5-user collaboration',
            '10 versions/design',
            'Full templates',
            'Unlimited exports',
        ],
    },
    {
        id: 'enterprise',
        title: 'Enterprise Plus',
        price: {
            priceId: {
                monthly: "price_1Rs5OqSsg21IEsaKMvE6F6dZ",
                yearly: "price_1Rs5RCSsg21IEsaKpbAWq3Du"
            },
            monthly: '80',
            yearly: '800'
        },
        duration: 'month',
        description: 'Enterprise Plan',
        features: [
            'Everything in Plus',
            'Unlimited architecture designs',
            'Unlimited users',
            'Unlimited versions',
            'Premium templates',
            'All-format exports',
        ],
    },
];


export default function Pricing() {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center gap-10 py-28">
            <SectionHeader
                Icon={FaMoneyCheck}
                title="Pricing that fits your vision"
                section="pricing"
                description="Unlock the power of AI-driven design generation with plans tailored for everyone, from startups to enterprises."
            />

            <div className="w-full max-w-5xl p-5 flex flex-col items-center justify-center gap-14">
                <ToggleButton onToggle={setBillingPeriod} />

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-8">
                    {pricingPlans.map((plan) => {
                        const displayPrice =
                            billingPeriod === 'monthly' ? plan.price.monthly : plan.price.yearly;
                        const displayDuration = billingPeriod === 'monthly' ? 'month' : 'year';
                        const pricingId = billingPeriod === 'monthly' ? plan.price.priceId.monthly : plan.price.priceId.yearly

                        return (
                            <PricingCard
                                key={plan.id}
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