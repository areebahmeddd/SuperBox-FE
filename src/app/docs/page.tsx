"use client";

import Header from "@/components/header";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function DocsPage() {
  useEffect(() => {
    const docsUrl =
      process.env.NODE_ENV === "production"
        ? "https://docs.superbox-fe.vercel.app"
        : "http://localhost:3001";

    window.location.href = docsUrl;
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white pt-28 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 max-w-2xl"
        >
          <h1 className="text-4xl font-bold text-white">
            Redirecting to Documentation...
          </h1>
          <p className="text-lg text-gray-400">
            If you are not redirected automatically,{" "}
            <a
              href="http://localhost:3001"
              className="text-[var(--brand-red)] hover:underline transition-colors"
            >
              click here
            </a>
          </p>
        </motion.div>
      </div>
    </>
  );
}
