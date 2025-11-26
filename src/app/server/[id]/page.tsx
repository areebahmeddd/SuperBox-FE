"use client";

import Header from "@/components/header";
import ServerDetail from "@/components/server-detail";
import { useToast } from "@/components/toast-provider";
import type { ServerResponse } from "@/lib/types";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ServerPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const serverName = decodeURIComponent(params.id as string);
  const [server, setServer] = useState<ServerResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServer = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL!;
        const res = await fetch(`${API_URL}/servers`);
        if (!res.ok) throw new Error("Failed to fetch server");
        const json = await res.json();
        const servers: ServerResponse[] = json?.servers || [];
        const found = servers.find((s) => s.name === serverName) || null;
        setServer(found);
      } catch {
        addToast({
          title: "Failed to load server",
          description: "Please try again.",
          variant: "error",
        });
        setServer(null);
      } finally {
        setLoading(false);
      }
    };

    loadServer();
  }, [serverName, addToast]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/10 border-t-[var(--brand-red)] mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading server details...</p>
        </div>
      </motion.div>
    );
  }

  if (!server) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-black"
        >
          <Header />
          <main className="pt-24 flex items-center justify-center min-h-[calc(100vh-6rem)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center max-w-md mx-auto px-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
              >
                <span className="text-4xl">📦</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-3"
              >
                Server not found
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-white/60 text-sm mb-8"
              >
                The server you're looking for doesn't exist or has been removed.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/explore")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--brand-red)] to-[var(--brand-red-light)] text-white font-semibold text-sm hover:shadow-lg hover:shadow-[var(--brand-red)]/25 transition-shadow"
              >
                Browse Servers
              </motion.button>
            </motion.div>
          </main>
        </motion.div>
      </>
    );
  }

  const transformedServer = {
    id: Math.abs(
      server.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0),
    ),
    name: server.name,
    handle: server.author,
    lastDeployed: "Recently",
    icon: "📦",
    about: server.description,
    downloads: undefined,
    rating: undefined,
    reviewCount: undefined,
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
    monthlyToolCalls: server.tools?.count
      ? server.tools.count * 125000
      : undefined,
    totalPulls: server.security_report
      ? Math.floor(Math.random() * 50000) + 10000
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black overflow-x-hidden"
    >
      <Header />
      <main className="pt-24">
        <div className="max-w-6xl mx-auto">
          <ServerDetail server={transformedServer} />
        </div>
      </main>
    </motion.div>
  );
}
