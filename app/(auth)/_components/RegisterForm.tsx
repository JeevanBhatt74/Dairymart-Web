"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RegisterData, registerSchema } from "../schema";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api/auth";
import { useToast } from "@/app/_context/ToastContext";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterForm() {
    const router = useRouter();
    const toast = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
    });

    // Parse user-friendly error messages from backend errors
    const parseErrorMessage = (errorMessage: string): string => {
        // Handle MongoDB duplicate key errors
        if (errorMessage.includes("E11000") || errorMessage.includes("duplicate key")) {
            if (errorMessage.includes("phoneNumber")) {
                return "This phone number is already registered. Please use a different number or try logging in.";
            }
            if (errorMessage.includes("email")) {
                return "This email is already registered. Please use a different email or try logging in.";
            }
            return "This account already exists. Please try logging in instead.";
        }
        // Return original message if no pattern matches
        return errorMessage;
    };

    const submit = async (values: RegisterData) => {
        try {
            const result = await registerUser(values);
            if (result.success) {
                toast.success("Registration successful! Redirecting to login...");
                setTimeout(() => router.push("/login"), 1500);
            } else {
                const friendlyMessage = parseErrorMessage(result.message || "Registration failed");
                toast.error(friendlyMessage);
            }
        } catch (err: any) {
            const friendlyMessage = parseErrorMessage(err.message || "An error occurred during registration");
            toast.error(friendlyMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--dm-text-secondary)] ml-1">Full Name</label>
                    <div className="relative">
                        <input
                            type="text"
                            className={`w-full h-14 pl-11 pr-4 bg-[var(--dm-bg-light)] border rounded-[15px] outline-none transition-all text-[var(--dm-text-main)] ${errors.fullName ? 'border-red-500 focus:ring-red-500/10' : 'border-[var(--dm-border)] focus:border-[var(--dm-primary-blue)] focus:ring-blue-500/10'
                                } focus:ring-4`}
                            {...register("fullName")}
                            placeholder="John Doe"
                        />
                        <div className="absolute left-4 top-4 text-[var(--dm-text-secondary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </div>
                    </div>
                    {errors.fullName?.message && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><span>⚠</span> {errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--dm-text-secondary)] ml-1">Email</label>
                    <div className="relative">
                        <input
                            type="email"
                            className={`w-full h-14 pl-11 pr-4 bg-[var(--dm-bg-light)] border rounded-[15px] outline-none transition-all text-[var(--dm-text-main)] ${errors.email ? 'border-red-500 focus:ring-red-500/10' : 'border-[var(--dm-border)] focus:border-[var(--dm-primary-blue)] focus:ring-blue-500/10'
                                } focus:ring-4`}
                            {...register("email")}
                            placeholder="you@example.com"
                        />
                        <div className="absolute left-4 top-4 text-[var(--dm-text-secondary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                        </div>
                    </div>
                    {errors.email?.message && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><span>⚠</span> {errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--dm-text-secondary)] ml-1">Phone Number</label>
                    <div className="relative">
                        <input
                            type="text"
                            className={`w-full h-14 pl-11 pr-4 bg-[var(--dm-bg-light)] border rounded-[15px] outline-none transition-all text-[var(--dm-text-main)] ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500/10' : 'border-[var(--dm-border)] focus:border-[var(--dm-primary-blue)] focus:ring-blue-500/10'
                                } focus:ring-4`}
                            {...register("phoneNumber")}
                            placeholder="1234567890"
                        />
                        <div className="absolute left-4 top-4 text-[var(--dm-text-secondary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .57 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.57A2 2 0 0 1 22 16.92z" /></svg>
                        </div>
                    </div>
                    {errors.phoneNumber?.message && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><span>⚠</span> {errors.phoneNumber.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--dm-text-secondary)] ml-1">Address</label>
                    <div className="relative">
                        <input
                            type="text"
                            className={`w-full h-14 pl-11 pr-4 bg-[var(--dm-bg-light)] border rounded-[15px] outline-none transition-all text-[var(--dm-text-main)] ${errors.address ? 'border-red-500 focus:ring-red-500/10' : 'border-[var(--dm-border)] focus:border-[var(--dm-primary-blue)] focus:ring-blue-500/10'
                                } focus:ring-4`}
                            {...register("address")}
                            placeholder="123 Main St"
                        />
                        <div className="absolute left-4 top-4 text-[var(--dm-text-secondary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        </div>
                    </div>
                    {errors.address?.message && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><span>⚠</span> {errors.address.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--dm-text-secondary)] ml-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className={`w-full h-14 pl-4 pr-12 bg-[var(--dm-bg-light)] border rounded-[15px] outline-none transition-all text-[var(--dm-text-main)] ${errors.password ? 'border-red-500 focus:ring-red-500/10' : 'border-[var(--dm-border)] focus:border-[var(--dm-primary-blue)] focus:ring-blue-500/10'
                                } focus:ring-4`}
                            {...register("password")}
                            placeholder="••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-4 text-[var(--dm-text-secondary)] hover:text-[var(--dm-primary-blue)] transition-colors focus:outline-none"
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                    {errors.password?.message && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><span>⚠</span> {errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--dm-text-secondary)] ml-1">Confirm</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className={`w-full h-14 pl-4 pr-12 bg-[var(--dm-bg-light)] border rounded-[15px] outline-none transition-all text-[var(--dm-text-main)] ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500/10' : 'border-[var(--dm-border)] focus:border-[var(--dm-primary-blue)] focus:ring-blue-500/10'
                                } focus:ring-4`}
                            {...register("confirmPassword")}
                            placeholder="••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-4 text-[var(--dm-text-secondary)] hover:text-[var(--dm-primary-blue)] transition-colors focus:outline-none"
                        >
                            {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                    {errors.confirmPassword?.message && <p className="text-xs text-red-500 ml-1 flex items-center gap-1"><span>⚠</span> {errors.confirmPassword.message}</p>}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-[15px] text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2 outline-none border-none ring-0 focus:ring-0"
                style={{ backgroundColor: "var(--dm-primary-blue)" }}
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                    </>
                ) : (
                    "Sign Up"
                )}
            </button>

            <div className="text-center text-sm text-[var(--dm-text-secondary)]">
                Already have an account? <Link href="/login" className="font-bold text-[var(--dm-primary-blue)] hover:underline transition-colors">Log in</Link>
            </div>
        </form >
    );
}
