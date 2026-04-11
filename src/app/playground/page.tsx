import Header from "@/components/header";

export default function PlaygroundPage() {
  return (
    <>
      <Header />
      <div className="bg-background text-foreground flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-foreground text-4xl font-bold">Playground</h1>
          <p className="text-muted-foreground text-xl">Coming Soon</p>
        </div>
      </div>
    </>
  );
}
