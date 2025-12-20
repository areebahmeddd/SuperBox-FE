"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { showToast } from "@/lib/toast-utils";
import { onAuthStateChanged, type User } from "firebase/auth";
import { motion } from "framer-motion";
import { Compass, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AuthModal from "./auth-modal";
import PublishServerModal, { ServerFormData } from "./publish-modal";

export default function LandingSections() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handlePublishClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsPublishModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsPublishModalOpen(true);
  };

  const handlePublishServer = async (data: ServerFormData) => {
    if (!user) {
      showToast.error("Please sign in to publish servers");
      return;
    }

    try {
      const token = await user.getIdToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL!;

      const response = await fetch(`${API_URL}/servers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.detail || result?.message || "Failed to publish server",
        );
      }

      showToast.success(`"${data.name}" has been published successfully`);
      setIsPublishModalOpen(false);

      window.location.href = "/my-servers";
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to publish server";
      showToast.error(errorMessage);
    }
  };

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center text-center px-6">
      <div className="max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs tracking-widest text-[var(--brand-red-light)] mb-3"
        >
          DISCOVER • CONNECT • BUILD
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.3,
            type: "spring",
            stiffness: 100,
          }}
          className="text-6xl md:text-7xl font-bold text-white mb-4 leading-tight"
        >
          SUPER [<span className="text-[var(--brand-red)]">BOX</span>]
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-2xl md:text-3xl text-white/90 font-semibold mb-4"
        >
          An{" "}
          <span className="relative inline-block">
            open marketplace
            <motion.span
              className="absolute left-0 bottom-[-2px] w-full h-[2.5px] bg-[var(--brand-red)] rounded-full"
              style={{ transformOrigin: "left" }}
              initial={{ scaleX: 0, opacity: 0.4 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                scaleX: {
                  duration: 1.5,
                  delay: 0.8,
                  ease: [0.16, 0.7, 0.3, 0.95],
                },
                opacity: {
                  duration: 0.8,
                  delay: 0.8,
                  ease: "easeOut",
                },
              }}
            />
          </span>{" "}
          for MCP servers
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-lg md:text-xl text-white/80 mb-8"
        >
          <span className="relative inline-block">
            Deploy MCP
            <motion.span
              className="absolute left-0 bottom-[-2px] w-full h-[2.5px] bg-[var(--brand-red)] rounded-full"
              style={{ transformOrigin: "left" }}
              initial={{ scaleX: 0, opacity: 0.4 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                scaleX: {
                  duration: 1.5,
                  delay: 1.0,
                  ease: [0.16, 0.7, 0.3, 0.95],
                },
                opacity: {
                  duration: 0.8,
                  delay: 1.0,
                  ease: "easeOut",
                },
              }}
            />
          </span>{" "}
          for your LLMs and agents securely{" "}
          <span className="relative inline-block">
            on cloud
            <motion.span
              className="absolute left-0 bottom-[-2px] w-full h-[2.5px] bg-[var(--brand-red)] rounded-full"
              style={{ transformOrigin: "left" }}
              initial={{ scaleX: 0, opacity: 0.4 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                scaleX: {
                  duration: 1.5,
                  delay: 1.2,
                  ease: [0.16, 0.7, 0.3, 0.95],
                },
                opacity: {
                  duration: 0.8,
                  delay: 1.2,
                  ease: "easeOut",
                },
              }}
            />
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex items-center justify-center gap-3"
        >
          <Link href="/explore">
            <Button>
              <Compass className="w-4 h-4" /> Start exploring
            </Button>
          </Link>
          <Button variant="outline" onClick={handlePublishClick}>
            <Upload className="w-4 h-4" /> Publish a server
          </Button>
        </motion.div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
      <PublishServerModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onSubmit={handlePublishServer}
        editingServer={null}
      />
    </section>
  );
}
