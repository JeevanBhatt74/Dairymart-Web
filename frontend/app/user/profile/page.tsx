"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import AuthGuard from "@/app/_components/AuthGuard";
import { FaSave, FaUserCircle, FaSignOutAlt, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

export default function UserProfilePage() {
    const { register, handleSubmit, setValue } = useForm();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

    const [loyalty, setLoyalty] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");

            if (!userId) return;

            try {
                // Fetch User Profile
                const res = await fetch(`${API_URL}/v1/users/${userId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    const u = data.data;
                    setValue("fullName", u.fullName);
                    setValue("email", u.email);
                    setValue("phoneNumber", u.phoneNumber);
                    setValue("address", u.address);
                    setProfilePic(u.profilePicture);
                }

                // Fetch Loyalty Points
                const loyaltyRes = await fetch(`${API_URL.replace('/v1', '')}/loyalty/points`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const loyaltyData = await loyaltyRes.json();
                console.log("Loyalty Data Fetch:", loyaltyData);
                if (loyaltyData.success) {
                    setLoyalty(loyaltyData.data);
                }
            } catch (error) {
                console.error("Fetch error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [setValue, API_URL]);

    const onSubmit = async (data: any) => {
        setSubmitting(true);
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("address", data.address);

        if (data.password) {
            formData.append("password", data.password);
        }
        if (data.profilePicture && data.profilePicture[0]) {
            formData.append("profilePicture", data.profilePicture[0]);
        }

        try {
            const res = await fetch(`${API_URL}/v1/users/${userId}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });
            const result = await res.json();
            if (result.success) {
                alert("Profile Updated Successfully!");
                window.location.reload();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Update error", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <AuthGuard>
            <div className="min-h-screen bg-slate-50 pb-20">
                {/* Header Banner */}
                <div className="bg-(--dm-primary-blue) h-60 relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-500 opacity-90" />
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

                    <div className="container-custom mx-auto px-4 pt-10 relative z-10 flex justify-between items-start">
                        <button onClick={() => router.push("/")} className="text-white/80 hover:text-white flex items-center gap-2 font-medium transition-colors">
                            ← Back to Store
                        </button>
                    </div>
                </div>

                <div className="container-custom mx-auto px-4 -mt-24 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Sidebar / Profile Card */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 text-center border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 to-cyan-400" />

                                <div className="w-32 h-32 mx-auto rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg mb-6 ring-4 ring-blue-50">
                                    {profilePic ? (
                                        <img src={profilePic.startsWith('http') ? profilePic : `${BASE_URL}${profilePic}`} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUserCircle className="text-6xl text-slate-300" />
                                    )}
                                </div>

                                <h2 className="text-2xl font-bold text-slate-800">{loading ? "Loading..." : "My Profile"}</h2>
                                <p className="text-slate-500 font-medium">{localStorage.getItem("role") === 'admin' ? 'Administrator' : 'Valued Customer'}</p>

                                <div className="mt-8 pt-8 border-t border-slate-100 space-y-4 text-left">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><FaEnvelope /></div>
                                        <span className="text-sm truncate opacity-80">{loading ? "..." : "Managed Account"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><FaPhoneAlt /></div>
                                        <span className="text-sm opacity-80">Support: 9812345678</span>
                                    </div>
                                </div>

                                {/* Loyalty Points Section */}
                                {loyalty && (
                                    <div className="mt-8 p-6 rounded-2xl border text-left bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">⭐</div>
                                                <span className="font-bold text-slate-800 text-sm">Loyalty Points</span>
                                            </div>
                                            <span className="text-blue-700 font-bold text-sm">{loyalty.loyaltyPoints} pts</span>
                                        </div>

                                        {!loyalty.discountAvailable ? (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                    <span>Progress to 20% Off</span>
                                                    <span>{loyalty.loyaltyPoints}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-blue-100 shadow-inner">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                                                        style={{ width: `${Math.min(100, (loyalty.loyaltyPoints / 100) * 100)}%` }}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-slate-500 italic text-center">
                                                    {loyalty.pointsToNextDiscount} more points for 20% discount
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="bg-emerald-500 text-white p-3 rounded-xl shadow-lg shadow-emerald-500/20 text-center">
                                                <p className="font-bold text-xs">🎉 20% DISCOUNT READY!</p>
                                                <p className="text-[10px] opacity-90">Apply at checkout on orders &gt; Rs. 1000</p>
                                            </div>
                                        )}

                                        <div className="mt-4 pt-4 border-t border-blue-100 grid grid-cols-2 gap-2 text-[9px] font-bold text-blue-600 text-center uppercase tracking-tighter">
                                            <div className="bg-white rounded-lg py-1 border border-blue-50 shadow-sm">🛒 +20 PTS</div>
                                            <div className="bg-white rounded-lg py-1 border border-blue-50 shadow-sm">🔥 +100 BONUS</div>
                                        </div>
                                    </div>
                                )}

                                <button onClick={handleLogout} className="mt-8 w-full py-3 rounded-xl border border-red-100 text-red-600 font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                                    <FaSignOutAlt /> Sign Out
                                </button>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
                                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Edit Profile</h3>
                                        <p className="text-slate-500 text-sm">Update your personal information</p>
                                    </div>
                                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg">
                                        🔧
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                        <input {...register("fullName")} className="w-full bg-slate-50 border-transparent rounded-xl p-3.5 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                        <input {...register("email")} disabled className="w-full bg-slate-100 border-transparent rounded-xl p-3.5 text-slate-500 cursor-not-allowed" />
                                        <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                                        <input {...register("phoneNumber")} className="w-full bg-slate-50 border-transparent rounded-xl p-3.5 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input {...register("address")} className="w-full bg-slate-50 border-transparent rounded-xl pl-10 pr-3.5 py-3.5 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 pt-4 border-t border-slate-100">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Security</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                {...register("password")}
                                                className="w-full bg-slate-50 border-transparent rounded-xl p-3.5 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none pr-10"
                                                placeholder="Enter new password to change"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Profile Picture</label>
                                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors bg-slate-50 cursor-pointer group">
                                            <input type="file" {...register("profilePicture")} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 flex justify-end pt-4">
                                        <button type="submit" disabled={submitting} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 transform hover:-translate-y-0.5 transition-all">
                                            <FaSave />
                                            {submitting ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
