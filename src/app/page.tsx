import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Showcase } from "@/components/showcase";

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Showcase />
        </main>
      </div>
    </>
  );
}