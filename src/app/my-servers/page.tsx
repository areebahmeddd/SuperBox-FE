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
          setUserServers(result.servers || []);
          setShowEmptyState(result.servers?.length === 0);
        } else {
          setShowEmptyState(true);
        }
      } catch (error) {
        setShowEmptyState(true);
      }
    };

    fetchUserServers();
  }, [user]);

  const handlePublishServer = async (
    data: ServerFormData,
    setIsScanning?: (val: boolean) => void,
    setScanProgress?: (val: string) => void,
  ) => {
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

      if (setIsScanning && !isEditing) setIsScanning(true);
      if (setScanProgress && !isEditing)
        setScanProgress("Running security scans...");

      await new Promise((resolve) => setTimeout(resolve, 100));

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
        setUserServers(listResult.servers || []);
        setShowEmptyState(listResult.servers?.length === 0);
      }

      setIsModalOpen(false);
      setEditingServer(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to publish server";
      showToast.error(errorMessage);
    } finally {
      if (setIsScanning) setIsScanning(false);
      if (setScanProgress) setScanProgress("");
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
        setUserServers(listResult.servers || []);
        setShowEmptyState(listResult.servers?.length === 0);
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
      className="bg-background min-h-screen overflow-x-hidden"
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
      <main className="px-6 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl py-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 text-center"
          >
            <h1 className="text-foreground mb-3 text-4xl font-bold md:text-5xl">
              My Servers
            </h1>
            <p className="text-muted-foreground text-base">
              Manage and publish your MCP servers
            </p>
          </motion.div>

          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8 flex items-center justify-between"
            >
              <p className="text-muted-foreground text-sm font-medium">
                {userServers.length}{" "}
                {userServers.length === 1 ? "server" : "servers"}
              </p>
              <Button onClick={handlePublishClick}>
                <Plus className="h-4 w-4" />
                Add New Server
              </Button>
            </motion.div>

            {showEmptyState ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="py-12 text-center"
              >
                <p className="text-muted-foreground text-sm">
                  No servers published yet. Click "Add New Server" to get
                  started.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {userServers.map((server, index) => (
                  <motion.div
                    key={server.name || `server-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.4 + index * 0.1,
                    }}
                  >
                    <Link
                      href={`/server/${encodeURIComponent(server.name)}`}
                      className="group block h-full"
                    >
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="bg-card border-border group-hover:border-primary relative flex h-full cursor-pointer flex-col rounded-2xl border p-6 transition-all duration-300"
                      >
                        <div className="relative flex flex-1 items-start gap-4">
                          <motion.div
                            whileHover={{ rotate: 5 }}
                            className="bg-muted border-border flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border transition-colors"
                          >
                            <Package className="text-primary h-7 w-7" />
                          </motion.div>
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex items-start justify-between gap-4">
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-foreground group-hover:text-foreground text-xl font-semibold transition-colors">
                                  {server.name}
                                </h3>
                                {server.pricing && (
                                  <span className="bg-primary/15 text-primary border-primary/20 rounded-lg border px-2.5 py-1 text-xs font-semibold">
                                    {server.pricing.amount > 0
                                      ? `$${server.pricing.amount}/mo`
                                      : "Free"}
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
                                  className="text-muted-foreground hover:text-primary group/edit p-1.5 transition-colors"
                                  aria-label="Edit server"
                                >
                                  <Edit className="h-4 w-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteServer(server.name);
                                  }}
                                  className="text-muted-foreground hover:text-primary group/delete p-1.5 transition-colors"
                                  aria-label="Delete server"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </motion.button>
                              </div>
                            </div>

                            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                              {server.description}
                            </p>

                            <div className="text-muted-foreground flex items-center gap-4 text-xs">
                              <span className="flex items-center gap-1.5">
                                <span className="bg-primary h-2 w-2 rounded-full" />
                                {server.lang}
                              </span>
                              <span className="bg-muted rounded px-2 py-0.5">
                                {server.license}
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
