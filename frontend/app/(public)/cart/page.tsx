"use client";

import { useCart } from "@/app/_context/CartContext";
import { FaTrash, FaMinus, FaPlus, FaArrowRight, FaShoppingBag, FaBoxOpen } from "react-icons/fa";
import Link from "next/link";
import { useEffect } from "react";

export default function CartPage() {
    const { cart, loading, fetchCart, addToCart, removeFromCart, clearCart } = useCart();

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

    useEffect(() => {
        fetchCart();
    }, []);

    if (loading && !cart) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-[var(--dm-primary-blue)] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-6 px-4">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-200">
                    <FaShoppingBag size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Your Cart is Empty</h1>
                <p className="text-gray-500 text-center max-w-sm">
                    Looks like you haven't added anything to your cart yet.
                    Explore our fresh dairy products!
                </p>
                <Link href="/" className="px-8 py-3 bg-[var(--dm-primary-blue)] text-white rounded-full font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-95">
                    Start Shopping
                </Link>
            </div>
        );
    }

    const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const deliveryFee = 50; // Fixed delivery fee for now
    const total = subtotal + deliveryFee;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                    <span className="bg-blue-100 p-2 rounded-lg text-[var(--dm-primary-blue)]"><FaShoppingBag size={24} /></span>
                    Shopping Cart
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-[24px] shadow-sm overflow-hidden border border-gray-100">
                            {cart.items.map((item) => (
                                <div key={item.product._id} className="p-6 flex flex-col sm:flex-row items-center gap-6 border-b border-gray-50 last:border-0 hover:bg-slate-50 transition-colors">
                                    {/* Image */}
                                    <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden relative">
                                        {item.product.image ? (
                                            <img
                                                src={item.product.image.startsWith('http') ? item.product.image : `${BASE_URL}${item.product.image}`}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <FaBoxOpen size={24} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">{item.product.name}</h3>
                                        <p className="text-sm text-gray-400 font-medium mb-2">{item.product.category}</p>
                                        <p className="text-[var(--dm-primary-blue)] font-bold">Rs. {item.product.price}</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => addToCart(item.product._id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white rounded-md disabled:opacity-50"
                                        >
                                            <FaMinus size={10} />
                                        </button>
                                        <span className="w-10 text-center font-bold text-gray-800 text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => addToCart(item.product._id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white rounded-md"
                                        >
                                            <FaPlus size={10} />
                                        </button>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeFromCart(item.product._id)}
                                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center px-2">
                            <Link href="/" className="text-gray-500 hover:text-[var(--dm-primary-blue)] font-medium text-sm flex items-center gap-2">
                                <FaArrowRight className="rotate-180" /> Continue Shopping
                            </Link>
                            <button onClick={clearCart} className="text-red-500 text-sm font-medium hover:underline">Clear Cart</button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[24px] shadow-lg shadow-blue-500/5 p-6 border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">Rs. {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="font-bold text-gray-900">Rs. {deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-gray-100 my-4"></div>
                                <div className="flex justify-between text-lg">
                                    <span className="font-bold text-gray-800">Total</span>
                                    <span className="font-extrabold text-[var(--dm-primary-blue)]">Rs. {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link href="/checkout" className="w-full py-4 bg-[var(--dm-primary-blue)] text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95 block text-center">
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
