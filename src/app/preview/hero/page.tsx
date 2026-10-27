import { Instrument_Sans } from "next/font/google";
import { IlluminatedHero } from "@/blocks/illuminated-hero";

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--vh-font",
  display: "swap",
});

export default function HeroPreviewPage() {
  return (
    <div className={sans.variable}>
      <IlluminatedHero />
    </div>
  );
}