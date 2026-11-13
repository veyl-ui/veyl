import type { ReactNode, SVGProps } from "react";
import type { DropNavbarMenu } from "@/registry/veyl/drop-navbar";
import { registryUrl } from "@/lib/docs/site";

/** Small outline icons for the menu. Each one is drawn on a 24px grid and inherits the text colour. */
const Icon = (props: SVGProps<SVGSVGElement> & { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  />
);

const DownloadIcon = () => (
  <Icon>
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12" />
  </Icon>
);
const PaletteIcon = () => (
  <Icon>
    <path d="M12 21a9 9 0 1 1 9-9c0 2.5-2 3-3.5 3H15a2 2 0 0 0-1.5 3.3c.6.8.3 2.7-1.5 2.7Z" />
    <circle cx="7.5" cy="11" r=".6" />
    <circle cx="10.5" cy="7" r=".6" />
    <circle cx="15.5" cy="7.5" r=".6" />
  </Icon>
);
const HistoryIcon = () => (
  <Icon>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2" />
  </Icon>
);
const ScaleIcon = () => (
  <Icon>
    <path d="M12 3v18M5 7h14M5 7l-3 7a3.5 3.5 0 0 0 6 0L5 7ZM19 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7ZM8 21h8" />
  </Icon>
);
const PullRequestIcon = () => (
  <Icon>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M6 8.5v7M18 15.5V10a3 3 0 0 0-3-3h-3M14.5 4.5 12 7l2.5 2.5" />
  </Icon>
);
const GithubIcon = () => (
  <Icon>
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </Icon>
);
const NpmIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
  </svg>
);
const BugIcon = () => (
  <Icon>
    <path d="M8 9h8v7a4 4 0 0 1-8 0V9ZM9 9a3 3 0 0 1 6 0M3 13h3M18 13h3M4 19l3-2M20 19l-3-2M4 7l3 2M20 7l-3 2" />
  </Icon>
);

/* ---------- What shows on the right while a row is highlighted ---------- */

const Title = ({ children }: { children: ReactNode }) => (
  <p className="text-sm font-medium text-foreground">{children}</p>
);
const Text = ({ children }: { children: ReactNode }) => (
  <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">{children}</p>
);
const Row = ({ children, tag }: { children: ReactNode; tag?: string }) => (
  <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[0.8125rem] text-foreground">
    {children}
    {tag ? <span className="ml-auto rounded-md bg-brand/15 px-1.5 py-px text-[0.6875rem] font-medium text-brand-ink">{tag}</span> : null}
  </div>
);

const installPreview = (
  <div className="flex flex-col gap-3">
    <div>
      <Title>Installation</Title>
      <Text>Copy one command, paste it, done.</Text>
    </div>
    <code className="break-all rounded-lg border border-border bg-card p-2.5 font-mono text-xs leading-relaxed text-muted-foreground">
      npx shadcn@latest add <span className="text-brand-ink">{registryUrl("flip-words")}</span>
    </code>
    <Text>Tailwind, the helper and your first component.</Text>
  </div>
);

const themingPreview = (
  <div className="flex flex-col gap-3">
    <div>
      <Title>Theming</Title>
      <Text>Change the colours and dark mode in one place.</Text>
    </div>
    <div className="flex gap-2">
      {["bg-brand", "bg-brand-ink", "bg-card", "bg-foreground"].map((c) => (
        <span key={c} className={`size-9 rounded-full border border-border ${c}`} />
      ))}
    </div>
    <Text>Every component follows your tokens.</Text>
  </div>
);

const changelogPreview = (
  <div className="flex flex-col gap-2">
    <div className="mb-1">
      <Title>Changelog</Title>
      <Text>The latest additions.</Text>
    </div>
    <Row tag="New">Spotlight Footer</Row>
    <Row tag="New">Glass CTA</Row>
    <Row>FAQ</Row>
  </div>
);

const licensePreview = (
  <div className="flex flex-col gap-3">
    <div>
      <Title>License</Title>
      <Text>What you can and can&apos;t do with Veyl, in plain English.</Text>
    </div>
    <Row>
      <span className="size-4 text-brand-ink [&>svg]:size-4">
        <ScaleIcon />
      </span>
      Read the terms
    </Row>
  </div>
);

const contributePreview = (
  <div className="flex flex-col gap-2">
    <div className="mb-1">
      <Title>Contribute</Title>
      <Text>Found a bug or have an idea? Help shape Veyl.</Text>
    </div>
    <Row>
      <span className="size-4 [&>svg]:size-4">
        <GithubIcon />
      </span>
      Fork the repo
    </Row>
    <Row>
      <span className="size-4 [&>svg]:size-4">
        <PullRequestIcon />
      </span>
      Open a pull request
    </Row>
  </div>
);

/** The Resources dropdown: Veyl's pages on the left, a live preview on the right. */
export const resourcesMenu: DropNavbarMenu = {
  items: [
    { label: "Installation", href: "/docs/installation", icon: <DownloadIcon />, preview: installPreview },
    { label: "Theming", href: "/docs/theming", icon: <PaletteIcon />, preview: themingPreview },
    { label: "Changelog", href: "/docs/changelog", icon: <HistoryIcon />, badge: "New", preview: changelogPreview },
    { label: "License", href: "/license", icon: <ScaleIcon />, preview: licensePreview },
    { label: "Contribute", href: "/docs/contribute", icon: <PullRequestIcon />, preview: contributePreview },
  ],
  footerLabel: "Community",
  footer: [
    { label: "GitHub", href: "https://github.com/veyl-ui/veyl", icon: <GithubIcon /> },
    { label: "npm", href: "https://www.npmjs.com/org/veyl-style", icon: <NpmIcon /> },
    { label: "Report an issue", href: "https://github.com/veyl-ui/veyl/issues", icon: <BugIcon /> },
  ],
};