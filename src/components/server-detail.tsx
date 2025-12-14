"use client";

import { motion } from "framer-motion";
import { ChevronRight, Copy, Home, Lock, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import PaywallModal from "./paywall-modal";
import ServerDetailTabs from "./server-tabs";

interface ServerDetailProps {
  server: {
    id: number;
    name: string;
    handle: string;
    lastDeployed: string;
    icon: string;
    about: string;
    tools: Array<{
      name: string;
      description: string;
      parameters?: Array<{
        name: string;
        type: string;
        required: boolean;
        description: string;
      }>;
    }>;
    connectionUrl: string;
    tags: string[];
    clients: {
      auto: string[];
      json: string[];
    };
    qualityScore?: number;
    monthlyToolCalls?: number;
    totalPulls?: number;
    uptime?: number;
    latency?: {
      p95: number;
    };
    license?: string;
    isLocal?: boolean;
    publishedDate?: string;
    sourceCode?: {
      platform: string;
      url: string;
      repo: string;
    };
    homepage?: {
      url: string;
      domain: string;
    };
    security?: any;
    pricing: {
      currency: string;
      amount: number;
    };
  };
}

const supportedClients = [
  {
    name: "VS Code",
    icon: "/icons/brands/vscode.svg",
  },
  {
    name: "Cursor",
    icon: "/icons/brands/cursor.svg",
  },
  {
    name: "Windsurf",
    icon: "/icons/brands/windsurf.svg",
  },
  {
    name: "Claude Desktop",
    icon: "/icons/brands/claude.svg",
  },
  {
    name: "ChatGPT",
    icon: "/icons/brands/chatgpt.svg",
  },
  {
    name: "Gemini",
    icon: "/icons/brands/gemini.svg",
  },
];

export default function ServerDetail({ server }: ServerDetailProps) {
  const [copied, setCopied] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const isPaid = server.pricing && server.pricing.amount > 0;

  const pullCommand = `superbox pull --name ${server.name}`;

  const copyCommand = () => {
    navigator.clipboard.writeText(pullCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyJsonConfig = () => {
    const jsonConfig = JSON.stringify(
      {
        mcpServers: {
          [server.name]: {
            command: "npx",
            args: ["-y", server.name],
          },
        },
      },
      null,
      2,
    );
    navigator.clipboard.writeText(jsonConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-6 pb-20 max-w-7xl mx-auto"
    >
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 mb-8 text-sm"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-4 h-4 text-gray-600" />
        <Link
          href="/explore"
          className="text-gray-400 hover:text-white transition-colors"
        >
          Explore
        </Link>
        <ChevronRight className="w-4 h-4 text-gray-600" />
        <span className="text-white/95 font-medium">{server.name}</span>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12"
      >
        <div className="flex items-start gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
            className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0"
          >
            <Package className="w-12 h-12 text-[var(--brand-red)]" />
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-white/95">
                {server.name}
              </h1>
              {server.pricing.amount > 0 && (
                <span className="px-3 py-1.5 bg-[var(--brand-red)]/15 text-[var(--brand-red)] text-sm font-semibold rounded-lg">
                  ${server.pricing.amount}/mo
                </span>
              )}
            </div>
            <p className="text-gray-400 text-lg mb-4">{server.handle}</p>

            <div className="flex items-start gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg max-w-2xl">
              <svg
                className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs text-amber-200/90">
                <span className="font-semibold">Note:</span> First 100 tool
                calls are free. After that, ₹10 will be charged for every 100
                tool calls.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {server.tags.map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <ServerDetailTabs server={server} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-24 space-y-6">
            {isPaid ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                className="border border-[var(--brand-red)]/30 rounded-2xl bg-gradient-to-br from-[var(--brand-red)]/10 to-[var(--brand-red)]/5 p-6"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand-red)]/20 border border-[var(--brand-red)]/30 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-[var(--brand-red)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Premium Server
                    </h3>
                    <p className="text-sm text-white/60">
                      Unlock advanced features and capabilities
                    </p>
                  </div>
                </div>

                <div className="mb-4 p-4 bg-black/20 rounded-xl border border-white/10">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-white">
                      ${server.pricing.amount}
                    </span>
                    <span className="text-white/40 text-sm">/month</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPaywall(true)}
                  className="w-full py-3 rounded-xl bg-[var(--brand-red)] text-white font-semibold text-sm hover:bg-[var(--brand-red)]/90 transition-colors"
                >
                  Unlock Premium Access
                </button>

                <p className="text-xs text-white/40 text-center mt-3">
                  Includes unlimited API calls & priority support
                </p>
              </motion.div>
            ) : (
              <>
                <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-6">
                  <h3 className="text-lg font-semibold text-white/95 mb-4">
                    Quick Install
                  </h3>

                  <div className="relative">
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4 pr-12">
                      <code className="text-[var(--brand-red)] font-mono text-sm break-all">
                        {pullCommand}
                      </code>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={copyCommand}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                      title="Copy command"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  </div>

                  {copied && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-[var(--brand-red)] mt-2"
                    >
                      ✓ Copied to clipboard!
                    </motion.p>
                  )}

                  <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      Or add to your client
                    </span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  <div>
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-3">
                      <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
                        <code>{`{
  "mcpServers": {
    "${server.name}": {
      "command": "npx",
      "args": ["-y", "${server.name}"]
    }
  }
}`}</code>
                      </pre>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={copyJsonConfig}
                      className="w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-gray-300 font-medium transition-all"
                    >
                      Copy JSON Config
                    </motion.button>
                  </div>
                </div>

                <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-6">
                  <h3 className="text-lg font-semibold text-white/95 mb-4">
                    Compatible Clients
                  </h3>

                  <div className="space-y-2">
                    {supportedClients.map((client, index) => (
                      <motion.div
                        key={client.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={client.icon}
                            alt={client.name}
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                          <span className="text-sm text-gray-300">
                            {client.name}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {isPaid && (
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          server={{
            name: server.name,
            pricing: server.pricing,
          }}
        />
      )}
    </motion.div>
  );
}
