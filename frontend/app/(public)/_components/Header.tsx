"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/_context/CartContext";
import { FaShoppingCart } from "react-icons/fa";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartCount } = useCart();

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
    <header className="sticky top-0 z-50 w-full border-b border-[var(--dm-border)] bg-[var(--dm-surface-white)]/80 backdrop-blur-md">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--dm-primary-blue)]/10 text-2xl">
            🥛
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--dm-primary-blue)]">
            DairyMart
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--dm-text-secondary)]">
          <Link href="/" className="hover:text-[var(--dm-primary-blue)] transition-colors">Home</Link>
          <Link href="/products" className="hover:text-[var(--dm-primary-blue)] transition-colors">Products</Link>
          <Link href="/about" className="hover:text-[var(--dm-primary-blue)] transition-colors">Our Story</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/checkout" className="relative p-2 text-slate-600 hover:text-[var(--dm-primary-blue)] transition-colors">
            <FaShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="relative group">
              <button className="flex items-center gap-2 h-10 w-10 justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-xl">
                👤
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50 overflow-hidden">
                <Link href="/user/orders" className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 border-b border-slate-50">
                  📦 My Orders
                </Link>
                <Link href="/user/profile" className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 border-b border-slate-50">
                  ⚙️ Settings
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-[var(--dm-text-secondary)] hover:text-[var(--dm-primary-blue)]"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="h-10 px-6 inline-flex items-center justify-center bg-[var(--dm-primary-blue)] text-white font-bold text-sm radius-btn hover:opacity-90 shadow-soft transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}