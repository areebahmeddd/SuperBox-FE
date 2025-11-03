"use client";
import ExploreSection from "@/components/explore-section";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-black overflow-x-hidden"
      style={{
        backgroundImage: "linear-gradient(135deg, #000000 0%, #0a1e35 100%)",
      }}
    >
      <Header />
      <main className="pt-20">
        <HeroSection />
        <ExploreSection />
      </main>
    </div>
  );
}
