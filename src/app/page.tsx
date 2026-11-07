import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Components } from "@/components/components";
import { FAQ } from "@/components/faq";

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Components />
          <FAQ />
        </main>
      </div>
    </>
  );
}