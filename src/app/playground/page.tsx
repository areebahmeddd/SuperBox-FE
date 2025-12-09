"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/header";
import { Search, SendHorizontal, Sparkles, Loader2 } from "lucide-react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Mock MCP servers data
  const mockMcpServers: MCPServer[] = [
    {
      name: "weather-api",
      description: "Get real-time weather information for any location",
      author: "SuperBox",
      lang: "Python",
    },
    {
      name: "file-manager",
      description: "Manage files and directories with advanced operations",
      author: "SuperBox",
      lang: "Node.js",
    },
    {
      name: "database-query",
      description: "Query and manage databases with SQL support",
      author: "SuperBox",
      lang: "Go",
    },
    {
      name: "image-processor",
      description: "Process and transform images with AI",
      author: "SuperBox",
      lang: "Python",
    },
    {
      name: "text-analyzer",
      description: "Analyze and process text with NLP capabilities",
      author: "SuperBox",
      lang: "Python",
    },
  ];

  const filteredMcpServers = mockMcpServers.filter(
    (server) =>
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase())
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

    // Simulate AI response with 2 second delay
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
      <div className="min-h-screen bg-black text-white pt-20 relative overflow-x-hidden">
        {/* Red Misty Fog Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ff5252]/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-20 right-1/4 w-[600px] h-[300px] bg-[#ff5252]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-10 left-1/4 w-[500px] h-[250px] bg-[#ffbaba]/20 rounded-full blur-[90px] animate-pulse" style={{ animationDelay: "2s" }} />
        
        <div className="max-w-4xl mx-auto h-[calc(100vh-5rem)] flex flex-col px-4 relative z-10">
          {/* Messages Area */}
          <div className="flex-1 overflow-hidden py-8 space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#ff5252]/30 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#ff5252]/20 to-[#ffbaba]/20 flex items-center justify-center border border-[#ff5252]/30 backdrop-blur-sm">
                    <Sparkles className="w-10 h-10 text-[#ff5252]" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ff5252] via-[#ffbaba] to-[#ff5252] bg-clip-text text-transparent">
                  Welcome to SuperBox Playground
                </h2>
                <p className="text-gray-400 text-center max-w-md text-lg">
                  Select an MCP server and start chatting to test its
                  capabilities
                </p>
                <div className="flex gap-3 mt-4">
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#ff5252]/10 to-[#ffbaba]/10 border border-[#ff5252]/30 text-[#ff5252] text-sm">
                    AI-Powered
                  </div>
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#ff5252]/10 to-[#ffbaba]/10 border border-[#ff5252]/30 text-[#ffbaba] text-sm">
                    Real-time
                  </div>
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#ffbaba]/10 to-[#ff5252]/10 border border-[#ffbaba]/30 text-[#ffbaba] text-sm">
                    Secure
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-[#ff5252] to-[#ff5252]/80 text-white shadow-lg shadow-[#ff5252]/20"
                        : "bg-gradient-to-br from-white/5 to-white/[0.02] text-white border border-white/10 backdrop-blur-sm"
                    }`}
                  >
                    {message.selectedMcp && message.role === "user" && (
                      <div className="text-xs opacity-60 mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Using: {message.selectedMcp}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-50 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gradient-to-br from-[#ff5252]/10 to-[#ffbaba]/10 text-white border border-[#ff5252]/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#ff5252]" />
                    <span className="text-sm text-[#ffbaba]">Thinking...</span>
                    <div className="flex gap-1 ml-2">
                      <div className="w-2 h-2 rounded-full bg-[#ff5252] animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-[#ffbaba] animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 rounded-full bg-[#ff5252] animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="pb-8 pt-4 border-t border-white/5 backdrop-blur-sm">
            {selectedMcp && (
              <div className="mb-3 flex items-center gap-2 text-sm">
                <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#ff5252]/20 to-[#ffbaba]/20 border border-[#ff5252]/40 flex items-center gap-2 backdrop-blur-sm shadow-lg shadow-[#ff5252]/10">
                  <Sparkles className="w-4 h-4 text-[#ff5252]" />
                  <span className="text-[#ffbaba] font-medium">{selectedMcp.name}</span>
                  <button
                    onClick={() => setSelectedMcp(null)}
                    className="text-[#ff5252]/60 hover:text-[#ffbaba] ml-1 text-lg">
                    ×
                  </button>
                </div>
              </div>
            )}
            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 focus-within:border-[#ff5252]/50 focus-within:shadow-lg focus-within:shadow-[#ff5252]/10 transition-all backdrop-blur-sm">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={3}
                className="w-full bg-transparent text-white placeholder-gray-400 p-4 pr-24 resize-none focus:outline-none"
              />
              <div className="absolute right-4 bottom-4 flex gap-2">
                <button
                  onClick={() => setShowMcpSearch(!showMcpSearch)}
                  className="p-2 rounded-lg hover:bg-[#ff5252]/20 hover:border hover:border-[#ff5252]/30 transition-all relative group"
                  title="Search MCP Servers"
                >
                  <Search className="w-5 h-5 text-gray-400 group-hover:text-[#ff5252] transition-colors" />
                  {selectedMcp && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff5252] rounded-full border-2 border-black animate-pulse" />
                  )}
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 rounded-lg bg-gradient-to-r from-[#ff5252] to-[#ff5252]/80 hover:from-[#ffbaba] hover:to-[#ff5252] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#ff5252]/30"
                  title="Send Message"
                >
                  <SendHorizontal className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* MCP Search Modal */}
          {showMcpSearch && (
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setShowMcpSearch(false)}
            >
              <div
                className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-[#ff5252]/30 w-full max-w-2xl max-h-[600px] overflow-hidden shadow-2xl shadow-[#ff5252]/20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-[#ff5252]/20 bg-gradient-to-r from-[#ff5252]/5 to-[#ffbaba]/5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff5252]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search MCP servers..."
                      className="w-full bg-white/5 text-white placeholder-gray-400 pl-10 pr-4 py-3 rounded-xl border border-[#ff5252]/30 focus:outline-none focus:border-[#ff5252]/50 focus:shadow-lg focus:shadow-[#ff5252]/20 transition-all"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[500px] p-4 space-y-3">
                  {filteredMcpServers.length > 0 ? (
                    filteredMcpServers.map((server, index) => (
                      <button
                        key={server.name}
                        onClick={() => {
                          setSelectedMcp(server);
                          setShowMcpSearch(false);
                          setSearchQuery("");
                          inputRef.current?.focus();
                        }}
                        className="w-full text-left p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-[#ff5252]/10 hover:to-[#ffbaba]/10 border border-white/10 hover:border-[#ff5252]/40 transition-all group relative overflow-hidden"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#ff5252]/0 via-[#ff5252]/5 to-[#ff5252]/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-start justify-between relative z-10">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white group-hover:text-[#ffbaba] transition-colors">
                              {server.name}
                            </h3>
                            <p className="text-sm text-gray-400 group-hover:text-gray-300 mt-1">
                              {server.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 group-hover:text-gray-400">
                              <span>by {server.author}</span>
                              <span>•</span>
                              <span className="px-2 py-0.5 rounded bg-[#ff5252]/10 text-[#ff5252] border border-[#ff5252]/20">{server.lang}</span>
                            </div>
                          </div>
                          <Sparkles className="w-5 h-5 text-white/40 group-hover:text-[#ff5252] flex-shrink-0 ml-4 transition-colors" />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      No MCP servers found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
