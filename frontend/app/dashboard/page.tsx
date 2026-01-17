"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define the type for the User state
interface User {
  firstName?: string;
  email?: string;
  role?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulate fetching user from localStorage or API
    const token = localStorage.getItem("token");
    if (!token) {
       router.push("/login"); // Redirect if not logged in
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--dm-bg-main)]">
      {/* Dashboard Navbar */}
      <nav className="h-16 bg-white border-b border-[var(--dm-border)] px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <span className="text-2xl">🥛</span>
            <span className="font-bold text-[var(--dm-primary-blue)] text-lg">My Dashboard</span>
        </div>
        <button 
            onClick={handleLogout}
            className="text-sm font-medium text-red-500 hover:bg-red-50 px-4 py-2 rounded-[12px] transition-colors"
        >
            Sign Out
        </button>
      </nav>

      <div className="container-custom py-8 space-y-8">
        
        {/* 1. Welcome Banner */}
        <div className="relative overflow-hidden radius-card p-8 text-white shadow-lg shadow-blue-500/20"
             style={{ background: "linear-gradient(135deg, var(--dm-primary-blue), var(--dm-gradient-light))" }}>
            <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
                <p className="opacity-90">Manage your orders and account settings.</p>
            </div>
            {/* Decor Circles */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
        </div>

        {/* 2. Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon="🛍️" label="Total Orders" value="12" />
            <StatCard icon="💖" label="Favorites" value="4" />
            <StatCard icon="💳" label="Wallet Balance" value="Rs. 450" />
        </div>

        {/* 3. Recent Orders Section */}
        <div className="bg-white radius-card p-6 shadow-soft border border-[var(--dm-border)]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[var(--dm-text-main)]">Recent Orders</h2>
                <button className="text-sm text-[var(--dm-primary-blue)] font-semibold hover:underline">View All</button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-4 text-sm font-medium text-[var(--dm-text-secondary)] pb-4 border-b border-[var(--dm-border)]">
                <span>Order ID</span>
                <span>Date</span>
                <span>Status</span>
                <span className="text-right">Total</span>
            </div>

            {/* Order Items (Dummy Data) */}
            <div className="space-y-4 mt-4">
                <OrderItem id="#DM-8821" date="Jan 1, 2026" status="Delivered" total="Rs. 1,200" statusColor="text-green-600 bg-green-50" />
                <OrderItem id="#DM-8820" date="Dec 28, 2025" status="Processing" total="Rs. 450" statusColor="text-blue-600 bg-blue-50" />
                <OrderItem id="#DM-8819" date="Dec 24, 2025" status="Cancelled" total="Rs. 890" statusColor="text-red-600 bg-red-50" />
            </div>
        </div>

      </div>
    </div>
  );
}

// --- Helper Components & Types ---

// 1. StatCard Component
interface StatCardProps {
  icon: string;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
    return (
        <div className="bg-white p-6 radius-card shadow-card border border-[var(--dm-border)] flex items-center gap-4 hover:shadow-soft transition-shadow">
            <div className="h-12 w-12 rounded-[15px] bg-[var(--dm-bg-main)] flex items-center justify-center text-2xl">
                {icon}
            </div>
            <div>
                <p className="text-sm text-[var(--dm-text-secondary)]">{label}</p>
                <p className="text-xl font-bold text-[var(--dm-text-main)]">{value}</p>
            </div>
        </div>
    );
}

// 2. OrderItem Component (Fixed Type Error)
interface OrderItemProps {
  id: string;
  date: string;
  status: string;
  total: string;
  statusColor: string;
}

function OrderItem({ id, date, status, total, statusColor }: OrderItemProps) {
    return (
        <div className="grid grid-cols-4 items-center text-sm py-2">
            <span className="font-medium text-[var(--dm-text-main)]">{id}</span>
            <span className="text-[var(--dm-text-secondary)]">{date}</span>
            <div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                    {status}
                </span>
            </div>
            <span className="text-right font-bold text-[var(--dm-text-main)]">{total}</span>
        </div>
    );
}