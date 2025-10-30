import React from 'react';

interface Message {
    id: string;
    content: string;
    sender: "user" | "bot";
    timestamp: Date;
}

interface ChatMessageProps {
    message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.sender === "user";

    return (
        <div
            key={message.id}
            className={`flex ${isUser ? "justify-end" : "justify-start"} message-fade-in`}
        >
            <div className="flex items-start gap-3 max-w-[85%]">
                <div
                    className={`rounded-2xl px-6 py-4 shadow-md ${
                        isUser
                            ? "bg-white/80 border border-accent/15 text-card-foreground"
                            : "bg-white/80 border border-primary/10 text-card-foreground"
                    }`}
                >
                    {message.sender === "bot" && (
                        <div className="flex items-center gap-2 mb-2">
                            <span
                                className="text-xs font-semibold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                                PlantBot AI
                            </span>
                        </div>
                    )}
                    <p className="text-sm leading-relaxed text-pretty">{message.content}</p>
                </div>
            </div>
        </div>
    );
}

// typing
export function TypingIndicator() {
    return (
        <div className="flex justify-start message-fade-in">
            <div className="flex items-start gap-3 max-w-[85%]">
                <div className="rounded-2xl px-6 py-4 bg-white/80 border border-primary/10 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <span
                            className="text-xs font-semibold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                            PlantBot AI
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary pulse-dot" style={{animationDelay: "0s"}}/>
                        <div className="w-2 h-2 rounded-full bg-accent pulse-dot" style={{animationDelay: "0.2s"}}/>
                        <div className="w-2 h-2 rounded-full bg-secondary pulse-dot" style={{animationDelay: "0.4s"}}/>
                    </div>
                </div>
            </div>
        </div>
    );
}