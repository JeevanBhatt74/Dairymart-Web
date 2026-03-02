"use client";

import { useRouter } from "next/navigation";
import { FaTimesCircle } from "react-icons/fa";

export default function PaymentFailurePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 animate-shake">
                <FaTimesCircle size={48} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-500 max-w-md mb-8">
                We couldn't process your payment. Please try again or choose a different payment method.
            </p>
            <div className="flex gap-4">
                <button onClick={() => router.push("/checkout")} className="px-6 py-3 bg-[var(--dm-primary-blue)] text-white rounded-xl font-bold hover:bg-blue-600 transition-colors">
                    Try Again
                </button>
                <button onClick={() => router.push("/")} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                    Go Home
                </button>
            </div>
        </div>
    );
}
