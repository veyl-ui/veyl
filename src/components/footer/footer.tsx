import Link from "next/link";
import { VeylLogo } from "@/components/brand/veyl-logo";
import { SpotlightFooter, type FooterColumn, type FooterSocial } from "@/registry/veyl/spotlight-footer";
import { ThemeSwitch } from "./theme-switch";

const columns: FooterColumn[] = [
  {
    title: "Components",
    links: [
      { label: "Illuminated Hero", href: "/docs/components/illuminated-hero" },
      { label: "Flip Words", href: "/docs/components/flip-words" },
      { label: "Bento Grid", href: "/docs/components/bento-grid" },
      { label: "Drop Navbar", href: "/docs/components/drop-navbar" },
      { label: "All components", href: "/docs" },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Introduction", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "GitHub", href: "https://github.com/veyl-ui/veyl" },
      { label: "npm", href: "https://www.npmjs.com/org/veyl-style" },
      { label: "Report an issue", href: "https://github.com/veyl-ui/veyl/issues" },
    ],
  },
];

const GithubIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </svg>
);

const NpmIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
  </svg>
);

const socials: FooterSocial[] = [
  { label: "GitHub", href: "https://github.com/veyl-ui/veyl", icon: GithubIcon },
  { label: "npm", href: "https://www.npmjs.com/org/veyl-style", icon: NpmIcon },
];

/** The landing page's footer: the SpotlightFooter component with Veyl's links, logo and theme switch. */
export function Footer() {
  return (
    <SpotlightFooter
      linkComponent={Link}
      brand={
        <Link href="/" aria-label="Veyl home" className="inline-flex">
          <VeylLogo markClassName="size-9" />
        </Link>
      }
      tagline="Copy-paste components that make your pages feel alive."
      columns={columns}
      socials={socials}
      copyright="© 2026 Veyl. All rights reserved."
      wordmark="Veyl"
      end={<ThemeSwitch />}
    />
  );
}