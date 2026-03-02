"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { resetPassword } from "@/lib/api/auth";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface ResetPasswordData {
    password: string;
    confirmPassword: string;
}

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const otp = searchParams.get("otp");

    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordData>();

    useEffect(() => {
        if (!email || !otp) {
            router.push("/forgot-password");
        }
    }, [email, otp, router]);

    const submit = async (values: ResetPasswordData) => {
        if (!email || !otp) return;
        if (values.password !== values.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        setIsLoading(true);
        try {
            const result = await resetPassword({ email, otp, newPassword: values.password });
            if (result.success) {
                alert("Password reset successfully! Please login with your new password.");
                router.push("/login");
            } else {
                setError(result.message || "Failed to reset password");
            }
        } catch (err: Error | any) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!email || !otp) return null;

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex justify-center">
                        <Image src="/logo.png" alt="DairyMart Logo" width={80} height={80} className="object-contain" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Reset Password</h2>
                    <p className="text-slate-500 text-sm mt-2">Create a new strong password for your account.</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(submit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                                })}
                                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password?.message && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword", {
                                    required: "Confirm Password is required",
                                    validate: (val) => {
                                        if (watch('password') != val) {
                                            return "Your passwords do no match";
                                        }
                                    },
                                })}
                                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.confirmPassword?.message && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
