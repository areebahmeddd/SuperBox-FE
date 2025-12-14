"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Shield,
  XCircle,
} from "lucide-react";

interface SecurityReportProps {
  security?: {
    metadata: {
      repository: string;
      repo_url: string;
      scan_date: string;
      scanners_used: string[];
    };
    summary: {
      total_issues_all_scanners: number;
      critical_issues: number;
      sonarcloud_url: string;
      scan_passed: boolean;
    };
    sonarqube: {
      total_issues: number;
      bugs: number;
      vulnerabilities: number;
      code_smells: number;
      security_hotspots: number;
      quality_gate: string;
      reliability_rating: string;
      security_rating: string;
      maintainability_rating: string;
      coverage: number;
      duplications: number;
      lines_of_code: number;
    };
    gitguardian: {
      scan_passed: boolean;
      total_secrets: number;
      secrets: any[];
      error: string | null;
    };
    bandit: {
      scan_passed: boolean;
      total_issues: number;
      severity_counts: {
        high: number;
        medium: number;
        low: number;
      };
      total_lines_scanned: number;
      issues: Array<{
        title: string;
        severity: string;
        confidence: string;
        file: string;
        line_number: number;
        test_id: string;
        test_name: string;
        cwe: number;
      }>;
      error: string | null;
    };
    recommendations: string[];
  };
}

export default function SecurityReport({ security }: SecurityReportProps) {
  if (!security) {
    return (
      <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-12 text-center">
        <Shield className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No security report available</p>
      </div>
    );
  }

  const getRatingColor = (rating: string) => {
    if (rating === "A") return "text-green-400";
    if (rating === "B") return "text-yellow-400";
    return "text-red-400";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-gray-500/15 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/15 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-white/10 rounded-2xl bg-white/[0.02] p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-[var(--brand-red)]" />
              <h3 className="text-2xl font-bold text-white/95">
                Security Scan
              </h3>
            </div>
            <p className="text-sm text-gray-400">
              Scanned{" "}
              {new Date(security.metadata.scan_date).toLocaleDateString()}
            </p>
          </div>

          {security.summary.scan_passed ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/15 text-green-400 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Passed</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/15 text-red-400 rounded-lg">
              <XCircle className="w-5 h-5" />
              <span className="font-semibold">Issues Found</span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-6">
          <p className="text-sm text-gray-400 mb-2">Total Issues</p>
          <p className="text-3xl font-bold text-white/95">
            {security.summary.total_issues_all_scanners}
          </p>
        </div>

        <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-6">
          <p className="text-sm text-gray-400 mb-2">Critical</p>
          <p
            className={`text-3xl font-bold ${security.summary.critical_issues === 0 ? "text-green-400" : "text-red-400"}`}
          >
            {security.summary.critical_issues}
          </p>
        </div>

        <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-6">
          <p className="text-sm text-gray-400 mb-2">Vulnerabilities</p>
          <p
            className={`text-3xl font-bold ${security.sonarqube.vulnerabilities === 0 ? "text-green-400" : "text-red-400"}`}
          >
            {security.sonarqube.vulnerabilities}
          </p>
        </div>

        <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-6">
          <p className="text-sm text-gray-400 mb-2">Secrets</p>
          <p
            className={`text-3xl font-bold ${security.gitguardian.total_secrets === 0 ? "text-green-400" : "text-yellow-400"}`}
          >
            {security.gitguardian.total_secrets}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border border-white/10 rounded-2xl bg-white/[0.02] p-6"
      >
        <h4 className="text-lg font-semibold text-white/95 mb-6">
          Quality Ratings
        </h4>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-3">Security</p>
            <div className="flex items-center gap-3">
              <span
                className={`text-4xl font-bold ${getRatingColor(security.sonarqube.security_rating)}`}
              >
                {security.sonarqube.security_rating}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-3">Reliability</p>
            <div className="flex items-center gap-3">
              <span
                className={`text-4xl font-bold ${getRatingColor(security.sonarqube.reliability_rating)}`}
              >
                {security.sonarqube.reliability_rating}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-3">Maintainability</p>
            <div className="flex items-center gap-3">
              <span
                className={`text-4xl font-bold ${getRatingColor(security.sonarqube.maintainability_rating)}`}
              >
                {security.sonarqube.maintainability_rating}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/10">
          <div>
            <p className="text-sm text-gray-400 mb-2">Code Coverage</p>
            <p className="text-2xl font-bold text-white/95">
              {security.sonarqube.coverage}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Duplications</p>
            <p className="text-2xl font-bold text-white/95">
              {security.sonarqube.duplications}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Lines of Code</p>
            <p className="text-2xl font-bold text-white/95">
              {security.sonarqube.lines_of_code.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      {security.bandit.total_issues > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-white/10 rounded-2xl bg-white/[0.02] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h4 className="text-lg font-semibold text-white/95">
                Security Issues
              </h4>
              <span className="px-2.5 py-0.5 bg-yellow-500/15 text-yellow-400 text-sm font-semibold rounded-lg">
                {security.bandit.total_issues}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 border border-red-500/30 bg-red-500/10 rounded-xl">
              <p className="text-2xl font-bold text-red-400 mb-1">
                {security.bandit.severity_counts.high}
              </p>
              <p className="text-sm text-gray-400">High</p>
            </div>
            <div className="text-center p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-xl">
              <p className="text-2xl font-bold text-yellow-400 mb-1">
                {security.bandit.severity_counts.medium}
              </p>
              <p className="text-sm text-gray-400">Medium</p>
            </div>
            <div className="text-center p-4 border border-gray-500/30 bg-gray-500/10 rounded-xl">
              <p className="text-2xl font-bold text-gray-400 mb-1">
                {security.bandit.severity_counts.low}
              </p>
              <p className="text-sm text-gray-400">Low</p>
            </div>
          </div>

          {security.bandit.issues.slice(0, 3).map((issue, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border mb-3 last:mb-0 ${getSeverityColor(issue.severity)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium flex-1">{issue.title}</p>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${getSeverityColor(issue.severity)}`}
                >
                  {issue.severity.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{issue.file.split("/").pop()}</span>
                <span>Line {issue.line_number}</span>
                <code className="px-2 py-0.5 bg-white/5 rounded">
                  {issue.test_id}
                </code>
              </div>
            </div>
          ))}

          {security.bandit.issues.length > 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-6 relative"
            >
              <div className="flex items-center justify-center">
                <button className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <span className="relative">
                    Show {security.bandit.issues.length - 3} more issues
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/50 group-hover:w-full transition-all duration-300" />
                  </span>
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-300"
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
        </motion.div>
      )}

      {security.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border border-white/10 rounded-2xl bg-white/[0.02] p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-[var(--brand-red)]" />
            <h4 className="text-lg font-semibold text-white/95">
              Recommendations
            </h4>
          </div>
          <ul className="space-y-2">
            {security.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-300">
                <span className="text-[var(--brand-red)] mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
