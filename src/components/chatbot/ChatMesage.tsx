import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PlantResults from './PlantResults';
import type { PlantPrediction } from '@/lib/types';

interface Message {
    id: string;
    content: string;
    sender: "user" | "bot";
    timestamp: Date;
    plantResults?: PlantPrediction[];
    sources?: Array<{ plant_name: string; relevance?: number }>;
    image?: File | string; // Match types.ts definition
    selectedPlant?: string;
}

interface ChatMessageProps {
    message: Message;
    onSelectPlant?: (prediction: PlantPrediction) => void;
    onNoneMatch?: () => void;
}

export function ChatMessage({ message, onSelectPlant, onNoneMatch }: ChatMessageProps) {
    const isUser = message.sender === "user";

    return (
        <div
            key={message.id}
            className={`flex ${isUser ? "justify-end" : "justify-start"} message-fade-in`}
        >
            <div className="flex items-start gap-3 max-w-[85%]">
                <div
                    className={`rounded-2xl px-6 py-4 shadow-md ${isUser
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

                    {/* User uploaded image */}
                    {message.image && (
                        <img
                            src={message.image}
                            alt="Uploaded"
                            className="max-w-[200px] rounded-lg mb-2"
                        />
                    )}

                    {/* Render markdown for bot messages, plain text for user */}
                    {message.sender === "bot" ? (
                        <div className="prose prose-sm max-w-none
                            prose-p:text-sm prose-p:leading-relaxed prose-p:my-1
                            prose-strong:text-primary prose-strong:font-semibold
                            prose-em:text-muted-foreground prose-em:italic
                            prose-table:text-xs prose-table:border-collapse
                            prose-th:border prose-th:border-primary/20 prose-th:bg-primary/5 prose-th:px-2 prose-th:py-1
                            prose-td:border prose-td:border-primary/10 prose-td:px-2 prose-td:py-1
                            prose-ul:text-sm prose-ul:my-1
                            prose-li:my-0.5">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <p className="text-sm leading-relaxed text-pretty">{message.content}</p>
                    )}

                    {/* Plant Results */}
                    {message.plantResults && message.plantResults.length > 0 && (
                        <PlantResults
                            predictions={message.plantResults}
                            onSelectPlant={onSelectPlant}
                            onNoneMatch={onNoneMatch}
                        />
                    )}

                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-primary/10">
                            <p className="text-xs font-semibold text-primary mb-2">📚 Nguồn tham khảo:</p>
                            <div className="flex flex-wrap gap-2">
                                {message.sources.map((source, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                                    >
                                        🌿 {source.plant_name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
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
                        <div className="w-2 h-2 rounded-full bg-primary pulse-dot" style={{ animationDelay: "0s" }} />
                        <div className="w-2 h-2 rounded-full bg-accent pulse-dot" style={{ animationDelay: "0.2s" }} />
                        <div className="w-2 h-2 rounded-full bg-secondary pulse-dot" style={{ animationDelay: "0.4s" }} />
                    </div>
                </div>
            </div>
        </div>
    );
}