export interface ServerResponse {
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
  tools: {
    count: number;
    names: string[];
  };
  pricing?: {
    currency: string;
    amount: number;
  };
  security_report: {
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
  meta: {
    created_at: string;
    updated_at: string;
  };
  homepage?: string;
}

export type ServerListItem = Pick<
  ServerResponse,
  "name" | "description" | "lang" | "author" | "license" | "pricing" | "tools"
>;
