"use client";

import { motion } from "framer-motion";
import { Code, Info, Shield, Star } from "lucide-react";
import { useState } from "react";
import ReviewsSection from "./reviews-section";
import SecurityReport from "./security-report";
import ServerDetailsCard from "./server-card";

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
  const [showAllTools, setShowAllTools] = useState(false);

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: Info },
    { id: "security" as TabType, label: "Security", icon: Shield },
    { id: "reviews" as TabType, label: "Reviews", icon: Star },
  ];

  const visibleTools = showAllTools ? server.tools : server.tools.slice(0, 3);
  const hasMoreTools = server.tools.length > 3;

  return (
    <div>
      <div className="border-b border-border mb-8">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeTab === "overview" && (
          <div className="space-y-6">
            <section className="border-2 border-border rounded-2xl bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                About
              </h3>
              <p className="text-foreground leading-relaxed">{server.about}</p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-5 h-5 text-[var(--brand-red)]" />
                <h3 className="text-lg font-semibold text-foreground">Tools</h3>
                <span className="px-2.5 py-0.5 bg-[var(--brand-red)]/15 text-[var(--brand-red)] text-xs font-semibold rounded-lg">
                  {server.tools.length}
                </span>
              </div>

              <div className="space-y-3">
                {visibleTools.map((tool, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-2 border-border rounded-2xl bg-card p-5"
                  >
                    <h4 className="text-base font-semibold text-foreground mb-2">
                      {tool.name}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {tool.description}
                    </p>

                    {tool.parameters && tool.parameters.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                          Parameters
                        </p>
                        <div className="space-y-2">
                          {tool.parameters.map((param, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm flex-wrap"
                            >
                              <code className="px-2 py-1 bg-muted border border-border rounded text-primary font-mono text-xs">
                                {param.name}
                              </code>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  param.required
                                    ? "bg-primary/15 text-primary"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {param.required ? "required" : "optional"}
                              </span>
                              <span className="px-2 py-1 bg-muted rounded text-muted-foreground text-xs">
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

              {hasMoreTools && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-6 relative"
                >
                  {!showAllTools && (
                    <div className="absolute -top-12 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                  )}

                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => setShowAllTools(!showAllTools)}
                      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="relative">
                        {showAllTools
                          ? "Show less"
                          : `Show ${server.tools.length - 3} more tools`}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground/50 group-hover:w-full transition-all duration-300" />
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${showAllTools ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </section>

            <section>
              <ServerDetailsCard server={server} />
            </section>
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
          />
        )}
      </motion.div>
    </div>
  );
}
