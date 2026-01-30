"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
    _id: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any, qty: number) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, qty: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("dairymart_cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("dairymart_cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any, qty: number) => {
        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
            return [...prev, {
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: qty
            }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item._id !== id));
    };

    const updateQuantity = (id: string, qty: number) => {
        if (qty < 1) return;
        setCart(prev => prev.map(item => item._id === id ? { ...item, quantity: qty } : item));
    }

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
