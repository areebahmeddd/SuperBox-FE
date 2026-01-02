"use client";

import type { ServerListItem } from "@/lib/types";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import Link from "next/link";

interface ToolCardProps {
  tool: ServerListItem;
}

const getCurrencySymbol = (currency: string): string => {
  const symbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    JPY: "¥",
    CNY: "¥",
    AUD: "A$",
    CAD: "C$",
  };
  return symbols[currency.toUpperCase()] || currency;
};

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/server/${encodeURIComponent(tool.name)}`}
      className="block h-full w-full"
    >
      <motion.div
        whileHover={{
          y: -6,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
        whileTap={{
          scale: 0.98,
          transition: { duration: 0.1 },
        }}
        className="h-full group"
        style={{ willChange: "transform" }}
      >
        <motion.div
          className="relative p-6 rounded-2xl bg-card h-full min-h-[280px] flex flex-col cursor-pointer border border-border"
          whileHover={{
            borderColor: "var(--primary)",
            transition: { duration: 0.15 },
          }}
          whileTap={{
            borderColor: "var(--primary)",
            transition: { duration: 0.1 },
          }}
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-start gap-3 mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-muted/80 transition-colors duration-300"
              >
                <Package className="w-6 h-6 text-primary" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
                  {tool.name}
                </h3>
                {tool.author && (
                  <p className="text-xs text-muted-foreground truncate">
                    {tool.author}
                  </p>
                )}
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-auto line-clamp-3 min-h-[4rem]">
              {tool.description}
            </p>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {tool.lang}
                </span>
                {tool.pricing && tool.pricing.amount > 0 ? (
                  <span className="px-2 py-1 bg-primary/15 text-primary text-xs font-semibold rounded">
                    {getCurrencySymbol(tool.pricing.currency)}
                    {tool.pricing.amount}
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-muted text-foreground text-xs font-semibold rounded">
                    FREE
                  </span>
                )}
              </div>
              {tool.license && (
                <span className="text-xs font-medium text-muted-foreground">
                  {tool.license}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
