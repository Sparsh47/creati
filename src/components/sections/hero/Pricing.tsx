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
        monthly: string;
        yearly: string;
    };
    duration: 'month' | 'year';
    description: string;
    features: string[];
    highlight?: boolean;
};

export const pricingPlans: Plan[] = [
    {
        id: 'starter',
        title: 'Starter',
        price: {
            monthly: '0',
            yearly: '0'
        },
        duration: 'month',
        description: 'Free Plan',
        features: [
            '3 private designs',
            '2-user collaboration',
            'Auto-save & versions',
            'Basic templates',
            '5 exports/mo',
            'Mobile-responsive UI',
        ],
    },
    {
        id: 'professional',
        title: 'Professional',
        price: {
            monthly: '29',
            yearly: '299'
        },
        duration: 'month',
        description: 'Premium Plan',
        highlight: true,
        features: [
            'Everything in Starter',
            '5-user collaboration',
            '10 versions/design',
            'Full templates',
            'Unlimited exports',
            'Mobile-responsive UI',
        ],
    },
    {
        id: 'enterprise',
        title: 'Enterprise Plus',
        price: {
            monthly: '99',
            yearly: '999'
        },
        duration: 'month',
        description: 'Enterprise Plan',
        features: [
            'Everything in Professional',
            'Unlimited users',
            'Unlimited versions',
            'Premium templates',
            'All-format exports',
            'Mobile-responsive UI',
        ],
    },
];


export default function Pricing() {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center gap-10 relative py-40">
            <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-blue-500/20 to-transparent" />

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

                        return (
                            <PricingCard
                                key={plan.id}
                                price={displayPrice}
                                duration={displayDuration}
                                description={plan.description}
                                features={plan.features}
                                highlight={plan.highlight}
                                onAction={() =>
                                    console.log(`${plan.title} (${billingPeriod}) plan selected`)
                                }
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};