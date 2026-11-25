import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { demos } from "@/components/docs/demos";
import { ArrowLeftIcon } from "@/components/docs/icons";
import { ThemeToggle } from "@/components/docs/theme-toggle";
import { componentDocs, getDoc } from "@/lib/docs/components";
import { cn } from "@/lib/utils";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return componentDocs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  return {
    title: doc ? `${doc.title} (full screen)` : "Full screen",
    // A bare demo is not a page worth finding in a search engine.
    robots: { index: false, follow: false },
  };
}

/** One component, alone, filling the whole window. Opened from the full screen button in the docs. */
export default function FullScreenPage({ params }: { params: Promise<Params> }) {
  return (
    // The fallback is an empty stage, so nothing flashes while the slug is read.
    <Suspense fallback={<div className="h-svh w-full bg-stage" />}>
      <FullScreenContent params={params} />
    </Suspense>
  );
}

async function FullScreenContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  return (
    <>
      {/* The demos were built for a frame with a height, so give them the whole window. */}
      <main
        className={cn(
          "relative h-svh w-full overflow-auto bg-stage",
          doc.centered && "flex items-center justify-center p-6",
        )}
      >
        {demos[doc.slug]}
      </main>

      {/* Bottom right, so it never sits on top of a navbar. Quiet until you point at it. */}
      <nav
        aria-label="Full screen controls"
        className="fixed bottom-4 right-6 z-50 flex items-center gap-1 rounded-full border border-border bg-background/80 p-1 text-sm opacity-60 shadow-card backdrop-blur transition-opacity hover:opacity-100 focus-within:opacity-100"
      >
        <Link
          href={`/docs/components/${doc.slug}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeftIcon />
          Back to docs
        </Link>
        <span aria-hidden="true" className="h-5 w-px bg-border" />
        <ThemeToggle />
      </nav>
    </>
  );
}