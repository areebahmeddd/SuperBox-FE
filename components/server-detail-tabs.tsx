"use client";

import { motion } from "framer-motion";
import { Code, Info, Shield, Star } from "lucide-react";
import { useState } from "react";
import ReviewsSection from "./reviews-section";
import SecurityReport from "./security-report";
import ServerDetailsCard from "./server-details-card";

interface Tool {
  name: string;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
}

interface ServerDetailTabsProps {
  server: {
    name: string;
    about: string;
    tools: Tool[];
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
    downloads?: number;
    rating?: number;
    reviewCount?: number;
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

type TabType = "overview" | "security" | "reviews";

export default function ServerDetailTabs({ server }: ServerDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const tabs = [
    {
      id: "overview" as TabType,
      label: "Overview",
      icon: Info,
    },
    {
      id: "security" as TabType,
      label: "Security",
      icon: Shield,
    },
    {
      id: "reviews" as TabType,
      label: "Reviews",
      icon: Star,
    },
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-white/10 mb-8">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-white/95"
                  : "text-gray-400/80 hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "overview" && (
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
              {/* About Section */}
              <section>
                <h3 className="text-xl font-semibold text-white/95 mb-4">
                  About
                </h3>
                <p className="text-gray-300/80 leading-relaxed">
                  {server.about}
                </p>
              </section>

              {/* Tools Section */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-semibold text-white/95">Tools</h3>
                  <span className="px-2 py-0.5 bg-cyan-400/20 text-cyan-400 text-xs rounded-full">
                    {server.tools.length}
                  </span>
                </div>
                <div className="mb-6 px-4 py-2.5 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-400/90 flex items-center gap-2">
                    <span className="text-base">ℹ️</span>
                    All servers have a{" "}
                    <span className="font-semibold">
                      100 tool calls/month
                    </span>{" "}
                    limit
                  </p>
                </div>
                <div className="space-y-4">
                  {server.tools.map((tool, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="p-6 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all duration-200"
                    >
                      <h4 className="text-lg font-semibold text-white/95 mb-3">
                        {tool.name}
                      </h4>
                      <p className="text-gray-400/80 text-sm leading-relaxed mb-4">
                        {tool.description}
                      </p>

                      {tool.parameters && tool.parameters.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <p className="text-xs font-semibold text-gray-400/80 mb-3 uppercase tracking-wider">
                            Parameters
                          </p>
                          <div className="space-y-2">
                            {tool.parameters.map((param, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 text-sm"
                              >
                                <code className="px-2 py-1 bg-white/5 rounded text-cyan-400 font-mono text-xs">
                                  {param.name}
                                </code>
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    param.required
                                      ? "bg-orange-500/20 text-orange-400"
                                      : "bg-gray-500/20 text-gray-400"
                                  }`}
                                >
                                  {param.required ? "required" : "optional"}
                                </span>
                                <span className="px-2 py-1 bg-white/5 rounded text-gray-400 text-xs">
                                  {param.type}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>

            {/* Details Card in Sidebar */}
            <div className="col-span-1">
              <ServerDetailsCard server={server} />
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <SecurityReport security={server.security} />
        )}

        {activeTab === "reviews" && (
          <ReviewsSection
            serverName={server.name}
            averageRating={server.rating}
            totalReviews={server.reviewCount}
            reviews={[
              {
                id: "1",
                author: "John Doe",
                rating: 5,
                date: "2025-10-15",
                comment:
                  "Excellent server! Very reliable and easy to integrate. The tools provided are exactly what I needed for my project.",
                helpful: 12,
              },
              {
                id: "2",
                author: "Jane Smith",
                rating: 4,
                date: "2025-10-20",
                comment:
                  "Great functionality overall. Documentation could be improved, but the server performs well.",
                helpful: 8,
              },
              {
                id: "3",
                author: "Mike Johnson",
                rating: 5,
                date: "2025-10-25",
                comment:
                  "Amazing work! This server has been running flawlessly in production for weeks. Highly recommended.",
                helpful: 15,
              },
            ]}
          />
        )}
      </motion.div>
    </div>
  );
}
