"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/app/_context/CartContext";

import { useNotifications } from "@/app/_context/NotificationContext";

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartCount } = useCart();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-white/30 backdrop-blur-xl border border-white/30 shadow-2xl shadow-black/10 rounded-full px-6 py-3 transition-all duration-300 flex items-center justify-between hover:bg-white/40 hover:shadow-black/20 hover:border-white/50">

        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative h-8 w-auto transform group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="DairyMart Logo"
              width={40}
              height={40}
              className="object-contain h-full w-auto"
              priority
            />
          </div>
        </Link>

        {/* Navigation Links - Centered */}
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[
            { name: "Home", href: "/" },
            { name: "Products", href: "/products" },
            { name: "About", href: "/about" },
            ...(isLoggedIn ? [
              { name: "Favorites", href: "/favorites" },
              { name: "My Orders", href: "/orders" }
            ] : [])
          ].map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${isActive
                  ? "bg-black text-white shadow-md scale-105"
                  : "text-slate-600 hover:text-black hover:bg-slate-100"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {isLoggedIn && (
            <div className="relative group/notification">
              <button className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 border shadow-sm ${unreadCount > 0 ? 'bg-white text-black border-slate-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-black hover:border-slate-300'}`} title="Notifications">
                <NotificationIcon />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-xl shadow-black/5 border border-slate-100 opacity-0 invisible group-hover/notification:opacity-100 group-hover/notification:visible transition-all transform origin-top-right z-50 overflow-hidden translate-y-2 group-hover/notification:translate-y-0">
                <div className="p-3 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-[11px] text-blue-500 hover:text-blue-600 font-medium">
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`p-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                        onClick={() => !n.isRead && markAsRead(n._id)}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-xs ${!n.isRead ? 'font-bold text-black' : 'font-medium text-slate-600'}`}>{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <Link href="/cart" className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 border shadow-sm group ${pathname === '/cart' ? 'bg-black text-white border-black' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-black hover:border-slate-300'}`} title="Cart">
            <ShoppingCartIcon />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="relative group">
              <Link href="/user/profile" className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 border shadow-sm ${pathname?.startsWith('/user') ? 'bg-black text-white border-black' : 'bg-gradient-to-tr from-slate-100 to-white text-slate-700 border-slate-200 hover:border-slate-300'}`} title="Profile">
                <span className="text-lg">👤</span>
              </Link>
              <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-2xl shadow-xl shadow-black/5 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50 overflow-hidden translate-y-2 group-hover:translate-y-0">
                <div className="p-1.5">
                  <Link href="/user/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-black rounded-xl transition-colors">
                    <span>⚙️</span> Settings
                  </Link>
                  <Link href="/user/chat" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-black rounded-xl transition-colors">
                    <span>💬</span> Chat with Support
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={`text-sm font-bold px-3 py-2 transition-colors ${pathname === '/login' ? 'text-black' : 'text-slate-500 hover:text-black'}`}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="h-9 px-5 inline-flex items-center justify-center bg-black text-white font-bold text-sm rounded-full hover:bg-slate-800 hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
