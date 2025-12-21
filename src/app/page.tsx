"use client";
import Header from "@/components/header";
import LandingSections from "@/components/landing-sections";
import WaveBackground from "@/components/wave-background";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background overflow-x-hidden relative"
    >
      <WaveBackground />
      <div className="fixed inset-0 z-[10] backdrop-blur-[16px] pointer-events-none" />
      <Header />
      <main className="relative z-10">
        <LandingSections />
      </main>
    </motion.div>
  );
}
