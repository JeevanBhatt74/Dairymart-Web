"use client";

import { useCart } from "../_context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaTrash, FaCreditCard, FaLock } from "react-icons/fa";

export default function CheckoutPage() {
    const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        address: "",
        city: "",
        zip: "",
        phone: ""
    });

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-slate-800">Your Cart is Empty</h2>
                <button onClick={() => router.push("/")} className="mt-4 text-blue-600 font-semibold hover:underline">Start Shopping</button>
            </div>
        );
    }

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to place an order");
            router.push("/login");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cart.map(item => ({ product: item._id, quantity: item.quantity })),
                    totalAmount: cartTotal,
                    shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}`,
                    paymentMethod: "COD" // Hardcoded for now
                })
            });

            const data = await res.json();
            if (data.success) {
                clearCart();
                alert("Order Placed Successfully!");
                router.push("/user/orders"); // Redirect to order history
            } else {
                alert(data.message || "Order Failed");
            }
        } catch (error) {
            console.error("Order error", error);
            alert("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--dm-bg-main)] py-12">
            <div className="container-custom mx-auto max-w-6xl px-4">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Cart Items & Form */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Cart Summary */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Cart Items ({cart.length})</h2>
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item._id} className="flex gap-4 py-4 border-b border-slate-100 last:border-0">
                                        <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
                                            {item.image && <img src={`http://localhost:5000${item.image}`} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900">{item.name}</h3>
                                            <p className="text-blue-600 font-bold">${item.price}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex items-center gap-3 bg-slate-100 rounded-lg px-2 py-1">
                                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                                                <span className="text-sm font-bold">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                            </div>
                                            <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600 text-sm"><FaTrash /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Form */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Shipping Information</h2>
                            <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                    <input required type="text" className="w-full p-3 bg-slate-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Street Address" onChange={e => setFormData({ ...formData, address: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                    <input required type="text" className="w-full p-3 bg-slate-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="City" onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Zip Code</label>
                                    <input required type="text" className="w-full p-3 bg-slate-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Zip Code" onChange={e => setFormData({ ...formData, zip: e.target.value })} />
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div>
                        <div className="bg-white p-6 rounded-3xl shadow-lg shadow-blue-500/5 border border-slate-200 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-slate-500">
                                    <span>Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Shipping</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="border-t border-slate-100 pt-3 flex justify-between text-lg font-bold text-slate-900">
                                    <span>Total</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button form="checkout-form" disabled={submitting} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                                {submitting ? "Processing..." : (
                                    <>
                                        <FaLock size={14} /> Place Order
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                                <FaCreditCard /> Secure Payment powered by Stripe (Mock)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
