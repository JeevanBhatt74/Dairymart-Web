"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaChevronLeft, FaMinus, FaPlus, FaShoppingCart, FaStar, FaBoxOpen, FaHeart, FaRegHeart } from "react-icons/fa";
import { useCart } from "@/app/_context/CartContext";
import axios from "axios";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    stock: number;
    calories?: number;
    protein?: number;
    fat?: number;
    carbohydrates?: number;
}

export default function ProductDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/products/${id}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.data);

                    // Check favorite status if logged in
                    const token = localStorage.getItem("token");
                    if (token) {
                        try {
                            const favRes = await axios.get(`${API_URL}/favorites/${id}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            if (favRes.data.success) {
                                setIsFavorite(favRes.data.isFavorited);
                            }
                        } catch (err) {
                            console.error("Error checking favorite status", err);
                        }
                    }

                    // Fetch related products (simulated by fetching all and filtering)
                    // Ideally backend should support /products?category=X
                    // For now, just a placeholder fetch
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const handleToggleFavorite = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/favorites/toggle`,
                { productId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setIsFavorite((prev) => !prev);
            }
        } catch (error) {
            console.error("Error toggling favorite", error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-[var(--dm-primary-blue)] rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
            <button onClick={() => router.back()} className="text-[var(--dm-primary-blue)] hover:underline">Go Back</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-[var(--dm-primary-blue)] transition-colors mb-8 font-medium">
                    <FaChevronLeft className="text-sm" /> Back to Store
                </button>

                <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-xl shadow-blue-500/5 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">

                    {/* Image Section */}
                    <div className="relative">
                        <div className="aspect-square bg-slate-50 rounded-[28px] overflow-hidden flex items-center justify-center relative group">
                            {product.image ? (
                                <img src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                                <FaBoxOpen className="text-6xl text-slate-300" />
                            )}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-600 uppercase tracking-wider shadow-sm">
                                {product.category}
                            </div>

                            <button
                                onClick={handleToggleFavorite}
                                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
                            >
                                {isFavorite ? (
                                    <FaHeart className="text-red-500 text-xl" />
                                ) : (
                                    <FaRegHeart className="text-slate-400 text-xl" />
                                )}
                            </button>
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

                        {/* Nutritional Information */}
                        {(product.calories || product.protein || product.fat || product.carbohydrates) && (
                            <div className="bg-gradient-to-br from-blue-50 to-white rounded-[20px] p-5 border border-blue-100">
                                <h3 className="font-bold text-base text-[var(--dm-text-main)] mb-3">Nutritional Facts <span className="text-xs font-normal text-gray-500">(per 100g)</span></h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {product.calories && (
                                        <div className="bg-white rounded-[10px] p-2.5">
                                            <p className="text-xs text-gray-500 mb-0.5">Calories</p>
                                            <p className="text-lg font-bold text-[var(--dm-primary-blue)]">{product.calories} <span className="text-xs">kcal</span></p>
                                        </div>
                                    )}
                                    {product.protein && (
                                        <div className="bg-white rounded-[10px] p-2.5">
                                            <p className="text-xs text-gray-500 mb-0.5">Protein</p>
                                            <p className="text-lg font-bold text-green-600">{product.protein}g</p>
                                        </div>
                                    )}
                                    {product.fat && (
                                        <div className="bg-white rounded-[10px] p-2.5">
                                            <p className="text-xs text-gray-500 mb-0.5">Fat</p>
                                            <p className="text-lg font-bold text-orange-600">{product.fat}g</p>
                                        </div>
                                    )}
                                    {product.carbohydrates && (
                                        <div className="bg-white rounded-[10px] p-2.5">
                                            <p className="text-xs text-gray-500 mb-0.5">Carbs</p>
                                            <p className="text-lg font-bold text-purple-600">{product.carbohydrates}g</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Price & Stock */}
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div className="text-3xl font-bold text-[var(--dm-primary-blue)]">Rs. {product.price.toFixed(2)}</div>
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
                                <div className="text-sm text-slate-400 font-medium">Total: <span className="text-slate-900 font-bold">Rs. {(product.price * quantity).toFixed(2)}</span></div>
                            </div>

                            <button
                                onClick={async () => {
                                    try {
                                        await addToCart(product._id, quantity);
                                        alert("Added to cart!");
                                    } catch (err) {
                                        alert("Please login first");
                                        router.push("/login");
                                    }
                                }}
                                disabled={product.stock === 0}
                                className="w-full py-4 bg-[var(--dm-primary-blue)] text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
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
