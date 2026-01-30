"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaChevronLeft, FaMinus, FaPlus, FaShoppingCart, FaStar, FaBoxOpen } from "react-icons/fa";
import { useCart } from "@/app/_context/CartContext";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    stock: number;
}

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products/${params.id}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.data);
                }
            } catch (error) {
                console.error("Error fetching product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params.id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!product) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
            <button onClick={() => router.back()} className="mt-4 text-blue-600 font-semibold hover:underline">Go Back</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--dm-bg-main)] py-8">
            <div className="container-custom mx-auto max-w-6xl px-4">

                {/* Back Button */}
                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-[var(--dm-primary-blue)] transition-colors mb-8 font-medium">
                    <FaChevronLeft className="text-sm" /> Back to Store
                </button>

                <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-xl shadow-blue-500/5 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">

                    {/* Image Section */}
                    <div className="relative">
                        <div className="aspect-square bg-slate-50 rounded-[28px] overflow-hidden flex items-center justify-center relative group">
                            {product.image ? (
                                <img src={`http://localhost:5000${product.image}`} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                                <FaBoxOpen className="text-6xl text-slate-300" />
                            )}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-600 uppercase tracking-wider shadow-sm">
                                {product.category}
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">{product.name}</h1>
                            <div className="flex items-center gap-1 text-amber-400 text-sm mb-4">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-amber-200" />
                                <span className="text-slate-400 ml-2 font-medium">(4.5 Reviews)</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed text-lg">{product.description}</p>
                        </div>

                        {/* Price & Stock */}
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div className="text-3xl font-bold text-[var(--dm-primary-blue)]">${product.price.toFixed(2)}</div>
                            <div className={`px-4 py-2 rounded-xl text-sm font-bold ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center bg-slate-100 rounded-xl p-1">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-white rounded-lg transition-all shadow-sm"><FaMinus size={12} /></button>
                                    <span className="w-10 text-center font-bold text-slate-800">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-white rounded-lg transition-all shadow-sm"><FaPlus size={12} /></button>
                                </div>
                                <div className="text-sm text-slate-400 font-medium">Total: <span className="text-slate-900 font-bold">${(product.price * quantity).toFixed(2)}</span></div>
                            </div>

                            <button className="w-full py-4 bg-[var(--dm-primary-blue)] text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-95">
                                <FaShoppingCart />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
