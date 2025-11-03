"use client";

import Header from "@/components/header";
import PublishServerModal, {
  ServerFormData,
} from "@/components/publish-server-modal";
import { createServer } from "@/lib/api";
import { motion } from "framer-motion";
import { ExternalLink, Eye, Plus, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const dummyUserServers = [
  {
    id: 101,
    name: "My Weather API",
    handle: "@myusername/weather-mcp-server",
    description:
      "Real-time weather data and forecasts for any location worldwide. Includes historical data and severe weather alerts.",
    icon: "🌤️",
    status: "active",
    deployedAt: "2 days ago",
    tools: 3,
    usage: "1.2k",
    isPublic: true,
  },
  {
    id: 102,
    name: "Database Manager",
    handle: "@myusername/db-manager-mcp",
    description:
      "Comprehensive database management tools for PostgreSQL and MySQL. Execute queries, manage schemas, and monitor performance.",
    icon: "🗄️",
    status: "active",
    deployedAt: "1 week ago",
    tools: 8,
    usage: "3.5k",
    isPublic: true,
  },
  {
    id: 103,
    name: "Image Processor",
    handle: "@myusername/image-processor",
    description:
      "Advanced image processing capabilities including resize, crop, filters, and AI-powered enhancements.",
    icon: "🖼️",
    status: "draft",
    deployedAt: "3 days ago",
    tools: 5,
    usage: "0",
    isPublic: false,
  },
  {
    id: 104,
    name: "Email Automation",
    handle: "@myusername/email-automation",
    description:
      "Automate your email workflows with templates, scheduling, and smart triggers for various events.",
    icon: "📧",
    status: "active",
    deployedAt: "5 days ago",
    tools: 6,
    usage: "892",
    isPublic: true,
  },
];

export default function MyServersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublishServer = async (data: ServerFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createServer(data);
      alert(`Server "${data.name}" published successfully!`);
      // Optionally, refresh the server list here or redirect
      window.location.reload();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to publish server";
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-black overflow-x-hidden"
      style={{
        backgroundImage: "linear-gradient(135deg, #000000 0%, #0a1e35 100%)",
      }}
    >
      <Header />
      <PublishServerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePublishServer}
      />
      <main className="pt-32 px-6 max-w-7xl mx-auto pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-12"
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-5xl font-bold text-white/95 mb-4">
                My Servers
              </h1>
              <p className="text-gray-400/80 text-lg">
                Manage and monitor your published MCP servers
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-white text-gray-900 hover:bg-white/90 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Publish New Server
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-6 bg-white/[0.02] border border-white/10 rounded-xl"
            >
              <p className="text-gray-400/80 text-sm mb-2">Total Servers</p>
              <p className="text-3xl font-bold text-white/95">
                {dummyUserServers.length}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-6 bg-white/[0.02] border border-white/10 rounded-xl"
            >
              <p className="text-gray-400/80 text-sm mb-2">Active</p>
              <p className="text-3xl font-bold text-white/95">
                {dummyUserServers.filter((s) => s.status === "active").length}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="p-6 bg-white/[0.02] border border-white/10 rounded-xl"
            >
              <p className="text-gray-400/80 text-sm mb-2">Total Usage</p>
              <p className="text-3xl font-bold text-white/95">5.6k</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="p-6 bg-white/[0.02] border border-white/10 rounded-xl"
            >
              <p className="text-gray-400/80 text-sm mb-2">Total Tools</p>
              <p className="text-3xl font-bold text-white/95">
                {dummyUserServers.reduce((sum, s) => sum + s.tools, 0)}
              </p>
            </motion.div>
          </div>

          <div className="space-y-4">
            {dummyUserServers.map((server, index) => (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="p-6 bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.04] rounded-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-3xl flex-shrink-0">
                      {server.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white/95">
                          {server.name}
                        </h3>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            server.status === "active"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                          }`}
                        >
                          {server.status}
                        </span>
                        {!server.isPublic && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            Private
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400/70 text-sm mb-2">
                        {server.handle}
                      </p>
                      <p className="text-gray-300/80 text-sm leading-relaxed mb-4">
                        {server.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-gray-400/80">
                          <span className="font-medium text-white/90">
                            {server.tools}
                          </span>{" "}
                          tools
                        </span>
                        <span className="text-gray-400/80">
                          <span className="font-medium text-white/90">
                            {server.usage}
                          </span>{" "}
                          requests
                        </span>
                        <span className="text-gray-400/80">
                          Updated {server.deployedAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/server/${server.id}`}>
                      <button
                        className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
                        title="View Server"
                      >
                        <Eye className="w-4 h-4 text-gray-300/90" />
                      </button>
                    </Link>
                    <button
                      className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
                      title="View Analytics"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-300/90" />
                    </button>
                    <button
                      className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4 text-gray-300/90" />
                    </button>
                    <button
                      className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/40 rounded-lg transition-all duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {dummyUserServers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-32"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
                <Plus className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-white/95 mb-3">
                No servers yet
              </h2>
              <p className="text-gray-400/80 mb-8 max-w-md mx-auto">
                Get started by publishing your first MCP server and share it
                with the community
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-white text-gray-900 hover:bg-white/90 rounded-xl font-semibold transition-all duration-200"
              >
                Publish Your First Server
              </button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
