"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaUserPlus, FaChevronLeft, FaEye, FaEyeSlash } from "react-icons/fa";

interface CreateUserFormData {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    role: "user" | "admin";
    profilePicture: FileList;
}

export default function CreateUserPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<CreateUserFormData>();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: CreateUserFormData) => {
        setSubmitting(true);
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("address", data.address);
        formData.append("role", data.role);
        if (data.profilePicture[0]) {
            formData.append("profilePicture", data.profilePicture[0]);
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            const result = await res.json();
            if (result.success) {
                router.push("/admin/users");
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error creating user", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500" title="Go back">
                    <FaChevronLeft />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create New User</h2>
                    <p className="text-slate-500 text-sm">Add a new user to the system.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Col */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Account Info</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input {...register("fullName", { required: true })} className="w-full bg-slate-50 border-transparent rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="e.g. John Doe" />
                                {errors.fullName && <span className="text-red-500 text-xs mt-1 block">Full Name is required</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input type="email" {...register("email", { required: true })} className="w-full bg-slate-50 border-transparent rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="john@example.com" />
                                {errors.email && <span className="text-red-500 text-xs mt-1 block">Email is required</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register("password", { required: true })}
                                        className="w-full bg-slate-50 border-transparent rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && <span className="text-red-500 text-xs mt-1 block">Password is required</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Personal Details</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <input {...register("phoneNumber", { required: true })} className="w-full bg-slate-50 border-transparent rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="+977..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                    <input {...register("address", { required: true })} className="w-full bg-slate-50 border-transparent rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="Kathmandu" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <div className="relative">
                                    <select {...register("role")} className="w-full bg-slate-50 border-transparent rounded-xl p-3 appearance-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Profile Picture</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors bg-slate-50">
                                    <input type="file" {...register("profilePicture")} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
                    <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold shadow-lg shadow-blue-500/30 transition-all">
                        <FaUserPlus />
                        {submitting ? "Creating..." : "Create User"}
                    </button>
                </div>
            </form>
        </div>
    );
}
