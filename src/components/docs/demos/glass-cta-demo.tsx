import { GlassBackdrop, GlassCta } from "@/registry/veyl/glass-cta";

export function GlassCtaDemo() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="relative">
        <GlassBackdrop />
        <GlassCta
          eyebrow="Get started"
          title="Make your next page feel alive"
          description="Copy a component, make it yours, and ship something people remember. One command is all it takes."
          primary={{ label: "Get started", href: "#" }}
          secondary={{ label: "Browse components", href: "#" }}
          command="npx shadcn@latest add glass-cta"
        />
      </div>
    </div>
  );
}