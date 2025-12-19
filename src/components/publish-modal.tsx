"use client";

import { showToast } from "@/lib/toast-utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Github, Globe, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import CustomDropdown from "./custom-dropdown";

interface PublishServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServerFormData) => void;
  editingServer?: any | null;
}

export interface ServerFormData {
  name: string;
  version: string;
  description: string;
  author: string;
  lang: string;
  license: string;
  entrypoint: string;
  repository: {
    type: string;
    url: string;
  };
  pricing: {
    currency: string;
    amount: number;
  };
  metadata?: {
    tags?: string[];
    homepage?: string;
  };
}

export default function PublishServerModal({
  isOpen,
  onClose,
  onSubmit,
  editingServer,
}: PublishServerModalProps) {
  const [isFree, setIsFree] = useState(true);
  const [formData, setFormData] = useState<ServerFormData>({
    name: "",
    version: "",
    description: "",
    author: "",
    lang: "",
    license: "",
    entrypoint: "",
    repository: {
      type: "git",
      url: "",
    },
    pricing: {
      currency: "",
      amount: 0,
    },
    metadata: {
      tags: [],
      homepage: "",
    },
  });

  useEffect(() => {
    if (editingServer) {
      setFormData({
        name: editingServer.name || "",
        version: editingServer.version || "",
        description: editingServer.description || "",
        author: editingServer.author || "",
        lang: editingServer.lang || "",
        license: editingServer.license || "",
        entrypoint: editingServer.entrypoint || "",
        repository: {
          type: editingServer.repository?.type || "git",
          url: editingServer.repository?.url || "",
        },
        pricing: {
          currency: editingServer.pricing?.currency || "",
          amount: editingServer.pricing?.amount || 0,
        },
        metadata: {
          tags: editingServer.metadata?.tags || [],
          homepage: editingServer.metadata?.homepage || "",
        },
      });
      setIsFree(editingServer.pricing?.amount === 0);
    } else {
      setFormData({
        name: "",
        version: "",
        description: "",
        author: "",
        lang: "",
        license: "",
        entrypoint: "",
        repository: {
          type: "git",
          url: "",
        },
        pricing: {
          currency: "",
          amount: 0,
        },
        metadata: {
          tags: [],
          homepage: "",
        },
      });
      setIsFree(true);
    }
  }, [editingServer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReadmeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      file.type !== "text/plain" &&
      !file.name.toLowerCase().endsWith(".md") &&
      !file.name.toLowerCase().endsWith(".txt")
    ) {
      showToast.error("Please upload a README file (.md or .txt)");
      return;
    }

    try {
      const text = await file.text();
      setFormData({
        ...formData,
        description: text.trim(),
      });
      showToast.success("README file uploaded successfully");
    } catch {
      showToast.error("Failed to read README file. Please try again.");
    }

    e.target.value = "";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-black/40 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden backdrop-blur-xl shadow-2xl z-10"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 bg-black/60 backdrop-blur-xl">
              <div className="flex-1 text-left">
                <h2 className="text-lg font-bold text-white">
                  {editingServer ? "Edit Server" : "Publish Server"}
                </h2>
                <p className="text-xs text-gray-400">
                  {editingServer
                    ? "Update your server's information"
                    : "Share your MCP server with the community"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 transition-colors group flex-shrink-0"
              >
                <X className="w-4 h-4 text-gray-400 group-hover:text-[var(--brand-red)] transition-colors" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto max-h-[calc(85vh-140px)]"
            >
              <div className="px-6 pt-2 pb-6 space-y-5 text-left">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-3.5 bg-white/5 border border-white/10 rounded-xl flex items-start gap-3 -mt-1"
                >
                  <AlertCircle className="w-4 h-4 text-[var(--brand-red)] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p className="font-medium text-white mb-1">
                      Before you publish
                    </p>
                    <p className="text-gray-400 text-xs">
                      Ensure your server follows our guidelines and includes
                      proper documentation. All published servers undergo
                      security scanning.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-white/10"></div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      Basic Information
                    </span>
                    <div className="h-px flex-1 bg-white/10"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-white mb-2">
                        Server Name{" "}
                        <span className="text-[var(--brand-red)]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="my-awesome-server"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Version{" "}
                        <span className="text-[var(--brand-red)]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.version}
                        onChange={(e) =>
                          setFormData({ ...formData, version: e.target.value })
                        }
                        placeholder="1.0.0"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Author{" "}
                        <span className="text-[var(--brand-red)]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.author}
                        onChange={(e) =>
                          setFormData({ ...formData, author: e.target.value })
                        }
                        placeholder="Your name"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all duration-200"
                      />
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-white">
                          Description{" "}
                          <span className="text-[var(--brand-red)]">*</span>
                        </label>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept=".md,.txt,text/plain"
                            onChange={handleReadmeUpload}
                            className="hidden"
                          />
                          <span className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[var(--brand-red)] transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-[var(--brand-red)]/30 bg-white/5 hover:bg-white/10">
                            <Upload className="w-3 h-3" />
                            Upload README
                          </span>
                        </label>
                      </div>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe what your server does and its key features..."
                        rows={4}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all duration-200 resize-none"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-white/10"></div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      Technical Details
                    </span>
                    <div className="h-px flex-1 bg-white/10"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <CustomDropdown
                        label="Language"
                        required
                        value={formData.lang}
                        onChange={(value) =>
                          setFormData({ ...formData, lang: value })
                        }
                        placeholder="Select language"
                        options={[
                          { value: "Python", label: "Python", icon: "🐍" },
                          {
                            value: "JavaScript",
                            label: "JavaScript",
                            icon: "📜",
                          },
                          {
                            value: "TypeScript",
                            label: "TypeScript",
                            icon: "💙",
                          },
                          { value: "Go", label: "Go", icon: "🐹" },
                          { value: "Rust", label: "Rust", icon: "🦀" },
                          { value: "Java", label: "Java", icon: "☕" },
                        ]}
                      />
                    </div>

                    <div>
                      <CustomDropdown
                        label="License"
                        required
                        value={formData.license}
                        onChange={(value) =>
                          setFormData({ ...formData, license: value })
                        }
                        placeholder="Select license"
                        options={[
                          { value: "MIT", label: "MIT" },
                          { value: "Apache-2.0", label: "Apache 2.0" },
                          { value: "GPL-3.0", label: "GPL 3.0" },
                          { value: "BSD-3-Clause", label: "BSD 3-Clause" },
                          { value: "ISC", label: "ISC" },
                        ]}
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-white mb-2">
                        Entrypoint{" "}
                        <span className="text-[var(--brand-red)]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.entrypoint}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            entrypoint: e.target.value,
                          })
                        }
                        placeholder="src/index.js"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all duration-200 font-mono text-sm"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-white/10"></div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      Repository
                    </span>
                    <div className="h-px flex-1 bg-white/10"></div>
                  </div>

                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-1">
                      <CustomDropdown
                        label="Type"
                        value={formData.repository.type}
                        onChange={(value) =>
                          setFormData({
                            ...formData,
                            repository: { ...formData.repository, type: value },
                          })
                        }
                        placeholder="Type"
                        options={[
                          { value: "git", label: "Git" },
                          { value: "svn", label: "SVN" },
                        ]}
                      />
                    </div>

                    <div className="col-span-5">
                      <label className="block text-sm font-medium text-white mb-2">
                        Repository URL{" "}
                        <span className="text-[var(--brand-red)]">*</span>
                      </label>
                      <div className="relative">
                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="url"
                          required
                          value={formData.repository.url}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              repository: {
                                ...formData.repository,
                                url: e.target.value,
                              },
                            })
                          }
                          placeholder="https://github.com/username/repo"
                          className="w-full pl-11 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-white/10"></div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      Pricing
                    </span>
                    <div className="h-px flex-1 bg-white/10"></div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setIsFree(true)}
                        className={`flex-1 py-2.5 rounded-full font-medium transition-all duration-200 ${
                          isFree
                            ? "bg-[var(--brand-red)] text-black"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        Free
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFree(false)}
                        className={`flex-1 py-2.5 rounded-full font-medium transition-all duration-200 ${
                          !isFree
                            ? "bg-[var(--brand-red)] text-black"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        Paid
                      </button>
                    </div>

                    {!isFree && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div>
                          <CustomDropdown
                            label="Currency"
                            required={!isFree}
                            value={formData.pricing.currency}
                            onChange={(value) =>
                              setFormData({
                                ...formData,
                                pricing: {
                                  ...formData.pricing,
                                  currency: value,
                                },
                              })
                            }
                            placeholder="Select currency"
                            options={[
                              { value: "USD", label: "USD", icon: "💵" },
                              { value: "EUR", label: "EUR", icon: "💶" },
                              { value: "GBP", label: "GBP", icon: "�" },
                              { value: "JPY", label: "JPY", icon: "�" },
                              { value: "CAD", label: "CAD", icon: "🍁" },
                              { value: "AUD", label: "AUD", icon: "🦘" },
                            ]}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Price{" "}
                            <span className="text-[var(--brand-red)]">*</span>
                          </label>
                          <input
                            type="number"
                            required={!isFree}
                            min="0"
                            step="0.01"
                            value={formData.pricing.amount || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pricing: {
                                  ...formData.pricing,
                                  amount: parseFloat(e.target.value) || 0,
                                },
                              })
                            }
                            placeholder="0.00"
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all duration-200"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-white/10"></div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      Optional
                    </span>
                    <div className="h-px flex-1 bg-white/10"></div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Homepage URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="url"
                        value={formData.metadata?.homepage || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            metadata: {
                              ...formData.metadata,
                              homepage: e.target.value,
                            },
                          })
                        }
                        placeholder="https://yoursite.com"
                        className="w-full pl-11 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand-red)]/50 focus:bg-white/[0.07] transition-all duration-200"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </form>

            <div className="sticky bottom-0 flex items-center justify-between px-6 py-3 bg-black/60 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span>All changes are saved locally</span>
              </div>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white text-sm font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 rounded-full bg-[var(--brand-red)] hover:bg-[var(--brand-red)]/90 text-black text-sm font-semibold transition-all duration-200 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {editingServer ? "Update Server" : "Publish Server"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
