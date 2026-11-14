"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FULL_TEXT } from "@/lib/docs/license";

/** A button that copies the whole licence text. It says "Copied" for a moment afterwards. */
export function CopyLicenseButton({ className, children = "Copy the license" }: { className?: string; children?: ReactNode }) {
  const [done, setDone] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(FULL_TEXT);
      setDone(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setDone(false), 1800);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  }

  return (
    <button type="button" onClick={copy} className={className}>
      <span aria-live="polite">{done ? "Copied ✓" : children}</span>
    </button>
  );
}