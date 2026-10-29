import { Manrope } from "next/font/google";
import {
  BentoCard,
  BentoGrid,
  FreshnessTracker,
  OriginTrail,
  RoastCurve,
  TastingNotes,
} from "@/registry/veyl/bento-grid";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

/* Photos from Unsplash (free to use). Credit is optional but kind:
   farm      Michael Starkie
   roaster   Zoshua Colah
   beans     Hannah Busing
   bag       pouchdirect Australia */
const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=70`;

const photos = {
  farm: unsplash("1741012253421-365cf4c78083"),
  roaster: unsplash("1741994042855-48baa6a524b6"),
  beans: unsplash("1743356629215-abb470447e71"),
  bag: unsplash("1707216265113-9f57a25cfea4"),
};

export default function BentoGridPreviewPage() {
  return (
    <main
      className={`${manrope.variable} flex flex-col min-h-screen items-center justify-center px-4 py-10`}
    >
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(150,150,150,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(150,150,150,0.3)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_70%)]"></div>
            <div className="relative">
              <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-3 tracking-tight font-[family-name:var(--font-manrope)]">
                Effortless Creations
              </h1>
              <p className="text-lg text-neutral-500 dark:text-neutral-400 font-medium font-[family-name:var(--font-manrope)]">
                Build with joy, let us handle the rest. 
              </p>
            </div>
          </div>
        </div>
      <div className="flex h-[680px] w-[1000px] max-w-full items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <BentoGrid className="h-full w-full">
            <BentoCard
              align="bottom"
              title="Traceable from the first harvest"
              description="Every lot, from a Ugandan hillside to your counter."
              image={{ src: photos.farm }}
              className="md:col-span-3"
            >
              <OriginTrail />
            </BentoCard>

            <BentoCard
              title="Roasted with precision"
              description="Each batch follows its own curve."
              image={{ src: photos.roaster }}
              className="md:col-span-2"
            >
              <RoastCurve />
            </BentoCard>

            <BentoCard
              title="Tasted before it ships"
              description="Cupped and scored by our team."
              image={{ src: photos.beans }}
              className="md:col-span-2"
            >
              <TastingNotes />
            </BentoCard>

            <BentoCard
              title="Delivered at peak freshness"
              description="On its way within 48 hours of roasting."
              image={{ src: photos.bag }}
              className="md:col-span-3"
            >
              <FreshnessTracker />
            </BentoCard>
          </BentoGrid>
        </div>
    </main>
  );
}