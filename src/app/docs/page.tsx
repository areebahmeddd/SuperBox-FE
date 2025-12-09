"use client";

import { useEffect } from "react";

export default function DocsPage() {
  useEffect(() => {
    const docsUrl = process.env.NODE_ENV === "production"
      ? "https://docs.superbox-fe.vercel.app"
      : "http://localhost:3001";
    
    window.location.href = docsUrl;
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold">
          <span className="inline-block bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Redirecting to Documentation...
          </span>
        </h1>
        <p className="text-xl text-gray-400">
          If you are not redirected automatically,{" "}
          <a
            href="http://localhost:3001"
            className="text-[var(--brand-red)] hover:underline"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  );
}
