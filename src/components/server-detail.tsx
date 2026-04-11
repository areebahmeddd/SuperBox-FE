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
    name: string;
    author: string;
    description: string;
    version: string;
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
    repository: {
      type: string;
      url: string;
    };
    license: string;
    meta?: {
      created_at: string;
      updated_at: string;
    };
    pricing?: {
      currency: string;
      amount: number;
    };
    homepage?: string;
    security_report?: any;
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
  const [copiedClient, setCopiedClient] = useState<string | null>(null);
  const isPaid = server.pricing && server.pricing.amount > 0;

  const pullCommand = `superbox pull --name ${server.name}`;

  const copyCommand = () => {
    navigator.clipboard.writeText(pullCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const configureForClient = (clientName: string) => {
    const clientKey = clientName.toLowerCase().replace(" ", "");
    const command = `superbox pull --name ${server.name} --client ${clientKey}`;
    navigator.clipboard.writeText(command);
    setCopiedClient(clientName);
    setTimeout(() => setCopiedClient(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-7xl px-6 pb-20"
    >
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 flex items-center gap-2 text-sm"
      >
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground group flex items-center gap-2 transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <ChevronRight className="text-muted-foreground h-4 w-4" />
        <Link
          href="/explore"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Explore
        </Link>
        <ChevronRight className="text-muted-foreground h-4 w-4" />
        <span className="text-foreground font-medium">{server.name}</span>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12"
      >
        <div className="mb-8 flex items-start gap-6">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
            className="bg-muted border-border flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl border"
          >
            <Package className="text-primary h-12 w-12" />
          </motion.div>

          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-foreground text-4xl font-bold">
                {server.name}
              </h1>
              {server.pricing && server.pricing.amount > 0 && (
                <span className="bg-primary/15 text-primary border-primary/20 rounded-lg border px-2.5 py-1 text-xs font-semibold">
                  ${server.pricing.amount}/mo
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              {server.author}
            </p>

            <div className="flex max-w-2xl items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <span className="font-semibold">Note:</span> First 100 tool
                calls are free. After that, ₹10 will be charged for every 100
                tool calls.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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
                className="border-primary/30 from-primary/10 to-primary/5 rounded-2xl border bg-gradient-to-br p-6"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="bg-primary/20 border-primary/30 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border">
                    <Lock className="text-primary h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-foreground mb-1 text-lg font-semibold">
                      Premium Server
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Unlock advanced features and capabilities
                    </p>
                  </div>
                </div>

                <div className="bg-card border-border mb-4 rounded-xl border p-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-foreground text-3xl font-bold">
                      ${server.pricing!.amount}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      /month
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPaywall(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-xl py-3 text-sm font-semibold transition-colors"
                >
                  Unlock Premium Access
                </button>

                <p className="text-muted-foreground mt-3 text-center text-xs">
                  Includes unlimited API calls & priority support
                </p>
              </motion.div>
            ) : (
              <>
                <div className="border-border bg-card rounded-2xl border p-6">
                  <h3 className="text-foreground mb-4 text-lg font-semibold">
                    Quick Install
                  </h3>

                  <div className="relative">
                    <div className="bg-muted border-border rounded-xl border p-4 pr-12">
                      <code className="text-primary font-mono text-sm break-all">
                        {pullCommand}
                      </code>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={copyCommand}
                      className="bg-muted hover:bg-muted/80 absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-2 transition-all"
                      title="Copy command"
                    >
                      <Copy className="text-muted-foreground h-4 w-4" />
                    </motion.button>
                  </div>

                  {copied && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-primary mt-2 text-xs"
                    >
                      ✓ Copied to clipboard!
                    </motion.p>
                  )}

                  <div className="my-6 flex items-center gap-3">
                    <div className="bg-border h-px flex-1" />
                    <span className="text-muted-foreground text-xs tracking-wider uppercase">
                      Or add to your client
                    </span>
                    <div className="bg-border h-px flex-1" />
                  </div>

                  <div className="bg-muted border-border rounded-xl border p-4">
                    <pre className="text-foreground overflow-x-auto font-mono text-xs">
                      <code>{`{
  "mcpServers": {
    "${server.name}": {
      "type": "stdio",
      "args": [
        "superbox.aws.proxy",
        "${server.name}"
      ]
    }
  }
}`}</code>
                    </pre>
                  </div>
                </div>

                <div className="border-border bg-card rounded-2xl border p-6">
                  <h3 className="text-foreground mb-4 text-lg font-semibold">
                    Compatible Clients
                  </h3>

                  <div className="space-y-2">
                    {supportedClients.map((client, index) => (
                      <motion.div
                        key={client.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => configureForClient(client.name)}
                        className="bg-muted hover:bg-primary/10 hover:border-primary/20 group flex cursor-pointer items-center justify-between rounded-xl border border-transparent p-3 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={client.icon}
                            alt={client.name}
                            width={20}
                            height={20}
                            className="h-5 w-5"
                          />
                          <span className="text-foreground text-sm font-medium">
                            {client.name}
                          </span>
                        </div>
                        {copiedClient === client.name ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Copied!</span>
                          </motion.div>
                        ) : (
                          <ChevronRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {copiedClient && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-primary/10 border-primary/20 mt-4 rounded-xl border p-3"
                    >
                      <div className="flex items-start gap-2">
                        <svg
                          className="text-primary mt-0.5 h-4 w-4 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="flex-1">
                          <p className="text-primary mb-1 text-xs font-medium">
                            Command copied to clipboard!
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Run the command in your terminal to configure{" "}
                            {copiedClient}.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
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
            pricing: server.pricing!,
          }}
        />
      )}
    </motion.div>
  );
}
