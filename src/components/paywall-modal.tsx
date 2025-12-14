"use client";

import { showToast } from "@/lib/toast-utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  server: {
    name: string;
    pricing: {
      currency: string;
      amount: number;
    };
  };
}

const getCurrencySymbol = (currency: string): string => {
  const symbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    JPY: "¥",
    CNY: "¥",
    AUD: "A$",
    CAD: "C$",
  };
  return symbols[currency.toUpperCase()] || currency;
};

const features = [
  "Unlimited API calls",
  "Priority support",
  "Advanced features",
  "Commercial license",
  "Early access to updates",
];

export default function PaywallModal({
  isOpen,
  onClose,
  server,
}: PaywallModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        throw new Error("API URL not configured");
      }

      const orderResponse = await fetch(`${API_URL}/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          server_name: server.name,
          amount: server.pricing.amount,
          currency: server.pricing.currency,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.detail || "Failed to create order");
      }

      const orderData = await orderResponse.json();

      if (orderData.status !== "success") {
        throw new Error(orderData.detail || "Failed to create order");
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay"));
      });

      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "SuperBox",
        description: `Purchase ${server.name}`,
        order_id: orderData.order.id,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            const verifyResponse = await fetch(
              `${API_URL}/payment/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  server_name: server.name,
                }),
              },
            );

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(
                errorData.detail || "Payment verification failed",
              );
            }

            const verifyData = await verifyResponse.json();

            if (verifyData.status === "success") {
              showToast.success(
                "Payment successful! You now have access to this server.",
              );
              onClose();
            } else {
              throw new Error(
                verifyData.detail || "Payment verification failed",
              );
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            showToast.error(
              error instanceof Error
                ? error.message
                : "Payment verification failed",
            );
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
        theme: {
          color: "#EF4444",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      showToast.error(
        error instanceof Error ? error.message : "Failed to initiate payment",
      );
      setIsProcessing(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-black/40 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden backdrop-blur-xl shadow-2xl z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 transition-colors z-10 group"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-gray-400 group-hover:text-[var(--brand-red)] transition-colors" />
            </button>

            <div className="p-8">
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[var(--brand-red)]/20 to-[var(--brand-red)]/10 border border-[var(--brand-red)]/30 mb-4"
                >
                  <span className="text-xs font-semibold text-[var(--brand-red)]">
                    PREMIUM SERVER
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  {server.name}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-white/60 mb-6"
                >
                  Unlock premium features and capabilities
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mb-6 p-6 rounded-xl bg-white/5 border border-white/10 w-full"
                >
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">
                      {getCurrencySymbol(server.pricing.currency)}
                      {server.pricing.amount}
                    </span>
                    <span className="text-white/40 text-sm">/month</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-full mb-6 space-y-3"
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + index * 0.05 }}
                      className="flex items-center gap-3 text-left"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--brand-red)]/20 border border-[var(--brand-red)]/30 flex items-center justify-center">
                        <Check className="w-3 h-3 text-[var(--brand-red)]" />
                      </div>
                      <span className="text-sm text-white/80">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-[var(--brand-red)] text-white font-semibold text-sm hover:bg-[var(--brand-red)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Unlock Access"}
                </motion.button>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65 }}
                  onClick={onClose}
                  className="mt-4 text-sm text-white/40 hover:text-white/60 transition-colors"
                >
                  Maybe later
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    typeof window !== "undefined" ? document.body : (null as any),
  );
}
