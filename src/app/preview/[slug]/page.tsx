import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { showcaseItems } from "@/components/showcase/data";
import { BeamAboutPreview, DropNavbarPreview, FlipWordsPreview } from "@/components/showcase/previews";

/** These pages exist only to be shown inside the phone frame on the landing page. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export function generateStaticParams() {
  return showcaseItems.map((item) => ({ slug: item.slug }));
}

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === "flip-words") {
    return (
      <div className="grid min-h-svh place-items-center">
        <FlipWordsPreview />
      </div>
    );
  }
  if (slug === "drop-navbar") return <DropNavbarPreview mode="page" />;
  if (slug === "beam-about") return <BeamAboutPreview mode="page" />;
  notFound();
}