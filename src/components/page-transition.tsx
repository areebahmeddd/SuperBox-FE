"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  return (
    <MotionConfig transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -8,
          }}
          style={{
            willChange: "transform, opacity",
          }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
