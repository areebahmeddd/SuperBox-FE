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
      <div className="bg-background text-foreground flex min-h-screen items-center justify-center px-4 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl space-y-4 text-center"
        >
          <h1 className="text-foreground text-4xl font-bold">
            Redirecting to Documentation...
          </h1>
          <p className="text-muted-foreground text-lg">
            If you are not redirected automatically,{" "}
            <a
              href="https://acm-aa28ebf6.mintlify.app"
              className="text-primary transition-colors hover:underline"
            >
              click here
            </a>
          </p>
        </motion.div>
      </div>
    </>
  );
}
