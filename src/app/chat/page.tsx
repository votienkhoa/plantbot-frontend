"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import ChatSidebar from "@/components/chatbot/ChatSidebar";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageIcon, Mic, Send, X } from "lucide-react"
import MessageList from "@/components/chatbot/MessageList";
import PlantSelectionModal from "@/components/chatbot/PlantSelectionModal";
import { plantAPI } from "@/lib/api";
import type { Message, ChatHistory, PlantPrediction } from "@/lib/types";

export default function PlantBotChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            content:
                "Xin chào! Tôi là PlantBot, trợ lý AI về dược liệu Việt Nam. Tôi có thể giúp bạn nhận diện cây, tư vấn công dụng, và trả lời câu hỏi về dược liệu. Bạn cần gì?",
            sender: "bot",
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [uploadedImage, setUploadedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [chatHistory] = useState<ChatHistory[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Modal state
    const [showPlantModal, setShowPlantModal] = useState(false);
    const [modalPredictions, setModalPredictions] = useState<PlantPrediction[]>([]);

    // Track pending question for Flow 2 (after plant selection)
    const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

    // Track selected plant for query reformulation
    const [selectedPlant, setSelectedPlant] = useState<string | null>(null);

    // Image upload ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setUploadedImage(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const clearImage = () => {
        setUploadedImage(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleSendMessage = async () => {
        if (!inputValue.trim() && !uploadedImage) return

        const hasImage = uploadedImage !== null
        const hasText = inputValue.trim().length > 0

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            content: inputValue || "",
            sender: "user",
            timestamp: new Date(),
            image: imagePreview || undefined,
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue("")
        setIsTyping(true)

        // Prepare bot message placeholder
        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "Đang xử lý...",
            sender: "bot",
            timestamp: new Date(),
        }

        try {
            if (hasImage && !hasText) {
                // Flow 1: Image only - show modal for plant selection
                const result = await plantAPI.classifyImage(uploadedImage!)

                setModalPredictions(result.predictions)
                setPendingQuestion(null)  // No question pending
                setShowPlantModal(true)
                // Do not add botMessage yet, wait for user selection
                return;
            } else if (hasImage && hasText) {
                // Flow 2: Image + question - identify first, then show modal
                const result = await plantAPI.identifyPlant(uploadedImage!)

                setModalPredictions(result.predictions)
                setPendingQuestion(inputValue)  // Store question for after selection
                setShowPlantModal(true)
                // Do not add botMessage yet, wait for user selection
                return;
            } else {
                // Flow 3: Pure text query with selected plant context
                try {
                    const result = await plantAPI.askQuestion(
                        inputValue,
                        messages,
                        selectedPlant || undefined  // Pass selected plant for reformulation
                    )
                    botMessage.content = result.answer
                    botMessage.sources = result.sources
                } catch (error) {
                    console.error("Flow 3 error:", error)
                    botMessage.content =
                        "Xin lỗi, đã xảy ra lỗi khi xử lý câu hỏi của bạn."
                }
            }
            setMessages((prev) => [...prev, botMessage]) // Add bot message after processing
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: `❌ Lỗi: ${error instanceof Error ? error.message : "Không thể kết nối tới server"} `,
                sender: "bot",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsTyping(false)
            clearImage()
            // Clear selected plant after a text query, unless it was an image-only classification
            if (!hasImage && hasText) {
                setSelectedPlant(null);
            }
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleNewChat = () => {
        setMessages([
            {
                id: Date.now().toString(),
                content: "Cuộc trò chuyện mới! Tôi có thể giúp gì cho bạn?",
                sender: "bot",
                timestamp: new Date(),
            },
        ])
        setSelectedPlant(null); // Clear selected plant on new chat
    }

    const handleSelectPlant = async (prediction: PlantPrediction) => {
        // Track selected plant for query reformulation
        setSelectedPlant(prediction.vietnamese_name);

        // Check if there's a pending question (Flow 2)
        if (pendingQuestion && pendingQuestion.trim()) {
            // Flow 2: Answer the pending question with selected plant
            setIsTyping(true);

            try {
                const result = await plantAPI.askWithSelectedPlant(
                    pendingQuestion,
                    prediction.class_name
                );

                // Add user message with plant selection
                const userMessage: Message = {
                    id: Date.now().toString(),
                    content: pendingQuestion,  // Just the question, no prefix
                    sender: "user",
                    timestamp: new Date(),
                    selectedPlant: prediction.vietnamese_name,
                    image: imagePreview || undefined,  // Include image if exists
                };

                // Add bot answer
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: result.answer,
                    sender: "bot",
                    timestamp: new Date(),
                    sources: result.rag_context?.map(c => ({ plant_name: c.plant_name })),
                };

                setMessages((prev) => [...prev, userMessage, botMessage]);
            } catch (error) {
                console.error("Flow 2 answer error:", error);
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: "Xin lỗi, đã xảy ra lỗi khi trả lời câu hỏi của bạn.",
                    sender: "bot",
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, errorMessage]);
            } finally {
                setIsTyping(false);
                setPendingQuestion(null);  // Clear pending question
            }
        } else {
            // Flow 1: Just confirm plant selection
            const userMessage: Message = {
                id: Date.now().toString(),
                content: `Tôi muốn hỏi về ${prediction.vietnamese_name}`,
                sender: "user",
                timestamp: new Date(),
                selectedPlant: prediction.vietnamese_name,
            };

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: `Bạn đã chọn cây ${prediction.vietnamese_name}. Bạn muốn biết gì về cây này?`,
                sender: "bot",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, userMessage, botMessage]);
        }

        setShowPlantModal(false);
        setModalPredictions([]);
    }

    const handleNoneMatch = () => {
        // Clear selected plant when user rejects all predictions
        setSelectedPlant(null);

        const userMessage: Message = {
            id: Date.now().toString(),
            content: "Không phải cây nào ở trên",
            sender: "user",
            timestamp: new Date(),
        }

        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content:
                "Tôi hiểu rồi. Bạn có thể mô tả cây đó hoặc gửi thêm ảnh để tôi tìm hiểu nhé.",
            sender: "bot",
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage, botMessage])
        setShowPlantModal(false)
        setModalPredictions([])
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
                <MessageList
                    messages={messages}
                    isTyping={isTyping}
                    messagesEndRef={messagesEndRef}
                    onSelectPlant={handleSelectPlant}
                    onNoneMatch={handleNoneMatch}
                />

                {/* Input Area */}
                <div className="border-t border-primary/20 p-4 bg-card/80 backdrop-blur-xl">
                    <div className="max-w-4xl mx-auto">
                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="mb-3 relative inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-24 w-24 object-cover rounded-lg border-2 border-primary/20"
                                />
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                    onClick={clearImage}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        )}

                        <div className="flex items-end gap-3">
                            <div className="flex-1 relative">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Hỏi về dược liệu hoặc upload ảnh..."
                                    className="pr-24 py-6 rounded-2xl border-2 border-primary/20 bg-background focus-visible:ring-1 focus-visible:border-primary/30 text-foreground placeholder:text-muted-foreground resize-none shadow-lg"
                                />
                                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 rounded-xl hover:bg-accent/20 hover:text-accent transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 rounded-xl hover:bg-accent/20 hover:text-accent transition-colors"
                                        onClick={() => { }}
                                    >
                                        <Mic className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() && !uploadedImage}
                                className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-green"
                            >
                                <Send className="w-5 h-5 text-primary-foreground" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-3">
                            PlantBot có thể nhầm lẫn. Hãy kiểm tra thông tin quan trọng.
                        </p>
                    </div>
                </div>
            </div>

            {/* Plant Selection Modal */}
            <PlantSelectionModal
                predictions={modalPredictions}
                open={showPlantModal}
                onSelect={handleSelectPlant}
                onNoneMatch={handleNoneMatch}
                onClose={() => setShowPlantModal(false)}
            />
        </div>
    )
}
