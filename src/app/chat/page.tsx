"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import ChatSidebar from "@/components/chatbot/ChatSidebar";

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
            preview: "aeqweqwe",
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
                    "That's a great question! I'd be happy to help you with that. Plants are fascinating organisms with unique care requirements. Let me provide you with detailed information based on the latest botanical research and expert recommendations.",
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
        <div className="h-screen flex bg-gradient-to-br from-background via-primary/5 to-accent/10 overflow-hidden relative">
            <ChatSidebar
                chatHistory={chatHistory}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onNewChat={handleNewChat}
            />
        </div>
)
}
