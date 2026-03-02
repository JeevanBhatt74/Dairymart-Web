"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaSearch, FaTrash, FaEdit, FaEye, FaChevronLeft, FaChevronRight, FaFileCsv } from "react-icons/fa";

interface User {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    phoneNumber: string;
    profilePicture?: string;
    createdAt: string;
}

const buildProfileImageUrl = (profilePicture?: string): string | null => {
    if (!profilePicture || !profilePicture.trim()) {
        return null;
    }
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
    try {
        if (profilePicture.startsWith('http://') || profilePicture.startsWith('https://')) {
            return profilePicture;
        }
        const path = profilePicture.startsWith('/') ? profilePicture : `/${profilePicture}`;
        return `${BASE_URL}${path}`;
    } catch {
        return null;
    }
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const limit = 10;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const fetchUsers = async (pageNo: number) => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/admin/users?page=${pageNo}&limit=${limit}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setUsers(data.data);
                if (data.pagination) {
                    setPage(data.pagination.page);
                    setTotalPages(data.pagination.totalPages);
                    setTotalUsers(data.pagination.total);
                }
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/admin/users/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.ok) {
                fetchUsers(page); // Refresh list
            } else {
                alert("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user", error);
        }
    }

    const handleExportCSV = () => {
        if (users.length === 0) return;

        // Define CSV headers
        const headers = ["ID", "Full Name", "Email", "Phone", "Role", "Joined Date"];

        // Map users to CSV rows
        const rows = users.map(user => [
            user._id,
            `"${user.fullName}"`, // Quote to handle commas in names
            user.email,
            user.phoneNumber,
            user.role,
            new Date(user.createdAt).toLocaleDateString()
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h2>
                    <p className="text-slate-500 mt-1">Manage platform users, roles, and permissions.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/30 active:scale-95"
                    >
                        <FaFileCsv className="text-lg" />
                        <span className="font-semibold text-sm">Export CSV</span>
                    </button>
                    <Link href="/admin/users/create" className="group flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 active:scale-95">
                        <FaPlus className="text-sm transition-transform group-hover:rotate-90" />
                        <span className="font-semibold text-sm">Add User</span>
                    </Link>
                </div>
            </div>

            {/* Filters & Pagination Info */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="relative flex-1 max-w-md w-full">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users on this page..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 placeholder:text-slate-400 font-medium transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm font-medium text-slate-500">
                    Showing {filteredUsers.length} of {totalUsers} Users (Page {page} of {totalPages})
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100 table-fixed">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                                                    {buildProfileImageUrl(user.profilePicture) ? (
                                                        <Image src={buildProfileImageUrl(user.profilePicture)!} alt={user.fullName} width={40} height={40} className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.fullName.charAt(0)
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{user.fullName}</div>
                                                    <div className="text-xs text-slate-400">ID: {user._id.substring(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-600">{user.email}</span>
                                                <span className="text-xs text-slate-400">{user.phoneNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-flex items-center gap-1.5 ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-purple-500' : 'bg-emerald-500'}`}></span>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/users/${user._id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <FaEye size={16} />
                                                </Link>
                                                <Link href={`/admin/users/${user._id}/edit`} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                                                    <FaEdit size={16} />
                                                </Link>
                                                <button onClick={() => handleDelete(user._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete user">
                                                    <FaTrash size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                            No users found matching &quot;{searchTerm}&quot;
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <FaChevronLeft size={12} />
                        Previous
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === p
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-white hover:shadow-sm"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                        <FaChevronRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}
