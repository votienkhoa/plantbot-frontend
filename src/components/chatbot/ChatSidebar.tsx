// components/chatbot/ChatSidebar.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {Leaf, Plus, X, MessageSquare, Trash2, Edit3, Home, Settings, History} from "lucide-react";
import { Card } from "@/components/chatbot/ChatHistoryCard";
import Link from "next/link";

interface ChatHistory {
    id: string;
    title: string;
    preview: string;
    timestamp: Date;
}

interface ChatSidebarProps {
    chatHistory: ChatHistory[];
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    onNewChat: () => void;
}

export default function ChatSidebar({chatHistory, sidebarOpen, setSidebarOpen, onNewChat,}: ChatSidebarProps) {
    return (
        <aside
            className={`
                ${sidebarOpen ? "w-80" : "w-0"}
                transition-all duration-300 bg-sidebar/95 border-r border-sidebar-border/50 flex flex-col overflow-hidden`}
        >
            <div className="p-6 border-b border-sidebar-border/90">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary shadow-lg shadow-primary/20">
                            <Leaf className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            PlantBot
                        </span>
                    </div>

                    <button
                        className="text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-all"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5"/>
                    </button>
                </div>
                <Button
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg shadow-primary/30 rounded-xl h-11 font-medium transition-all hover:shadow-xl hover:shadow-primary/40"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Chat
                </Button>
            </div>
            {/*content*/}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="flex gap-3 align-center text-sidebar-foreground/50  tracking-wider mb-4 px-2">
                    <History className="h-5 w-5"/>
                    <span className="text-xs my-auto font-semibold uppercase">
                        History
                    </span>
                </div>
                {chatHistory.map((chat) => (
                    <Card
                        key={chat.id}
                        className="p-4 py-2 bg-sidebar-accent/40 hover:bg-sidebar-accent/90 border border-sidebar-border/30 cursor-pointer transition-all group rounded-xl"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <MessageSquare className="w-4 h-4 text-primary flex-shrink-0" />
                                <h4 className="text-xs text-sidebar-foreground truncate">{chat.title}</h4>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="p-4 border-t border-sidebar-border/50 space-y-2">
                <Link href="/">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-xl h-11 font-medium transition-all"
                    >
                        <Leaf className="w-4 h-4 mr-3" />
                        Plant Library
                    </Button>
                </Link>
                <Link href="/">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-xl h-11 font-medium transition-all"
                    >
                        <Home className="w-4 h-4 mr-3" />
                        Home
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-xl h-11 font-medium transition-all"
                >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                </Button>
            </div>
        </aside>
    );
}