"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { verifyOTP } from "@/lib/api/auth";
import Image from "next/image";

interface VerifyOTPData {
    otp: string;
}

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<VerifyOTPData>();

    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (!email) {
            router.push("/forgot-password");
        }
    }, [email, router]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0 && !canResend) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer, canResend]);

    const handleResend = async () => {
        if (!canResend || !email) return;
        setIsLoading(true);
        setError("");
        try {
            // Re-use forgotPassword API as it sends a new OTP
            const { forgotPassword } = await import("@/lib/api/auth");
            const result = await forgotPassword(email);
            if (result.success) {
                setTimer(30);
                setCanResend(false);
                alert("OTP Resent successfully!");
            } else {
                setError(result.message || "Failed to resend OTP");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const submit = async (values: VerifyOTPData) => {
        if (!email) return;
        setError("");
        setIsLoading(true);
        try {
            const result = await verifyOTP(email, values.otp);
            if (result.success) {
                // Redirect to Reset Password page with email and otp
                router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(values.otp)}`);
            } else {
                setError(result.message || "Invalid OTP");
            }
        } catch (err: Error | any) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!email) return null;

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex justify-center">
                        <Image src="/logo.png" alt="DairyMart Logo" width={80} height={80} className="object-contain" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Verify OTP</h2>
                    <p className="text-slate-500 text-sm mt-2">Enter the 6-digit code sent to <br /><span className="font-semibold text-slate-700">{email}</span></p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(submit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">OTP Code</label>
                        <input
                            {...register("otp", {
                                required: "OTP is required",
                                minLength: { value: 6, message: "OTP must be 6 digits" },
                                maxLength: { value: 6, message: "OTP must be 6 digits" }
                            })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-center tracking-[0.5em] font-mono text-lg"
                            placeholder="XXXXXX"
                        />
                        {errors.otp?.message && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
                    </div>

                    <div className="text-center text-sm text-slate-500">
                        {canResend ? (
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-blue-600 font-bold hover:underline disabled:opacity-50"
                                disabled={isLoading}
                            >
                                Resend Code
                            </button>
                        ) : (
                            <p>Resend code in <span className="font-mono font-bold text-slate-700">{timer}s</span></p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                        {isLoading ? "Verifying..." : "Verify Code"}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <button onClick={() => router.back()} className="text-slate-500 hover:text-blue-600 font-medium transition-colors">
                        ← Back to Email
                    </button>
                </div>
            </div>
        </div>
    );
}
