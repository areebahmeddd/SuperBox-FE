"use client";

import { showToast } from "@/lib/toast-utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogTitle className="sr-only">
          {server.name} - Premium Server
        </DialogTitle>
        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 mb-4"
            >
              <span className="text-xs font-semibold text-primary">
                PREMIUM SERVER
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-bold text-foreground mb-2"
            >
              {server.name}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-muted-foreground mb-6"
            >
              Unlock premium features and capabilities
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="mb-6 p-6 rounded-xl bg-card border border-border w-full"
            >
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-foreground">
                  {getCurrencySymbol(server.pricing.currency)}
                  {server.pricing.amount}
                </span>
                <span className="text-muted-foreground text-sm">/month</span>
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
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full"
            >
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                variant="default"
                size="lg"
                className="w-full py-3 rounded-xl"
              >
                {isProcessing ? "Processing..." : "Unlock Access"}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="mt-4 text-muted-foreground hover:text-foreground"
              >
                Maybe later
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
