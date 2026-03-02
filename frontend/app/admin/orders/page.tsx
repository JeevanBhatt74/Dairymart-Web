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

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Show 8 orders per page

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${API_URL}/orders/admin/all`, {
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
            const res = await fetch(`${API_URL}/orders/admin/${id}/status`, {
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
        (order.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination values
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

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
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to page 1 on search
                        }}
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
                            {paginatedOrders.map(order => (
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-700">
                                Showing <span className="font-medium">{filteredOrders.length === 0 ? 0 : startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredOrders.length)}</span> of{' '}
                                <span className="font-medium">{filteredOrders.length}</span> orders
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 focus:outline-offset-0">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
