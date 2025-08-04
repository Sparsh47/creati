"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiXCircle, FiArrowLeft } from 'react-icons/fi';

const CancelPage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 4000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-white">
            <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg text-gray-800 overflow-hidden text-center">
                <div className="p-8 md:p-12">
                    <FiXCircle className="w-16 h-16 mx-auto text-red-500" />

                    <h1 className="text-3xl md:text-4xl font-bold mt-4 text-blue-900">
                        Payment Cancelled
                    </h1>

                    <p className="text-gray-600 mt-3">
                        Your payment process was not completed. You have not been charged.
                    </p>
                    <p className="text-gray-500 mt-2 text-sm">
                        You will be automatically redirected to the homepage shortly.
                    </p>

                    <div className="mt-8">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold transition-colors"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                            Return to Homepage Now
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CancelPage;
