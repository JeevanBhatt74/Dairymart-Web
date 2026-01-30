"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaSearch, FaSlidersH, FaWater, FaCheese, FaIceCream, FaPlus, FaBoxOpen } from "react-icons/fa";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
}

const CATEGORIES = [
  { name: "Milk", icon: <FaWater />, color: "text-blue-500 bg-blue-50" },
  { name: "Cheese", icon: <FaCheese />, color: "text-orange-500 bg-orange-50" },
  { name: "Yogurt", icon: <FaIceCream />, color: "text-pink-500 bg-pink-50" },
  { name: "Butter", icon: "🧈", color: "text-yellow-600 bg-yellow-50" },
  { name: "Cream", icon: "🍰", color: "text-purple-500 bg-purple-50" },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--dm-bg-main)] pb-24">

      {/* Sticky Search Header */}
      <div className="sticky top-16 z-30 pt-6 pb-2 px-4 transition-all duration-300">
        <div className="container-custom mx-auto max-w-4xl">
          <div className="relative shadow-lg shadow-black/5 rounded-[20px]">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-14 pr-12 rounded-[20px] bg-white/90 backdrop-blur-md border border-white/50 outline-none focus:ring-2 focus:ring-[var(--dm-primary-blue)]/30 text-[var(--dm-text-main)] placeholder-gray-400"
            />
            <div className="absolute left-5 top-4 text-gray-400 text-lg">
              <FaSearch aria-hidden="true" />
            </div>
            <button
              type="button"
              aria-label="Filter Search Results"
              className="absolute right-3 top-2.5 h-9 w-9 bg-gray-100 rounded-[12px] flex items-center justify-center text-gray-600 hover:bg-[var(--dm-primary-blue)] hover:text-white transition-colors"
            >
              <FaSlidersH aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom mx-auto mt-6 space-y-10 px-4">

        {/* Promo Banner */}
        <div className="relative overflow-hidden rounded-[24px] p-8 sm:p-10 shadow-xl shadow-blue-500/20 group cursor-pointer"
          style={{ background: "linear-gradient(135deg, var(--dm-primary-blue), #63C6F7)" }}>
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-3 text-white">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border border-white/10">
                Fresh Offer
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Good Morning!</h2>
              <p className="opacity-90 text-sm sm:text-base max-w-xs font-medium leading-relaxed">
                Get <span className="font-bold text-yellow-300">20% off</span> on your first order.
              </p>
            </div>
            <div className="text-white opacity-80 hidden sm:block text-8xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              🥛
            </div>
          </div>
          <div className="absolute -right-10 -bottom-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-bold text-[var(--dm-text-main)]">Categories</h3>
            <Link href="#" className="text-sm font-semibold text-[var(--dm-primary-blue)] hover:bg-blue-50 px-3 py-1 rounded-full transition-colors">See All</Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
            {CATEGORIES.map((cat, i) => (
              <button
                key={i}
                type="button"
                className="flex flex-col items-center gap-3 group min-w-[85px] snap-start"
              >
                <div className={`w-18 h-18 p-4 rounded-[22px] flex items-center justify-center text-2xl shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 ${cat.color}`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-semibold text-gray-500 group-hover:text-[var(--dm-text-main)] transition-colors">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Products */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[var(--dm-text-main)] px-1">Featured Products</h3>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded-[20px] animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-[20px] p-3 shadow-sm border border-transparent hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group cursor-pointer relative">
                  <div className="aspect-[1/1] bg-gray-50 rounded-[16px] flex items-center justify-center mb-3 relative overflow-hidden">
                    {product.image ? (
                      <img src={`http://localhost:5000${product.image}`} alt={product.name} className="w-full h-full object-cover rounded-[16px] group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <FaBoxOpen className="text-4xl text-gray-300 group-hover:text-blue-500 transition-colors" />
                    )}
                  </div>

                  <div className="px-1 space-y-1 mb-2">
                    <h4 className="font-bold text-[var(--dm-text-main)] text-sm truncate">{product.name}</h4>
                    <p className="text-xs text-gray-400 truncate font-medium">{product.category}</p>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <span className="font-bold text-[var(--dm-primary-blue)] text-sm">${product.price.toFixed(2)}</span>
                    <button
                      type="button"
                      aria-label={`Add ${product.name} to cart`}
                      className="h-8 w-8 rounded-[10px] bg-[var(--dm-primary-blue)] flex items-center justify-center text-white shadow-md shadow-blue-500/30 hover:bg-blue-600 active:scale-90 transition-all"
                    >
                      <FaPlus size={12} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">No products found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}