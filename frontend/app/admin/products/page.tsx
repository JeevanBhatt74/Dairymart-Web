"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus, FaSearch, FaTrash, FaEdit, FaBoxOpen } from "react-icons/fa";

interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    image?: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            // Public GET endpoint
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

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
            } else {
                alert("Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product", error);
        }
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Product Management</h2>
                    <p className="text-slate-500 mt-1">Manage your inventory, prices, and stock.</p>
                </div>
                <Link href="/admin/products/create" className="group flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-600/40 active:scale-95">
                    <FaPlus className="text-sm transition-transform group-hover:rotate-90" />
                    <span className="font-semibold text-sm">Add Product</span>
                </Link>
            </div>

            {/* Filters & Actions */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700 placeholder:text-slate-400 font-medium transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                    {filteredProducts.length} Items
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 table-fixed">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map(product => (
                                <tr key={product._id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 font-bold overflow-hidden border border-slate-100">
                                                {product.image ? (
                                                    <img src={`http://localhost:5000${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <FaBoxOpen className="text-xl" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">{product.name}</div>
                                                <div className="text-xs text-slate-400">ID: {product._id.substring(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-2 text-sm font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                                            {product.stock}
                                            {product.stock < 10 && <span className="text-[10px] bg-red-50 px-1.5 py-0.5 rounded text-red-600 border border-red-100 uppercase tracking-wide">Low</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-emerald-600">${product.price.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/products/${product._id}/edit`} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                                                <FaEdit size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(product._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <FaTrash size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        No products found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
