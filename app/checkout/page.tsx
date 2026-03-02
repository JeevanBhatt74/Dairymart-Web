"use client";

import { useCart } from "@/app/_context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaMoneyBillWave, FaCreditCard, FaCheckCircle, FaWallet } from "react-icons/fa";
import axios from "axios";

export default function CheckoutPage() {
    const { cart, loading, clearCart } = useCart();
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        fullName: "User Name",
        address: "Kathmandu, Nepal",
        phone: "+977 9800000000",
        paymentMethod: "COD"
    });

    // Loyalty
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [discountAvailable, setDiscountAvailable] = useState(false);
    const [useDiscount, setUseDiscount] = useState(false);
    const [pointsToNext, setPointsToNext] = useState(100);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

    const subtotal = cart?.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;
    const deliveryFee = 50;
    const discountAmount = useDiscount && discountAvailable && (subtotal + deliveryFee) >= 1000 ? Math.round((subtotal + deliveryFee) * 0.2) : 0;
    const total = subtotal + deliveryFee - discountAmount;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        (async () => {
            try {
                const res = await axios.get(`${API_URL.replace('/api', '')}/api/loyalty/points`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setLoyaltyPoints(res.data.data.loyaltyPoints);
                    setDiscountAvailable(res.data.data.discountAvailable);
                    setPointsToNext(res.data.data.pointsToNextDiscount);
                }
            } catch (e) { /* silent */ }
        })();
    }, [API_URL]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {
        setError(null);
        setIsPlacingOrder(true);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to place an order.");
            setIsPlacingOrder(false);
            router.push("/login");
            return;
        }

        try {
            const orderItems = cart?.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            }));

            if (!orderItems || orderItems.length === 0) {
                setError("Your cart is empty.");
                setIsPlacingOrder(false);
                return;
            }

            const payload = {
                items: orderItems,
                totalAmount: total,
                shippingAddress: `${formData.address}, ${formData.phone}`,
                paymentMethod: formData.paymentMethod,
                useDiscount: useDiscount && discountAvailable && total >= 1000,
            };

            // 1. Create Order
            const res = await axios.post(`${API_URL}/orders`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                const orderId = res.data.data._id;
                clearCart();

                // 2. Handle Payment Flow
                if (formData.paymentMethod === "ESEWA") {
                    // Call Backend to get Esewa Signature & Config
                    const esewaRes = await axios.post(`${API_URL}/payment/initiate/esewa`, {
                        orderId,
                        amount: total
                    });

                    if (esewaRes.data.success) {
                        submitEsewaForm(esewaRes.data.data);
                    }
                } else if (formData.paymentMethod === "KHALTI") {
                    // Call Backend to initiate Khalti
                    const successUrl = `${window.location.origin}/payment/success`;
                    const failureUrl = `${window.location.origin}/payment/failure`;

                    const khaltiRes = await axios.post(`${API_URL}/payment/initiate/khalti`, {
                        orderId,
                        amount: total,
                        name: formData.fullName,
                        email: "customer@example.com",
                        phone: formData.phone,
                        successUrl: successUrl,
                        failureUrl: failureUrl
                    });

                    if (khaltiRes.data.success) {
                        window.location.href = khaltiRes.data.data.payment_url;
                    }
                } else {
                    // COD - Direct Success
                    setStep(3);
                }
            }
        } catch (err: any) {
            console.error("Order placement failed", err);
            setError(err.response?.data?.message || "Failed to place order. Please try again.");
            setIsPlacingOrder(false);
        }
    };

    const submitEsewaForm = (data: any) => {
        const form = document.createElement("form");
        form.action = data.esewa_url;
        form.method = "POST";
        form.style.display = "none";

        for (const key in data) {
            if (key === "esewa_url") continue;
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = data[key];
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    };

    if (loading) return null;

    if (step === 3) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-24 h-24 bg-green-100 text-green-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <FaCheckCircle size={48} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-500 max-w-md mb-8">
                    Your order has been placed successfully. You will receive an email confirmation shortly.
                </p>
                <div className="flex gap-4">
                    <button onClick={() => router.push("/orders")} className="px-6 py-3 bg-[var(--dm-primary-blue)] text-white rounded-xl font-bold hover:bg-blue-600 transition-colors">
                        View Orders
                    </button>
                    <button onClick={() => router.push("/")} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-xl text-center">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left Column: Forms */}
                    <div className="space-y-6">
                        {/* Address Section */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-[var(--dm-primary-blue)] flex items-center justify-center text-sm font-bold">1</div>
                                Shipping Address
                            </h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Address Line 1"
                                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone Number"
                                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-[var(--dm-primary-blue)] flex items-center justify-center text-sm font-bold">2</div>
                                Payment Method
                            </h2>
                            <div className="space-y-3">
                                {/* Cash on Delivery */}
                                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'border-[var(--dm-primary-blue)] bg-blue-50/50' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={formData.paymentMethod === "COD"}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-[var(--dm-primary-blue)] accent-[var(--dm-primary-blue)]"
                                    />
                                    <div className="flex items-center gap-3">
                                        <FaMoneyBillWave className="text-green-600 text-xl" />
                                        <span className="font-bold text-gray-700">Cash on Delivery</span>
                                    </div>
                                </label>

                                {/* eSewa */}
                                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'ESEWA' ? 'border-green-500 bg-green-50/50' : 'border-gray-200 hover:border-green-200'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="ESEWA"
                                        checked={formData.paymentMethod === "ESEWA"}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-green-500 accent-green-500"
                                    />
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold text-xs uppercase">eSewa</div>
                                        <span className="font-bold text-gray-700">eSewa Mobile Wallet</span>
                                    </div>
                                </label>

                                {/* Khalti */}
                                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'KHALTI' ? 'border-purple-500 bg-purple-50/50' : 'border-gray-200 hover:border-purple-200'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="KHALTI"
                                        checked={formData.paymentMethod === "KHALTI"}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-purple-600 accent-purple-600"
                                    />
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-xs uppercase">Khalti</div>
                                        <span className="font-bold text-gray-700">Khalti Digital Wallet</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div>
                        <div className="bg-white p-6 rounded-[24px] shadow-lg shadow-blue-500/5 border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Your Order</h2>
                            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                                {cart?.items.map((item) => (
                                    <div key={item.product._id} className="flex items-center gap-4 py-2 border-b border-gray-50">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.product.image?.startsWith('http') ? item.product.image : `${BASE_URL}${item.product.image}`} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.product.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-gray-700 text-sm">Rs. {(item.product.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mt-6 pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Subtotal</span>
                                    <span>Rs. {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Delivery Fee</span>
                                    <span>Rs. {deliveryFee.toFixed(2)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600 text-sm font-semibold">
                                        <span>🎉 Loyalty Discount (20%)</span>
                                        <span>-Rs. {discountAmount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                                    <span>Total</span>
                                    <span>Rs. {total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Loyalty Points Section */}
                            <div className="mt-4 p-4 rounded-xl border" style={{ background: 'linear-gradient(135deg, #7C3AED08, #29ABE210)', borderColor: '#29ABE230' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">⭐</span>
                                        <span className="text-sm font-bold text-gray-700">Loyalty Points</span>
                                    </div>
                                    <span className="text-sm font-bold text-white bg-[var(--dm-primary-blue)] px-3 py-1 rounded-full">{loyaltyPoints} pts</span>
                                </div>
                                {!discountAvailable && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">{pointsToNext} more pts to unlock 20% discount</p>
                                        <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${Math.min(100, (loyaltyPoints / 100) * 100)}%`, background: 'linear-gradient(90deg, #29ABE2, #7C3AED)' }} />
                                        </div>
                                    </div>
                                )}
                                {discountAvailable && (subtotal + deliveryFee) >= 1000 && (
                                    <label className="flex items-center justify-between cursor-pointer mt-1">
                                        <span className="text-sm font-semibold text-green-700">🎉 Use 100 pts for 20% off!</span>
                                        <input type="checkbox" checked={useDiscount} onChange={(e) => setUseDiscount(e.target.checked)} className="w-5 h-5 accent-[var(--dm-primary-blue)]" />
                                    </label>
                                )}
                                {discountAvailable && (subtotal + deliveryFee) < 1000 && (
                                    <p className="text-xs text-orange-600 mt-1">✨ Add Rs. {1000 - (subtotal + deliveryFee)} more for 20% off</p>
                                )}
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder || !cart || cart.items.length === 0}
                                className={`w-full mt-6 py-4 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 ${isPlacingOrder ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--dm-primary-blue)] hover:bg-blue-600 shadow-blue-500/20'}`}
                            >
                                {isPlacingOrder ? "Processing..." : "Place Order"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
