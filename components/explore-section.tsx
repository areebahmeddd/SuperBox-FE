"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ToolCard from "./tool-card";

interface Server {
  name: string;
  author: string;
  description: string;
  lang: string;
  license: string;
  pricing: {
    currency: string;
    amount: number;
  };
}

export default function ExploreSection() {
  const [freeTools, setFreeTools] = useState<Server[]>([]);
  const [paidTools, setPaidTools] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const freeScrollContainer = useRef<HTMLDivElement>(null);
  const paidScrollContainer = useRef<HTMLDivElement>(null);
  const [canScrollLeftFree, setCanScrollLeftFree] = useState(false);
  const [canScrollRightFree, setCanScrollRightFree] = useState(true);
  const [canScrollLeftPaid, setCanScrollLeftPaid] = useState(false);
  const [canScrollRightPaid, setCanScrollRightPaid] = useState(true);

  useEffect(() => {
    const loadServers = async () => {
      try {
        const { fetchServers } = await import("@/lib/api");
        const data = await fetchServers();
        const free = data.filter(
          (server) =>
            !server.pricing ||
            !server.pricing.currency ||
            !server.pricing.amount,
        );
        const paid = data.filter(
          (server) =>
            server.pricing && server.pricing.currency && server.pricing.amount,
        );
        setFreeTools(free);
        setPaidTools(paid);
      } catch (error) {
        console.error("Failed to fetch servers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServers();
  }, []);

  const scrollFree = (direction: "left" | "right") => {
    if (freeScrollContainer.current) {
      const scrollAmount = 400;
      freeScrollContainer.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollPaid = (direction: "left" | "right") => {
    if (paidScrollContainer.current) {
      const scrollAmount = 400;
      paidScrollContainer.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScrollFree = () => {
    if (freeScrollContainer.current) {
      setCanScrollLeftFree(freeScrollContainer.current.scrollLeft > 0);
      setCanScrollRightFree(
        freeScrollContainer.current.scrollLeft <
          freeScrollContainer.current.scrollWidth -
            freeScrollContainer.current.clientWidth,
      );
    }
  };

  const handleScrollPaid = () => {
    if (paidScrollContainer.current) {
      setCanScrollLeftPaid(paidScrollContainer.current.scrollLeft > 0);
      setCanScrollRightPaid(
        paidScrollContainer.current.scrollLeft <
          paidScrollContainer.current.scrollWidth -
            paidScrollContainer.current.clientWidth,
      );
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto relative z-10 space-y-16">
      {/* Free Servers Section */}
      {freeTools.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-white">Free Servers</h2>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full">
                {freeTools.length}
              </span>
            </div>
            <a
              href="/explore"
              className="text-sm font-medium text-gray-300/90 hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              View all <span>→</span>
            </a>
          </div>

          <div className="relative">
            <div
              ref={freeScrollContainer}
              onScroll={handleScrollFree}
              className="flex gap-6 overflow-x-auto scroll-smooth py-2 pb-4 hide-scrollbar"
            >
              {freeTools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="w-[340px] flex-shrink-0"
                >
                  <ToolCard tool={tool} />
                </motion.div>
              ))}
            </div>

            {canScrollLeftFree && (
              <button
                onClick={() => scrollFree("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white p-3 rounded-full transition-all duration-200 z-20 backdrop-blur-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {canScrollRightFree && (
              <button
                onClick={() => scrollFree("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white p-3 rounded-full transition-all duration-200 z-20 backdrop-blur-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Paid Servers Section */}
      {paidTools.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-white">Premium Servers</h2>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-semibold rounded-full">
                {paidTools.length}
              </span>
            </div>
            <a
              href="/explore"
              className="text-sm font-medium text-gray-300/90 hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              View all <span>→</span>
            </a>
          </div>

          <div className="relative">
            <div
              ref={paidScrollContainer}
              onScroll={handleScrollPaid}
              className="flex gap-6 overflow-x-auto scroll-smooth py-2 pb-4 hide-scrollbar"
            >
              {paidTools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="w-[340px] flex-shrink-0"
                >
                  <ToolCard tool={tool} />
                </motion.div>
              ))}
            </div>

            {canScrollLeftPaid && (
              <button
                onClick={() => scrollPaid("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white p-3 rounded-full transition-all duration-200 z-20 backdrop-blur-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {canScrollRightPaid && (
              <button
                onClick={() => scrollPaid("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white p-3 rounded-full transition-all duration-200 z-20 backdrop-blur-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {freeTools.length === 0 && paidTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400/70">No servers available</p>
        </div>
      )}
    </section>
  );
}
