"use client";

import { FaUsers, FaShoppingCart, FaDollarSign, FaBoxOpen } from "react-icons/fa";

export default function AdminDashboard() {
    // Dummy Data for Dashboard
    const stats = [
        { title: "Total Users", value: "1,240", change: "+12%", icon: <FaUsers />, color: "bg-blue-500" },
        { title: "Total Sales", value: "Rs. 45,290", change: "+8%", icon: <FaDollarSign />, color: "bg-emerald-500" },
        { title: "Orders", value: "450", change: "+23%", icon: <FaShoppingCart />, color: "bg-purple-500" },
        { title: "Products", value: "85", change: "+5", icon: <FaBoxOpen />, color: "bg-amber-500" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
                <p className="text-slate-500 mt-1">Welcome back, Administrator. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                                {stat.change} from last month
                            </span>
                        </div>
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-900/5 ${stat.color} bg-opacity-90 group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders - Placeholder */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-lg border border-slate-200">📦</div>
                                    <div>
                                        <div className="font-semibold text-slate-900">Order #{1000 + i}</div>
                                        <div className="text-xs text-slate-500">2 mins ago</div>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-700">Rs. 120.00</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition-colors text-left flex flex-col gap-2">
                            <FaBoxOpen className="text-2xl" />
                            Add Product
                        </button>
                        <button className="p-4 bg-purple-50 text-purple-700 rounded-xl font-semibold hover:bg-purple-100 transition-colors text-left flex flex-col gap-2">
                            <FaUsers className="text-2xl" />
                            Manage Users
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
