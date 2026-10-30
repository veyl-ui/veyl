import { Instrument_Sans } from "next/font/google";
import { IlluminatedHero } from "@/registry/veyl/illuminated-hero";

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--vh-font",
  display: "swap",
});

export function HeroDemo() {
  return (
    <div className={`${sans.variable} h-full w-full`}>
      <IlluminatedHero headingLevel="h2" />
    </div>
  );
}
