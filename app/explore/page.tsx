"use client";

import Header from "@/components/header";
import ToolCard from "@/components/tool-card";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface Server {
  name: string;
  author: string;
  description: string;
  lang: string;
  license: string;
  pricing?: {
    currency: string;
    amount: number;
  };
}

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const [allTools, setAllTools] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );

  useEffect(() => {
    const loadServers = async () => {
      try {
        const { fetchServers } = await import("@/lib/api");
        const data = await fetchServers();
        setAllTools(data);
      } catch (error) {
        console.error("Failed to fetch servers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServers();
  }, []);

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
    <div
      className="min-h-screen bg-black overflow-x-hidden"
      style={{
        backgroundImage: "linear-gradient(135deg, #000000 0%, #0a1e35 100%)",
      }}
    >
      <Header />
      <main className="pt-32 px-6 max-w-7xl mx-auto pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-12"
        >
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Explore All MCP Servers
            </h1>
            <p className="text-gray-400/80 text-lg">
              Discover and connect powerful tools to your AI agents
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for tools..."
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300"
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Results count */}
          {!loading && (
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-medium text-gray-400/80">
                {filteredTools.length}{" "}
                {filteredTools.length === 1 ? "server" : "servers"} found
              </p>
            </div>
          )}

          {/* Tools Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool, index) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(index * 0.03, 0.3),
                    }}
                  >
                    <ToolCard tool={tool} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-32">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                    <Search className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-xl text-gray-400 mb-2">No servers found</p>
                  <p className="text-sm text-gray-500">
                    Try searching with different keywords
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
