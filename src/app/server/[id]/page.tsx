"use client";

import Header from "@/components/header";
import ServerDetail from "@/components/server-detail";
import { Button } from "@/components/ui/button";
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
        const API_URL = process.env.NEXT_PUBLIC_API_URL!;
        const res = await fetch(
          `${API_URL}/servers/${encodeURIComponent(serverName)}`,
        );
        if (!res.ok) throw new Error("Failed to fetch server");
        const json = await res.json();
        // console.log('Backend API Response:', json);
        setServer(json?.server || null);
      } catch (error) {
        console.error("Backend API Error:", error);
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
        className="bg-background flex min-h-screen items-center justify-center"
      >
        <div className="text-center">
          <div className="border-border border-t-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2" />
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
          className="bg-background min-h-screen"
        >
          <Header />
          <main className="flex min-h-[calc(100vh-6rem)] items-center justify-center pt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto max-w-md px-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="bg-muted border-border mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border"
              >
                <Box className="text-muted-foreground h-10 w-10" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-foreground mb-3 text-2xl font-bold"
              >
                Server not found
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-muted-foreground mb-8 text-sm"
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
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-background min-h-screen overflow-x-hidden"
    >
      <Header />
      <main className="pt-24">
        <div className="mx-auto max-w-6xl">
          <ServerDetail server={transformedServer} />
        </div>
      </main>
    </motion.div>
  );
}
