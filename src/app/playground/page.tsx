"use client";

import Header from "@/components/header";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, SendHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  selectedMcp?: string;
}

interface MCPServer {
  name: string;
  description: string;
  author: string;
  lang: string;
}

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedMcp, setSelectedMcp] = useState<MCPServer | null>(null);
  const [showMcpSearch, setShowMcpSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mcpServers, setMcpServers] = useState<MCPServer[]>([]);
  const [loadingServers, setLoadingServers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchServers = async () => {
      setLoadingServers(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL!;
        const response = await fetch(`${API_URL}/servers`);
        if (response.ok) {
          const result = await response.json();
          const servers = result?.data || result?.servers || [];
          setMcpServers(
            servers.map((s: any) => ({
              name: s.name,
              description: s.description,
              author: s.author,
              lang: s.lang,
            })),
          );
        }
      } catch (error) {
      } finally {
        setLoadingServers(false);
      }
    };
    fetchServers();
  }, []);

  const filteredMcpServers = mcpServers.filter(
    (server) =>
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
      selectedMcp: selectedMcp?.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        "I've analyzed your request using the " +
          (selectedMcp?.name || "default") +
          " MCP server. Here's what I found...",
        "Based on your query and the capabilities of " +
          (selectedMcp?.name || "the selected server") +
          ", I can help you with that task.",
        "Processing your request through " +
          (selectedMcp?.name || "SuperBox") +
          " MCP. The results indicate...",
        "I've successfully executed your command using " +
          (selectedMcp?.name || "the MCP server") +
          ". Here are the results:",
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          responses[Math.floor(Math.random() * responses.length)] +
          "\n\nThis is a simulated response for demonstration purposes. The actual MCP integration will provide real-time results based on your selected server and query.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white pt-28 relative overflow-x-hidden">
        <div className="max-w-4xl mx-auto h-[calc(100vh-7rem)] flex flex-col px-6 relative z-10">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto py-8 space-y-4">
            <div className="max-w-3xl mx-auto px-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] w-full space-y-5 text-center">
                  <h2 className="text-3xl font-bold text-white">
                    SuperBox Playground
                  </h2>
                  <p className="text-gray-400 max-w-md text-base">
                    Select an MCP server and start chatting to test its
                    capabilities
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-end gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs text-white/70">
                        AI
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-md ${
                        message.role === "user"
                          ? "bg-[var(--brand-red)] text-white rounded-br-md border border-white/10"
                          : "bg-white/5 text-white border border-white/10"
                      }`}
                    >
                      {message.selectedMcp && message.role === "user" && (
                        <div className="text-xs opacity-70 mb-1.5">
                          Using: {message.selectedMcp}
                        </div>
                      )}
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="w-9 h-9 rounded-full bg-[var(--brand-red)] text-white flex items-center justify-center text-xs border border-white/20">
                        You
                      </div>
                    )}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 text-sm text-gray-300 px-1 py-1">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span className="text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="pb-8 pt-4 border-t border-white/5">
            {selectedMcp && (
              <div className="mb-3 flex items-center gap-2 text-sm max-w-2xl mx-auto">
                <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                  <span className="text-white font-medium">
                    {selectedMcp.name}
                  </span>
                  <button
                    onClick={() => setSelectedMcp(null)}
                    className="text-gray-400 hover:text-white ml-1 transition-colors"
                    aria-label="Clear selected MCP"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-4 py-2.5 focus-within:border-white/30 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <button
                  onClick={() => setShowMcpSearch(!showMcpSearch)}
                  className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center relative"
                  title="Search MCP Servers"
                >
                  <Search className="w-5 h-5 text-gray-200" />
                  {selectedMcp && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--brand-red)] rounded-full border-2 border-black" />
                  )}
                </button>
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (inputRef.current) {
                      inputRef.current.style.height = "auto";
                      const scrollHeight = inputRef.current.scrollHeight;
                      inputRef.current.style.height = `${Math.min(Math.max(scrollHeight, 44), 120)}px`;
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 py-2 px-2 resize-none focus:outline-none leading-relaxed"
                  style={{
                    minHeight: "44px",
                    maxHeight: "120px",
                    lineHeight: "1.5",
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="h-10 w-10 rounded-xl bg-[var(--brand-red)] hover:bg-[var(--brand-red)]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  title="Send Message"
                >
                  <SendHorizontal className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* MCP Search Modal */}
          <AnimatePresence>
            {showMcpSearch && (
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setShowMcpSearch(false)}
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative bg-black/40 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden backdrop-blur-xl shadow-2xl z-10"
                >
                  <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 bg-black/60 backdrop-blur-xl border-b border-white/10">
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Select MCP Server
                      </h2>
                      <p className="text-xs text-gray-400">
                        Choose a server to use in the playground
                      </p>
                    </div>
                    <button
                      onClick={() => setShowMcpSearch(false)}
                      className="p-1.5 transition-colors group"
                    >
                      <X className="w-4 h-4 text-gray-400 group-hover:text-[var(--brand-red)] transition-colors" />
                    </button>
                  </div>
                  <div className="overflow-y-auto max-h-[calc(85vh-140px)]">
                    <div className="p-6 space-y-5">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search MCP servers..."
                          className="w-full bg-white/5 text-white placeholder-gray-400 pl-12 pr-4 py-3 rounded-full border border-white/10 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all"
                          autoFocus
                        />
                      </div>
                      <div className="space-y-3">
                        {loadingServers ? (
                          <div className="text-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-red)] mx-auto" />
                            <p className="text-gray-400 mt-2">
                              Loading servers...
                            </p>
                          </div>
                        ) : filteredMcpServers.length > 0 ? (
                          filteredMcpServers.map((server) => (
                            <button
                              key={server.name}
                              onClick={() => {
                                setSelectedMcp(server);
                                setShowMcpSearch(false);
                                setSearchQuery("");
                                inputRef.current?.focus();
                              }}
                              className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-white group-hover:text-[var(--brand-red)] transition-colors">
                                    {server.name}
                                  </h3>
                                  <p className="text-sm text-gray-400 group-hover:text-gray-300 mt-1">
                                    {server.description}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 group-hover:text-gray-400">
                                    <span>by {server.author}</span>
                                    <span>•</span>
                                    <span className="px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                                      {server.lang}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="text-center py-12 text-gray-400">
                            {searchQuery
                              ? `No servers found matching "${searchQuery}"`
                              : "No servers available"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
