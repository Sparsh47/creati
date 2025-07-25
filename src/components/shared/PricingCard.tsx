import React from 'react';
import { FaCircleCheck } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import Link from "next/link";

export type PricingCardProps = {
    price: string;
    duration: 'month' | 'year';
    description: string;
    features: string[];
    onAction?: () => void;
    highlight?: boolean;
};

export default function PricingCard({
                                        price,
                                        duration,
                                        description,
                                        features,
                                        onAction,
                                        highlight = false,
                                    }: PricingCardProps) {
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
            {highlight && <p className="absolute text-xs right-5 top-5 font-medium text-blue-500 border border-blue-500 rounded-full px-3 py-1">Most Popular</p>}
            <div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-[#0066FF]">${price}</span>
                    <span className="text-sm font-medium text-blue-400">/ {duration}</span>
                </div>
                <p className="mt-2 text-sm text-blue-500">{description}</p>
            </div>

            <Link href={{
                pathname: '/signin',
                query: 'type=signin&plan=PLAN_ID'
            }}
                className="cursor-pointer mt-4 w-full flex items-center justify-center py-2 rounded-lg font-semibold text-white bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 shadow-md shadow-blue-500/50 transition-transform duration-200 hover:scale-[1.02]"
            >
                Subscribe
            </Link>

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