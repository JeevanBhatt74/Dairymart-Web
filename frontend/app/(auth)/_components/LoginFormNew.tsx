"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { LoginData, loginSchema } from "../schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "@/lib/api/auth";

export default function LoginFormNew() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    });

    const submit = async (values: LoginData) => {
        setError("");
        setIsLoading(true);
        try {
            const result = await loginUser(values);
            if (result.success) {
                localStorage.setItem("token", result.token);
                localStorage.setItem("userId", result.data._id);
                localStorage.setItem("role", result.data.role);

                if (result.data.role === 'admin') {
                    router.push("/admin");
                } else {
                    router.push("/");
                }
            } else {
                setError(result.message || "Login failed");
            }
        } catch (err: Error | unknown) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred during login";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[var(--dm-text-main)]">Welcome Back</h2>
                <p className="mt-1 text-sm text-[var(--dm-text-secondary)]">Sign in to manage your orders</p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-5 p-4 rounded-[12px] bg-red-50 border border-red-200 flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(submit)} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--dm-text-secondary)] ml-1">Email</label>
                    <div className="relative">
                        <input
                            type="email"
                            className={`w-full h-12 pl-11 pr-4 bg-[var(--dm-bg-light)] border rounded-[15px] outline-none transition-all text-[var(--dm-text-main)] ${errors.email ? 'border-red-500 focus:ring-red-500/10' : 'border-[var(--dm-border)] focus:border-[var(--dm-primary-blue)] focus:ring-blue-500/10'
                                } focus:ring-4`}
                            {...register("email")}
                            placeholder="user@dairymart.com"
                        />
                        <div className="absolute left-4 top-3.5 text-[var(--dm-text-secondary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                        </div>
                    </div>
                    {errors.email?.message && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><span>⚠</span> {errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--dm-text-secondary)] ml-1">Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            className={`w-full h-14 pl-11 pr-4 bg-[var(--dm-bg-light)] border rounded-[15px] outline-none transition-all text-[var(--dm-text-main)] ${errors.password ? 'border-red-500 focus:ring-red-500/10' : 'border-[var(--dm-border)] focus:border-[var(--dm-primary-blue)] focus:ring-blue-500/10'
                                } focus:ring-4`}
                            {...register("password")}
                            placeholder="••••••"
                        />
                        <div className="absolute left-4 top-3.5 text-[var(--dm-text-secondary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="3" height="8" x="1" y="2" /><path d="M4 18c0 .268.132.52.36.678.228.158.552.232.848.232h7.584c.296 0 .62-.074.848-.232.228-.159.36-.41.36-.678V5.344" /><path d="M4 18c0 .268.132.52.36.678.228.158.552.232.848.232h7.584c.296 0 .62-.074.848-.232.228-.159.36-.41.36-.678V5.344" /></svg>
                        </div>
                    </div>
                    {errors.password?.message && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><span>⚠</span> {errors.password.message}</p>}
                    <div className="text-right">
                        <Link href="#" className="text-xs font-bold text-[var(--dm-primary-blue)] hover:underline">Forgot Password?</Link>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-[15px] text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2 outline-none border-none ring-0 focus:ring-0"
                    style={{ backgroundColor: "var(--dm-primary-blue)" }}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing In...
                        </>
                    ) : (
                        "Sign In"
                    )}
                </button>
            </form>

            <p className="text-center text-sm text-[var(--dm-text-secondary)] mt-8">
                Don&apos;t have an account? <Link href="/register" className="font-bold text-[var(--dm-primary-blue)] hover:underline transition-colors">Sign up</Link>
            </p>
        </div>
    );
}
