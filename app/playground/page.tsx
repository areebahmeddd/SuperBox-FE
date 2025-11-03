"use client";

import Header from "@/components/header";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, Plus, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface LoadedServer {
  id: number;
  name: string;
  handle: string;
  icon: string;
}

const promptSuggestions = [
  {
    text: "What should I be working on based on the Linear tickets assigned to me?",
    icon: "📋",
  },
  {
    text: "Create a bar chart showing monthly sales data",
    icon: "📊",
  },
  {
    text: "Help me understand my data schema",
    icon: "⚡",
  },
  {
    text: "Prepare meeting materials for tomorrow's product review",
    icon: "📄",
  },
  {
    text: "Classify this time series data and create a predictive model",
    icon: "🤖",
  },
  {
    text: "Generate an investor update email",
    icon: "✉️",
  },
];

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadedServers, setLoadedServers] = useState<LoadedServer[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you want to: "${content}". With the MCP servers loaded, I can help you with that. This is a demo response - in production, this would connect to your actual MCP servers and execute the requested actions.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <div
      className="min-h-screen bg-black overflow-hidden flex flex-col"
      style={{
        backgroundImage: "linear-gradient(135deg, #000000 0%, #0a1e35 100%)",
      }}
    >
      <Header />

      <main className="flex-1 flex flex-col pt-20 px-6 max-w-7xl mx-auto w-full pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col"
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white/95 mb-2">
              Playground
            </h1>
            <p className="text-gray-400/80">
              Chat with your MCP servers and execute commands
            </p>
          </div>

          <div className="flex-1 flex flex-col bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-4">
                      <Sparkles className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white/95 mb-2">
                      Start a conversation
                    </h2>
                    <p className="text-gray-400/80">
                      Try one of these prompts or type your own
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full">
                    {promptSuggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className="p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 text-left group"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">
                            {suggestion.icon}
                          </span>
                          <p className="text-sm text-gray-300/80 group-hover:text-white/90 transition-colors">
                            {suggestion.text}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-4 ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-cyan-400" />
                          </div>
                        )}

                        <div
                          className={`max-w-[70%] p-4 rounded-2xl ${
                            message.role === "user"
                              ? "bg-white/10 border border-white/20"
                              : "bg-white/[0.02] border border-white/10"
                          }`}
                        >
                          <p className="text-gray-200/90 leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <p className="text-xs text-gray-500/70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>

                        {message.role === "user" && (
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                          <p className="text-gray-400/80">Thinking...</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="border-t border-white/10 p-4">
              <div className="flex items-end gap-3">
                {loadedServers.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <div className="flex -space-x-2">
                      {loadedServers.slice(0, 3).map((server) => (
                        <div
                          key={server.id}
                          className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-xs border border-white/20"
                          title={server.name}
                        >
                          {server.icon}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-cyan-400 font-medium">
                      {loadedServers.length} server
                      {loadedServers.length !== 1 ? "s" : ""} loaded
                    </span>
                  </div>
                )}

                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Press i to chat..."
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300 pr-12"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-cyan-500/20 hover:bg-cyan-500/30 disabled:bg-white/5 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    <Send
                      className={`w-5 h-5 ${inputValue.trim() ? "text-cyan-400" : "text-gray-500"}`}
                    />
                  </button>
                </div>

                <button
                  onClick={() => {
                    alert("Server selection modal coming soon!");
                  }}
                  className="px-4 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 flex items-center gap-2"
                  title="Load MCP Server"
                >
                  <Plus className="w-5 h-5 text-gray-300" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-3 px-2">
                <div className="flex items-center gap-2 text-xs text-gray-500/80">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400/80"></span>
                    claude haiku 4.5
                  </span>
                </div>
                <p className="text-xs text-gray-500/70">
                  Press Enter to send • Shift+Enter for new line
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
