"use client";

import Header from "@/components/header";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function DocsPage() {
  useEffect(() => {
    window.location.href = "https://acm-aa28ebf6.mintlify.app";
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background text-foreground pt-28 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 max-w-2xl"
        >
          <h1 className="text-4xl font-bold text-foreground">
            Redirecting to Documentation...
          </h1>
          <p className="text-lg text-muted-foreground">
            If you are not redirected automatically,{" "}
            <a
              href="https://acm-aa28ebf6.mintlify.app"
              className="text-primary hover:underline transition-colors"
            >
              click here
            </a>
          </p>
        </motion.div>
      </div>
    </>
  );
}
