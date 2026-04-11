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
        className="group h-full"
        style={{ willChange: "transform" }}
      >
        <motion.div
          className="bg-card border-border relative flex h-full min-h-[280px] cursor-pointer flex-col rounded-2xl border p-6"
          whileHover={{
            borderColor: "var(--primary)",
            transition: { duration: 0.15 },
          }}
          whileTap={{
            borderColor: "var(--primary)",
            transition: { duration: 0.1 },
          }}
        >
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex items-start gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-muted group-hover:bg-muted/80 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-300"
              >
                <Package className="text-primary h-6 w-6" />
              </motion.div>
              <div className="min-w-0 flex-1">
                <h3 className="text-foreground mb-1 truncate text-lg font-semibold">
                  {tool.name}
                </h3>
                {tool.author && (
                  <p className="text-muted-foreground truncate text-xs">
                    {tool.author}
                  </p>
                )}
              </div>
            </div>

            <p className="text-muted-foreground mb-auto line-clamp-3 min-h-[4rem] text-sm leading-relaxed">
              {tool.description}
            </p>

            <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs font-medium">
                  <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                  {tool.lang}
                </span>
                {tool.pricing && tool.pricing.amount > 0 ? (
                  <span className="bg-primary/15 text-primary rounded px-2 py-1 text-xs font-semibold">
                    {getCurrencySymbol(tool.pricing.currency)}
                    {tool.pricing.amount}
                  </span>
                ) : (
                  <span className="bg-muted text-foreground rounded px-2 py-1 text-xs font-semibold">
                    FREE
                  </span>
                )}
              </div>
              {tool.license && (
                <span className="text-muted-foreground text-xs font-medium">
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
