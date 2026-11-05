"use client";

import Link from "next/link";
import { VeylLogo } from "@/components/brand/veyl-logo";
import { GithubIcon } from "@/components/docs/icons";
import { ThemeToggle } from "@/components/docs/theme-toggle";
import { DropNavbar } from "@/registry/veyl/drop-navbar";

const links = [
  { label: "Components", href: "/docs/components/illuminated-hero" },
  { label: "Docs", href: "/docs" },
  { label: "Install", href: "/#install" },
];

/** The landing page navbar is Veyl's own Drop Navbar component, dressed with our logo and icons. */
export function Navbar() {
  return (
    <DropNavbar
      linkComponent={Link}
      logo={
        <>
          <VeylLogo markClassName="size-[30px]" />
        </>
      }
      links={links}
      actions={
        <>
          <a
            href="https://github.com/veyl-ui/veyl"
            target="_blank"
            rel="noreferrer"
            aria-label="Veyl on GitHub"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground"
          >
            <GithubIcon />
          </a>
          <ThemeToggle />
        </>
      }
      cta={{ label: "Get started", href: "/docs/installation" }}
    />
  );
}
