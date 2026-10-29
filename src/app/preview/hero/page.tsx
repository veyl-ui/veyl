import { Instrument_Sans } from "next/font/google";
import { IlluminatedHero } from "@/registry/veyl/illuminated-hero";

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--vh-font",
  display: "swap",
});

export default function HeroPreviewPage() {
  return (
    <div className={sans.variable}>
      {/* 1. Full screen, default text. Should look exactly like before. */}
      <div className="h-svh">
        <IlluminatedHero />
      </div>

      {/* 2. Inside a framed box, with your own text. Proves it sizes from its container. */}
      <div className="flex min-h-svh items-center justify-center bg-neutral-100 px-4 py-10 dark:bg-neutral-900">
        <div className="flex h-[650px] w-[707px] max-w-full items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="h-full w-full overflow-hidden rounded-md shadow-sm">
            <IlluminatedHero
              headingLevel="h2"
              headline={["Meet Veyl", "Quietly Alive Interfaces.", "Beautifully built, one line at a time."]}
              description={[
                "Components that feel considered,",
                "motion that never shouts,",
                "and code you can make your own.",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}