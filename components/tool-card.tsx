"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";
import Link from "next/link";

interface ToolCardProps {
  tool: {
    name: string;
    author: string;
    description: string;
    lang: string;
    license: string;
    pricing: {
      currency: string;
      amount: number;
    };
  };
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
      className="block h-full"
    >
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="h-full group"
        style={{ willChange: "transform" }}
      >
        <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 h-full flex flex-col cursor-pointer">
          {/* Subtle gradient on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-cyan-500 to-blue-500 transition-opacity duration-300 rounded-2xl" />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors duration-300">
                <Package className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white/95 mb-1 truncate">
                  {tool.name}
                </h3>
                <p className="text-xs text-gray-400/70 truncate">
                  {tool.author}
                </p>
              </div>
            </div>

            {/* Description - Fixed height for consistency */}
            <p className="text-gray-300/75 text-sm leading-relaxed mb-auto line-clamp-3 min-h-[4rem]">
              {tool.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70" />
                  {tool.lang}
                </span>
                {tool.pricing &&
                tool.pricing.currency &&
                tool.pricing.amount ? (
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded">
                    {getCurrencySymbol(tool.pricing.currency)}
                    {tool.pricing.amount}
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded">
                    FREE
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-gray-400/70">
                {tool.license}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
