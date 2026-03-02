"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

interface User {
    _id: string;
    fullName: string;
    email: string;
    profilePicture?: string;
}

interface Conversation {
    _id: string;
    user: User;
    lastMessage?: string;
    unreadCount: number;
    updatedAt: string;
}

interface Message {
    _id: string;
    conversationId: string;
    sender: string;
    senderType: "user" | "admin";
    content: string;
    timestamp: string;
}

export default function AdminChatPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const selectedUserRef = useRef<User | null>(null);

    const adminId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    // Keep ref in sync with state
    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    const fetchConversations = useCallback(async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/chat/conversations`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setConversations(res.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching conversations:", error);
            setIsLoading(false);
        }
    }, [baseUrl, token]);

    const fetchMessages = useCallback(async (userId: string) => {
        try {
            const res = await axios.get(`${baseUrl}/api/chat/messages/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(res.data.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }, [baseUrl, token]);

    const markAsRead = useCallback(async (userId: string) => {
        try {
            await axios.put(`${baseUrl}/api/chat/read/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setConversations((prev) =>
                prev.map((c) => (c.user._id === userId ? { ...c, unreadCount: 0 } : c))
            );
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    }, [baseUrl, token]);

    // Socket initialization — only once
    useEffect(() => {
        fetchConversations();

        const socket = io(baseUrl, { transports: ["websocket"] });
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Admin socket connected");
            if (adminId) socket.emit("join", adminId);
        });

        socket.on("receiveMessage", (message: Message) => {
            const currentSelected = selectedUserRef.current;
            if (currentSelected && message.sender === currentSelected._id) {
                setMessages((prev) => [...prev, message]);
                markAsRead(currentSelected._id);
            }
            fetchConversations();
        });

        socket.on("messageSent", (message: Message) => {
            // Replace temp message with server-confirmed one
            setMessages((prev) =>
                prev.map((m) =>
                    m._id.startsWith("temp_") && m.content === message.content ? message : m
                )
            );
            fetchConversations();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Load messages when selecting a user
    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser._id);
            markAsRead(selectedUser._id);
        }
    }, [selectedUser]);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser || !adminId) return;

        socketRef.current?.emit("sendMessage", {
            senderId: adminId,
            receiverId: selectedUser._id,
            content: newMessage.trim(),
            senderType: "admin",
        });

        // Optimistic update
        const tempMsg: Message = {
            _id: `temp_${Date.now()}`,
            conversationId: "",
            sender: adminId,
            senderType: "admin",
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
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        if (diff < 86400000) return "Today";
        if (diff < 172800000) return "Yesterday";
        return d.toLocaleDateString([], { month: "short", day: "numeric" });
    };

    const filteredConversations = conversations.filter((c) =>
        c.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group messages by date
    const groupedMessages: { date: string; msgs: Message[] }[] = [];
    messages.forEach((msg) => {
        const dateStr = formatDate(msg.timestamp);
        const last = groupedMessages[groupedMessages.length - 1];
        if (last && last.date === dateStr) {
            last.msgs.push(msg);
        } else {
            groupedMessages.push({ date: dateStr, msgs: [msg] });
        }
    });

    return (
        <div className="flex h-[calc(100vh-96px)] rounded-2xl overflow-hidden border border-slate-200/60" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            {/* Sidebar */}
            <div className="w-[340px] border-r border-slate-100 flex flex-col bg-white">
                {/* Sidebar header */}
                <div className="p-5 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight">Chats</h1>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[11px] font-semibold text-emerald-600">Online</span>
                        </div>
                    </div>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:bg-slate-100 transition-colors placeholder:text-slate-400 border-none"
                        />
                    </div>
                </div>

                {/* Conversation list */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-slate-400 font-medium">Loading...</span>
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-2 text-slate-400">
                            <svg className="w-10 h-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-sm font-medium">No conversations yet</span>
                        </div>
                    ) : (
                        filteredConversations.map((conv) => {
                            const isSelected = selectedUser?._id === conv.user._id;
                            return (
                                <button
                                    key={conv._id}
                                    onClick={() => setSelectedUser(conv.user)}
                                    className={`w-full px-5 py-3.5 flex items-center gap-3 transition-all duration-150 ${isSelected
                                            ? "bg-blue-50/80"
                                            : "hover:bg-slate-50/80"
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-12 h-12 rounded-full overflow-hidden ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}>
                                            {conv.user.profilePicture ? (
                                                <img src={conv.user.profilePicture} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                                    {conv.user.fullName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h3 className={`font-semibold truncate text-[14px] ${isSelected ? "text-blue-700" : "text-slate-800"}`}>
                                                {conv.user.fullName}
                                            </h3>
                                            <span className="text-[11px] text-slate-400 font-medium flex-shrink-0 ml-2">
                                                {formatDate(conv.updatedAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[13px] text-slate-500 truncate flex-1">
                                                {conv.lastMessage || "No messages yet"}
                                            </p>
                                            {conv.unreadCount > 0 && (
                                                <span className="bg-blue-500 text-white text-[10px] font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-50/40">
                {selectedUser ? (
                    <>
                        {/* Chat header */}
                        <div className="h-[72px] px-6 flex items-center gap-4 bg-white border-b border-slate-100">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    {selectedUser.profilePicture ? (
                                        <img src={selectedUser.profilePicture} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                            {selectedUser.fullName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="font-bold text-slate-900 text-[15px] leading-tight">{selectedUser.fullName}</h2>
                                <p className="text-[11px] text-emerald-500 font-semibold">Active now</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] text-slate-400">{selectedUser.email}</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            {groupedMessages.map((group, gi) => (
                                <div key={gi}>
                                    {/* Date divider */}
                                    <div className="flex items-center justify-center my-5">
                                        <span className="px-3 py-1 bg-slate-200/60 text-slate-500 text-[11px] font-semibold rounded-full">
                                            {group.date}
                                        </span>
                                    </div>
                                    {/* Messages in group */}
                                    {group.msgs.map((msg, mi) => {
                                        const isAdmin = msg.senderType === "admin";
                                        const nextMsg = group.msgs[mi + 1];
                                        const showTail = !nextMsg || nextMsg.senderType !== msg.senderType;

                                        return (
                                            <div
                                                key={msg._id}
                                                className={`flex ${isAdmin ? "justify-end" : "justify-start"} ${showTail ? "mb-3" : "mb-0.5"}`}
                                            >
                                                {/* User avatar (left side) */}
                                                {!isAdmin && showTail && (
                                                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 self-end">
                                                        {selectedUser.profilePicture ? (
                                                            <img src={selectedUser.profilePicture} alt="" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                                                {selectedUser.fullName.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {!isAdmin && !showTail && <div className="w-8 mr-2 flex-shrink-0" />}

                                                <div className={`max-w-[60%] ${!isAdmin ? "" : ""}`}>
                                                    <div
                                                        className={`px-4 py-2.5 text-[14px] leading-relaxed ${isAdmin
                                                                ? `text-white rounded-2xl ${showTail ? "rounded-br-sm" : "rounded-2xl"}`
                                                                : `text-slate-800 rounded-2xl ${showTail ? "rounded-bl-sm" : "rounded-2xl"} bg-white border border-slate-100 shadow-sm`
                                                            }`}
                                                        style={isAdmin ? { background: "linear-gradient(135deg, #0084FF 0%, #0099FF 100%)" } : {}}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                    {showTail && (
                                                        <div className={`flex items-center gap-1 mt-1 ${isAdmin ? "justify-end" : "justify-start"} px-1`}>
                                                            <span className="text-[10px] text-slate-400 font-medium">
                                                                {formatTime(msg.timestamp)}
                                                            </span>
                                                            {isAdmin && (
                                                                <svg className={`w-3.5 h-3.5 ${msg._id.startsWith("temp_") ? "text-slate-400" : "text-blue-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                                                    {msg._id.startsWith("temp_") ? (
                                                                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                                                    ) : (
                                                                        <><polyline points="20 6 9 17 4 12" /><polyline points="16 6 9 13" /></>
                                                                    )}
                                                                </svg>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input area */}
                        <div className="px-6 py-4 bg-white border-t border-slate-100">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-5 py-3 bg-slate-50 rounded-2xl text-sm outline-none focus:bg-slate-100 transition-colors placeholder:text-slate-400 border-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="h-11 w-11 flex items-center justify-center rounded-full text-white transition-all duration-200 disabled:opacity-30 active:scale-90 shadow-lg shadow-blue-200/50 hover:shadow-blue-300/60"
                                    style={{ background: "linear-gradient(135deg, #0084FF, #0099FF)" }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13" />
                                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    /* Empty state */
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                        <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-blue-100" style={{ background: "linear-gradient(135deg, #0084FF, #00C6FF)" }}>
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Your Messages</h2>
                        <p className="text-slate-500 max-w-xs text-sm leading-relaxed">
                            Select a customer from the left to view their messages and start helping them.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
