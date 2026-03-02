"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { EmailIcon, LockIcon } from "@/app/_components/Icons";

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
                <label className="text-sm font-semibold text-[--dm-text-secondary] ml-1" htmlFor="email">Email</label>
                <div className="relative">
                    <input
                        id="email"
                        type="email"
                        className="w-full h-12 pl-11 pr-4 bg-[--dm-bg-light] border border-[--dm-border] rounded-[15px] outline-none focus:border-[--dm-primary-blue] focus:ring-4 focus:ring-blue-500/10 transition-all text-[--dm-text-main]"
                        {...register("email")}
                        placeholder="hello@dairymart.com"
                    />
                    <div className="absolute left-4 top-3.5 text-[--dm-text-secondary]">
                        <EmailIcon />
                    </div>
                </div>
                {errors.email?.message && <p className="text-xs text-[--dm-error] ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-semibold text-[--dm-text-secondary]" htmlFor="password">Password</label>
                    <Link href="#" className="text-xs font-bold text-[--dm-primary-blue] hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative">
                    <input
                        id="password"
                        type="password"
                        className="w-full h-12 pl-11 pr-4 bg-[--dm-bg-light] border border-[--dm-border] rounded-[15px] outline-none focus:border-[--dm-primary-blue] focus:ring-4 focus:ring-blue-500/10 transition-all text-[--dm-text-main]"
                        {...register("password")}
                        placeholder="••••••••"
                    />
                    <div className="absolute left-4 top-3.5 text-[--dm-text-secondary]">
                        <LockIcon />
                    </div>
                </div>
                {errors.password?.message && <p className="text-xs text-[--dm-error] ml-1">{errors.password.message}</p>}
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting || pending} 
                className="w-full h-12 rounded-[15px] text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all disabled:opacity-70 bg-[--dm-primary-blue]"
            >
                {isSubmitting || pending ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-center text-sm text-[--dm-text-secondary]">
                Donot have an account? <Link href="/register" className="font-bold text-[--dm-primary-blue] hover:underline">Create Account</Link>
            </div>
        </form>
    );
}
