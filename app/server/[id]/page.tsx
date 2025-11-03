"use client";

import Header from "@/components/header";
import ServerDetail from "@/components/server-detail";
import { fetchServerByName, type ServerResponse } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ServerPage() {
  const params = useParams();
  const router = useRouter();
  const serverName = decodeURIComponent(params.id as string);
  const [server, setServer] = useState<ServerResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServer = async () => {
      try {
        const data = await fetchServerByName(serverName);
        if (!data) {
          router.push("/explore");
          return;
        }
        setServer(data);
      } catch (error) {
        console.error("Failed to fetch server:", error);
        router.push("/explore");
      } finally {
        setLoading(false);
      }
    };

    loadServer();
  }, [serverName, router]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-black flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(135deg, #000000 0%, #0a1e35 100%)",
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
      </div>
    );
  }

  if (!server) {
    return (
      <div
        className="min-h-screen bg-black flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(135deg, #000000 0%, #0a1e35 100%)",
        }}
      >
        <div className="text-white text-2xl">Server not found</div>
      </div>
    );
  }

  // Transform API data to match component interface
  const transformedServer = {
    id: server.name,
    name: server.name,
    handle: server.author,
    lastDeployed: "Recently",
    icon: "📦",
    about: server.description,
    downloads: 1250,
    rating: 4.7,
    reviewCount: 35,
    tools: server.tools?.names
      ? server.tools.names.map((toolName) => ({
          name: toolName,
          description: `Tool provided by ${server.name}`,
        }))
      : [
          {
            name: server.entrypoint,
            description: `Entry point: ${server.entrypoint}`,
          },
        ],
    connectionUrl: server.repository.url,
    tags: [
      server.lang,
      server.license,
      `v${server.version}`,
      ...(server.tools?.count ? [`${server.tools.count} tools`] : []),
    ],
    clients: {
      auto: [],
      json: [],
      typescript: [],
      python: [],
    },
    qualityScore: server.security_report
      ? Math.max(
          0,
          100 -
            server.security_report.summary.total_issues_all_scanners * 3 -
            server.security_report.summary.critical_issues * 10,
        )
      : undefined,
    monthlyToolCalls: undefined,
    deployedFrom: server.repository
      ? {
          branch: "main",
          commit: server.repository.url.split("/").pop()?.slice(0, 7) || "N/A",
        }
      : undefined,
    uptime: server.security_report
      ? server.security_report.summary.scan_passed
        ? 99.9
        : server.security_report.summary.critical_issues === 0
          ? 99.5
          : 95.0
      : undefined,
    latency: server.security_report
      ? {
          p95:
            server.security_report.sonarqube.lines_of_code > 1000 ? 250 : 150,
        }
      : undefined,
    license: server.license,
    isLocal: false,
    publishedDate: server.security_report
      ? new Date(server.security_report.metadata.scan_date).toLocaleDateString()
      : undefined,
    pricing: server.pricing,
    sourceCode: {
      platform: server.repository.type,
      url: server.repository.url,
      repo: server.repository.url.replace("https://github.com/", ""),
    },
    homepage: {
      url: server.repository.url,
      domain: server.repository.url
        .replace("https://", "")
        .replace("http://", "")
        .split("/")[0],
    },
    security: server.security_report || undefined,
  };

  return (
    <div
      className="min-h-screen bg-black overflow-x-hidden"
      style={{
        backgroundImage: "linear-gradient(135deg, #000000 0%, #0a1e35 100%)",
      }}
    >
      <Header />
      <main className="pt-20">
        <ServerDetail server={transformedServer} />
      </main>
    </div>
  );
}
