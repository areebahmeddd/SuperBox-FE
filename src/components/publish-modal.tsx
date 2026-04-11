"use client";

import { GithubIcon } from "@/components/ui/github-icon";
import { showToast } from "@/lib/toast-utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Globe, Upload, X } from "lucide-react";
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
            className="bg-background/80 absolute inset-0 backdrop-blur-sm dark:bg-black/70"
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
            className="bg-card border-border relative z-10 max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
          >
            {isScanning && (
              <div className="bg-background/90 absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="border-primary h-12 w-12 rounded-full border-4 border-t-transparent"
                />
                <div className="text-center">
                  <p className="text-foreground text-lg font-semibold">
                    {scanProgress || "Running security scans..."}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    This may take a few moments
                  </p>
                </div>
              </div>
            )}

            <div className="bg-card/80 border-border sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3.5 backdrop-blur-xl">
              <div className="flex-1 text-left">
                <h2 className="text-foreground text-lg font-bold">
                  {editingServer ? "Edit Server" : "Publish Server"}
                </h2>
                <p className="text-muted-foreground text-xs">
                  {editingServer
                    ? "Update your server's information"
                    : "Share your MCP server with the community"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="group flex-shrink-0 p-1.5 transition-colors"
              >
                <X className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(85vh-140px)] overflow-y-auto"
            >
              <div className="space-y-5 px-6 pt-2 pb-6 text-left">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-muted border-border mt-2 flex items-start gap-3 rounded-xl border p-3.5"
                >
                  <AlertCircle className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div className="text-foreground text-sm">
                    <p className="text-foreground mb-1 font-medium">
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
                  <div className="mb-3 flex items-center justify-center gap-3">
                    <div className="bg-border h-px flex-1"></div>
                    <span className="text-muted-foreground text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
                      Basic Information
                    </span>
                    <div className="bg-border h-px flex-1"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-foreground mb-2 block text-sm font-medium">
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
                        className="bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary/50 focus:bg-input/80 w-full rounded-xl border px-4 py-2 text-sm transition-all duration-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-foreground mb-2 block text-sm font-medium">
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
                        className="bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary/50 focus:bg-input/80 w-full rounded-xl border px-4 py-2 text-sm transition-all duration-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-foreground mb-2 block text-sm font-medium">
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
                        className="bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary/50 focus:bg-input/80 w-full rounded-xl border px-4 py-2 text-sm transition-all duration-200 focus:outline-none"
                      />
                    </div>

                    <div className="col-span-2">
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-foreground block text-sm font-medium">
                          Description <span className="text-primary">*</span>
                        </label>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept=".md,.txt,text/plain"
                            onChange={handleReadmeUpload}
                            className="hidden"
                          />
                          <span className="text-muted-foreground hover:text-primary border-border hover:border-primary/30 bg-muted hover:bg-muted/80 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors">
                            <Upload className="h-3 w-3" />
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
                        className="bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary/50 focus:bg-input/80 w-full resize-none rounded-xl border px-4 py-2 text-sm transition-all duration-200 focus:outline-none"
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
                  <div className="mb-3 flex items-center justify-center gap-3">
                    <div className="bg-border h-px flex-1"></div>
                    <span className="text-muted-foreground text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
                      Technical Details
                    </span>
                    <div className="bg-border h-px flex-1"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-foreground mb-2 block text-sm font-medium">
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
                      <label className="text-foreground mb-2 block text-sm font-medium">
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
                      <label className="text-foreground mb-2 block text-sm font-medium">
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
                        className="bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary/50 focus:bg-input/80 w-full rounded-xl border px-4 py-2 font-mono text-sm transition-all duration-200 focus:outline-none"
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
                  <div className="mb-3 flex items-center justify-center gap-3">
                    <div className="bg-border h-px flex-1"></div>
                    <span className="text-muted-foreground text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
                      Repository
                    </span>
                    <div className="bg-border h-px flex-1"></div>
                  </div>

                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-1">
                      <label className="text-foreground mb-2 block text-sm font-medium">
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
                      <label className="text-foreground mb-2 block text-sm font-medium">
                        Repository URL <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <GithubIcon className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
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
                          className="bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary/50 focus:bg-input/80 w-full rounded-xl border py-2 pr-4 pl-11 text-sm transition-all duration-200 focus:outline-none"
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
                  <div className="mb-3 flex items-center justify-center gap-3">
                    <div className="bg-border h-px flex-1"></div>
                    <span className="text-muted-foreground text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
                      Pricing
                    </span>
                    <div className="bg-border h-px flex-1"></div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted border-border flex items-center gap-3 rounded-xl border p-1">
                      <Button
                        type="button"
                        onClick={() => setIsFree(true)}
                        variant={isFree ? "default" : "ghost"}
                        size="default"
                        className={`flex-1 rounded-lg border-2 py-2.5 font-medium transition-all ${
                          isFree
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-sm"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border-transparent bg-transparent"
                        }`}
                      >
                        Free
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setIsFree(false)}
                        variant={!isFree ? "default" : "ghost"}
                        size="default"
                        className={`flex-1 rounded-lg border-2 py-2.5 font-medium transition-all ${
                          !isFree
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-sm"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border-transparent bg-transparent"
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
                          <label className="text-foreground mb-2 block text-sm font-medium">
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
                          <label className="text-foreground mb-2 block text-sm font-medium">
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
                            className="bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary/50 focus:bg-input/80 w-full rounded-xl border px-4 py-2 text-sm transition-all duration-200 focus:outline-none"
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
                  <div className="mb-3 flex items-center justify-center gap-3">
                    <div className="bg-border h-px flex-1"></div>
                    <span className="text-muted-foreground text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
                      Optional
                    </span>
                    <div className="bg-border h-px flex-1"></div>
                  </div>

                  <div>
                    <label className="text-foreground mb-2 block text-sm font-medium">
                      Homepage URL
                    </label>
                    <div className="relative">
                      <Globe className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
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
                        className="bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary/50 focus:bg-input/80 w-full rounded-xl border py-2 pr-4 pl-11 text-sm transition-all duration-200 focus:outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </form>

            <div className="bg-card/80 border-border sticky bottom-0 flex items-center justify-between border-t px-6 py-3 backdrop-blur-xl">
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                <span>All changes are saved locally</span>
              </div>
              <div className="flex gap-2.5">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  size="default"
                  className="rounded-full px-5 py-2"
                  disabled={isScanning}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="default"
                  size="default"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 py-2 font-semibold"
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
                        className="border-primary-foreground h-4 w-4 rounded-full border-2 border-t-transparent"
                      />
                      <span>{scanProgress || "Scanning..."}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
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
