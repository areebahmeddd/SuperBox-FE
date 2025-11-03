"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo - Minimalist */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center"
        >
          <a
            href="/"
            className="text-2xl font-semibold tracking-tight text-white/95 hover:text-white transition-colors duration-200"
          >
            MCP Box
          </a>
        </motion.div>

        {/* Navigation - Cleaner spacing and styling */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-6"
        >
          <a
            href="/playground"
            className="text-sm font-medium text-gray-300/90 hover:text-white transition-colors duration-200"
          >
            Playground
          </a>

          <a href="/my-servers">
            <button className="px-5 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 text-white/90 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200">
              My Servers
            </button>
          </a>
        </motion.nav>
      </div>
    </header>
  );
}
