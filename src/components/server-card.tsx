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
      className="border border-border rounded-2xl bg-card p-6"
    >
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-border">
        <Info className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Details</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {serverData.qualityScore !== undefined && (
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Quality Score
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
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
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Monthly Calls
            </p>
          </div>
          <div className="text-lg font-bold text-foreground">
            {serverData.monthlyToolCalls !== undefined
              ? formatNumber(serverData.monthlyToolCalls)
              : "Not measured"}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Download className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Total Pulls
            </p>
          </div>
          <div className="text-lg font-bold text-foreground">
            {serverData.totalPulls !== undefined
              ? formatNumber(serverData.totalPulls)
              : "Not measured"}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Uptime
            </p>
          </div>
          <div
            className={
              serverData.uptime !== undefined
                ? "text-lg font-bold text-green-600 dark:text-green-400"
                : "text-base font-semibold text-muted-foreground"
            }
          >
            {serverData.uptime !== undefined
              ? `${serverData.uptime}%`
              : "Not measured"}
          </div>
        </div>

        {serverData.latency !== undefined ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Latency (P95)
              </p>
            </div>
            <div className="text-base font-semibold text-foreground">
              {serverData.latency.p95}ms
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Latency (P95)
              </p>
            </div>
            <div className="text-base font-semibold text-muted-foreground">
              Not measured
            </div>
          </div>
        )}

        {server.license && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Scale className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                License
              </p>
            </div>
            <div className="text-base font-semibold text-foreground">
              {server.license}
            </div>
          </div>
        )}

        {serverData.publishedDate && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Published
              </p>
            </div>
            <div className="text-base font-semibold text-foreground">
              {serverData.publishedDate}
            </div>
          </div>
        )}

        {serverData.lastDeployed && (
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Last Updated
              </p>
            </div>
            <div className="text-base font-semibold text-foreground">
              {serverData.lastDeployed}
            </div>
          </div>
        )}

        <div className="col-span-2 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Pricing
            </p>
            <div>
              {server.pricing && server.pricing.amount > 0 ? (
                <span className="px-3 py-1.5 bg-primary/15 text-primary text-sm font-bold rounded-lg">
                  ${server.pricing.amount}/mo
                </span>
              ) : (
                <span className="px-3 py-1.5 bg-green-500/15 text-green-600 dark:text-green-400 text-sm font-bold rounded-lg">
                  FREE
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Source Code
            </p>
          </div>
          <a
            href={server.repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            <span className="truncate">
              {server.repository.url.replace("https://github.com/", "")}
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70 flex-shrink-0 group-hover:opacity-100" />
          </a>
        </div>

        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Home className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Homepage
            </p>
          </div>
          {server.homepage ? (
            <a
              href={server.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
            >
              <span className="truncate">{server.homepage}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 flex-shrink-0 group-hover:opacity-100" />
            </a>
          ) : (
            <span className="text-sm text-muted-foreground">Not available</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
