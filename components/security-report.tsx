"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bug,
  CheckCircle,
  Clock,
  ExternalLink,
  FileWarning,
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
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-gray-500/50 mx-auto mb-4" />
        <p className="text-gray-400/70">No security report available</p>
      </div>
    );
  }

  const getRatingColor = (rating: string) => {
    if (rating === "N/A" || !rating) return "text-gray-400";
    const numRating = parseFloat(rating);
    if (numRating >= 4.0) return "text-red-400";
    if (numRating >= 2.0) return "text-orange-400";
    return "text-green-400";
  };

  const getRatingLabel = (rating: string) => {
    if (rating === "N/A" || !rating) return "N/A";
    const numRating = parseFloat(rating);
    if (numRating >= 4.0) return "Poor";
    if (numRating >= 2.0) return "Fair";
    return "Good";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "medium":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30";
      case "low":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/30";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Scan Overview Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border border-white/10 rounded-xl bg-white/[0.02] p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white/95 mb-2 flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              Security Scan Report
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(security.metadata.scan_date)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {security.summary.scan_passed ? (
              <span className="px-3 py-1.5 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Passed
              </span>
            ) : (
              <span className="px-3 py-1.5 bg-red-500/20 text-red-400 text-sm font-semibold rounded-full flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Issues Found
              </span>
            )}
          </div>
        </div>

        {/* Scanners Used */}
        <div className="flex flex-wrap gap-2 mb-4">
          {security.metadata.scanners_used.map((scanner, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-medium rounded-full border border-cyan-500/30"
            >
              {scanner}
            </span>
          ))}
        </div>

        {security.summary.sonarcloud_url && (
          <a
            href={security.summary.sonarcloud_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View Full Report on SonarCloud
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        {/* Total Issues */}
        <div className="border border-white/10 rounded-xl bg-white/[0.02] p-5">
          <div className="flex items-center gap-3 mb-3">
            <FileWarning className="w-5 h-5 text-cyan-400" />
            <span className="text-xs text-gray-400/70 uppercase tracking-wider">
              Total Issues
            </span>
          </div>
          <div className="text-3xl font-bold text-white/95">
            {security.summary.total_issues_all_scanners}
          </div>
        </div>

        {/* Critical */}
        <div className="border border-white/10 rounded-xl bg-white/[0.02] p-5">
          <div className="flex items-center gap-3 mb-3">
            {security.summary.critical_issues === 0 ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-xs text-gray-400/70 uppercase tracking-wider">
              Critical
            </span>
          </div>
          <div className="text-3xl font-bold text-white/95">
            {security.summary.critical_issues}
          </div>
        </div>

        {/* Vulnerabilities */}
        <div className="border border-white/10 rounded-xl bg-white/[0.02] p-5">
          <div className="flex items-center gap-3 mb-3">
            {security.sonarqube.vulnerabilities === 0 ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-xs text-gray-400/70 uppercase tracking-wider">
              Vulnerabilities
            </span>
          </div>
          <div className="text-3xl font-bold text-white/95">
            {security.sonarqube.vulnerabilities}
          </div>
        </div>

        {/* Secrets */}
        <div className="border border-white/10 rounded-xl bg-white/[0.02] p-5">
          <div className="flex items-center gap-3 mb-3">
            {security.gitguardian.total_secrets === 0 ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            )}
            <span className="text-xs text-gray-400/70 uppercase tracking-wider">
              Secrets Found
            </span>
          </div>
          <div className="text-3xl font-bold text-white/95">
            {security.gitguardian.total_secrets}
          </div>
        </div>
      </motion.div>

      {/* Quality Ratings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="border border-white/10 rounded-xl bg-white/[0.02] p-6"
      >
        <h3 className="text-lg font-semibold text-white/95 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          SonarQube Quality Ratings
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-gray-400/70 mb-2 uppercase tracking-wider">
              Security
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${getRatingColor(security.sonarqube.security_rating)}`}
              >
                {security.sonarqube.security_rating}
              </span>
              <span className="text-sm text-gray-400/80">
                {getRatingLabel(security.sonarqube.security_rating)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400/70 mb-2 uppercase tracking-wider">
              Reliability
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${getRatingColor(security.sonarqube.reliability_rating)}`}
              >
                {security.sonarqube.reliability_rating}
              </span>
              <span className="text-sm text-gray-400/80">
                {getRatingLabel(security.sonarqube.reliability_rating)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400/70 mb-2 uppercase tracking-wider">
              Maintainability
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${getRatingColor(security.sonarqube.maintainability_rating)}`}
              >
                {security.sonarqube.maintainability_rating}
              </span>
              <span className="text-sm text-gray-400/80">
                {getRatingLabel(security.sonarqube.maintainability_rating)}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/10">
          <div>
            <p className="text-xs text-gray-400/70 mb-2 uppercase tracking-wider">
              Code Coverage
            </p>
            <div className="text-xl font-bold text-white/95">
              {security.sonarqube.coverage}%
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400/70 mb-2 uppercase tracking-wider">
              Duplications
            </p>
            <div className="text-xl font-bold text-white/95">
              {security.sonarqube.duplications}%
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400/70 mb-2 uppercase tracking-wider">
              Lines of Code
            </p>
            <div className="text-xl font-bold text-white/95">
              {security.sonarqube.lines_of_code.toLocaleString()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bandit Issues */}
      {security.bandit.total_issues > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="border border-white/10 rounded-xl bg-white/[0.02] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white/95 flex items-center gap-2">
              <Bug className="w-5 h-5 text-orange-400" />
              Bandit Security Issues ({security.bandit.total_issues})
            </h3>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-400">
                {security.bandit.total_lines_scanned.toLocaleString()} lines
                scanned
              </span>
            </div>
          </div>

          {/* Severity Distribution */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 border border-white/10 rounded-lg">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {security.bandit.severity_counts.high}
              </div>
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                High
              </p>
            </div>
            <div className="text-center p-3 border border-white/10 rounded-lg">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {security.bandit.severity_counts.medium}
              </div>
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                Medium
              </p>
            </div>
            <div className="text-center p-3 border border-white/10 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {security.bandit.severity_counts.low}
              </div>
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                Low
              </p>
            </div>
          </div>

          {/* Issue List */}
          <div className="space-y-3">
            {security.bandit.issues.slice(0, 5).map((issue, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-gray-300/90 font-medium flex-1">
                    {issue.title}
                  </p>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${getSeverityColor(issue.severity)}`}
                  >
                    {issue.severity.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    📄 ...{issue.file.split("/").slice(-2).join("/")}
                  </span>
                  <span>Line {issue.line_number}</span>
                  <code className="px-2 py-0.5 bg-white/5 rounded text-gray-400">
                    {issue.test_id}
                  </code>
                  <span className="text-gray-500">CWE-{issue.cwe}</span>
                </div>
              </div>
            ))}
            {security.bandit.issues.length > 5 && (
              <p className="text-center text-sm text-gray-400 pt-2">
                +{security.bandit.issues.length - 5} more issues
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Scanner Errors */}
      {(security.gitguardian.error || security.bandit.error) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="border border-yellow-500/30 rounded-xl bg-yellow-500/5 p-6"
        >
          <h3 className="text-lg font-semibold text-white/95 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Scanner Warnings
          </h3>
          <div className="space-y-2 text-sm text-gray-300/90">
            {security.gitguardian.error && (
              <p>
                <span className="font-semibold">GitGuardian:</span>{" "}
                {security.gitguardian.error}
              </p>
            )}
            {security.bandit.error && (
              <p>
                <span className="font-semibold">Bandit:</span>{" "}
                {security.bandit.error}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
