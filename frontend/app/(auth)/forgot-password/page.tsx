"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { forgotPassword } from "@/lib/api/auth";
import Image from "next/image";

interface ForgotPasswordData {
    email: string;
}

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordData>();

    const submit = async (values: ForgotPasswordData) => {
        setError("");
        setIsLoading(true);
        try {
            const result = await forgotPassword(values.email);
            if (result.success) {
                // Redirect to OTP page with email as query param
                router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
            } else {
                setError(result.message || "Failed to send OTP");
            }
        } catch (err: Error | any) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex justify-center">
                        <Image src="/logo.png" alt="DairyMart Logo" width={80} height={80} className="object-contain" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Forgot Password?</h2>
                    <p className="text-slate-500 text-sm mt-2">Enter your email address and we'll send you a code to reset your password.</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(submit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            placeholder="user@example.com"
                        />
                        {errors.email?.message && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                        {isLoading ? "Sending..." : "Send OTP"}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <Link href="/login" className="text-slate-500 hover:text-blue-600 font-medium transition-colors">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
