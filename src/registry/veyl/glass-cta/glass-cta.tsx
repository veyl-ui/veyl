"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GlassCube } from "./glass-cube";
import "./glass-cta.css";

export type GlassCtaAction = { label: ReactNode; href: string };

export type GlassCtaProps = {
  /** Small flowing label above the title. Leave out to hide it. */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  primary?: GlassCtaAction;
  secondary?: GlassCtaAction;
  /** A command shown in a box with a Copy button. */
  command?: string;
  /** Use your router's link, for example next/link. Defaults to a plain <a>. */
  linkComponent?: ElementType;
  /** The small line under the cube. Use null to hide it. */
  hint?: string | null;
  className?: string;
};

export function GlassCta({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  command,
  linkComponent,
  hint,
  className,
}: GlassCtaProps) {
  const Link = linkComponent ?? "a";
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    if (!command) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1400);
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      /* clipboard blocked: the command is still on screen to copy by hand */
    }
  }

  return (
    <div className={cn("gc-root w-full", className)}>
      <div className="gc-left">
        {eyebrow && <span className="gc-eyebrow">{eyebrow}</span>}
        <h2 className="gc-title">{title}</h2>
        {description && <p className="gc-desc">{description}</p>}
        {(primary || secondary) && (
          <div className="gc-actions">
            {primary && (
              <Link href={primary.href} className="gc-btn gc-btn-primary">
                {primary.label}
              </Link>
            )}
            {secondary && (
              <Link href={secondary.href} className="gc-btn gc-btn-secondary">
                {secondary.label}
              </Link>
            )}
          </div>
        )}
        {command && (
          <div className="gc-command">
            <span>{command}</span>
            <button type="button" className="gc-copy" onClick={copy}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </div>
      <GlassCube hint={hint} />
    </div>
  );
}