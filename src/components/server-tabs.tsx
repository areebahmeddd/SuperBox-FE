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
    description: string;
    tools: Tool[];
    license: string;
    repository: {
      type: string;
      url: string;
    };
    meta?: {
      created_at: string;
      updated_at: string;
    };
    pricing?: {
      currency: string;
      amount: number;
    };
    homepage?: string;
    security_report?: any;
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
      <div className="border-border mb-8 border-b">
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
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="bg-primary absolute right-0 bottom-0 left-0 h-0.5"
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
            <section className="border-border bg-card rounded-2xl border-2 p-6">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                About
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {server.description}
              </p>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-3">
                <Code className="h-5 w-5 text-[var(--brand-red)]" />
                <h3 className="text-foreground text-lg font-semibold">Tools</h3>
                <span className="rounded-lg bg-[var(--brand-red)]/15 px-2.5 py-0.5 text-xs font-semibold text-[var(--brand-red)]">
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
                    className="border-border bg-card rounded-2xl border-2 p-5"
                  >
                    <h4 className="text-foreground mb-2 text-base font-semibold">
                      {tool.name}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {tool.description}
                    </p>

                    {tool.parameters && tool.parameters.length > 0 && (
                      <div className="mt-4 border-t border-white/5 pt-4">
                        <p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Parameters
                        </p>
                        <div className="space-y-2">
                          {tool.parameters.map((param, idx) => (
                            <div
                              key={idx}
                              className="flex flex-wrap items-center gap-2 text-sm"
                            >
                              <code className="bg-muted border-border text-primary rounded border px-2 py-1 font-mono text-xs">
                                {param.name}
                              </code>
                              <span
                                className={`rounded px-2 py-1 text-xs font-medium ${
                                  param.required
                                    ? "bg-primary/15 text-primary"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {param.required ? "required" : "optional"}
                              </span>
                              <span className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs">
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
                  className="relative mt-6"
                >
                  {!showAllTools && (
                    <div className="from-background pointer-events-none absolute -top-12 right-0 left-0 h-12 bg-gradient-to-t to-transparent" />
                  )}

                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => setShowAllTools(!showAllTools)}
                      className="group text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
                    >
                      <span className="relative">
                        {showAllTools
                          ? "Show less"
                          : `Show ${server.tools.length - 3} more tools`}
                        <span className="bg-foreground/50 absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" />
                      </span>
                      <svg
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${showAllTools ? "rotate-180" : ""}`}
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
          <SecurityReport security={server.security_report} />
        )}

        {activeTab === "reviews" && (
          <ReviewsSection
            serverName={server.name}
            averageRating={undefined}
            totalReviews={undefined}
          />
        )}
      </motion.div>
    </div>
  );
}
