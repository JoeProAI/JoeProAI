"use client";

import React, { useState, useRef, useEffect } from 'react';

const ChatInterface = () => {
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
        { role: 'ai', content: 'Gork 4.1-fast initialized. Systems nominal. Awaiting input.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "Processing data stream...",
                "That's an interesting perspective. Tell me more.",
                "Accessing neural pathways... optimization complete.",
                "I can help you with that. Let's dive into the code.",
                "System alert: Creativity levels spiking.",
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            setMessages(prev => [...prev, { role: 'ai', content: randomResponse }]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-cyber-darker border border-neon-cyan/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)]">
            {/* Header */}
            <div className="bg-cyber-light/80 backdrop-blur border-b border-neon-cyan/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse" />
                    <h2 className="text-neon-cyan font-mono font-bold tracking-wider">GORK 4.1-FAST</h2>
                </div>
                <div className="text-xs text-gray-500 font-mono">V.4.1.0</div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm scrollbar-thin scrollbar-thumb-neon-cyan/20 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
              max-w-[80%] p-3 rounded-lg
              ${msg.role === 'user'
                                ? 'bg-neon-blue/10 border border-neon-blue/30 text-blue-100 rounded-br-none'
                                : 'bg-neon-cyan/10 border border-neon-cyan/30 text-cyan-100 rounded-bl-none'}
            `}>
                            <div className="text-xs opacity-50 mb-1 uppercase">{msg.role === 'user' ? 'User' : 'Gork'}</div>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-neon-cyan/10 border border-neon-cyan/30 text-cyan-100 p-3 rounded-lg rounded-bl-none">
                            <span className="animate-pulse">_</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-cyber-light/50 border-t border-neon-cyan/20">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter command or query..."
                        className="flex-1 bg-cyber-dark border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all font-mono text-sm"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan rounded-lg hover:bg-neon-cyan/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all font-bold uppercase text-sm"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
