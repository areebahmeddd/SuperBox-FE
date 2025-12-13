"use client";

import AuthModal from "@/components/auth-modal";
import Header from "@/components/header";
import PublishServerModal, { ServerFormData } from "@/components/publish-modal";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { showToast } from "@/lib/toast-utils";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { Edit, Package, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyServersPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userServers, setUserServers] = useState<any[]>([]);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [editingServer, setEditingServer] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/");
        return;
      }
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [router]);

  const handlePublishClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setEditingServer(null);
      setIsModalOpen(true);
    }
  };

  const handleEditClick = (server: any) => {
    setEditingServer(server);
    setIsModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsModalOpen(true);
  };

  const handlePublishServer = async (data: ServerFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL!;
      const response = await fetch(`${API_URL}/servers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result?.detail || result?.message || "Failed to create server",
        );
      }
      showToast.success("Server published", {
        description: `"${data.name}" is now live.`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to publish server";
      setError(errorMessage);
      showToast.error("Publish failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black overflow-x-hidden"
    >
      <Header />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
      <PublishServerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePublishServer}
      />
      <main className="pt-28 px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-8 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white/95 mb-3">
              My Servers
            </h1>
            <p className="text-gray-400/80 text-base">
              Manage and publish your MCP servers
            </p>
          </motion.div>

          {showEmptyState ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                type: "spring",
                stiffness: 100,
              }}
              className="border border-white/10 rounded-3xl bg-white/[0.02] p-10 text-center max-w-2xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5,
                    type: "spring",
                    stiffness: 150,
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-white/20 mb-6"
                >
                  <Plus className="w-10 h-10 text-[var(--brand-red)]" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-2xl font-bold text-white/95 mb-3"
                >
                  No servers yet
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="text-gray-400/80 mb-8 max-w-md mx-auto"
                >
                  Publish your first MCP server to make it available to your
                  agents.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Button onClick={handlePublishClick}>
                    Publish Your First Server
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center justify-between mb-8"
              >
                <p className="text-sm font-medium text-gray-400">
                  {userServers.length}{" "}
                  {userServers.length === 1 ? "server" : "servers"}
                </p>
                <Button onClick={handlePublishClick}>
                  <Plus className="w-4 h-4" />
                  Publish New Server
                </Button>
              </motion.div>

              <div className="grid grid-cols-1 gap-5">
                {userServers.map((server, index) => (
                  <motion.div
                    key={server.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.4 + index * 0.1,
                    }}
                  >
                    <Link
                      href={`/server/${encodeURIComponent(server.name)}`}
                      className="block group"
                    >
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/10 group-hover:border-[var(--brand-red)] transition-all duration-300 cursor-pointer"
                      >
                        <div className="relative flex items-start gap-4">
                          <motion.div
                            whileHover={{ rotate: 5 }}
                            className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 transition-colors"
                          >
                            <Package className="w-7 h-7 text-[var(--brand-red)]" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-xl font-semibold text-white/95 group-hover:text-white transition-colors">
                                  {server.name}
                                </h3>
                                {server.pricing && (
                                  <span className="px-2.5 py-1 bg-[var(--brand-red)]/15 text-[var(--brand-red)] text-xs font-semibold rounded-lg border border-[var(--brand-red)]/20">
                                    ${server.pricing.amount}/mo
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleEditClick(server);
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-[var(--brand-red)] transition-colors group/edit"
                                  aria-label="Edit server"
                                >
                                  <Edit className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-[var(--brand-red)] transition-colors group/delete"
                                  aria-label="Delete server"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>

                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                              {server.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{
                                    backgroundColor: "var(--brand-red)",
                                  }}
                                />
                                {server.lang}
                              </span>
                              <span className="px-2 py-0.5 bg-white/5 rounded">
                                {server.license}
                              </span>
                              <span>⭐ {server.stars}</span>
                              <span>📥 {server.downloads}</span>
                              <span className="text-gray-600">
                                • Updated {server.lastUpdated}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </motion.div>
  );
}
