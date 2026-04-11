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
    snyk: {
      scan_passed: boolean;
      total_vulnerabilities: number;
      severity_counts: {
        critical: number;
        high: number;
        medium: number;
        low: number;
      };
      vulnerabilities: Array<{
        title: string;
        package: string;
        version: string;
        severity: string;
        id: string;
        cve: string[];
        cvss_score: number;
        is_upgradable: boolean;
        is_patchable: boolean;
      }>;
      error: string | null;
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
      <div className="border-border bg-card rounded-2xl border p-12 text-center">
        <Shield className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <p className="text-muted-foreground">No security report available</p>
      </div>
    );
  }

  const getRatingColor = (rating: string) => {
    if (rating === "A") return "text-green-600 dark:text-green-400";
    if (rating === "B") return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-600/20 text-red-600 dark:text-red-400 border-red-600/40";
      case "high":
        return "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-border bg-card rounded-2xl border p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Shield className="text-primary h-6 w-6" />
              <h3 className="text-foreground text-2xl font-bold">
                Security Scan
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Scanned{" "}
              {new Date(security.metadata.scan_date).toLocaleDateString()}
            </p>
          </div>

          {security.summary.scan_passed ? (
            <div className="flex items-center gap-2 rounded-lg bg-green-500/15 px-4 py-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Passed</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/15 px-4 py-2 text-red-600 dark:text-red-400">
              <XCircle className="h-5 w-5" />
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
        <div className="border-border bg-card rounded-2xl border p-6">
          <p className="text-muted-foreground mb-2 text-sm">Total Issues</p>
          <p className="text-foreground text-3xl font-bold">
            {security.summary.total_issues_all_scanners}
          </p>
        </div>

        <div className="border-border bg-card rounded-2xl border p-6">
          <p className="text-muted-foreground mb-2 text-sm">Critical</p>
          <p
            className={`text-3xl font-bold ${security.summary.critical_issues === 0 ? "text-green-400" : "text-red-400"}`}
          >
            {security.summary.critical_issues}
          </p>
        </div>

        <div className="border-border bg-card rounded-2xl border p-6">
          <p className="text-muted-foreground mb-2 text-sm">Vulnerabilities</p>
          <p
            className={`text-3xl font-bold ${security.sonarqube.vulnerabilities === 0 ? "text-green-400" : "text-red-400"}`}
          >
            {security.sonarqube.vulnerabilities}
          </p>
        </div>

        <div className="border-border bg-card rounded-2xl border p-6">
          <p className="text-muted-foreground mb-2 text-sm">Secrets</p>
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
        className="border-border bg-card rounded-2xl border p-6"
      >
        <h4 className="text-foreground mb-6 text-lg font-semibold">
          Quality Ratings
        </h4>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-muted-foreground mb-3 text-sm">Security</p>
            <div className="flex items-center gap-3">
              <span
                className={`text-4xl font-bold ${getRatingColor(security.sonarqube.security_rating)}`}
              >
                {security.sonarqube.security_rating}
              </span>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-3 text-sm">Reliability</p>
            <div className="flex items-center gap-3">
              <span
                className={`text-4xl font-bold ${getRatingColor(security.sonarqube.reliability_rating)}`}
              >
                {security.sonarqube.reliability_rating}
              </span>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-3 text-sm">
              Maintainability
            </p>
            <div className="flex items-center gap-3">
              <span
                className={`text-4xl font-bold ${getRatingColor(security.sonarqube.maintainability_rating)}`}
              >
                {security.sonarqube.maintainability_rating}
              </span>
            </div>
          </div>
        </div>

        <div className="border-border mt-6 grid grid-cols-3 gap-6 border-t pt-6">
          <div>
            <p className="text-muted-foreground mb-2 text-sm">Code Coverage</p>
            <p className="text-foreground text-2xl font-bold">
              {security.sonarqube.coverage}%
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-2 text-sm">Duplications</p>
            <p className="text-foreground text-2xl font-bold">
              {security.sonarqube.duplications}%
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-2 text-sm">Lines of Code</p>
            <p className="text-foreground text-2xl font-bold">
              {security.sonarqube.lines_of_code.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      {security.snyk && security.snyk.total_vulnerabilities > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border-border bg-card rounded-2xl border p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
              <h4 className="text-foreground text-lg font-semibold">
                Dependency Vulnerabilities
              </h4>
              <span className="rounded-lg bg-red-500/15 px-2.5 py-0.5 text-sm font-semibold text-red-600 dark:text-red-400">
                {security.snyk.total_vulnerabilities}
              </span>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-4 gap-4">
            <div className="rounded-xl border border-red-500/40 bg-red-500/15 p-4 text-center">
              <p className="mb-1 text-2xl font-bold text-red-600 dark:text-red-400">
                {security.snyk.severity_counts.critical}
              </p>
              <p className="text-muted-foreground text-sm">Critical</p>
            </div>
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
              <p className="mb-1 text-2xl font-bold text-red-600 dark:text-red-400">
                {security.snyk.severity_counts.high}
              </p>
              <p className="text-muted-foreground text-sm">High</p>
            </div>
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center">
              <p className="mb-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {security.snyk.severity_counts.medium}
              </p>
              <p className="text-muted-foreground text-sm">Medium</p>
            </div>
            <div className="border-border bg-muted rounded-xl border p-4 text-center">
              <p className="text-muted-foreground mb-1 text-2xl font-bold">
                {security.snyk.severity_counts.low}
              </p>
              <p className="text-muted-foreground text-sm">Low</p>
            </div>
          </div>

          {security.snyk.vulnerabilities.slice(0, 3).map((vuln, idx) => (
            <div
              key={idx}
              className={`mb-3 rounded-xl border p-4 last:mb-0 ${getSeverityColor(vuln.severity)}`}
            >
              <div className="mb-2 flex items-start justify-between">
                <p className="flex-1 text-sm font-medium">{vuln.title}</p>
                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${getSeverityColor(vuln.severity)}`}
                >
                  {vuln.severity.toUpperCase()}
                </span>
              </div>
              <div className="text-muted-foreground mb-2 flex items-center gap-4 text-xs">
                <span>
                  <strong>Package:</strong> {vuln.package}@{vuln.version}
                </span>
                {vuln.cvss_score > 0 && (
                  <span>
                    <strong>CVSS:</strong> {vuln.cvss_score}
                  </span>
                )}
              </div>
              {(vuln.is_upgradable || vuln.is_patchable) && (
                <div className="border-border/50 mt-2 border-t pt-2">
                  <div className="flex gap-2">
                    {vuln.is_upgradable && (
                      <span className="rounded bg-green-500/15 px-2 py-1 text-xs text-green-600 dark:text-green-400">
                        Upgradable
                      </span>
                    )}
                    {vuln.is_patchable && (
                      <span className="rounded bg-blue-500/15 px-2 py-1 text-xs text-blue-600 dark:text-blue-400">
                        Patchable
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {security.snyk.vulnerabilities.length > 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="relative mt-6"
            >
              <div className="flex items-center justify-center">
                <button className="group text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors">
                  <span className="relative">
                    Show {security.snyk.vulnerabilities.length - 3} more
                    vulnerabilities
                    <span className="bg-foreground/50 absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" />
                  </span>
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-300"
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

      {security.gitguardian.total_secrets > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="border-border bg-card rounded-2xl border p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              <h4 className="text-foreground text-lg font-semibold">
                Secrets Detected
              </h4>
              <span className="rounded-lg bg-yellow-500/15 px-2.5 py-0.5 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                {security.gitguardian.total_secrets}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
              {security.gitguardian.total_secrets} secret
              {security.gitguardian.total_secrets > 1 ? "s" : ""} found in
              repository. Rotate credentials immediately.
            </p>
          </div>
        </motion.div>
      )}

      {security.bandit.total_issues > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border-border bg-card rounded-2xl border p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              <h4 className="text-foreground text-lg font-semibold">
                Security Issues
              </h4>
              <span className="rounded-lg bg-yellow-500/15 px-2.5 py-0.5 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                {security.bandit.total_issues}
              </span>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
              <p className="mb-1 text-2xl font-bold text-red-600 dark:text-red-400">
                {security.bandit.severity_counts.high}
              </p>
              <p className="text-muted-foreground text-sm">High</p>
            </div>
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center">
              <p className="mb-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {security.bandit.severity_counts.medium}
              </p>
              <p className="text-muted-foreground text-sm">Medium</p>
            </div>
            <div className="border-border bg-muted rounded-xl border p-4 text-center">
              <p className="text-muted-foreground mb-1 text-2xl font-bold">
                {security.bandit.severity_counts.low}
              </p>
              <p className="text-muted-foreground text-sm">Low</p>
            </div>
          </div>

          {security.bandit.issues.slice(0, 3).map((issue, idx) => (
            <div
              key={idx}
              className={`mb-3 rounded-xl border p-4 last:mb-0 ${getSeverityColor(issue.severity)}`}
            >
              <div className="mb-2 flex items-start justify-between">
                <p className="flex-1 text-sm font-medium">{issue.title}</p>
                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${getSeverityColor(issue.severity)}`}
                >
                  {issue.severity.toUpperCase()}
                </span>
              </div>
              <div className="text-muted-foreground flex items-center gap-4 text-xs">
                <span>{issue.file.split("/").pop()}</span>
                <span>Line {issue.line_number}</span>
                <code className="bg-muted rounded px-2 py-0.5">
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
              className="relative mt-6"
            >
              <div className="flex items-center justify-center">
                <button className="group text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors">
                  <span className="relative">
                    Show {security.bandit.issues.length - 3} more issues
                    <span className="bg-foreground/50 absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" />
                  </span>
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-300"
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
          transition={{ delay: 0.5 }}
          className="border-border bg-card rounded-2xl border p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <FileText className="text-primary h-5 w-5" />
            <h4 className="text-foreground text-lg font-semibold">
              Recommendations
            </h4>
          </div>
          <ul className="space-y-2">
            {security.recommendations.map((rec, idx) => (
              <li key={idx} className="text-foreground flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
