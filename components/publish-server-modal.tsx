"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { useState } from "react";

interface PublishServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServerFormData) => void;
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
}: PublishServerModalProps) {
  const [formData, setFormData] = useState<ServerFormData>({
    name: "",
    version: "1.0.0",
    description: "",
    author: "",
    lang: "Python",
    license: "MIT",
    entrypoint: "main.py",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white/[0.02] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden backdrop-blur-xl my-8"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold text-white/95">
                    Publish New Server
                  </h2>
                  <p className="text-gray-400/80 text-sm mt-1">
                    Share your MCP server with the community
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]"
              >
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white/95">
                      Basic Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-300/90 mb-2">
                        Server Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g., image-watermarker"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300/90 mb-2">
                          Version *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.version}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              version: e.target.value,
                            })
                          }
                          placeholder="1.0.0"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300/90 mb-2">
                          Author *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.author}
                          onChange={(e) =>
                            setFormData({ ...formData, author: e.target.value })
                          }
                          placeholder="Your Name"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300/90 mb-2">
                        Description *
                      </label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="A simple MCP that adds watermark logos to images."
                        rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300 resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-lg font-semibold text-white/95">
                      Technical Details
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300/90 mb-2">
                          Language *
                        </label>
                        <select
                          value={formData.lang}
                          onChange={(e) =>
                            setFormData({ ...formData, lang: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300"
                        >
                          <option value="Python">Python</option>
                          <option value="JavaScript">JavaScript</option>
                          <option value="TypeScript">TypeScript</option>
                          <option value="Go">Go</option>
                          <option value="Rust">Rust</option>
                          <option value="Java">Java</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300/90 mb-2">
                          License *
                        </label>
                        <select
                          value={formData.license}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              license: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300"
                        >
                          <option value="MIT">MIT</option>
                          <option value="Apache-2.0">Apache 2.0</option>
                          <option value="GPL-3.0">GPL 3.0</option>
                          <option value="BSD-3-Clause">BSD 3-Clause</option>
                          <option value="ISC">ISC</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300/90 mb-2">
                        Entrypoint *
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
                        placeholder="main.py"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-lg font-semibold text-white/95">
                      Pricing (Optional)
                    </h3>
                    <p className="text-sm text-gray-400/70">
                      Leave empty for free servers
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300/90 mb-2">
                          Currency *
                        </label>
                        <select
                          required
                          value={formData.pricing.currency || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pricing: {
                                currency: e.target.value,
                                amount: formData.pricing.amount || 0,
                              },
                            })
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300"
                        >
                          <option value="">
                            Select Currency (or leave for Free)
                          </option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="INR">INR</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300/90 mb-2">
                          Amount *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={formData.pricing.amount || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pricing: {
                                currency: formData.pricing.currency,
                                amount: parseFloat(e.target.value) || 0,
                              },
                            })
                          }
                          placeholder="0.00 (use 0 for free)"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-lg font-semibold text-white/95">
                      Repository
                    </h3>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-300/90 mb-2">
                          Type *
                        </label>
                        <select
                          value={formData.repository.type}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              repository: {
                                ...formData.repository,
                                type: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300"
                        >
                          <option value="git">Git</option>
                          <option value="svn">SVN</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-300/90 mb-2">
                          Repository URL *
                        </label>
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
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              <div className="flex items-center justify-between p-6 border-t border-white/10">
                <p className="text-sm text-gray-400/80">* Required fields</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300/90 rounded-xl font-semibold border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-white text-gray-900 hover:bg-white/90 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Publish Server
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
