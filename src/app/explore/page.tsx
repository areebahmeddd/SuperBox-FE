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
      setLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL!;
        const res = await fetch(`${API_URL}/servers`);
        if (!res.ok) throw new Error("Failed to fetch servers");
        const json = await res.json();
        // console.log('Backend API Response:', json);
        const servers: ServerResponse[] = json?.servers || [];
        const list: ServerListItem[] = servers.map((s) => ({
          name: s.name,
          author: s.author,
          description: s.description,
          lang: s.lang,
          license: s.license,
          tools: s.tools,
          pricing: s.pricing,
        }));
        setAllTools(list);
      } catch (error) {
        console.error("Backend API Error:", error);
        showToast.error("Failed to load servers. Please retry in a moment.");
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
      className="bg-background min-h-screen overflow-x-hidden"
    >
      <Header />
      <main className="px-6 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-5xl"
        >
          <div className="mb-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-foreground mb-3 text-4xl font-bold md:text-5xl"
            >
              Explore MCP Servers
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-muted-foreground text-base"
            >
              Find and connect tools for your LLMs
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative mx-auto mb-8 max-w-2xl"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, author or description"
              className="bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary/60 focus:bg-input/80 w-full rounded-full border py-3 pr-12 pl-12 transition-all duration-200 outline-none"
            />
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2" />
            <button
              onClick={toggleMic}
              aria-label="Voice search"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
            >
              <Mic className={`h-5 w-5 ${isListening ? "text-primary" : ""}`} />
            </button>
          </motion.div>

          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mb-8 flex items-center justify-start"
            >
              <p className="text-muted-foreground text-sm font-medium">
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
              <div className="border-border border-t-primary h-10 w-10 animate-spin rounded-full border-2" />
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                    className="h-full w-full"
                  >
                    <ToolCard tool={tool} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="col-span-full py-24 text-center"
                >
                  <div className="bg-muted mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
                    <Search className="text-muted-foreground h-8 w-8" />
                  </div>
                  <p className="text-muted-foreground mb-2 text-xl">
                    No servers found
                  </p>
                  <p className="text-muted-foreground/70 text-sm">
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
        <div className="bg-background flex min-h-screen items-center justify-center overflow-x-hidden">
          <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
