"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { FaSave, FaChevronLeft, FaEye, FaEyeSlash } from "react-icons/fa";

export default function EditUserPage() {
    const params = useParams();
    const router = useRouter();
    const { register, handleSubmit, setValue } = useForm();
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${API_URL}/admin/users/${params.id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    const u = data.data;
                    setValue("fullName", u.fullName);
                    setValue("email", u.email);
                    setValue("phoneNumber", u.phoneNumber);
                    setValue("address", u.address);
                    setValue("role", u.role);
                }
            } catch (error) {
                console.error("Fetch error", error);
            }
        };
        fetchUser();
    }, [params.id, setValue]);

    const onSubmit = async (data: any) => {
        setSubmitting(true);
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("address", data.address);
        formData.append("role", data.role);

        if (data.password) {
            formData.append("password", data.password);
        }
        if (data.profilePicture && data.profilePicture[0]) {
            formData.append("profilePicture", data.profilePicture[0]);
        }

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/admin/users/${params.id}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });
            const result = await res.json();
            if (result.success) {
                router.push("/admin/users");
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Update error", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <FaChevronLeft />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Edit User</h2>
                    <p className="text-slate-500 text-sm">Update user details and permissions.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Account Info</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input {...register("fullName")} className="w-full bg-slate-50 border-transparent rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input type="email" {...register("email")} className="w-full bg-slate-50 border-transparent rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">New Password (Optional)</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register("password")}
                                        className="w-full bg-slate-50 border-transparent rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none pr-10"
                                        placeholder="Leave blank to keep current"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Personal Details</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <input {...register("phoneNumber")} className="w-full bg-slate-50 border-transparent rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                    <input {...register("address")} className="w-full bg-slate-50 border-transparent rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
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
                        <FaSave />
                        {submitting ? "Savings..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
