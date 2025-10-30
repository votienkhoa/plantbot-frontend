import React from 'react';
import { ChatMessage, TypingIndicator } from './ChatMesage'; // Import component đã tạo

interface Message {
    id: string;
    content: string;
    sender: "user" | "bot";
    timestamp: Date;
}

interface MessageListProps {
    messages: Message[];
    isTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessageList({ messages, isTyping, messagesEndRef }: MessageListProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}

                {isTyping && <TypingIndicator />}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}