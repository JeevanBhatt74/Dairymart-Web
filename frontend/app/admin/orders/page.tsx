"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaSearch, FaEye, FaShippingFast, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

interface OrderItem {
    product: {
        name: string;
        image?: string;
    };
    quantity: number;
}

interface Order {
    _id: string;
    user: {
        fullName: string;
        email: string;
    };
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:5000/api/orders/admin/all", {
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

    const updateStatus = async (id: string, newStatus: string) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:5000/api/orders/admin/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "Processing": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Shipped": return "bg-indigo-100 text-indigo-700 border-indigo-200";
            case "Delivered": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
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

    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Order Management</h2>
                <p className="text-slate-500 mt-1">Track and manage customer orders.</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Email..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 placeholder:text-slate-400 font-medium transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 table-fixed">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.map(order => (
                                <tr key={order._id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-900">{order.user?.fullName || 'Unknown User'}</span>
                                            <span className="text-xs text-slate-400">{order.user?.email || 'No Email'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-slate-800">${order.totalAmount.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className="text-xs font-medium border-none bg-slate-100 rounded-lg py-1 pl-2 pr-6 focus:ring-0 cursor-pointer outline-none"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
