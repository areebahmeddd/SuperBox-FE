"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Award,
  Calendar,
  Clock,
  Code,
  ExternalLink,
  GitBranch,
  Globe,
  Home,
  Info,
  Scale,
  TrendingUp,
} from "lucide-react";

interface ServerDetailsCardProps {
  server: {
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
    pricing: {
      currency: string;
      amount: number;
    };
    sourceCode?: {
      platform: string;
      url: string;
      repo: string;
    };
    homepage?: {
      url: string;
      domain: string;
    };
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
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="border border-white/10 rounded-xl bg-white/[0.02] p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Info className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-bold text-white/95">Details</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Quality Score */}
        {server.qualityScore !== undefined && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-gray-400/70" />
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                Quality Score
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xl font-bold ${getQualityColor(server.qualityScore)}`}
              >
                🏆
              </span>
              <span className="text-lg font-semibold text-white/95">
                {server.qualityScore}/100
              </span>
            </div>
          </div>
        )}

        {/* Monthly Tool Calls */}
        {server.monthlyToolCalls !== undefined && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-400/70" />
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                Monthly Tool Calls
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="text-lg font-semibold text-white/95">
                {formatNumber(server.monthlyToolCalls)}
              </span>
            </div>
          </div>
        )}

        {/* Deployed From */}
        {server.deployedFrom && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-4 h-4 text-gray-400/70" />
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                Deployed from
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <span className="text-sm font-medium text-white/90">
                {server.deployedFrom.branch} ~ {server.deployedFrom.commit}
              </span>
            </div>
          </div>
        )}

        {/* Uptime */}
        {server.uptime !== undefined && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-gray-400/70" />
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                Uptime
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-white/95">
                {server.uptime}%
              </span>
            </div>
          </div>
        )}

        {/* Latency */}
        {server.latency && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-400/70" />
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                Latency
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/90">
                {server.latency.p95.toFixed(2)}s (P95)
              </span>
            </div>
          </div>
        )}

        {/* License */}
        {server.license && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-gray-400/70" />
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                License
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/90">
                {server.license}
              </span>
            </div>
          </div>
        )}

        {/* Local */}
        {server.isLocal !== undefined && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-gray-400/70" />
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                Local
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌐</span>
              <span className="text-sm font-medium text-white/90">
                {server.isLocal ? "Yes" : "No"}
              </span>
            </div>
          </div>
        )}

        {/* Published */}
        {server.publishedDate && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-400/70" />
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                Published
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/90">
                {server.publishedDate}
              </span>
            </div>
          </div>
        )}

        {/* Pricing */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-400/70">💰</span>
            <p className="text-xs text-gray-400/70 uppercase tracking-wider">
              Pricing
            </p>
          </div>
          <div className="flex items-center gap-2">
            {server.pricing &&
            server.pricing.currency &&
            server.pricing.amount ? (
              <span className="px-3 py-1.5 bg-amber-500/20 text-amber-400 text-sm font-semibold rounded">
                {server.pricing.currency} {server.pricing.amount}
              </span>
            ) : (
              <span className="px-3 py-1.5 bg-green-500/20 text-green-400 text-sm font-semibold rounded">
                FREE
              </span>
            )}
          </div>
        </div>

        {/* Source Code */}
        {server.sourceCode && (
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-gray-400/70" />
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                Source Code
              </p>
            </div>
            <a
              href={server.sourceCode.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors duration-200 group"
            >
              <span className="text-xl">🧑‍💻</span>
              <span className="underline-offset-4 group-hover:underline">
                {server.sourceCode.repo}
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        )}

        {/* Homepage */}
        {server.homepage && (
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Home className="w-4 h-4 text-gray-400/70" />
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                Homepage
              </p>
            </div>
            <a
              href={server.homepage.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors duration-200 group"
            >
              <span>🔗</span>
              <span className="underline-offset-4 group-hover:underline">
                {server.homepage.domain}
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}
