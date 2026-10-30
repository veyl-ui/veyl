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

/* Photos from Unsplash (free to use):
   farm Michael Starkie, roaster Zoshua Colah, beans Hannah Busing, bag pouchdirect Australia */
const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=70`;

const photos = {
  farm: unsplash("1741012253421-365cf4c78083"),
  roaster: unsplash("1741994042855-48baa6a524b6"),
  beans: unsplash("1743356629215-abb470447e71"),
  bag: unsplash("1707216265113-9f57a25cfea4"),
};

export function BentoDemo() {
  return (
    <div className={`${manrope.variable} h-full w-full overflow-y-auto p-3`}>
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
  );
}
