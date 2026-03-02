"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaSearch, FaWater, FaCheese, FaIceCream, FaBoxOpen, FaShoppingCart, FaArrowRight, FaLeaf, FaFire, FaTruck, FaShieldAlt } from "react-icons/fa";
import { useCart } from "@/app/_context/CartContext";
import { useRouter } from "next/navigation";

// --- Types ---
interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
  calories?: number;
  isFeatured?: boolean;
}

// --- Constants ---
const CATEGORIES = [
  { name: "Milk", icon: <FaWater />, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
  { name: "Cheese", icon: <FaCheese />, color: "bg-yellow-50 text-yellow-600", border: "border-yellow-100" },
  { name: "Yogurt", icon: <FaIceCream />, color: "bg-pink-50 text-pink-600", border: "border-pink-100" },
  { name: "Butter", icon: "🧈", color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
  { name: "Cream", icon: "🍰", color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
  { name: "Ghee", icon: "🏺", color: "bg-orange-50 text-orange-600", border: "border-orange-100" },
];

const FEATURES = [
  { icon: <FaLeaf className="text-green-500" />, title: "100% Organic", desc: "Sourced directly from local farmers." },
  { icon: <FaTruck className="text-blue-500" />, title: "Free Delivery", desc: "On all orders above Rs. 1000." },
  { icon: <FaShieldAlt className="text-purple-500" />, title: "Quality Promise", desc: "No added preservatives or chemicals." },
];

// --- Sub-Component: Product Card ---
const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product._id, 1);
    } catch (error) {
      router.push("/login");
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'milk': return 'bg-blue-50';
      case 'cheese': return 'bg-yellow-50';
      case 'yogurt': return 'bg-pink-50';
      case 'butter': return 'bg-amber-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div key={product._id} className="group relative bg-white rounded-3xl p-4 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100/50 hover:border-blue-100 flex flex-col h-full">

      {/* Badge */}
      {product.isFeatured && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-orange-500 shadow-sm flex items-center gap-1 border border-orange-100">
          <FaFire /> POPULAR
        </div>
      )}

      {/* Image Area */}
      <Link href={`/products/${product._id}`} className="block relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50">
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/5 to-transparent`}></div>
        <img
          src={!imageError && product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`) : '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-contain p-4 transform group-hover:scale-110 transition-transform duration-700 ease-out mix-blend-multiply"
          onError={() => setImageError(true)}
        />

        {/* Quick Action Button - Visible on Hover */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
          title="Add to Cart"
        >
          <FaShoppingCart size={14} />
        </button>
      </Link>

      {/* Info */}
      <div className="flex-1 flex flex-col">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.category}</div>
        <Link href={`/products/${product._id}`}>
          <h3 className="text-gray-900 font-bold text-base leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{product.name}</h3>
        </Link>

        <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through font-medium">Rs. {product.price + 20}</span>
            <span className="text-lg font-black text-gray-900">Rs. {product.price}</span>
          </div>
          <div className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-md">
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        if (data.success) setProducts(data.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_URL]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">

        {/* Background Gradients - Subtle & Premium */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-100/40 rounded-full blur-[120px] mix-blend-multiply animate-pulse"></div>
          <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-emerald-50/60 rounded-full blur-[100px] mix-blend-multiply animate-pulse delay-700"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-purple-50/40 rounded-full blur-[80px] mix-blend-multiply animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-gray-500 text-xs font-bold tracking-widest uppercase mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Fresh from the Farm
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight leading-[1.05] mb-8 drop-shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            Pure Goodness, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Delivered To You.</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-100">
            Experience the taste of 100% organic dairy. No preservatives, just nature's best ingredients delivered fresh every morning.
          </p>

          {/* Search Omnibar */}
          <div className="max-w-2xl mx-auto relative group z-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-200">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-emerald-200 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative flex items-center bg-white rounded-full p-2 shadow-xl shadow-blue-900/5 ring-1 ring-black/5">
              <div className="pl-6 text-gray-400"> <FaSearch className="text-lg" /> </div>
              <input
                type="text"
                placeholder="Search 'Cow Milk', 'Paneer'..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 h-12 bg-transparent border-none outline-none px-4 text-gray-700 placeholder-gray-400 font-medium text-lg"
              />
              <button className="h-12 px-8 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-colors shadow-lg">
                Find
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* --- FEATURES & CATEGORIES --- */}
      <div className="container mx-auto px-6 pb-24 space-y-24">

        {/* Features Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-xl">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <div className="hidden sm:flex gap-2">
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500">←</button>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500">→</button>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {CATEGORIES.map((cat, i) => (
              <button key={i} className="group flex-shrink-0 snap-start">
                <div className={`w-32 h-32 md:w-40 md:h-40 rounded-[32px] ${cat.color} ${cat.border} border-2 flex flex-col items-center justify-center gap-3 transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2 shadow-sm group-hover:shadow-lg relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="text-4xl md:text-5xl relative z-10">{cat.icon}</div>
                  <span className="font-bold text-sm md:text-base relative z-10">{cat.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Best Sellers</h2>
              <p className="text-gray-500">Freshly stocked products you might love.</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-5 py-2.5 rounded-full transition-colors">
              View All Products <FaArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => <div key={i} className="h-80 bg-gray-100 rounded-3xl animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {filteredProducts.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
