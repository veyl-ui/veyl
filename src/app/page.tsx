import { About } from "@/components/about";
import { FAQ } from "@/components/faq";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Showcase } from "@/components/showcase";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Showcase />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}