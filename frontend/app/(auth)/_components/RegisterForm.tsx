"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RegisterData, registerSchema } from "../schema";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
    });
    const [pending, setTransition] = useTransition();

    const submit = async (values: RegisterData) => {
        setTransition(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            router.push("/login");
        });
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-5">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--dm-text-secondary)] ml-1">Full Name</label>
                <div className="relative">
                    <input
                        type="text"
                        className="w-full h-12 pl-11 pr-4 bg-[var(--dm-bg-light)] border border-[var(--dm-border)] rounded-[15px] outline-none focus:border-[var(--dm-primary-blue)] focus:ring-4 focus:ring-blue-500/10 transition-all text-[var(--dm-text-main)]"
                        {...register("name")}
                        placeholder="John Doe"
                    />
                    <div className="absolute left-4 top-3.5 text-[var(--dm-text-secondary)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                </div>
                {errors.name?.message && <p className="text-xs text-[var(--dm-error)] ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--dm-text-secondary)] ml-1">Email</label>
                <div className="relative">
                    <input
                        type="email"
                        className="w-full h-12 pl-11 pr-4 bg-[var(--dm-bg-light)] border border-[var(--dm-border)] rounded-[15px] outline-none focus:border-[var(--dm-primary-blue)] focus:ring-4 focus:ring-blue-500/10 transition-all text-[var(--dm-text-main)]"
                        {...register("email")}
                        placeholder="you@example.com"
                    />
                    <div className="absolute left-4 top-3.5 text-[var(--dm-text-secondary)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                </div>
                {errors.email?.message && <p className="text-xs text-[var(--dm-error)] ml-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--dm-text-secondary)] ml-1">Password</label>
                    <input
                        type="password"
                        className="w-full h-12 px-4 bg-[var(--dm-bg-light)] border border-[var(--dm-border)] rounded-[15px] outline-none focus:border-[var(--dm-primary-blue)] focus:ring-4 focus:ring-blue-500/10 transition-all text-[var(--dm-text-main)]"
                        {...register("password")}
                        placeholder="••••••"
                    />
                    {errors.password?.message && <p className="text-xs text-[var(--dm-error)] ml-1">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--dm-text-secondary)] ml-1">Confirm</label>
                    <input
                        type="password"
                        className="w-full h-12 px-4 bg-[var(--dm-bg-light)] border border-[var(--dm-border)] rounded-[15px] outline-none focus:border-[var(--dm-primary-blue)] focus:ring-4 focus:ring-blue-500/10 transition-all text-[var(--dm-text-main)]"
                        {...register("confirmPassword")}
                        placeholder="••••••"
                    />
                    {errors.confirmPassword?.message && <p className="text-xs text-[var(--dm-error)] ml-1">{errors.confirmPassword.message}</p>}
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting || pending} 
                className="w-full h-12 rounded-[15px] text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all disabled:opacity-70 mt-2"
                style={{ backgroundColor: "var(--dm-primary-blue)" }}
            >
                {isSubmitting || pending ? "Creating Account..." : "Sign Up"}
            </button>

            <div className="text-center text-sm text-[var(--dm-text-secondary)]">
                Already have an account? <Link href="/login" className="font-bold text-[var(--dm-primary-blue)] hover:underline">Log in</Link>
            </div>
        </form>
    );
}