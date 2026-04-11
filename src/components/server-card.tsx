"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Award,
  Calendar,
  Clock,
  Code,
  Download,
  ExternalLink,
  Home,
  Info,
  Scale,
  TrendingUp,
} from "lucide-react";

interface ServerDetailsCardProps {
  server: {
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
  };
}

export default function ServerDetailsCard({ server }: ServerDetailsCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}k`;
    }
    return num.toString();
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-orange-600 dark:text-orange-400";
  };

  const serverData = server as any;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="border-border bg-card rounded-2xl border p-6"
    >
      <div className="border-border mb-6 flex items-center gap-2 border-b pb-4">
        <Info className="text-primary h-5 w-5" />
        <h2 className="text-foreground text-lg font-bold">Details</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {serverData.qualityScore !== undefined && (
          <div className="col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <Award className="text-muted-foreground h-4 w-4" />
              <p className="text-muted-foreground text-xs tracking-wider uppercase">
                Quality Score
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                <div
                  className={`h-full transition-all duration-500 ${
                    serverData.qualityScore >= 80
                      ? "bg-green-600 dark:bg-green-400"
                      : serverData.qualityScore >= 60
                        ? "bg-yellow-600 dark:bg-yellow-400"
                        : "bg-orange-600 dark:bg-orange-400"
                  }`}
                  style={{ width: `${serverData.qualityScore}%` }}
                />
              </div>
              <span
                className={`text-xl font-bold ${getQualityColor(serverData.qualityScore)}`}
              >
                {serverData.qualityScore}
              </span>
            </div>
          </div>
        )}

        <div>
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="text-muted-foreground h-4 w-4" />
            <p className="text-muted-foreground text-xs tracking-wider uppercase">
              Monthly Calls
            </p>
          </div>
          <div className="text-foreground text-lg font-bold">
            {serverData.monthlyToolCalls !== undefined
              ? formatNumber(serverData.monthlyToolCalls)
              : "Not measured"}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Download className="text-muted-foreground h-4 w-4" />
            <p className="text-muted-foreground text-xs tracking-wider uppercase">
              Total Pulls
            </p>
          </div>
          <div className="text-foreground text-lg font-bold">
            {serverData.totalPulls !== undefined
              ? formatNumber(serverData.totalPulls)
              : "Not measured"}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Activity className="text-muted-foreground h-4 w-4" />
            <p className="text-muted-foreground text-xs tracking-wider uppercase">
              Uptime
            </p>
          </div>
          <div
            className={
              serverData.uptime !== undefined
                ? "text-lg font-bold text-green-600 dark:text-green-400"
                : "text-muted-foreground text-base font-semibold"
            }
          >
            {serverData.uptime !== undefined
              ? `${serverData.uptime}%`
              : "Not measured"}
          </div>
        </div>

        {serverData.latency !== undefined ? (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <p className="text-muted-foreground text-xs tracking-wider uppercase">
                Latency (P95)
              </p>
            </div>
            <div className="text-foreground text-base font-semibold">
              {serverData.latency.p95}ms
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <p className="text-muted-foreground text-xs tracking-wider uppercase">
                Latency (P95)
              </p>
            </div>
            <div className="text-muted-foreground text-base font-semibold">
              Not measured
            </div>
          </div>
        )}

        {server.license && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Scale className="text-muted-foreground h-4 w-4" />
              <p className="text-muted-foreground text-xs tracking-wider uppercase">
                License
              </p>
            </div>
            <div className="text-foreground text-base font-semibold">
              {server.license}
            </div>
          </div>
        )}

        {serverData.publishedDate && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <p className="text-muted-foreground text-xs tracking-wider uppercase">
                Published
              </p>
            </div>
            <div className="text-foreground text-base font-semibold">
              {serverData.publishedDate}
            </div>
          </div>
        )}

        {serverData.lastDeployed && (
          <div className="col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <p className="text-muted-foreground text-xs tracking-wider uppercase">
                Last Updated
              </p>
            </div>
            <div className="text-foreground text-base font-semibold">
              {serverData.lastDeployed}
            </div>
          </div>
        )}

        <div className="border-border col-span-2 border-t pt-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs tracking-wider uppercase">
              Pricing
            </p>
            <div>
              {server.pricing && server.pricing.amount > 0 ? (
                <span className="bg-primary/15 text-primary rounded-lg px-3 py-1.5 text-sm font-bold">
                  ${server.pricing.amount}/mo
                </span>
              ) : (
                <span className="rounded-lg bg-green-500/15 px-3 py-1.5 text-sm font-bold text-green-600 dark:text-green-400">
                  FREE
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <Code className="text-muted-foreground h-4 w-4" />
            <p className="text-muted-foreground text-xs tracking-wider uppercase">
              Source Code
            </p>
          </div>
          <a
            href={server.repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 group flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <span className="truncate">
              {server.repository.url.replace("https://github.com/", "")}
            </span>
            <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 opacity-70 group-hover:opacity-100" />
          </a>
        </div>

        <div className="col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <Home className="text-muted-foreground h-4 w-4" />
            <p className="text-muted-foreground text-xs tracking-wider uppercase">
              Homepage
            </p>
          </div>
          {server.homepage ? (
            <a
              href={server.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 group flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <span className="truncate">{server.homepage}</span>
              <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 opacity-70 group-hover:opacity-100" />
            </a>
          ) : (
            <span className="text-muted-foreground text-sm">Not available</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
