import type { ServerResponse } from "./types";

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
};

function generateMockMetrics(serverName: string) {
  const seed = serverName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  const daysAgo = random(30, 365);
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - daysAgo);

  const updatedDaysAgo = random(1, 30);
  const updatedDate = new Date();
  updatedDate.setDate(updatedDate.getDate() - updatedDaysAgo);

  return {
    monthlyToolCalls: random(50000, 500000),
    totalPulls: random(10000, 200000),
    uptime: random(95, 100) + Math.random().toFixed(1),
    latency: {
      p50: random(50, 150),
      p95: random(150, 300),
      p99: random(300, 500),
    },
    qualityScore: random(75, 98),
    meta: {
      created_at: createdDate.toISOString(),
      updated_at: updatedDate.toISOString(),
    },
  };
}

const INDIAN_NAMES = [
  "Rajesh Kumar",
  "Priya Sharma",
  "Amit Patel",
  "Sneha Reddy",
  "Vikram Singh",
  "Ananya Desai",
  "Rohan Mehta",
  "Kavya Nair",
  "Arjun Joshi",
  "Divya Iyer",
  "Siddharth Rao",
  "Meera Krishnan",
  "Karan Malhotra",
  "Aditi Gupta",
  "Rahul Verma",
];
export function generateReviews(
  serverName: string,
  count: number = 8,
): Review[] {
  const comments = [
    "Excellent MCP server! Works flawlessly with my setup. Highly recommended for production use.",
    "Great tool, easy to integrate. The documentation could be better though.",
    "Very reliable and fast. Saved me a lot of time in my project.",
    "Good server but had some issues with authentication initially. Support helped resolve it quickly.",
    "Perfect for what I needed. The security scan results are impressive.",
    "Solid implementation. Would love to see more features in future updates.",
    "Works well but the pricing is a bit high for small projects.",
    "Amazing performance! The tools provided are exactly what I was looking for.",
    "Good server overall, but encountered a few bugs. The maintainer is responsive.",
    "Best MCP server I've used so far. The code quality is top-notch.",
    "Easy to set up and use. Documentation is clear and helpful.",
    "Great value for money. The security features are excellent.",
    "Had some compatibility issues but they were resolved quickly.",
    "Outstanding server! The tools are well-designed and efficient.",
    "Good but needs more examples in the documentation.",
  ];
  const reviews: Review[] = [];
  const usedNames = new Set<string>();
  for (let i = 0; i < count; i++) {
    let name = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
    while (usedNames.has(name) && usedNames.size < INDIAN_NAMES.length) {
      name = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
    }
    usedNames.add(name);
    const rating = Math.floor(Math.random() * 2) + 4;
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    reviews.push({
      id: `review-${serverName}-${i}`,
      author: name,
      rating,
      date: date.toISOString(),
      comment: comments[Math.floor(Math.random() * comments.length)],
      helpful: Math.floor(Math.random() * 50) + 5,
    });
  }
  return reviews.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
export const MOCK_SERVERS: ServerResponse[] = [
  {
    name: "github-mcp",
    version: "2.1.0",
    description:
      "Official GitHub MCP server for interacting with GitHub repositories, issues, pull requests, and more. Perfect for automating GitHub workflows and managing code repositories.",
    author: "Anthropic",
    lang: "TypeScript",
    license: "MIT",
    entrypoint: "dist/index.js",
    repository: {
      type: "git",
      url: "https://github.com/modelcontextprotocol/servers",
    },
    tools: {
      count: 12,
      names: [
        "search_repositories",
        "get_repository",
        "create_issue",
        "list_issues",
        "get_issue",
        "create_pull_request",
        "list_pull_requests",
        "get_pull_request",
        "list_commits",
        "get_file_contents",
        "search_code",
        "get_user_info",
      ],
    },
    pricing: { currency: "USD", amount: 0 },
    ...generateMockMetrics("github-mcp"),
    security_report: {
      metadata: {
        repository: "modelcontextprotocol/servers",
        repo_url: "https://github.com/modelcontextprotocol/servers",
        scan_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        scanners_used: ["sonarqube", "gitguardian", "bandit"],
      },
      summary: {
        total_issues_all_scanners: 3,
        critical_issues: 0,
        sonarcloud_url: "https://sonarcloud.io/project/overview?id=github-mcp",
        scan_passed: true,
      },
      sonarqube: {
        total_issues: 2,
        bugs: 0,
        vulnerabilities: 0,
        code_smells: 2,
        security_hotspots: 0,
        quality_gate: "PASSED",
        reliability_rating: "A",
        security_rating: "A",
        maintainability_rating: "A",
        coverage: 87,
        duplications: 3.2,
        lines_of_code: 2847,
      },
      gitguardian: {
        scan_passed: true,
        total_secrets: 0,
        secrets: [],
        error: null,
      },
      bandit: {
        scan_passed: true,
        total_issues: 1,
        severity_counts: { high: 0, medium: 0, low: 1 },
        total_lines_scanned: 2847,
        issues: [
          {
            title: "Use of assert detected",
            severity: "low",
            confidence: "medium",
            file: "src/utils/validation.ts",
            line_number: 45,
            test_id: "B101",
            test_name: "assert_used",
            cwe: 703,
          },
        ],
        error: null,
      },
      recommendations: [
        "Consider adding rate limiting for API calls",
        "Add input validation for user-provided repository names",
      ],
    },
  },
  {
    name: "supabase-mcp",
    version: "1.8.3",
    description:
      "Supabase MCP server for database operations, authentication, storage, and real-time subscriptions. Seamlessly integrate Supabase into your MCP workflows.",
    author: "Supabase",
    lang: "TypeScript",
    license: "Apache-2.0",
    entrypoint: "dist/index.js",
    repository: {
      type: "git",
      url: "https://github.com/supabase/mcp-server-supabase",
    },
    tools: {
      count: 15,
      names: [
        "query_database",
        "insert_row",
        "update_row",
        "delete_row",
        "create_table",
        "list_tables",
        "get_table_schema",
        "upload_file",
        "download_file",
        "list_files",
        "create_user",
        "list_users",
        "subscribe_realtime",
        "execute_function",
        "get_analytics",
      ],
    },
    pricing: { currency: "USD", amount: 0 },
    ...generateMockMetrics("supabase-mcp"),
    security_report: {
      metadata: {
        repository: "supabase/mcp-server-supabase",
        repo_url: "https://github.com/supabase/mcp-server-supabase",
        scan_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        scanners_used: ["sonarqube", "gitguardian", "bandit"],
      },
      summary: {
        total_issues_all_scanners: 1,
        critical_issues: 0,
        sonarcloud_url:
          "https://sonarcloud.io/project/overview?id=supabase-mcp",
        scan_passed: true,
      },
      sonarqube: {
        total_issues: 1,
        bugs: 0,
        vulnerabilities: 0,
        code_smells: 1,
        security_hotspots: 0,
        quality_gate: "PASSED",
        reliability_rating: "A",
        security_rating: "A",
        maintainability_rating: "A",
        coverage: 92,
        duplications: 2.1,
        lines_of_code: 3421,
      },
      gitguardian: {
        scan_passed: true,
        total_secrets: 0,
        secrets: [],
        error: null,
      },
      bandit: {
        scan_passed: true,
        total_issues: 0,
        severity_counts: { high: 0, medium: 0, low: 0 },
        total_lines_scanned: 3421,
        issues: [],
        error: null,
      },
      recommendations: [
        "Consider implementing connection pooling for better performance",
      ],
    },
  },
  {
    name: "google-search-mcp",
    version: "1.5.2",
    description:
      "Google Search MCP server for performing web searches, getting search results, and accessing Google Search API. Perfect for research and information gathering tasks.",
    author: "Google",
    lang: "Python",
    license: "Apache-2.0",
    entrypoint: "src/main.py",
    repository: {
      type: "git",
      url: "https://github.com/google/mcp-google-search",
    },
    tools: {
      count: 8,
      names: [
        "search",
        "search_images",
        "search_videos",
        "search_news",
        "get_trending_searches",
        "autocomplete",
        "related_searches",
        "search_advanced",
      ],
    },
    pricing: { currency: "USD", amount: 9.99 },
    ...generateMockMetrics("google-search-mcp"),
    security_report: {
      metadata: {
        repository: "google/mcp-google-search",
        repo_url: "https://github.com/google/mcp-google-search",
        scan_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        scanners_used: ["sonarqube", "gitguardian", "bandit"],
      },
      summary: {
        total_issues_all_scanners: 18,
        critical_issues: 2,
        sonarcloud_url:
          "https://sonarcloud.io/project/overview?id=google-search-mcp",
        scan_passed: false,
      },
      sonarqube: {
        total_issues: 12,
        bugs: 1,
        vulnerabilities: 2,
        code_smells: 9,
        security_hotspots: 3,
        quality_gate: "FAILED",
        reliability_rating: "B",
        security_rating: "C",
        maintainability_rating: "B",
        coverage: 68,
        duplications: 8.5,
        lines_of_code: 1923,
      },
      gitguardian: {
        scan_passed: false,
        total_secrets: 1,
        secrets: [
          { type: "Google API Key", file: "config/secrets.py", line: 12 },
        ],
        error: null,
      },
      bandit: {
        scan_passed: false,
        total_issues: 5,
        severity_counts: { high: 2, medium: 2, low: 1 },
        total_lines_scanned: 1923,
        issues: [
          {
            title: "Use of insecure hash function",
            severity: "high",
            confidence: "high",
            file: "src/auth.py",
            line_number: 34,
            test_id: "B303",
            test_name: "blacklist_calls",
            cwe: 327,
          },
          {
            title: "SQL injection possible",
            severity: "high",
            confidence: "medium",
            file: "src/database.py",
            line_number: 67,
            test_id: "B608",
            test_name: "hardcoded_sql_expressions",
            cwe: 89,
          },
          {
            title: "Use of eval() detected",
            severity: "medium",
            confidence: "high",
            file: "src/utils.py",
            line_number: 89,
            test_id: "B307",
            test_name: "eval",
            cwe: 95,
          },
          {
            title: "Hardcoded password string",
            severity: "medium",
            confidence: "medium",
            file: "src/config.py",
            line_number: 23,
            test_id: "B105",
            test_name: "hardcoded_password_string",
            cwe: 798,
          },
        ],
        error: null,
      },
      recommendations: [
        "Remove hardcoded API keys and use environment variables",
        "Fix SQL injection vulnerabilities by using parameterized queries",
        "Replace insecure hash functions with secure alternatives",
        "Remove eval() usage and use safer alternatives",
        "Increase test coverage to at least 80%",
      ],
    },
  },
  {
    name: "slack-mcp",
    version: "3.2.1",
    description:
      "Slack MCP server for sending messages, managing channels, users, and files. Integrate Slack notifications and workflows into your MCP applications.",
    author: "Slack Technologies",
    lang: "TypeScript",
    license: "MIT",
    entrypoint: "dist/index.js",
    repository: {
      type: "git",
      url: "https://github.com/slackapi/mcp-server-slack",
    },
    tools: {
      count: 14,
      names: [
        "send_message",
        "send_dm",
        "list_channels",
        "create_channel",
        "archive_channel",
        "list_users",
        "get_user_info",
        "upload_file",
        "list_files",
        "search_messages",
        "add_reaction",
        "create_thread",
        "get_channel_history",
        "set_status",
      ],
    },
    pricing: { currency: "USD", amount: 0 },
    ...generateMockMetrics("slack-mcp"),
    security_report: {
      metadata: {
        repository: "slackapi/mcp-server-slack",
        repo_url: "https://github.com/slackapi/mcp-server-slack",
        scan_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        scanners_used: ["sonarqube", "gitguardian", "bandit"],
      },
      summary: {
        total_issues_all_scanners: 5,
        critical_issues: 0,
        sonarcloud_url: "https://sonarcloud.io/project/overview?id=slack-mcp",
        scan_passed: true,
      },
      sonarqube: {
        total_issues: 4,
        bugs: 0,
        vulnerabilities: 0,
        code_smells: 4,
        security_hotspots: 0,
        quality_gate: "PASSED",
        reliability_rating: "A",
        security_rating: "A",
        maintainability_rating: "A",
        coverage: 85,
        duplications: 4.2,
        lines_of_code: 4123,
      },
      gitguardian: {
        scan_passed: true,
        total_secrets: 0,
        secrets: [],
        error: null,
      },
      bandit: {
        scan_passed: true,
        total_issues: 1,
        severity_counts: { high: 0, medium: 0, low: 1 },
        total_lines_scanned: 4123,
        issues: [
          {
            title: "Use of insecure random number generator",
            severity: "low",
            confidence: "low",
            file: "src/utils/random.ts",
            line_number: 12,
            test_id: "B311",
            test_name: "blacklist_calls",
            cwe: 330,
          },
        ],
        error: null,
      },
      recommendations: [
        "Consider adding retry logic for API rate limits",
        "Add comprehensive error handling for network failures",
      ],
    },
  },
  {
    name: "notion-mcp",
    version: "2.0.5",
    description:
      "Notion MCP server for creating pages, databases, blocks, and managing Notion workspaces. Perfect for automating documentation and knowledge management.",
    author: "Notion",
    lang: "TypeScript",
    license: "MIT",
    entrypoint: "dist/index.js",
    repository: {
      type: "git",
      url: "https://github.com/notionhq/mcp-server-notion",
    },
    tools: {
      count: 16,
      names: [
        "create_page",
        "update_page",
        "get_page",
        "list_pages",
        "create_database",
        "query_database",
        "append_block",
        "update_block",
        "delete_block",
        "search",
        "get_user",
        "list_users",
        "create_comment",
        "list_comments",
        "get_page_content",
        "export_page",
      ],
    },
    pricing: { currency: "USD", amount: 0 },
    ...generateMockMetrics("notion-mcp"),
    security_report: {
      metadata: {
        repository: "notionhq/mcp-server-notion",
        repo_url: "https://github.com/notionhq/mcp-server-notion",
        scan_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        scanners_used: ["sonarqube", "gitguardian", "bandit"],
      },
      summary: {
        total_issues_all_scanners: 2,
        critical_issues: 0,
        sonarcloud_url: "https://sonarcloud.io/project/overview?id=notion-mcp",
        scan_passed: true,
      },
      sonarqube: {
        total_issues: 2,
        bugs: 0,
        vulnerabilities: 0,
        code_smells: 2,
        security_hotspots: 0,
        quality_gate: "PASSED",
        reliability_rating: "A",
        security_rating: "A",
        maintainability_rating: "A",
        coverage: 90,
        duplications: 2.8,
        lines_of_code: 3892,
      },
      gitguardian: {
        scan_passed: true,
        total_secrets: 0,
        secrets: [],
        error: null,
      },
      bandit: {
        scan_passed: true,
        total_issues: 0,
        severity_counts: { high: 0, medium: 0, low: 0 },
        total_lines_scanned: 3892,
        issues: [],
        error: null,
      },
      recommendations: [],
    },
  },
  {
    name: "postgres-mcp",
    version: "1.3.7",
    description:
      "PostgreSQL MCP server for executing queries, managing schemas, and database operations. Direct database access for your MCP applications.",
    author: "PostgreSQL Community",
    lang: "Python",
    license: "PostgreSQL",
    entrypoint: "src/main.py",
    repository: {
      type: "git",
      url: "https://github.com/postgresql/mcp-server-postgres",
    },
    tools: {
      count: 10,
      names: [
        "execute_query",
        "list_tables",
        "describe_table",
        "create_table",
        "drop_table",
        "list_databases",
        "backup_database",
        "restore_database",
        "get_table_stats",
        "analyze_query",
      ],
    },
    pricing: { currency: "USD", amount: 0 },
    ...generateMockMetrics("postgres-mcp"),
    security_report: {
      metadata: {
        repository: "postgresql/mcp-server-postgres",
        repo_url: "https://github.com/postgresql/mcp-server-postgres",
        scan_date: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        scanners_used: ["sonarqube", "gitguardian", "bandit"],
      },
      summary: {
        total_issues_all_scanners: 25,
        critical_issues: 3,
        sonarcloud_url:
          "https://sonarcloud.io/project/overview?id=postgres-mcp",
        scan_passed: false,
      },
      sonarqube: {
        total_issues: 15,
        bugs: 2,
        vulnerabilities: 3,
        code_smells: 10,
        security_hotspots: 5,
        quality_gate: "FAILED",
        reliability_rating: "C",
        security_rating: "D",
        maintainability_rating: "C",
        coverage: 52,
        duplications: 12.3,
        lines_of_code: 2456,
      },
      gitguardian: {
        scan_passed: false,
        total_secrets: 2,
        secrets: [
          { type: "Database Password", file: "config/db.py", line: 18 },
          { type: "Connection String", file: "src/connection.py", line: 45 },
        ],
        error: null,
      },
      bandit: {
        scan_passed: false,
        total_issues: 8,
        severity_counts: { high: 3, medium: 3, low: 2 },
        total_lines_scanned: 2456,
        issues: [
          {
            title: "SQL injection possible",
            severity: "high",
            confidence: "high",
            file: "src/query_executor.py",
            line_number: 78,
            test_id: "B608",
            test_name: "hardcoded_sql_expressions",
            cwe: 89,
          },
          {
            title: "Use of insecure hash function",
            severity: "high",
            confidence: "high",
            file: "src/auth.py",
            line_number: 56,
            test_id: "B303",
            test_name: "blacklist_calls",
            cwe: 327,
          },
          {
            title: "Hardcoded password string",
            severity: "high",
            confidence: "high",
            file: "config/db.py",
            line_number: 18,
            test_id: "B105",
            test_name: "hardcoded_password_string",
            cwe: 798,
          },
          {
            title: "Use of pickle module",
            severity: "medium",
            confidence: "high",
            file: "src/serialization.py",
            line_number: 34,
            test_id: "B301",
            test_name: "pickle",
            cwe: 502,
          },
        ],
        error: null,
      },
      recommendations: [
        "CRITICAL: Fix SQL injection vulnerabilities immediately",
        "Remove hardcoded database credentials",
        "Use parameterized queries for all database operations",
        "Replace insecure hash functions",
        "Implement proper connection pooling",
        "Add input validation for all user inputs",
        "Increase test coverage significantly",
      ],
    },
  },
  {
    name: "aws-mcp",
    version: "1.9.4",
    description:
      "AWS MCP server for managing EC2, S3, Lambda, and other AWS services. Comprehensive cloud infrastructure management through MCP.",
    author: "Amazon Web Services",
    lang: "Python",
    license: "Apache-2.0",
    entrypoint: "src/main.py",
    repository: { type: "git", url: "https://github.com/aws/mcp-server-aws" },
    tools: {
      count: 22,
      names: [
        "list_ec2_instances",
        "create_ec2_instance",
        "terminate_instance",
        "list_s3_buckets",
        "upload_to_s3",
        "download_from_s3",
        "list_lambda_functions",
        "invoke_lambda",
        "create_lambda",
        "list_dynamodb_tables",
        "query_dynamodb",
        "put_item_dynamodb",
        "list_rds_instances",
        "create_rds_instance",
        "list_iam_users",
        "create_iam_user",
        "attach_policy",
        "get_cloudwatch_metrics",
        "create_sns_topic",
        "publish_to_sns",
        "list_vpcs",
        "create_vpc",
      ],
    },
    pricing: { currency: "USD", amount: 19.99 },
    ...generateMockMetrics("aws-mcp"),
    security_report: {
      metadata: {
        repository: "aws/mcp-server-aws",
        repo_url: "https://github.com/aws/mcp-server-aws",
        scan_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        scanners_used: ["sonarqube", "gitguardian", "bandit"],
      },
      summary: {
        total_issues_all_scanners: 7,
        critical_issues: 0,
        sonarcloud_url: "https://sonarcloud.io/project/overview?id=aws-mcp",
        scan_passed: true,
      },
      sonarqube: {
        total_issues: 6,
        bugs: 0,
        vulnerabilities: 0,
        code_smells: 6,
        security_hotspots: 1,
        quality_gate: "PASSED",
        reliability_rating: "A",
        security_rating: "B",
        maintainability_rating: "A",
        coverage: 78,
        duplications: 5.1,
        lines_of_code: 5678,
      },
      gitguardian: {
        scan_passed: true,
        total_secrets: 0,
        secrets: [],
        error: null,
      },
      bandit: {
        scan_passed: true,
        total_issues: 1,
        severity_counts: { high: 0, medium: 0, low: 1 },
        total_lines_scanned: 5678,
        issues: [
          {
            title: "Use of insecure random number generator",
            severity: "low",
            confidence: "low",
            file: "src/utils/random.py",
            line_number: 23,
            test_id: "B311",
            test_name: "blacklist_calls",
            cwe: 330,
          },
        ],
        error: null,
      },
      recommendations: [
        "Consider implementing AWS IAM role-based authentication",
        "Add rate limiting for API calls",
      ],
    },
  },
  {
    name: "openai-mcp",
    version: "1.2.8",
    description:
      "OpenAI MCP server for GPT models, embeddings, fine-tuning, and moderation. Integrate OpenAI's powerful AI capabilities into your MCP workflows.",
    author: "OpenAI",
    lang: "Python",
    license: "MIT",
    entrypoint: "src/main.py",
    repository: {
      type: "git",
      url: "https://github.com/openai/mcp-server-openai",
    },
    tools: {
      count: 11,
      names: [
        "create_completion",
        "create_chat",
        "create_embedding",
        "create_image",
        "create_edit",
        "create_moderation",
        "list_models",
        "get_model",
        "create_fine_tune",
        "list_fine_tunes",
        "cancel_fine_tune",
      ],
    },
    pricing: { currency: "USD", amount: 0 },
    ...generateMockMetrics("openai-mcp"),
    security_report: {
      metadata: {
        repository: "openai/mcp-server-openai",
        repo_url: "https://github.com/openai/mcp-server-openai",
        scan_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        scanners_used: ["sonarqube", "gitguardian", "bandit"],
      },
      summary: {
        total_issues_all_scanners: 4,
        critical_issues: 0,
        sonarcloud_url: "https://sonarcloud.io/project/overview?id=openai-mcp",
        scan_passed: true,
      },
      sonarqube: {
        total_issues: 3,
        bugs: 0,
        vulnerabilities: 0,
        code_smells: 3,
        security_hotspots: 0,
        quality_gate: "PASSED",
        reliability_rating: "A",
        security_rating: "A",
        maintainability_rating: "A",
        coverage: 88,
        duplications: 3.5,
        lines_of_code: 3124,
      },
      gitguardian: {
        scan_passed: true,
        total_secrets: 0,
        secrets: [],
        error: null,
      },
      bandit: {
        scan_passed: true,
        total_issues: 1,
        severity_counts: { high: 0, medium: 0, low: 1 },
        total_lines_scanned: 3124,
        issues: [
          {
            title: "Use of assert detected",
            severity: "low",
            confidence: "medium",
            file: "src/utils/validation.py",
            line_number: 42,
            test_id: "B101",
            test_name: "assert_used",
            cwe: 703,
          },
        ],
        error: null,
      },
      recommendations: [
        "Consider adding request timeout handling",
        "Implement retry logic for API failures",
      ],
    },
  },
];
export function getReviewsForServer(serverName: string): Review[] {
  return generateReviews(serverName, Math.floor(Math.random() * 3) + 3);
}
export function getAllMockServers(): ServerResponse[] {
  return MOCK_SERVERS;
}
export function getMockServerByName(name: string): ServerResponse | undefined {
  return MOCK_SERVERS.find((server) => server.name === name);
}
