"use client";

import Header from "@/components/header";
import ServerDetail from "@/components/server-detail";
import { Button } from "@/components/ui/button";
import { getUserServers } from "@/lib/local-storage";
import { getMockServerByName } from "@/lib/mock-data";
import { showToast } from "@/lib/toast-utils";
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
        await new Promise((resolve) => setTimeout(resolve, 500));

        let foundServer = getMockServerByName(serverName);

        if (!foundServer) {
          const userServers = getUserServers();
          foundServer = userServers.find((s) => s.name === serverName);
        }

        setServer(foundServer || null);
      } catch (error) {
        console.error("Error loading server:", error);
        showToast.error("Failed to load server. Please try again.");
        setServer(null);
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

  const transformedServer = {
    name: server.name,
    author: server.author,
    description: server.description,
    version: server.version,
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
    repository: server.repository,
    license: server.license,
    meta: server.meta,
    pricing: server.pricing || { currency: "", amount: 0 },
    homepage: server.homepage,
    security_report: server.security_report,
    ...((server as any).monthlyToolCalls && {
      monthlyToolCalls: (server as any).monthlyToolCalls,
    }),
    ...((server as any).totalPulls && {
      totalPulls: (server as any).totalPulls,
    }),
    ...((server as any).uptime && { uptime: (server as any).uptime }),
    ...((server as any).latency && { latency: (server as any).latency }),
    ...((server as any).qualityScore && {
      qualityScore: (server as any).qualityScore,
    }),
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
