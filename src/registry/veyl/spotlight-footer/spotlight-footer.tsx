import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SpotlightWordmark } from "./spotlight-wordmark";
import "./spotlight-footer.css";

export type FooterLink = { label: ReactNode; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };
export type FooterSocial = { label: string; href: string; icon: ReactNode };

export type SpotlightFooterProps = {
  /** Your logo and name, shown at the top of the brand block. */
  brand?: ReactNode;
  tagline?: ReactNode;
  columns: FooterColumn[];
  socials?: FooterSocial[];
  copyright?: ReactNode;
  /** The huge cropped word at the bottom. Leave out to hide it. */
  wordmark?: string;
  /** Sits at the right of the copyright row. A theme switch is a good fit. */
  end?: ReactNode;
  /** Use your router's link, for example next/link. Defaults to a plain <a>. Web addresses always use a plain <a>. */
  linkComponent?: ElementType;
  className?: string;
};

const isExternal = (href: string) => /^https?:\/\//.test(href);

export function SpotlightFooter({
  brand,
  tagline,
  columns,
  socials,
  copyright,
  wordmark,
  end,
  linkComponent,
  className,
}: SpotlightFooterProps) {
  const Router = linkComponent ?? "a";

  function renderLink(href: string, children: ReactNode, props: { className?: string; "aria-label"?: string } = {}) {
    if (isExternal(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    }
    return (
      <Router href={href} {...props}>
        {children}
      </Router>
    );
  }

  return (
    <footer className={cn("sf-root", className)}>
      <div className="sf-inner">
        <div className="sf-top">
          <nav aria-label="Footer" className="sf-cols">
            {columns.map((col) => (
              <div key={col.title} className="sf-col">
                <h3>{col.title}</h3>
                <ul>
                  {col.links.map((link, i) => (
                    <li key={i}>{renderLink(link.href, link.label)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {(brand || tagline || socials?.length) && (
            <div className="sf-brand">
              {brand && <div className="sf-logo">{brand}</div>}
              {tagline && <p className="sf-tagline">{tagline}</p>}
              {socials && socials.length > 0 && (
                <div className="sf-socials">
                  {socials.map((s) => (
                    <span key={s.label}>{renderLink(s.href, s.icon, { "aria-label": s.label })}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {(copyright || end) && (
          <div className="sf-bar">
            {copyright && <span className="sf-copy">{copyright}</span>}
            {end && <div className="sf-end">{end}</div>}
          </div>
        )}

        {wordmark && <SpotlightWordmark text={wordmark} />}
      </div>
    </footer>
  );
}