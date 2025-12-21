import PageTransition from "@/components/page-transition";
import { ThemeProvider } from "@/lib/theme-provider";
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
    <html lang="en" data-scroll-behavior="smooth" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          <PageTransition>{children}</PageTransition>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: "toast-theme",
              style: {
                borderRadius: "16px",
                padding: "16px",
                fontSize: "14px",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#ff5252",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: "#ff5252",
                  secondary: "#fff",
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
