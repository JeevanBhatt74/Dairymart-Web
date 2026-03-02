import Link from "next/link";

export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">About DairyMart</h1>
                    <p className="text-xl md:text-2xl text-blue-100">
                        Delivering Fresh, Quality Dairy Products to Your Doorstep
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Our Mission & Vision</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <div className="text-4xl text-blue-600 mb-4">🎯</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                            <p className="text-slate-700 leading-relaxed">
                                To provide customers with the highest quality dairy and dairy-based products sourced directly from trusted farmers and producers. We aim to make nutritious, fresh products accessible to every household while ensuring fair practices and supporting local agriculture.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <div className="text-4xl text-blue-600 mb-4">🌟</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                            <p className="text-slate-700 leading-relaxed">
                                To become the most trusted online dairy marketplace in India, connecting quality producers with health-conscious consumers. We envision a future where fresh, authentic dairy products reach every doorstep with complete transparency and reliability.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Why Choose DairyMart?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-slate-50 rounded-lg">
                            <div className="text-5xl text-blue-600 mb-4">✓</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">100% Fresh & Authentic</h3>
                            <p className="text-slate-700">
                                All products sourced directly from verified farmers and certified producers. No middlemen, no compromise on quality.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-slate-50 rounded-lg">
                            <div className="text-5xl text-blue-600 mb-4">🚚</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Fast Express Delivery</h3>
                            <p className="text-slate-700">
                                Same-day delivery available in select areas. Products delivered in insulated containers maintaining optimal temperature.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-slate-50 rounded-lg">
                            <div className="text-5xl text-blue-600 mb-4">💰</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Best Prices Guaranteed</h3>
                            <p className="text-slate-700">
                                Direct sourcing means lower costs for you. Compare our prices and experience the difference quality makes.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-slate-50 rounded-lg">
                            <div className="text-5xl text-blue-600 mb-4">🛡️</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Quality Assurance</h3>
                            <p className="text-slate-700">
                                Every product undergoes rigorous quality checks. Our commitment to hygiene and standards is unmatched.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-slate-50 rounded-lg">
                            <div className="text-5xl text-blue-600 mb-4">♻️</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Eco-Friendly Practices</h3>
                            <p className="text-slate-700">
                                Sustainable packaging, reduced plastic usage, and support for environmentally conscious farming methods.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-slate-50 rounded-lg">
                            <div className="text-5xl text-blue-600 mb-4">👥</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">24/7 Customer Support</h3>
                            <p className="text-slate-700">
                                Our dedicated support team is always ready to help. Live chat, email, and phone support available round-the-clock.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold text-slate-900 mb-8">Our Story</h2>
                    <div className="space-y-6 text-slate-700 leading-relaxed">
                        <p>
                            DairyMart was founded with a simple yet powerful vision: to revolutionize how families access fresh dairy products. We recognized a gap in the market where consumers wanted authentic, traceable, and fresh products without the inflated costs of traditional retail chains.
                        </p>
                        <p>
                            Starting as a small initiative to connect local farmers with urban households, DairyMart has grown into a trusted platform serving thousands of customers across major cities. Our journey has been built on trust, transparency, and an unwavering commitment to quality.
                        </p>
                        <p>
                            Today, we partner with over 100+ verified dairy farms and producers, ensuring a consistent supply of premium products. From milk and yogurt to ghee and paneer, every item in our catalog is selected with care and delivered with pride.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="border-l-4 border-blue-600 pl-6 py-4">
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Integrity</h3>
                            <p className="text-slate-700">
                                We believe in honest dealings and complete transparency. Every product is what it claims to be, and every promise we make is kept.
                            </p>
                        </div>
                        <div className="border-l-4 border-blue-600 pl-6 py-4">
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Quality</h3>
                            <p className="text-slate-700">
                                Quality is non-negotiable. From sourcing to delivery, every step is monitored to ensure you receive only the best.
                            </p>
                        </div>
                        <div className="border-l-4 border-blue-600 pl-6 py-4">
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Sustainability</h3>
                            <p className="text-slate-700">
                                We care about our environment and support farming practices that are sustainable and ethical.
                            </p>
                        </div>
                        <div className="border-l-4 border-blue-600 pl-6 py-4">
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Community</h3>
                            <p className="text-slate-700">
                                We empower local farmers and producers, building a community where everyone benefits.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Overview */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Our Product Range</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "Fresh Milk", icon: "🥛" },
                            { name: "Paneer", icon: "🧀" },
                            { name: "Yogurt & Curds", icon: "🍯" },
                            { name: "Ghee & Butter", icon: "✨" },
                            { name: "Cheese Varieties", icon: "🧀" },
                            { name: "Cream Products", icon: "🥣" },
                            { name: "Khova & Mawa", icon: "🍮" },
                            { name: "Specialty items", icon: "⭐" },
                        ].map((product, idx) => (
                            <div key={idx} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
                                <div className="text-4xl mb-3">{product.icon}</div>
                                <h3 className="font-semibold text-slate-900">{product.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the DairyMart Family?</h2>
                    <p className="text-lg text-blue-100 mb-8">
                        Experience the freshness. Experience the difference. Start your journey with us today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-block"
                        >
                            Shop Now
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition inline-block"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer Info */}
            <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h3 className="text-2xl font-bold text-blue-600 mb-2">500+</h3>
                        <p className="text-slate-700">Happy Customers Served Daily</p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-blue-600 mb-2">100+</h3>
                        <p className="text-slate-700">Verified Farmers & Producers</p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-blue-600 mb-2">99%</h3>
                        <p className="text-slate-700">Customer Satisfaction Rate</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
