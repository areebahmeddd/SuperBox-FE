import PageTransition from "@/components/page-transition";
import { ToastProvider } from "@/components/toast-provider";
import type { Metadata } from "next";
import type React from "react";
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
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ToastProvider>
          <PageTransition>{children}</PageTransition>
        </ToastProvider>
      </body>
    </html>
  );
}
