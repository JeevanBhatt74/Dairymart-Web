"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-24 h-24 bg-green-100 text-green-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <FaCheckCircle size={48} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-500 max-w-md mb-8">
                Your payment has been processed and your order {orderId ? `#${orderId.slice(-6)}` : ""} has been confirmed.
            </p>
            <div className="flex gap-4">
                <button onClick={() => router.push("/orders")} className="px-6 py-3 bg-[var(--dm-primary-blue)] text-white rounded-xl font-bold hover:bg-blue-600 transition-colors">
                    View Orders
                </button>
                <button onClick={() => router.push("/")} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
