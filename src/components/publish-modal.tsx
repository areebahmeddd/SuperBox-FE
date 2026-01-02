"use client";

import { showToast } from "@/lib/toast-utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Github, Globe, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface PublishServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: ServerFormData,
    setIsScanning?: (val: boolean) => void,
    setScanProgress?: (val: string) => void,
  ) => void;
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
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState("");
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
          homepage: "",
        },
      });
      setIsFree(true);
    }
  }, [editingServer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, setIsScanning, setScanProgress);
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
            className="absolute inset-0 bg-background/80 dark:bg-black/70 backdrop-blur-sm"
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
            className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden backdrop-blur-xl shadow-2xl z-10"
          >
            {isScanning && (
              <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                />
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">
                    {scanProgress || "Running security scans..."}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This may take a few moments
                  </p>
                </div>
              </div>
            )}

            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 bg-card/80 backdrop-blur-xl border-b border-border">
              <div className="flex-1 text-left">
                <h2 className="text-lg font-bold text-foreground">
                  {editingServer ? "Edit Server" : "Publish Server"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {editingServer
                    ? "Update your server's information"
                    : "Share your MCP server with the community"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 transition-colors group flex-shrink-0"
              >
                <X className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
                  className="p-3.5 bg-muted border border-border rounded-xl flex items-start gap-3 mt-2"
                >
                  <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-foreground">
                    <p className="font-medium text-foreground mb-1">
                      Before you publish
                    </p>
                    <p className="text-muted-foreground text-xs">
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
                    <div className="h-px flex-1 bg-border"></div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Basic Information
                    </span>
                    <div className="h-px flex-1 bg-border"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Server Name <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="my-awesome-server"
                        className="w-full px-4 py-2 bg-input border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-input/80 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Version <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.version}
                        onChange={(e) =>
                          setFormData({ ...formData, version: e.target.value })
                        }
                        placeholder="1.0.0"
                        className="w-full px-4 py-2 bg-input border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-input/80 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Author <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.author}
                        onChange={(e) =>
                          setFormData({ ...formData, author: e.target.value })
                        }
                        placeholder="Your name"
                        className="w-full px-4 py-2 bg-input border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-input/80 transition-all duration-200"
                      />
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-foreground">
                          Description <span className="text-primary">*</span>
                        </label>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept=".md,.txt,text/plain"
                            onChange={handleReadmeUpload}
                            className="hidden"
                          />
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-full border border-border hover:border-primary/30 bg-muted hover:bg-muted/80">
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
                        className="w-full px-4 py-2 bg-input border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-input/80 transition-all duration-200 resize-none"
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
                    <div className="h-px flex-1 bg-border"></div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Technical Details
                    </span>
                    <div className="h-px flex-1 bg-border"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Language <span className="text-primary">*</span>
                      </label>
                      <Select
                        required
                        value={formData.lang}
                        onValueChange={(value) =>
                          setFormData({ ...formData, lang: value ?? "" })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {formData.lang ? (
                              <>
                                {formData.lang === "Python" && "🐍 Python"}
                                {formData.lang === "JavaScript" &&
                                  "📜 JavaScript"}
                                {formData.lang === "TypeScript" &&
                                  "💙 TypeScript"}
                                {formData.lang === "Go" && "🐹 Go"}
                                {formData.lang === "Rust" && "🦀 Rust"}
                                {formData.lang === "Java" && "☕ Java"}
                              </>
                            ) : (
                              <span className="text-muted-foreground">
                                Select language
                              </span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Python">🐍 Python</SelectItem>
                          <SelectItem value="JavaScript">
                            📜 JavaScript
                          </SelectItem>
                          <SelectItem value="TypeScript">
                            💙 TypeScript
                          </SelectItem>
                          <SelectItem value="Go">🐹 Go</SelectItem>
                          <SelectItem value="Rust">🦀 Rust</SelectItem>
                          <SelectItem value="Java">☕ Java</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        License <span className="text-primary">*</span>
                      </label>
                      <Select
                        required
                        value={formData.license}
                        onValueChange={(value) =>
                          setFormData({ ...formData, license: value ?? "" })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {formData.license || (
                              <span className="text-muted-foreground">
                                Select license
                              </span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MIT">MIT</SelectItem>
                          <SelectItem value="Apache-2.0">Apache 2.0</SelectItem>
                          <SelectItem value="GPL-3.0">GPL 3.0</SelectItem>
                          <SelectItem value="BSD-3-Clause">
                            BSD 3-Clause
                          </SelectItem>
                          <SelectItem value="ISC">ISC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Entrypoint <span className="text-primary">*</span>
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
                        className="w-full px-4 py-2 bg-input border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-input/80 transition-all duration-200 font-mono text-sm"
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
                    <div className="h-px flex-1 bg-border"></div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Repository
                    </span>
                    <div className="h-px flex-1 bg-border"></div>
                  </div>

                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Type
                      </label>
                      <Select
                        value={formData.repository.type}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            repository: {
                              ...formData.repository,
                              type: value ?? "git",
                            },
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {formData.repository.type || (
                              <span className="text-muted-foreground">
                                Type
                              </span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="git">Git</SelectItem>
                          <SelectItem value="svn">SVN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-5">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Repository URL <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                          className="w-full pl-11 pr-4 py-2 bg-input border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-input/80 transition-all duration-200"
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
                    <div className="h-px flex-1 bg-border"></div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Pricing
                    </span>
                    <div className="h-px flex-1 bg-border"></div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-1 bg-muted border border-border rounded-xl">
                      <Button
                        type="button"
                        onClick={() => setIsFree(true)}
                        variant={isFree ? "default" : "ghost"}
                        size="default"
                        className={`flex-1 py-2.5 rounded-lg font-medium border-2 transition-all ${
                          isFree
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-sm"
                            : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground border-transparent"
                        }`}
                      >
                        Free
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setIsFree(false)}
                        variant={!isFree ? "default" : "ghost"}
                        size="default"
                        className={`flex-1 py-2.5 rounded-lg font-medium border-2 transition-all ${
                          !isFree
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-sm"
                            : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground border-transparent"
                        }`}
                      >
                        Paid
                      </Button>
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
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Currency <span className="text-primary">*</span>
                          </label>
                          <Select
                            required={!isFree}
                            value={formData.pricing.currency}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                pricing: {
                                  ...formData.pricing,
                                  currency: value ?? "",
                                },
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue>
                                {formData.pricing.currency ? (
                                  <>
                                    {formData.pricing.currency === "USD" &&
                                      "💵 USD"}
                                    {formData.pricing.currency === "EUR" &&
                                      "💶 EUR"}
                                    {formData.pricing.currency === "GBP" &&
                                      "💷 GBP"}
                                    {formData.pricing.currency === "JPY" &&
                                      "💴 JPY"}
                                    {formData.pricing.currency === "CAD" &&
                                      "🍁 CAD"}
                                    {formData.pricing.currency === "AUD" &&
                                      "🦘 AUD"}
                                  </>
                                ) : (
                                  <span className="text-muted-foreground">
                                    Select currency
                                  </span>
                                )}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">💵 USD</SelectItem>
                              <SelectItem value="EUR">💶 EUR</SelectItem>
                              <SelectItem value="GBP">💷 GBP</SelectItem>
                              <SelectItem value="JPY">💴 JPY</SelectItem>
                              <SelectItem value="CAD">🍁 CAD</SelectItem>
                              <SelectItem value="AUD">🦘 AUD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Price <span className="text-primary">*</span>
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
                            className="w-full px-4 py-2 bg-input border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-input/80 transition-all duration-200"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-border"></div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      Optional
                    </span>
                    <div className="h-px flex-1 bg-border"></div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Homepage URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                        className="w-full pl-11 pr-4 py-2 bg-input border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-input/80 transition-all duration-200"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </form>

            <div className="sticky bottom-0 flex items-center justify-between px-6 py-3 bg-card/80 backdrop-blur-xl border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                <span>All changes are saved locally</span>
              </div>
              <div className="flex gap-2.5">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  size="default"
                  className="px-5 py-2 rounded-full"
                  disabled={isScanning}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="default"
                  size="default"
                  className="px-5 py-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                      />
                      <span>{scanProgress || "Scanning..."}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      {editingServer ? "Update Server" : "Publish Server"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
