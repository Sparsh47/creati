"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { FiCheckCircle, FiDownload, FiArrowLeft } from 'react-icons/fi';

interface PaymentMethodDetails {
    type: string;
    card?: { brand: string; last4: string; }
}
interface PaymentIntent {
    id: string;
    payment_method_details?: PaymentMethodDetails;
}
interface Invoice {
    id:string;
    invoice_pdf?: string;
    payment_intent?: PaymentIntent;
}
interface StripeSessionDetails {
    customer_details?: { name?: string; email?: string; };
    line_items?: { data: { description: string; }[]; };
    amount_total?: number;
    subscription?: { id: string; };
    created: number;
    invoice?: Invoice;
}

const SuccessPage: React.FC = () => {
    const [sessionDetails, setSessionDetails] = useState<StripeSessionDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        if (!session) return;
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        if (!sessionId) {
            setError('Missing checkout session ID.');
            setLoading(false);
            return;
        }
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/retrieve-session?session_id=${sessionId}`, {
            headers: { Authorization: `Bearer ${session?.user.accessToken}` }
        })
            .then(res => res.ok ? res.json() : Promise.reject(new Error(`Server responded with status: ${res.status}`)))
            .then(data => {
                if (!data.session) throw new Error('Session data missing in response.');
                setSessionDetails(data.session);
                console.log("Payment Intent: ", data.paymentIntent);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [session]);

    const renderDetailRow = (label: string, value: React.ReactNode) => (
        <div className="flex justify-between items-start py-3 border-b border-blue-200/50">
            <span className="text-gray-600 whitespace-nowrap">{label}</span>
            <div className="font-medium text-blue-900 break-words text-right ml-4">{value || 'N/A'}</div>
        </div>
    );

    if (loading) {
        return <div className="min-h-screen w-full flex items-center justify-center bg-blue-50 text-blue-800"><p>Verifying your payment details...</p></div>;
    }

    if (error) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-blue-50 p-4">
                <p className="text-red-500 text-lg text-center">{error}</p>
                <Link href="/" className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Go to Homepage</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-white">
            <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg text-gray-800 overflow-hidden">
                <div className="p-8 md:p-12">
                    <div className="text-center">
                        <FiCheckCircle className="w-16 h-16 mx-auto text-blue-500" />
                        <h1 className="text-3xl md:text-4xl font-bold mt-4 text-blue-900">Payment Successful</h1>
                        <p className="text-gray-600 mt-2">
                            Thank you, {sessionDetails?.customer_details?.name || 'Customer'}. Your subscription is active.
                        </p>
                    </div>

                    <div className="my-8 md:my-10 space-y-2 text-sm">
                        <h2 className="text-lg font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200/50">Subscription Summary</h2>
                        {renderDetailRow("Customer Name", sessionDetails?.customer_details?.name)}
                        {renderDetailRow("Email", sessionDetails?.customer_details?.email)}
                        {renderDetailRow("Plan", sessionDetails?.line_items?.data[0]?.description)}
                        {renderDetailRow("Amount Paid", sessionDetails?.amount_total ? `$${(sessionDetails.amount_total / 100).toFixed(2)}` : 'N/A')}
                        {renderDetailRow("Payment Date", sessionDetails?.created ? new Date(sessionDetails.created * 1000).toLocaleDateString() : 'N/A')}
                        {renderDetailRow("Subscription ID", sessionDetails?.subscription?.id)}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        {sessionDetails?.invoice?.invoice_pdf && (
                            <a href={sessionDetails.invoice.invoice_pdf} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors">
                                <FiDownload className="w-5 h-5" />
                                Download Receipt
                            </a>
                        )}
                        <Link href="/" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold transition-colors">
                            <FiArrowLeft className="w-5 h-5" />
                            Go Back
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SuccessPage;