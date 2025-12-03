'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Input, Card } from '@veil/ui';
import { MessageSquare, X, Send, Sparkles, Shield, HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    role: 'user' | 'ai';
    text: string;
}

const INITIAL_MESSAGES: Message[] = [
    {
        id: '1',
        role: 'ai',
        text: "Hi! I'm your Veil Concierge. I can help you with privacy questions, payment issues, or finding creators. How can I assist you today?"
    }
];

const SUGGESTED_QUESTIONS = [
    "How do I buy Zcash?",
    "Is my payment really private?",
    "I lost my secret key.",
    "How do subscriptions work?"
];

export function AiConcierge() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            let responseText = "I'm a demo AI, but I'd help you with that in the full version!";

            if (text.toLowerCase().includes('zcash') || text.toLowerCase().includes('buy')) {
                responseText = "To buy Zcash (ZEC), you can use exchanges like Coinbase, Gemini, or Kraken. Once purchased, withdraw it to a shielded wallet like Zashi or Nighthawk for maximum privacy.";
            } else if (text.toLowerCase().includes('private') || text.toLowerCase().includes('track')) {
                responseText = "Yes, Veil uses Zcash shielded transactions. This means the sender, receiver, and amount are encrypted on the blockchain. No one can track your payments to your identity.";
            } else if (text.toLowerCase().includes('key') || text.toLowerCase().includes('lost')) {
                responseText = "Oh no! Your secret key is generated locally in your browser for your security. Veil does not store it. If you've lost it, you may lose access to your content. Please check if you downloaded the backup file.";
            }

            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: responseText };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[350px] pointer-events-auto"
                    >
                        <Card className="glass-card border-white/10 shadow-2xl overflow-hidden flex flex-col h-[500px]">
                            {/* Header */}
                            <div className="p-4 border-b border-white/5 bg-zinc-900/50 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Veil Concierge</h3>
                                        <p className="text-xs text-green-500 flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                            Online
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                                    ? 'bg-primary text-white rounded-tr-none'
                                                    : 'bg-zinc-800 text-zinc-200 rounded-tl-none'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none flex gap-1">
                                            <span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Suggestions */}
                            {messages.length === 1 && (
                                <div className="px-4 pb-2">
                                    <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {SUGGESTED_QUESTIONS.map((q) => (
                                            <button
                                                key={q}
                                                onClick={() => handleSendMessage(q)}
                                                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full transition-colors border border-white/5"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Input */}
                            <div className="p-4 border-t border-white/5 bg-zinc-900/30">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage(inputValue);
                                    }}
                                    className="flex gap-2"
                                >
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Ask about privacy, payments..."
                                        className="bg-zinc-950/50 border-white/10 focus-visible:ring-primary/50"
                                    />
                                    <Button type="submit" size="icon" variant="glow" disabled={!inputValue.trim() || isTyping}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-14 rounded-full bg-primary shadow-lg shadow-primary/25 flex items-center justify-center text-white pointer-events-auto border border-white/10"
            >
                {isOpen ? <ChevronDown className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            </motion.button>
        </div>
    );
}
