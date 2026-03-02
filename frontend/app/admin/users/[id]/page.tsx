"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ViewUserPage() {
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${API_URL}/admin/users/${params.id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setUser(data.data);
            } catch (error) {
                console.error("Fetch error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [params.id]);

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>User not found</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-blue-600 mb-4">← Back to List</button>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex gap-8">
                <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm flex-shrink-0">
                    {user.profilePicture ? (
                        <img src={user.profilePicture.startsWith('http') ? user.profilePicture : `${BASE_URL}${user.profilePicture}`} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl">👤</span>
                    )}
                </div>

                <div className="space-y-4 flex-1">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block mt-2 ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                            {user.role}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <div>
                            <span className="block text-gray-500">Email</span>
                            <span className="font-medium">{user.email}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500">Phone</span>
                            <span className="font-medium">{user.phoneNumber}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="block text-gray-500">Address</span>
                            <span className="font-medium">{user.address}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500">Joined</span>
                            <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
