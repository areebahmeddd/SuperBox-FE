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
    pricing?: {
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
          className="relative p-6 rounded-2xl bg-white/[0.02] h-full min-h-[280px] flex flex-col cursor-pointer"
          initial={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
          whileHover={{
            borderColor: "var(--brand-red)",
            transition: { duration: 0.15 },
          }}
          whileTap={{
            borderColor: "var(--brand-red)",
            transition: { duration: 0.1 },
          }}
          style={{
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-start gap-3 mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors duration-300"
              >
                <Package
                  className="w-6 h-6"
                  style={{ color: "var(--brand-red)" }}
                />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white/95 mb-1 truncate">
                  {tool.name}
                </h3>
                <p className="text-xs text-gray-400/70 truncate">
                  {tool.author}
                </p>
              </div>
            </div>

            <p className="text-gray-300/75 text-sm leading-relaxed mb-auto line-clamp-3 min-h-[4rem]">
              {tool.description}
            </p>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400/70">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "var(--brand-red)" }}
                  />
                  {tool.lang}
                </span>
                {tool.pricing &&
                tool.pricing.currency &&
                tool.pricing.amount ? (
                  <span className="px-2 py-1 bg-[var(--brand-red)]/15 text-[var(--brand-red)] text-xs font-semibold rounded">
                    {getCurrencySymbol(tool.pricing.currency)}
                    {tool.pricing.amount}
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-white/10 text-white text-xs font-semibold rounded">
                    FREE
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-gray-400/70">
                {tool.license}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
