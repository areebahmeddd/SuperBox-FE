const API_URL = process.env.NEXT_PUBLIC_API_URL!;

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
  tools?: {
    count: number;
    names: string[];
  };
  pricing: {
    currency: string;
    amount: number;
  };
  security_report?: {
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

export async function fetchServers(): Promise<ServerResponse[]> {
  const response = await fetch(`${API_URL}/servers`);
  if (!response.ok) {
    throw new Error("Failed to fetch servers");
  }
  const data = await response.json();
  // API returns {total: number, servers: [...]}
  return data.servers || [];
}

export async function fetchServerByName(
  name: string,
): Promise<ServerResponse | null> {
  const servers = await fetchServers();
  return servers.find((s) => s.name === name) || null;
}

export interface CreateServerRequest {
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
  pricing: {
    currency: string;
    amount: number;
  };
  metadata?: {
    tags?: string[];
    homepage?: string;
  };
}

export async function createServer(
  data: CreateServerRequest,
): Promise<{ success: boolean; message: string; server?: ServerResponse }> {
  const response = await fetch(`${API_URL}/servers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Failed to create server");
  }

  return result;
}
