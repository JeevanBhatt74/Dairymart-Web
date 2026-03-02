"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface CartItem {
    product: {
        _id: string;
        name: string;
        price: number;
        image?: string;
        category: string;
    };
    quantity: number;
}

interface Cart {
    _id: string;
    user: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

interface CartContextType {
    cart: Cart | null;
    cartCount: number;
    loading: boolean;
    fetchCart: () => Promise<void>;
    addToCart: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const getAuthToken = () => {
        return localStorage.getItem("token");
    };

    const fetchCart = async () => {
        try {
            setLoading(true);
            const token = getAuthToken();
            if (!token) {
                setCart(null);
                setCartCount(0);
                return;
            }

            const response = await axios.get(`${API_URL}/cart`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                setCart(response.data.data);
                const count = response.data.data.items.reduce(
                    (sum: number, item: CartItem) => sum + item.quantity,
                    0
                );
                setCartCount(count);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCart(null);
            setCartCount(0);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId: string, quantity: number) => {
        const token = getAuthToken();
        if (!token) {
            // Throwing here to trigger the catch block in the component for redirect
            // Moved outside internal try/catch to avoid console.error logging
            throw new Error("Please login to add items to cart");
        }

        try {
            const response = await axios.post(
                `${API_URL}/cart`,
                { productId, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                await fetchCart(); // Refresh cart
            }
        } catch (error: any) {
            console.error("Error adding to cart:", error);
            throw error;
        }
    };

    const removeFromCart = async (productId: string) => {
        try {
            const token = getAuthToken();
            if (!token) return;

            const response = await axios.delete(`${API_URL}/cart/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                await fetchCart(); // Refresh cart
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            const token = getAuthToken();
            if (!token) return;

            const response = await axios.delete(`${API_URL}/cart`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                setCart(null);
                setCartCount(0);
            }
        } catch (error) {
            console.error("Error clearing cart:", error);
            throw error;
        }
    };

    // Fetch cart on mount if user is logged in
    useEffect(() => {
        // Basic check if we might have a token
        const token = getAuthToken();
        if (token) {
            fetchCart();
        }
    }, []);

    return (
        <CartContext.Provider
            value={{
                cart,
                cartCount,
                loading,
                fetchCart,
                addToCart,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
