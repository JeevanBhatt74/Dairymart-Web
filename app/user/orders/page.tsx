"use client";

import { useEffect, useState } from "react";
import { FaBoxOpen, FaClock, FaCheckCircle, FaShippingFast, FaTimesCircle } from "react-icons/fa";

interface OrderItem {
    product: {
        name: string;
        image?: string;
    };
    quantity: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

export default function UserOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch(`${API_URL}/orders/my-orders`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setOrders(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "text-yellow-600 bg-yellow-50 border-yellow-100";
            case "Processing": return "text-blue-600 bg-blue-50 border-blue-100";
            case "Shipped": return "text-indigo-600 bg-indigo-50 border-indigo-100";
            case "Delivered": return "text-emerald-600 bg-emerald-50 border-emerald-100";
            case "Cancelled": return "text-red-600 bg-red-50 border-red-100";
            default: return "text-slate-600 bg-slate-50 border-slate-100";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Pending": return <FaClock />;
            case "Processing": return <FaShippingFast />;
            case "Shipped": return <FaShippingFast />;
            case "Delivered": return <FaCheckCircle />;
            case "Cancelled": return <FaTimesCircle />;
            default: return <FaClock />;
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--dm-bg-main)] py-8 px-4">
            <div className="container-custom mx-auto max-w-4xl space-y-8">
                <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📦</div>
                        <h2 className="text-xl font-bold text-slate-700">No orders yet</h2>
                        <p className="text-slate-400 mt-2">Looks like you haven't placed an order yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order._id} className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID</div>
                                        <div className="font-mono font-bold text-slate-800">#{order._id.substring(order._id.length - 8).toUpperCase()}</div>
                                        <div className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</div>
                                    </div>
                                    <div className={`self-start md:self-center flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 overflow-hidden">
                                                {item.product?.image ? (
                                                    <img src={item.product.image.startsWith('http') ? item.product.image : `${BASE_URL}${item.product.image}`} alt={item.product?.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <FaBoxOpen className="text-slate-300" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{item.product?.name || "Product Removed"}</div>
                                                <div className="text-sm text-slate-500">Qty: {item.quantity}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <span className="font-medium text-slate-500">Total Amount</span>
                                    <span className="text-xl font-bold text-[var(--dm-primary-blue)]">${order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
