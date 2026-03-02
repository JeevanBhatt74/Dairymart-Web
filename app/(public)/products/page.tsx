"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaSearch, FaWater, FaCheese, FaIceCream, FaBoxOpen, FaShoppingCart, FaArrowLeft, FaFilter, FaFire } from "react-icons/fa";
import { useCart } from "@/app/_context/CartContext";
import { useRouter } from "next/navigation";

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

const CATEGORIES = [
    { name: "All", icon: <FaBoxOpen />, color: "bg-gray-100 text-gray-700" },
    { name: "Milk", icon: <FaWater />, color: "bg-blue-50 text-blue-600" },
    { name: "Cheese", icon: <FaCheese />, color: "bg-yellow-50 text-yellow-600" },
    { name: "Yogurt", icon: <FaIceCream />, color: "bg-pink-50 text-pink-600" },
    { name: "Butter", icon: "🧈", color: "bg-amber-50 text-amber-600" },
    { name: "Cream", icon: "🍰", color: "bg-purple-50 text-purple-600" },
    { name: "Ghee", icon: "🏺", color: "bg-orange-50 text-orange-600" },
];

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
        <div key={product._id} className="group relative bg-white rounded-3xl p-4 transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-blue-100 flex flex-col h-full animate-in fade-in zoom-in duration-500">

            {product.isFeatured && (
                <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-orange-500 shadow-sm flex items-center gap-1 border border-orange-100">
                    <FaFire /> POPULAR
                </div>
            )}

            <Link href={`/products/${product._id}`} className="block relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/5 to-transparent`}></div>
                <img
                    src={!imageError && product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`) : '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 transform group-hover:scale-110 transition-transform duration-700 ease-out mix-blend-multiply"
                    onError={() => setImageError(true)}
                />

                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-3 right-3 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
                    title="Add to Cart"
                >
                    <FaShoppingCart size={14} />
                </button>
            </Link>

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

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

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

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || product.category.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-24 font-sans selection:bg-blue-100 selection:text-blue-900">

            {/* Header Section */}
            <div className="container mx-auto px-6 mb-12">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <FaArrowLeft /> Back to Home
                </Link>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                    Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Collections.</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl">
                    Browse through our extensive range of fresh, organic, and locally sourced dairy products.
                </p>
            </div>

            {/* Controls: Search & Filter */}
            <div className="container mx-auto px-6 mb-12 sticky top-20 z-30">
                <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl shadow-gray-200/50 rounded-3xl p-4 flex flex-col gap-4 items-start justify-between">

                    {/* Search */}
                    <div className="relative w-full group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <FaSearch />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 h-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none font-medium placeholder-gray-400"
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat.name
                                    ? 'bg-gray-900 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <span className={`${selectedCategory === cat.name ? 'text-white' : 'text-gray-500'}`}>{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-6">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => <div key={i} className="h-80 bg-gray-100 rounded-3xl animate-pulse"></div>)}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                        {filteredProducts.map(p => <ProductCard key={p._id} product={p} />)}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your search or category filter.</p>
                        <button
                            onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                            className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 rounded-full font-bold hover:bg-blue-100 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}
