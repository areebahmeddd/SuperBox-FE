import PageTransition from "@/components/page-transition";
import type { Metadata } from "next";
import type React from "react";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "SuperBox - Open Marketplace for MCP Servers",
  description: "Discover, deploy, and test MCPs in isolated sandboxes.",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className={`font-sans antialiased`}>
        <PageTransition>{children}</PageTransition>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(0, 0, 0, 0.95)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#fff",
              borderRadius: "16px",
              padding: "16px",
              fontSize: "14px",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#ff5252",
                secondary: "#000",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#ff5252",
                secondary: "#000",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
