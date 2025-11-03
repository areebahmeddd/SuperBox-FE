"use client";

import { motion } from "framer-motion";
import { Check, Lock, Sparkles } from "lucide-react";
import { useState } from "react";

interface PremiumPaywallProps {
  server: {
    id: number;
    name: string;
    icon: string;
    price: number;
  };
  onPurchase: () => void;
}

export default function PremiumPaywall({
  server,
  onPurchase,
}: PremiumPaywallProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onPurchase();
  };

  return (
    <div
      className="min-h-screen bg-black overflow-x-hidden flex items-center justify-center px-6"
      style={{
        backgroundImage: "linear-gradient(135deg, #000000 0%, #0a1e35 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-full px-6 py-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-semibold">Premium Server</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-white/10">
            <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center text-5xl mb-4">
              {server.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white/95 mb-2">
                {server.name}
              </h1>
              <div className="flex items-center justify-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="text-gray-400/80 text-sm">
                  Premium Access Required
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-5xl font-bold text-white/95">
                ${server.price}
              </span>
              <span className="text-gray-400/80 text-lg">/ lifetime</span>
            </div>
            <p className="text-gray-500/80 text-sm">
              One-time payment • Unlimited access
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-white/95 font-semibold mb-4">
              What's included:
            </h3>
            {[
              "Full access to all premium tools",
              "Priority support and updates",
              "Advanced API features",
              "Commercial usage rights",
              "Lifetime access with no recurring fees",
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-gray-300/90">{feature}</span>
              </motion.div>
            ))}
          </div>

          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-400 hover:to-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Purchase Access for ${server.price}
              </>
            )}
          </button>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-500/80 text-xs text-center">
              🔒 Secure payment processing • 30-day money-back guarantee
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-6"
        >
          <a
            href="/"
            className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
          >
            ← Back to Explore
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
