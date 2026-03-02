"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Message {
    _id: string;
    sender: string;
    senderType: "user" | "admin";
    content: string;
    timestamp: string;
}

export default function UserChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const userIdRef = useRef<string | null>(null);
    const router = useRouter();

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    useEffect(() => {
        setMounted(true);

        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) return;

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

        const socket = io(baseUrl, { transports: ["websocket"] });
        socketRef.current = socket;

        socket.on("connect", () => socket.emit("join", userId));

        socket.on("receiveMessage", (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on("messageSent", (msg: Message) => {
            setMessages((prev) =>
                prev.map((m) => (m._id.startsWith("temp_") && m.content === msg.content ? msg : m))
            );
        });

        return () => { socket.disconnect(); };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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

    const formatDate = (ts: string) => {
        const d = new Date(ts);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) return "Today";
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
        return d.toLocaleDateString([], { month: "short", day: "numeric" });
    };

    if (!mounted) return null;

    if (!isLoggedIn) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, #0084FF20, #00C6FF20)" }}>
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Chat with Support</h2>
                <p className="text-slate-500 mb-6">Please log in to chat with our support team.</p>
                <button
                    onClick={() => router.push("/login")}
                    className="px-6 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, #0084FF, #0099FF)" }}
                >
                    Log In
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Back + Header */}
            <div className="mb-6">
                <Link href="/dashboard" className="text-sm text-blue-500 hover:underline mb-2 inline-block">
                    ← Back to Dashboard
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #0084FF, #00C6FF)" }}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">DairyMart Support</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                            <span className="text-sm text-slate-500">Usually replies instantly</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Container */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden" style={{ height: "calc(100vh - 280px)", minHeight: "400px" }}>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-5" style={{ height: "calc(100% - 72px)" }}>
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #0084FF20, #00C6FF20)" }}>
                                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-slate-700 mb-1">Hi there! 👋</p>
                            <p className="text-xs text-slate-500">Send a message to start chatting with our support team.</p>
                        </div>
                    ) : (
                        messages.map((msg, i) => {
                            const isMe = msg.senderType === "user";
                            const nextMsg = messages[i + 1];
                            const showTail = !nextMsg || nextMsg.senderType !== msg.senderType;
                            const prevMsg = messages[i - 1];
                            const showDate = !prevMsg || formatDate(prevMsg.timestamp) !== formatDate(msg.timestamp);

                            return (
                                <div key={msg._id}>
                                    {showDate && (
                                        <div className="flex justify-center my-4">
                                            <span className="text-[11px] text-slate-400 bg-slate-100 px-3 py-1 rounded-full font-medium">
                                                {formatDate(msg.timestamp)}
                                            </span>
                                        </div>
                                    )}
                                    <div className={`flex ${isMe ? "justify-end" : "justify-start"} ${showTail ? "mb-3" : "mb-0.5"}`}>
                                        <div className="max-w-[65%]">
                                            <div
                                                className={`px-4 py-2.5 text-[14px] leading-relaxed ${isMe
                                                        ? `text-white rounded-2xl ${showTail ? "rounded-br-sm" : "rounded-2xl"}`
                                                        : `text-slate-800 rounded-2xl ${showTail ? "rounded-bl-sm" : "rounded-2xl"} bg-slate-50 border border-slate-100`
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
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-5 py-4 bg-white border-t border-slate-100">
                    <form onSubmit={handleSend} className="flex items-center gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-5 py-3 bg-slate-50 rounded-xl text-sm outline-none focus:bg-slate-100 transition-colors placeholder:text-slate-400 border-none"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-30 active:scale-90"
                            style={{ background: "linear-gradient(135deg, #0084FF, #0099FF)" }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
