"use client";

import Header from "@/components/header";
import ToolCard from "@/components/tool-card";
import { showToast } from "@/lib/toast-utils";
import type { ServerListItem, ServerResponse } from "@/lib/types";
import { motion } from "framer-motion";
import { Mic, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

function ExploreContent() {
  const searchParams = useSearchParams();
  const [allTools, setAllTools] = useState<ServerListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const loadServers = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL!;
        const res = await fetch(`${API_URL}/servers`);
        if (!res.ok) throw new Error("Failed to fetch servers");
        const json = await res.json();
        const servers: ServerResponse[] = json?.servers || [];
        const list: ServerListItem[] = servers.map((s) => ({
          name: s.name,
          author: s.author,
          description: s.description,
          lang: s.lang,
          license: s.license,
          pricing: s.pricing,
        }));
        setAllTools(list);
      } catch (error) {
        showToast.error("Failed to load servers", {
          description: "Please retry in a moment.",
        });
      } finally {
        setLoading(false);
      }
    };
    loadServers();
  }, []);

  useEffect(() => {
    const SR: any =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e: any) => {
        const txt = e.results[0][0].transcript;
        setSearchQuery(txt);
      };
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const toggleMic = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      alert("Voice search not supported in this browser.");
      return;
    }
    if (isListening) {
      rec.stop();
      setIsListening(false);
    } else {
      try {
        rec.start();
        setIsListening(true);
      } catch (_) {}
    }
  };

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return allTools;
    }
    const query = searchQuery.toLowerCase();
    return allTools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.author.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query),
    );
  }, [searchQuery, allTools]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black overflow-x-hidden"
    >
      <Header />
      <main className="pt-28 px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="mb-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-3"
            >
              Explore MCP Servers
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-400 text-base"
            >
              Find and connect tools for your LLMs
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative max-w-2xl mx-auto mb-8"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, author or description"
              className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-[var(--brand-red)]/60 focus:bg-white/[0.06]"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <button
              onClick={toggleMic}
              aria-label="Voice search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white lift"
            >
              <Mic
                className={`w-5 h-5 ${isListening ? "text-[var(--brand-red)]" : ""}`}
              />
            </button>
          </motion.div>

          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex items-center justify-start mb-8"
            >
              <p className="text-sm font-medium text-gray-400">
                {filteredTools.length}{" "}
                {filteredTools.length === 1 ? "server" : "servers"} found
              </p>
            </motion.div>
          )}

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-24"
            >
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/10 border-t-[var(--brand-red)]" />
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool, index) => (
                  <motion.div
                    key={`${tool.author}-${tool.name}`}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <ToolCard tool={tool} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="col-span-full text-center py-24"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                    <Search className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-xl text-gray-400 mb-2">No servers found</p>
                  <p className="text-sm text-gray-500">
                    Try searching with different keywords
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </motion.div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen bg-black overflow-x-hidden flex items-center justify-center"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #000000 0%, #0a1e35 100%)",
          }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-red)]" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
