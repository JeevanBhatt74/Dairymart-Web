"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-white/30 backdrop-blur-xl border-t border-white/30 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] pt-20 pb-10 mt-16 text-slate-800">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block relative h-16 w-auto bg-white/40 rounded-xl p-2 backdrop-blur-sm shadow-sm border border-white/50">
                            <Image
                                src="/logo.png"
                                alt="DairyMart Logo"
                                width={150}
                                height={60}
                                className="object-contain h-full w-auto"
                            />
                        </Link>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Delivering the freshest organic dairy products directly from local farmers to your doorstep. Pure, natural, and healthy.
                        </p>
                        <div className="flex gap-4">
                            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/60 border border-white/50 flex items-center justify-center text-slate-500 hover:bg-black hover:text-white transition-all transform hover:scale-110 shadow-sm">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            {['Home', 'Products', 'About Us', 'Contact', 'FAQ'].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-slate-600 hover:text-black transition-colors font-medium text-sm">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg mb-6">Categories</h3>
                        <ul className="space-y-4">
                            {['Fresh Milk', 'Organic Cheese', 'Butter & Ghee', 'Yogurt', 'Ice Cream'].map((item) => (
                                <li key={item}>
                                    <Link href="/products" className="text-slate-600 hover:text-black transition-colors font-medium text-sm">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mt-1">
                                    <FaMapMarkerAlt size={14} />
                                </div>
                                <span className="text-slate-600 text-sm">Kathmandu, Nepal <br />Baneshowor - 10</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <FaPhone size={14} />
                                </div>
                                <span className="text-slate-600 text-sm">+977 9800000000</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <FaEnvelope size={14} />
                                </div>
                                <span className="text-slate-600 text-sm">support@dairymart.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-xs">© 2024 DairyMart. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="text-slate-500 hover:text-black text-xs font-medium transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-slate-500 hover:text-black text-xs font-medium transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
