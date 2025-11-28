import React from 'react';
import { ChatMessage, TypingIndicator } from "@/components/chatbot/ChatMesage";
import type { Message, PlantPrediction } from "@/lib/types";

interface MessageListProps {
    messages: Message[];
    isTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    onSelectPlant?: (prediction: PlantPrediction) => void;
    onNoneMatch?: () => void;
}

export default function MessageList({
    messages,
    isTyping,
    messagesEndRef,
    onSelectPlant,
    onNoneMatch
}: MessageListProps) {
    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                        onSelectPlant={onSelectPlant}
                        onNoneMatch={onNoneMatch}
                    />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}