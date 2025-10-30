"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import ChatSidebar from "@/components/chatbot/ChatSidebar";
import{ Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageIcon, Mic, Send} from "lucide-react"
import MessageList from "@/components/chatbot/MessageList";

interface Message {
    id: string
    content: string
    sender: "user" | "bot"
    timestamp: Date
}

interface ChatHistory {
    id: string
    title: string
    preview: string
    timestamp: Date
}

export default function PlantBotChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            content:
                "Hello! I'm PlantBot, your AI-powered plant companion. I can help you identify plants, provide care tips, answer ecology questions, and much more. What would you like to know?",
            sender: "bot",
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [chatHistory] = useState<ChatHistory[]>([
        {
            id: "1",
            title: "What is this plant?",
            preview: "123123123",
            timestamp: new Date(Date.now() - 86400000),
        },
        {
            id: "2",
            title: "Is this a rare plant?",
            preview: "123123",
            timestamp: new Date(Date.now() - 172800000),
        },
        {
            id: "3",
            title: "Is this seed poisonous?",
            preview: "abc",
            timestamp: new Date(Date.now() - 259200000),
        },
    ])
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleSendMessage = () => {
        if (!inputValue.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            sender: "user",
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue("")
        setIsTyping(true)

        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                content:
                    "Good question",
                sender: "bot",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, botMessage])
            setIsTyping(false)
        }, 1500)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }
    const handleNewChat = () => {
        console.log("New chat initiated")
    }

    return (
        <div
            className="h-screen flex bg-gradient-to-br from-background via-primary/5 to-accent/10 overflow-hidden relative">
            <ChatSidebar
                chatHistory={chatHistory}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNewChat={handleNewChat}
            />
            <div className="flex-1 flex flex-col min-w-0">
                {/* Messages Area */}
                <MessageList messages={messages} isTyping={isTyping} messagesEndRef={messagesEndRef}/>

                {/* Input Area */}
                <div className="border-t border-primary/20 p-4 bg-card/80 backdrop-blur-xl">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-end gap-3">
                            <div className="flex-1 relative">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ask me anything about plants..."
                                    className="pr-24 py-6 rounded-2xl border-2 border-primary/20 bg-background focus-visible:ring-1 focus-visible:border-primary/30 text-foreground placeholder:text-muted-foreground resize-none shadow-lg"
                                />
                                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 rounded-xl hover:bg-accent/20 hover:text-accent transition-colors"
                                        onClick={() => {
                                        }}
                                    >
                                        <ImageIcon className="w-4 h-4"/>
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 rounded-xl hover:bg-accent/20 hover:text-accent transition-colors"
                                        onClick={() => {
                                        }}
                                    >
                                        <Mic className="w-4 h-4"/>
                                    </Button>
                                </div>
                            </div>
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-green"
                            >
                                <Send className="w-5 h-5 text-primary-foreground"/>
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-3">
                            PlantBot can make mistakes. Consider checking important information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
