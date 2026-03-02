"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaBoxOpen, FaChevronLeft } from "react-icons/fa";

export default function CreateProductPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data: any) => {
        setSubmitting(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("category", data.category);
        formData.append("stock", data.stock);

        if (data.image[0]) {
            formData.append("image", data.image[0]);
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/products`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            const result = await res.json();
            if (result.success) {
                router.push("/admin/products");
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error creating product", error);
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
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Add New Product</h2>
                    <p className="text-slate-500 text-sm">Add a new item to your store inventory.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Col */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Product Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                                <input {...register("name", { required: true })} className="w-full bg-slate-50 border-transparent rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="e.g. Organic Whole Milk" />
                                {errors.name && <span className="text-red-500 text-xs mt-1 block">Name is required</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea {...register("description", { required: true })} rows={4} className="w-full bg-slate-50 border-transparent rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="Detailed product description..." />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Inventory & Pricing</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                                    <input type="number" step="0.01" {...register("price", { required: true })} className="w-full bg-slate-50 border-transparent rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                                    <input type="number" {...register("stock", { required: true })} className="w-full bg-slate-50 border-transparent rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="0" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <div className="relative">
                                    <select {...register("category", { required: true })} className="w-full bg-slate-50 border-transparent rounded-xl p-3 appearance-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none">
                                        <option value="">Select Category</option>
                                        <option value="Milk">Milk</option>
                                        <option value="Cheese">Cheese</option>
                                        <option value="Yogurt">Yogurt</option>
                                        <option value="Butter">Butter</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors bg-slate-50">
                                    <input type="file" {...register("image")} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
                    <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 font-bold shadow-lg shadow-emerald-500/30 transition-all">
                        <FaBoxOpen />
                        {submitting ? "Creating..." : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
