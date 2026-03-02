"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaBox, FaClock, FaCheckCircle } from "react-icons/fa";

interface Order {
    _id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: {
        product: {
            name: string;
            image?: string;
        };
        quantity: number;
    }[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await axios.get(`${API_URL}/orders/my-orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setOrders(res.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch ((status || '').toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-[var(--dm-primary-blue)] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>

                <div className="space-y-6">
                    {(!orders || orders.length === 0) ? (
                        <div className="text-center py-12 bg-white rounded-[24px]">
                            <p className="text-gray-500">No past orders found.</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 overflow-hidden">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Order #{order._id?.slice(-6) || 'UNKNOWN'}</p>
                                        <p className="text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date Unknown'}</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                                        {order.status || 'Pending'}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {(order.items || []).map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden">
                                                {item.product?.image && (
                                                    <img src={item.product.image.startsWith('http') ? item.product.image : `${BASE_URL}${item.product.image}`} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-800">{item.product?.name || "Product"}</p>
                                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <span className="text-gray-500 font-medium">Total Amount</span>
                                    <span className="text-xl font-extrabold text-[var(--dm-primary-blue)]">Rs. {order.totalAmount}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
