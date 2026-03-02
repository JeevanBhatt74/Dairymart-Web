"use client";

import AuthGuard from "@/app/_components/AuthGuard";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChartLineIcon, UsersIcon, BoxOpenIcon, ClipboardListIcon, SignOutAltIcon, ChatIcon } from "./_components/AdminIcons";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { name: "Dashboard", href: "/admin", icon: <ChartLineIcon /> },
        { name: "User Management", href: "/admin/users", icon: <UsersIcon /> },
        { name: "Products", href: "/admin/products", icon: <BoxOpenIcon /> },
        { name: "Orders", href: "/admin/orders", icon: <ClipboardListIcon /> },
        { name: "Chat", href: "/admin/chat", icon: <ChatIcon /> },
    ];

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    };

    return (
        <AuthGuard requiredRole="admin">
            <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
                {/* Sidebar */}
                <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
                    <div className="p-8 border-b border-slate-100 flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-blue-200 shadow-md">
                            🥛
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">DairyMart</h1>
                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Admin Panel</span>
                        </div>
                    </div>

                    <nav className="flex-1 p-6 space-y-2">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 px-2">Menu</div>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-6 border-t border-slate-100 space-y-2">

                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-medium">
                            <SignOutAltIcon /> Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
                    {/* Header Blur Bg */}
                    <div className="absolute top-0 left-0 w-full h-64 bg-slate-50 -z-10" />
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
