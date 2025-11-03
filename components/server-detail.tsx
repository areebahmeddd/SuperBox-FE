"use client";

import { motion } from "framer-motion";
import { Copy, Terminal } from "lucide-react";
import { useState } from "react";
import RazorpayPayment from "./razorpay-payment";
import ServerDetailTabs from "./server-detail-tabs";

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
    deployedFrom?: {
      branch: string;
      commit: string;
    };
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

const supportedClients = {
  auto: [
    { name: "VS Code", icon: "💻" },
    { name: "Cursor", icon: "⚡" },
    { name: "Windsurf", icon: "🌊" },
    { name: "Claude Desktop", icon: "🧠" },
    { name: "ChatGPT", icon: "🤖" },
    { name: "Gemini", icon: "✨" },
  ],
  json: [
    { name: "VS Code", icon: "💻" },
    { name: "Cursor", icon: "⚡" },
    { name: "Windsurf", icon: "🌊" },
    { name: "Claude Desktop", icon: "🧠" },
    { name: "ChatGPT", icon: "🤖" },
    { name: "Gemini", icon: "✨" },
  ],
};

export default function ServerDetail({ server }: ServerDetailProps) {
  const [activeTab, setActiveTab] = useState<"auto" | "json">("auto");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPurchased, setIsPurchased] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const isPaidServer =
    server.pricing &&
    server.pricing.currency &&
    server.pricing.amount &&
    server.pricing.amount > 0;

  const handlePaymentSuccess = (paymentId: string) => {
    setIsPurchased(true);
    setPaymentError(null);
    alert(`Payment successful! Payment ID: ${paymentId}`);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    alert(`Payment failed: ${error}`);
  };

  const pullCommand = `mcp-box pull ${server.name}`;

  const copyCommand = () => {
    navigator.clipboard.writeText(pullCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredClients = supportedClients[activeTab].filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="px-6 py-12 max-w-7xl mx-auto relative z-10"
    >
      <div className="mb-12 pb-8 border-b border-white/10">
        <div className="flex flex-col items-center text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center text-5xl mb-4">
              {server.icon}
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <h1 className="text-4xl font-bold text-white/95">
                  {server.name}
                </h1>
                <span className="text-gray-500">⊚</span>
              </div>
              <p className="text-gray-400/80 text-sm">{server.handle}</p>
              <p className="text-gray-500/70 text-xs mt-2">
                last deployed {server.lastDeployed}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-2 flex-wrap"
        >
          {server.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400/80 bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
            >
              {tag === "Remote" && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
              )}
              {tag === "Open Source" && <span>✓</span>}
              {tag === "2 tools" && <span>⚙</span>}
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="grid grid-cols-4 gap-8">
        {/* Main Content with Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="col-span-3"
        >
          <ServerDetailTabs server={server} />
        </motion.div>

        {/* Connect Sidebar */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="col-span-1"
        >
          <div className="flex items-center gap-2 mb-6">
            <Terminal className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white/95">Connect</h2>
          </div>

          {/* Payment Section for Paid Servers */}
          {isPaidServer && !isPurchased && (
            <div className="mb-8 p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl">
              <p className="text-sm text-amber-400 mb-4 font-medium">
                🔒 This is a premium server
              </p>
              <RazorpayPayment
                serverName={server.name}
                amount={server.pricing!.amount}
                currency={server.pricing!.currency}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
              {paymentError && (
                <p className="text-xs text-red-400 mt-2">{paymentError}</p>
              )}
            </div>
          )}

          {/* Show connection details only for free servers or after purchase */}
          {(!isPaidServer || isPurchased) && (
            <>
              <div className="mb-8">
                <p className="text-xs text-gray-400/80 mb-3 uppercase tracking-wider">
                  Run Command
                </p>
                <div className="relative">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <code className="text-cyan-400 font-mono text-sm break-all">
                      {pullCommand}
                    </code>
                  </div>
                  <button
                    onClick={copyCommand}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
                    title="Copy command"
                  >
                    <Copy className="w-4 h-4 text-gray-300" />
                  </button>
                  {copied && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-cyan-400 mt-2"
                    >
                      Copied!
                    </motion.p>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-400/80 mb-6">
                Or add to your client
              </p>
            </>
          )}

          {isPaidServer && !isPurchased && (
            <p className="text-sm text-gray-500 mb-6 text-center">
              Purchase required to access connection details
            </p>
          )}

          <div className="flex gap-2 mb-6 border-b border-white/10">
            {(["auto", "json"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === tab
                    ? "text-white/95 border-cyan-400"
                    : "text-gray-400/80 border-transparent hover:text-gray-300"
                }`}
              >
                {tab === "auto" && "⚡ Auto"}
                {tab === "json" && "{} JSON"}
              </button>
            ))}
          </div>

          {activeTab === "auto" ? (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clients..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300/90 placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300"
                />
              </div>

              <div className="space-y-3">
                {filteredClients.length > 0 ? (
                  filteredClients.map((client, index) => (
                    <motion.div
                      key={client.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl hover:bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                    >
                      <span className="text-xl">{client.icon}</span>
                      <span className="text-gray-300/90 text-sm font-medium">
                        {client.name}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500/80 text-sm py-4 text-center">
                    No clients found
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <pre className="text-xs text-gray-300/90 font-mono overflow-x-auto">
                <code>{`{
  "mcpServers": {
    "${server.name}": {
      "url": "https://zo57to64ouldo4fhyr2434pu2q0bqkzf.lambda-url.ap-south-1.on.aws/${server.name}"
    }
  }
}`}</code>
              </pre>
              <button
                onClick={() => {
                  const jsonConfig = `{
  "mcpServers": {
    "${server.name}": {
      "url": "https://zo57to64ouldo4fhyr2434pu2q0bqkzf.lambda-url.ap-south-1.on.aws/${server.name}"
    }
  }
}`;
                  navigator.clipboard.writeText(jsonConfig);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="mt-3 w-full px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg text-cyan-400 text-sm font-medium transition-all duration-200"
              >
                {copied ? "Copied!" : "Copy JSON"}
              </button>
            </div>
          )}
        </motion.section>
      </div>
    </motion.div>
  );
}
