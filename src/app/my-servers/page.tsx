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

  useEffect(() => {
    const fetchUserServers = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const API_URL = process.env.NEXT_PUBLIC_API_URL!;
        const response = await fetch(
          `${API_URL}/servers?author=${encodeURIComponent(user.displayName || user.email || "")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const result = await response.json();
          setUserServers(result.data || []);
          setShowEmptyState(result.data?.length === 0);
        } else {
          setShowEmptyState(true);
        }
      } catch (error) {
        setShowEmptyState(true);
      }
    };

    fetchUserServers();
  }, [user]);

  const handlePublishServer = async (data: ServerFormData) => {
    if (!user) {
      showToast.error("Please sign in to publish servers");
      return;
    }

    try {
      const token = await user.getIdToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL!;

      const isEditing = !!editingServer;
      const endpoint = isEditing
        ? `${API_URL}/servers/${editingServer.name}`
        : `${API_URL}/servers`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.detail ||
            result?.message ||
            `Failed to ${isEditing ? "update" : "create"} server`,
        );
      }

      showToast.success(
        `"${data.name}" has been ${isEditing ? "updated" : "published"} successfully`,
      );

      const listResponse = await fetch(
        `${API_URL}/servers?author=${encodeURIComponent(user.displayName || user.email || "")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (listResponse.ok) {
        const listResult = await listResponse.json();
        setUserServers(listResult.data || []);
        setShowEmptyState(listResult.data?.length === 0);
      }

      setIsModalOpen(false);
      setEditingServer(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to publish server";
      showToast.error(errorMessage);
    }
  };

  const handleDeleteServer = async (serverName: string) => {
    if (!user) {
      showToast.error("Please sign in to delete servers");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${serverName}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      const token = await user.getIdToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL!;

      const response = await fetch(
        `${API_URL}/servers/${serverName}?confirm=true`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.detail || result?.message || "Failed to delete server",
        );
      }

      showToast.success(`"${serverName}" has been removed successfully`);

      const listResponse = await fetch(
        `${API_URL}/servers?author=${encodeURIComponent(user.displayName || user.email || "")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (listResponse.ok) {
        const listResult = await listResponse.json();
        setUserServers(listResult.data || []);
        setShowEmptyState(listResult.data?.length === 0);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete server";
      showToast.error(errorMessage);
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
        onClose={() => {
          setIsModalOpen(false);
          setEditingServer(null);
        }}
        onSubmit={handlePublishServer}
        editingServer={editingServer}
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
                Add New Server
              </Button>
            </motion.div>

            {showEmptyState ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-center py-12"
              >
                <p className="text-gray-400 text-sm">
                  No servers published yet. Click "Add New Server" to get
                  started.
                </p>
              </motion.div>
            ) : (
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
                                    handleDeleteServer(server.name);
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
            )}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
