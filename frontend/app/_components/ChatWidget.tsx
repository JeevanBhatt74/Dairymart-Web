"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";

interface Message {
    _id: string;
    sender: string;
    senderType: "user" | "admin";
    content: string;
    timestamp: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [unread, setUnread] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isOpenRef = useRef(false);
    const userIdRef = useRef<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    // Hide on admin pages
    const isAdminPage = pathname.startsWith("/admin");

    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    // Mount + auth check + socket init
    useEffect(() => {
        setMounted(true);

        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (userId && token) {
            setIsLoggedIn(true);
            userIdRef.current = userId;

            // Fetch messages
            (async () => {
                try {
                    const res = await axios.get(`${baseUrl}/api/chat/messages/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setMessages(res.data.data || []);
                } catch (err) {
                    console.error("Failed to fetch messages:", err);
                }
            })();

            // Socket
            const socket = io(baseUrl, { transports: ["websocket"] });
            socketRef.current = socket;

            socket.on("connect", () => {
                socket.emit("join", userId);
            });

            socket.on("receiveMessage", (msg: Message) => {
                setMessages((prev) => [...prev, msg]);
                if (!isOpenRef.current) setUnread((u) => u + 1);
            });

            socket.on("messageSent", (msg: Message) => {
                setMessages((prev) =>
                    prev.map((m) =>
                        m._id.startsWith("temp_") && m.content === msg.content ? msg : m
                    )
                );
            });

            return () => { socket.disconnect(); };
        }
    }, []);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const handleOpen = () => {
        setIsOpen(true);
        setUnread(0);
        setTimeout(() => inputRef.current?.focus(), 200);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        const userId = userIdRef.current;
        if (!newMessage.trim() || !userId) return;

        socketRef.current?.emit("sendMessage", {
            senderId: userId,
            receiverId: "admin",
            content: newMessage.trim(),
            senderType: "user",
        });

        const tempMsg: Message = {
            _id: `temp_${Date.now()}`,
            sender: userId,
            senderType: "user",
            content: newMessage.trim(),
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempMsg]);
        setNewMessage("");
        inputRef.current?.focus();
    };

    const formatTime = (ts: string) =>
        new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Don't render until mounted, and hide on admin pages
    if (!mounted || isAdminPage) return null;

    return (
        <>
            {/* Floating button — visible on ALL non-admin pages */}
            {!isOpen && (
                <button
                    onClick={handleOpen}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-2xl"
                    style={{ background: "linear-gradient(135deg, #0084FF, #00C6FF)" }}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    {unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                            {unread}
                        </span>
                    )}
                </button>
            )}

            {/* Chat window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/60" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {/* Header */}
                    <div className="px-5 py-4 flex items-center gap-3 text-white" style={{ background: "linear-gradient(135deg, #0084FF, #00C6FF)" }}>
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-[15px] leading-tight">DairyMart Support</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                                <span className="text-[11px] opacity-80">Usually replies instantly</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Content area */}
                    {!isLoggedIn ? (
                        /* Login prompt for non-authenticated users */
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 bg-slate-50/50">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: "linear-gradient(135deg, #0084FF20, #00C6FF20)" }}>
                                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                </svg>
                            </div>
                            <p className="text-[15px] font-bold text-slate-800 mb-2">Chat with us!</p>
                            <p className="text-sm text-slate-500 mb-6 leading-relaxed">Log in to your account to start a conversation with our support team.</p>
                            <button
                                onClick={() => router.push("/login")}
                                className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg active:scale-95"
                                style={{ background: "linear-gradient(135deg, #0084FF, #0099FF)" }}
                            >
                                Log In to Chat
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-4 py-4 bg-slate-50/50">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center px-6">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #0084FF20, #00C6FF20)" }}>
                                            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700 mb-1">Hi there! 👋</p>
                                        <p className="text-xs text-slate-500 leading-relaxed">How can we help you today?<br />Send us a message to get started.</p>
                                    </div>
                                ) : (
                                    messages.map((msg, i) => {
                                        const isMe = msg.senderType === "user";
                                        const nextMsg = messages[i + 1];
                                        const showTail = !nextMsg || nextMsg.senderType !== msg.senderType;

                                        return (
                                            <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"} ${showTail ? "mb-3" : "mb-0.5"}`}>
                                                <div className="max-w-[75%]">
                                                    <div
                                                        className={`px-3.5 py-2 text-[13px] leading-relaxed ${isMe
                                                                ? `text-white rounded-2xl ${showTail ? "rounded-br-sm" : "rounded-2xl"}`
                                                                : `text-slate-800 rounded-2xl ${showTail ? "rounded-bl-sm" : "rounded-2xl"} bg-white border border-slate-100 shadow-sm`
                                                            }`}
                                                        style={isMe ? { background: "linear-gradient(135deg, #0084FF, #0099FF)" } : {}}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                    {showTail && (
                                                        <div className={`flex items-center gap-1 mt-0.5 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                                                            <span className="text-[10px] text-slate-400">{formatTime(msg.timestamp)}</span>
                                                            {isMe && (
                                                                <svg className={`w-3 h-3 ${msg._id.startsWith("temp_") ? "text-slate-400" : "text-blue-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                                                    <polyline points="20 6 9 17 4 12" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="px-4 py-3 bg-white border-t border-slate-100">
                                <form onSubmit={handleSend} className="flex items-center gap-2">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:bg-slate-100 transition-colors placeholder:text-slate-400 border-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-30 active:scale-90"
                                        style={{ background: "linear-gradient(135deg, #0084FF, #0099FF)" }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
