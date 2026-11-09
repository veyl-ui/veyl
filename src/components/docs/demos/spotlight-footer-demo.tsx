import { SpotlightFooter } from "@/registry/veyl/spotlight-footer";

export function SpotlightFooterDemo() {
  return (
    <div className="w-full">
      <SpotlightFooter
        brand={<span className="text-lg font-medium">Acme</span>}
        tagline="Tools that help small teams ship faster."
        columns={[
          {
            title: "Product",
            links: [
              { label: "Features", href: "#" },
              { label: "Pricing", href: "#" },
              { label: "Changelog", href: "#" },
            ],
          },
          {
            title: "Company",
            links: [
              { label: "About", href: "#" },
              { label: "Careers", href: "#" },
              { label: "Contact", href: "#" },
            ],
          },
        ]}
        copyright="© 2026 Acme. All rights reserved."
        wordmark="Acme"
      />
    </div>
  );
}