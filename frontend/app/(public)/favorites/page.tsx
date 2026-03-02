"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

interface Favorite {
    _id: string;
    product: {
        _id: string;
        name: string;
        price: number;
        image?: string;
        category: string;
    }
}

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await axios.get(`${API_URL}/favorites`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setFavorites(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching favorites", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-[var(--dm-primary-blue)] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                    <span className="text-red-500"><FaHeart /></span>
                    My Favorites
                </h1>

                {favorites.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[30px] border border-dashed border-gray-200">
                        <p className="text-gray-400 text-lg mb-4">No favorite items yet.</p>
                        <Link href="/" className="text-[var(--dm-primary-blue)] font-bold hover:underline">Browse Products</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {favorites.filter(fav => fav.product).map((fav) => (
                            <div key={fav._id} className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                                <Link href={`/products/${fav.product?._id}`}>
                                    <div className="aspect-square bg-gray-50 rounded-[20px] mb-4 overflow-hidden relative">
                                        <img
                                            src={fav.product?.image?.startsWith('http') ? fav.product.image : `${BASE_URL}${fav.product?.image || '/placeholder.png'}`}
                                            alt={fav.product?.name || 'Product'}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                                        />
                                    </div>
                                    <h3 className="font-bold text-gray-800 line-clamp-1">{fav.product?.name}</h3>
                                    <p className="text-xs text-gray-400 mb-2">{fav.product?.category}</p>
                                    <p className="text-[var(--dm-primary-blue)] font-bold">Rs. {fav.product?.price}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
