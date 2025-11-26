"use client";

import { motion } from "framer-motion";
import { Compass, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AuthModal from "./auth-modal";

export default function LandingSections() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  const handlePublishClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      window.location.href = "/my-servers";
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthModalOpen(false);
    window.location.href = "/my-servers";
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
          Super [<span className="text-[var(--brand-red)]">Box</span>]
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
          <Link href="/explore" className="btn btn-primary">
            <Compass className="w-4 h-4" /> Start exploring
          </Link>
          <button onClick={handlePublishClick} className="btn btn-ghost">
            <Upload className="w-4 h-4" /> Publish a server
          </button>
        </motion.div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </section>
  );
}
