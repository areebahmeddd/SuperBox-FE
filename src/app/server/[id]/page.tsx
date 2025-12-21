"use client";

import Header from "@/components/header";
import ServerDetail from "@/components/server-detail";
import { Button } from "@/components/ui/button";
import { getUserServers } from "@/lib/local-storage";
import { getMockServerByName, getReviewsForServer } from "@/lib/mock-data";
import type { ServerResponse } from "@/lib/types";
import { motion } from "framer-motion";
import { Box } from "lucide-react";
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
        const API_URL = process.env.NEXT_PUBLIC_API_URL!;
        const res = await fetch(`${API_URL}/servers`);
        if (!res.ok) throw new Error("Failed to fetch server");
        const json = await res.json();
        const servers: ServerResponse[] = json?.servers || [];
        const found = servers.find((s) => s.name === serverName) || null;
        setServer(found);
      } catch {
        console.log("API unavailable, using mock data");
        const mockServer = getMockServerByName(serverName);

        if (!mockServer) {
          const userServers = getUserServers();
          const userServer = userServers.find((s) => s.name === serverName);
          if (userServer) {
            setServer(userServer);
          } else {
            setServer(null);
          }
        } else {
          setServer(mockServer);
        }
      } finally {
        setLoading(false);
      }
    };

    loadServer();
  }, [serverName]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-border border-t-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">
            Loading server details...
          </p>
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
          className="min-h-screen bg-background"
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
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted border border-border flex items-center justify-center"
              >
                <Box className="w-10 h-10 text-muted-foreground" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-foreground mb-3"
              >
                Server not found
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-muted-foreground text-sm mb-8"
              >
                The server you're looking for doesn't exist or has been removed.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button onClick={() => router.push("/explore")} size="lg">
                  Browse Servers
                </Button>
              </motion.div>
            </motion.div>
          </main>
        </motion.div>
      </>
    );
  }

  const reviews = getReviewsForServer(server.name);
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : undefined;

  const transformedServer = {
    id: Math.abs(
      server.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0),
    ),
    name: server.name,
    handle: server.author,
    lastDeployed: "Recently",
    icon: "",
    about: server.description,
    downloads: undefined,
    rating: averageRating,
    reviewCount: reviews.length,
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
      className="min-h-screen bg-background overflow-x-hidden"
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
