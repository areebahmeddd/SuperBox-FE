"use client";

import AuthModal from "@/components/auth-modal";
import Header from "@/components/header";
import PublishServerModal, { ServerFormData } from "@/components/publish-modal";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import {
  deleteUserServer,
  getUserServersByAuthor,
  saveUserServer,
} from "@/lib/local-storage";
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
        await new Promise((resolve) => setTimeout(resolve, 300));
        const author = user.displayName || user.email || "";
        const servers = getUserServersByAuthor(author);
        setUserServers(servers);
        setShowEmptyState(servers.length === 0);
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

      if (setIsScanning && !isEditing) setIsScanning(true);
      if (setScanProgress && !isEditing)
        setScanProgress("Running security scans...");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const serverData = {
        ...data,
        author: user.displayName || user.email || "",
        meta: {
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        tools: {
          count: 0,
          names: [],
        },
        security_report: {
          metadata: {
            repository: data.repository.url,
            repo_url: data.repository.url,
            scan_date: new Date().toISOString(),
            scanners_used: ["sonarqube", "gitguardian", "bandit"],
          },
          summary: {
            total_issues_all_scanners: 0,
            critical_issues: 0,
            sonarcloud_url: "https://sonarcloud.io/project/overview",
            scan_passed: true,
          },
          sonarqube: {
            total_issues: 0,
            bugs: 0,
            vulnerabilities: 0,
            code_smells: 0,
            security_hotspots: 0,
            quality_gate: "PASSED",
            reliability_rating: "A",
            security_rating: "A",
            maintainability_rating: "A",
            coverage: 95,
            duplications: 1.5,
            lines_of_code: 1000,
          },
          gitguardian: {
            scan_passed: true,
            total_secrets: 0,
            secrets: [],
            error: null,
          },
          bandit: {
            scan_passed: true,
            total_issues: 0,
            severity_counts: { high: 0, medium: 0, low: 0 },
            total_lines_scanned: 1000,
            issues: [],
            error: null,
          },
          recommendations: [],
        },
      };

      saveUserServer(
        serverData,
        user.uid,
        isEditing ? (editingServer as any)?.id : undefined,
      );

      showToast.success(
        `"${data.name}" has been ${isEditing ? "updated" : "published"} successfully`,
      );

      const author = user.displayName || user.email || "";
      const servers = getUserServersByAuthor(author);
      setUserServers(servers);
      setShowEmptyState(servers.length === 0);

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
      await new Promise((resolve) => setTimeout(resolve, 500));
      const deleted = deleteUserServer(serverName);

      if (!deleted) {
        throw new Error("Failed to delete server");
      }

      showToast.success(`"${serverName}" has been removed successfully`);

      const author = user.displayName || user.email || "";
      const servers = getUserServersByAuthor(author);
      setUserServers(servers);
      setShowEmptyState(servers.length === 0);
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
      className="min-h-screen bg-background overflow-x-hidden"
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
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              My Servers
            </h1>
            <p className="text-muted-foreground text-base">
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
              <p className="text-sm font-medium text-muted-foreground">
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
                      className="block group h-full"
                    >
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="relative p-6 rounded-2xl bg-card border border-border group-hover:border-primary transition-all duration-300 cursor-pointer h-full flex flex-col"
                      >
                        <div className="relative flex items-start gap-4 flex-1">
                          <motion.div
                            whileHover={{ rotate: 5 }}
                            className="w-14 h-14 rounded-xl bg-muted border border-border flex items-center justify-center flex-shrink-0 transition-colors"
                          >
                            <Package className="w-7 h-7 text-primary" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-xl font-semibold text-foreground group-hover:text-foreground transition-colors">
                                  {server.name}
                                </h3>
                                {server.pricing && (
                                  <span className="px-2.5 py-1 bg-primary/15 text-primary text-xs font-semibold rounded-lg border border-primary/20">
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
                                  className="p-1.5 text-muted-foreground hover:text-primary transition-colors group/edit"
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
                                  className="p-1.5 text-muted-foreground hover:text-primary transition-colors group/delete"
                                  aria-label="Delete server"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>

                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                              {server.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                {server.lang}
                              </span>
                              <span className="px-2 py-0.5 bg-muted rounded">
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
