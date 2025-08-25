"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { FiCheckCircle, FiDownload, FiArrowLeft, FiLoader } from 'react-icons/fi';

interface PaymentMethodDetails {
    type: string;
    card?: { brand: string; last4: string; }
}

interface PaymentIntent {
    id: string;
    payment_method_details?: PaymentMethodDetails;
}

interface Invoice {
    id: string;
    invoice_pdf?: string;
    payment_intent?: PaymentIntent;
}

interface StripeSessionDetails {
    customer_details?: { name?: string; email?: string; };
    line_items?: {
        data: {
            description: string;
            price?: { id: string };
        }[];
    };
    amount_total?: number;
    subscription?: { id: string; };
    customer?: string;
    created: number;
    invoice?: Invoice;
}

const SuccessPage: React.FC = () => {
    const [sessionDetails, setSessionDetails] = useState<StripeSessionDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [subscriptionUpdated, setSubscriptionUpdated] = useState(false);
    const [updatingDatabase, setUpdatingDatabase] = useState(false);
    const [hasProcessed, setHasProcessed] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.user?.accessToken || hasProcessed) return;

        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        if (!sessionId) {
            setError('Missing checkout session ID.');
            setLoading(false);
            return;
        }

        // ✅ Prevent duplicate processing
        const processedKey = `checkout_processed_${sessionId}`;
        if (sessionStorage.getItem(processedKey)) {
            console.log('Checkout already processed for this session');
            setHasProcessed(true);
            setLoading(false);

            // Check if we have cached session details
            const cachedDetails = sessionStorage.getItem(`session_details_${sessionId}`);
            if (cachedDetails) {
                try {
                    setSessionDetails(JSON.parse(cachedDetails));
                    setSubscriptionUpdated(true);
                } catch (e) {
                    console.error('Error parsing cached session details:', e);
                }
            }
            return;
        }

        // ✅ Mark as processed BEFORE making API calls
        sessionStorage.setItem(processedKey, 'true');
        setHasProcessed(true);

        processCheckoutSuccess(sessionId);
    }, [session?.user?.accessToken, hasProcessed]);

    const processCheckoutSuccess = async (sessionId: string) => {
        try {
            const sessionResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/retrieve-session?session_id=${sessionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`
                    }
                }
            );

            if (!sessionResponse.ok) {
                throw new Error(`Server responded with status: ${sessionResponse.status}`);
            }

            const data = await sessionResponse.json();

            if (!data.session) {
                throw new Error('Session data missing in response.');
            }

            setSessionDetails(data.session);

            // ✅ Cache session details
            sessionStorage.setItem(`session_details_${sessionId}`, JSON.stringify(data.session));

            if (data.session.subscription && data.session.line_items?.data[0]?.price?.id) {
                await updateSubscriptionInDatabase(data.session);
            } else {
                console.warn('Missing subscription or price data, but showing success');
                setSubscriptionUpdated(true);
            }

        } catch (err: any) {
            console.error('Error processing checkout:', err);
            setError(err.message);

            // ✅ Remove processed flag on error so user can retry
            const urlParams = new URLSearchParams(window.location.search);
            const sessionId = urlParams.get('session_id');
            if (sessionId) {
                sessionStorage.removeItem(`checkout_processed_${sessionId}`);
                setHasProcessed(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateSubscriptionInDatabase = async (sessionData: StripeSessionDetails) => {
        try {
            setUpdatingDatabase(true);

            const subscriptionId = sessionData.subscription?.id;
            const customerId = sessionData.customer;
            const priceId = sessionData.line_items?.data[0]?.price?.id;

            if (!subscriptionId || !priceId) {
                console.warn('Missing subscription or price ID, skipping database update');
                setSubscriptionUpdated(true);
                return;
            }

            const updateResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/complete-checkout`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.user.accessToken}`
                    },
                    body: JSON.stringify({
                        stripeSubscriptionId: subscriptionId,
                        stripeCustomerId: customerId,
                        stripePriceId: priceId
                    })
                }
            );

            if (!updateResponse.ok) {
                const errorData = await updateResponse.json();

                // ✅ Handle "already completed" as success, not error
                if (errorData.message?.includes('already completed') ||
                    errorData.message?.includes('already exists') ||
                    errorData.error?.includes('already completed') ||
                    errorData.error?.includes('already exists')) {
                    console.log('Checkout already completed, showing success');
                    setSubscriptionUpdated(true);
                    return;
                }

                throw new Error(errorData.error || 'Failed to update subscription in database');
            }

            const result = await updateResponse.json();
            setSubscriptionUpdated(true);
            console.log('Database update successful:', result);

        } catch (error: any) {
            console.error('Error updating subscription in database:', error);

            // ✅ Don't show error for duplicate completions
            if (error.message?.includes('already completed') ||
                error.message?.includes('already exists')) {
                setSubscriptionUpdated(true);
                return;
            }

            setError(`Database update failed: ${error.message}`);
        } finally {
            setUpdatingDatabase(false);
        }
    };

    // ✅ Clean up session storage after some time
    useEffect(() => {
        const cleanup = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const sessionId = urlParams.get('session_id');
            if (sessionId) {
                // Clean up after 5 minutes
                setTimeout(() => {
                    sessionStorage.removeItem(`checkout_processed_${sessionId}`);
                    sessionStorage.removeItem(`session_details_${sessionId}`);
                }, 5 * 60 * 1000);
            }
        };

        cleanup();
        return cleanup;
    }, []);

    const renderDetailRow = (label: string, value: React.ReactNode) => (
        <div className="flex justify-between items-start py-3 border-b border-blue-200/50">
            <span className="text-gray-600 whitespace-nowrap">{label}</span>
            <div className="font-medium text-blue-900 break-words text-right ml-4">
                {value || 'N/A'}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-blue-50 text-blue-800">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p>Verifying your payment details...</p>
                {updatingDatabase && (
                    <p className="text-sm text-gray-600 mt-2">Updating your subscription...</p>
                )}
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-blue-50 p-4">
                <div className="text-center">
                    <p className="text-red-500 text-lg mb-4">{error}</p>
                    <div className="space-y-2">
                        <button
                            onClick={() => {
                                // ✅ Allow retry by clearing flags
                                const urlParams = new URLSearchParams(window.location.search);
                                const sessionId = urlParams.get('session_id');
                                if (sessionId) {
                                    sessionStorage.removeItem(`checkout_processed_${sessionId}`);
                                }
                                setHasProcessed(false);
                                setError(null);
                                setLoading(true);
                            }}
                            className="inline-block px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors mr-2"
                        >
                            Retry
                        </button>
                        <Link
                            href="/subscription"
                            className="inline-block px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors mr-2"
                        >
                            Back to Pricing
                        </Link>
                        <Link
                            href="/flow"
                            className="inline-block px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-white">
            <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg text-gray-800 overflow-hidden">
                <div className="p-8 md:p-12">
                    <div className="text-center">
                        <FiCheckCircle className="w-16 h-16 mx-auto text-green-500" />
                        <h1 className="text-3xl md:text-4xl font-bold mt-4 text-blue-900">
                            Payment Successful
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Thank you, {sessionDetails?.customer_details?.name || 'Customer'}.
                            Your subscription is now active.
                        </p>

                        {updatingDatabase && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
                                <FiLoader className="animate-spin mr-2 text-blue-600" />
                                <p className="text-blue-700 text-sm">
                                    Finalizing your subscription...
                                </p>
                            </div>
                        )}

                        {subscriptionUpdated && !updatingDatabase && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-700 text-sm flex items-center justify-center">
                                    <FiCheckCircle className="mr-2" />
                                    Your account has been updated with the new subscription plan!
                                </p>
                            </div>
                        )}
                    </div>

                    {sessionDetails && (
                        <div className="my-8 md:my-10 space-y-2 text-sm">
                            <h2 className="text-lg font-semibold text-blue-800 mb-4 pb-2 border-b border-blue-200/50">
                                Subscription Summary
                            </h2>
                            {renderDetailRow("Customer Name", sessionDetails?.customer_details?.name)}
                            {renderDetailRow("Email", sessionDetails?.customer_details?.email)}
                            {renderDetailRow("Plan", sessionDetails?.line_items?.data[0]?.description)}
                            {renderDetailRow(
                                "Amount Paid",
                                sessionDetails?.amount_total
                                    ? `$${(sessionDetails.amount_total / 100).toFixed(2)}`
                                    : 'N/A'
                            )}
                            {renderDetailRow(
                                "Payment Date",
                                sessionDetails?.created
                                    ? new Date(sessionDetails.created * 1000).toLocaleDateString()
                                    : 'N/A'
                            )}
                            {renderDetailRow("Subscription ID", sessionDetails?.subscription?.id)}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        {sessionDetails?.invoice?.invoice_pdf && (
                            <a
                                href={sessionDetails.invoice.invoice_pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                            >
                                <FiDownload className="w-5 h-5" />
                                Download Receipt
                            </a>
                        )}
                        <Link
                            href="/flow"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SuccessPage;
