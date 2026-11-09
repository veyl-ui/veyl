"use client";

import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";
import { registryUrl } from "@/lib/docs/site";
import { GlassBackdrop, GlassCta } from "@/registry/veyl/glass-cta";

/** The closing call to action: the GlassCta component with Veyl's words, links and install command. */
export function CTA() {
  return (
    <section id="get-started" className="relative scroll-mt-24 overflow-hidden border-t border-border">
      <div className="mx-auto w-full max-w-page px-5 py-24 sm:px-8">
        <Reveal>
          <div className="relative">
            <GlassBackdrop />
            <GlassCta
              linkComponent={Link}
              eyebrow="Get started"
              title="Make your next page feel alive"
              description="Copy a component, make it yours, and ship something people remember. One command is all it takes."
              primary={{ label: "Get started", href: "/docs/installation" }}
              secondary={{ label: "Browse components", href: "/docs" }}
              command={`npx shadcn@latest add ${registryUrl("flip-words")}`}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}