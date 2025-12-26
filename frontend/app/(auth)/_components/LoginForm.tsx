"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";

export default function LoginForm() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    });
    const [pending, setTransition] = useTransition();

    const submit = async (values: LoginData) => {
        setTransition(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            router.push("/dashboard");
        });
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--dm-text-secondary)] ml-1" htmlFor="email">Email</label>
                <div className="relative">
                    <input
                        id="email"
                        type="email"
                        className="w-full h-12 pl-11 pr-4 bg-[var(--dm-bg-light)] border border-[var(--dm-border)] rounded-[15px] outline-none focus:border-[var(--dm-primary-blue)] focus:ring-4 focus:ring-blue-500/10 transition-all text-[var(--dm-text-main)]"
                        {...register("email")}
                        placeholder="hello@dairymart.com"
                    />
                    <div className="absolute left-4 top-3.5 text-[var(--dm-text-secondary)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                </div>
                {errors.email?.message && <p className="text-xs text-[var(--dm-error)] ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-semibold text-[var(--dm-text-secondary)]" htmlFor="password">Password</label>
                    <Link href="#" className="text-xs font-bold text-[var(--dm-primary-blue)] hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative">
                    <input
                        id="password"
                        type="password"
                        className="w-full h-12 pl-11 pr-4 bg-[var(--dm-bg-light)] border border-[var(--dm-border)] rounded-[15px] outline-none focus:border-[var(--dm-primary-blue)] focus:ring-4 focus:ring-blue-500/10 transition-all text-[var(--dm-text-main)]"
                        {...register("password")}
                        placeholder="••••••••"
                    />
                    <div className="absolute left-4 top-3.5 text-[var(--dm-text-secondary)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                </div>
                {errors.password?.message && <p className="text-xs text-[var(--dm-error)] ml-1">{errors.password.message}</p>}
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting || pending} 
                className="w-full h-12 rounded-[15px] text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all disabled:opacity-70"
                style={{ backgroundColor: "var(--dm-primary-blue)" }}
            >
                {isSubmitting || pending ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-center text-sm text-[var(--dm-text-secondary)]">
                Donot have an account? <Link href="/register" className="font-bold text-[var(--dm-primary-blue)] hover:underline">Create Account</Link>
            </div>
        </form>
    );
}