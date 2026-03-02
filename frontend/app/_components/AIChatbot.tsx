"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface ChatMessage {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

const GROQ_API_KEY = "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";
const SYSTEM_PROMPT = `You are DairyMart AI, a friendly and knowledgeable assistant for DairyMart — a premium online dairy products store.

Your role:
- Help customers find the right dairy products (milk, cheese, yogurt, butter, ghee, cream).
- Answer questions about product quality, freshness, pricing, nutrition, and delivery.
- Assist with order tracking, returns, and general support queries.
- Recommend products based on customer preferences and dietary needs.

Tone: Warm, professional, and concise. Use emojis sparingly for a friendly feel.
Keep responses short (2-4 sentences) unless the user asks for detail.
If you don't know something specific about DairyMart's operations, say so honestly and suggest contacting support.`;

const SUGGESTIONS = [
    "🥛 What milk do you have?",
    "🧀 Best cheese for pizza?",
    "📦 Track my order",
    "🥜 Lactose-free options?",
];

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const chatHistoryRef = useRef<{ role: string; content: string }[]>([
        { role: "system", content: SYSTEM_PROMPT },
    ]);
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith("/admin");

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const sendToGroq = async (userMessage: string): Promise<string> => {
        chatHistoryRef.current.push({ role: "user", content: userMessage });

        try {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: chatHistoryRef.current,
                    temperature: 0.7,
                    max_tokens: 512,
                }),
            });

            if (!res.ok) {
                chatHistoryRef.current.pop();
                if (res.status === 429) return "⏳ Rate limit reached. Please wait a moment and try again.";
                return `⚠️ API Error ${res.status}`;
            }

            const data = await res.json();
            const reply = data.choices[0].message.content;
            chatHistoryRef.current.push({ role: "assistant", content: reply });
            return reply;
        } catch (e) {
            chatHistoryRef.current.pop();
            return "⚠️ Failed to connect to AI. Please try again.";
        }
    };

    const handleSend = async (text?: string) => {
        const msg = (text || input).trim();
        if (!msg || isLoading) return;

        const userMsg: ChatMessage = {
            id: `user_${Date.now()}`,
            text: msg,
            isUser: true,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        const reply = await sendToGroq(msg);

        const botMsg: ChatMessage = {
            id: `bot_${Date.now()}`,
            text: reply,
            isUser: false,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsLoading(false);
    };

    const handleClear = () => {
        setMessages([]);
        chatHistoryRef.current = [{ role: "system", content: SYSTEM_PROMPT }];
    };

    const formatTime = (date: Date) =>
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (!mounted || isAdminPage) return null;

    return (
        <>
            {/* Floating AI Button */}
            {!isOpen && (
                <button
                    onClick={() => {
                        setIsOpen(true);
                        setTimeout(() => inputRef.current?.focus(), 200);
                    }}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-2xl"
                    style={{ background: "linear-gradient(135deg, #29ABE2, #7C3AED)" }}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8V4m0 4a4 4 0 1 1 0 8m0-8a4 4 0 1 0 0 8m-4 4h8m-4 0v4" />
                    </svg>
                    {/* Robot face icon */}
                    <span className="absolute text-lg">🤖</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-6 right-6 z-50 w-[390px] h-[540px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/60"
                    style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                    {/* Header */}
                    <div
                        className="px-5 py-4 flex items-center gap-3 text-white"
                        style={{ background: "linear-gradient(135deg, #29ABE2, #7C3AED)" }}
                    >
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-lg">
                            🤖
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-[15px] leading-tight">DairyMart AI</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                                <span className="text-[11px] opacity-80">Online • AI Assistant</span>
                            </div>
                        </div>
                        <button
                            onClick={handleClear}
                            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                            title="New Chat"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 bg-slate-50/50">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-2xl"
                                    style={{ background: "linear-gradient(135deg, #29ABE220, #7C3AED20)" }}
                                >
                                    🐄
                                </div>
                                <p className="text-sm font-bold text-slate-800 mb-1">
                                    Hi! I&apos;m DairyMart AI 🤖
                                </p>
                                <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                                    Ask me about products, nutrition, orders, or delivery!
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {SUGGESTIONS.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleSend(s.replace(/[^\w\s?]/g, "").trim())}
                                            className="px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all hover:shadow-sm active:scale-95"
                                            style={{
                                                borderColor: "#29ABE240",
                                                color: "#475569",
                                                background: "white",
                                            }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.isUser ? "justify-end" : "justify-start"} mb-3`}
                                    >
                                        {!msg.isUser && (
                                            <div
                                                className="w-7 h-7 rounded-lg flex items-center justify-center mr-2 mt-1 text-xs flex-shrink-0"
                                                style={{ background: "linear-gradient(135deg, #29ABE2, #7C3AED)" }}
                                            >
                                                🤖
                                            </div>
                                        )}
                                        <div className="max-w-[75%]">
                                            <div
                                                className={`px-3.5 py-2.5 text-[13px] leading-relaxed rounded-2xl ${msg.isUser
                                                        ? "text-white rounded-br-sm"
                                                        : "text-slate-800 rounded-bl-sm bg-white border border-slate-100 shadow-sm"
                                                    }`}
                                                style={
                                                    msg.isUser
                                                        ? { background: "linear-gradient(135deg, #29ABE2, #7C3AED)" }
                                                        : {}
                                                }
                                            >
                                                {msg.text}
                                            </div>
                                            <span
                                                className={`text-[10px] text-slate-400 mt-0.5 px-1 block ${msg.isUser ? "text-right" : "text-left"
                                                    }`}
                                            >
                                                {formatTime(msg.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start mb-3">
                                        <div
                                            className="w-7 h-7 rounded-lg flex items-center justify-center mr-2 mt-1 text-xs flex-shrink-0"
                                            style={{ background: "linear-gradient(135deg, #29ABE2, #7C3AED)" }}
                                        >
                                            🤖
                                        </div>
                                        <div className="px-4 py-3 bg-white rounded-2xl rounded-bl-sm border border-slate-100 shadow-sm">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="px-4 py-3 bg-white border-t border-slate-100">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                disabled={isLoading}
                                className="flex-1 px-4 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:bg-slate-100 transition-colors placeholder:text-slate-400 border-none disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-30 active:scale-90"
                                style={{ background: "linear-gradient(135deg, #29ABE2, #7C3AED)" }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
