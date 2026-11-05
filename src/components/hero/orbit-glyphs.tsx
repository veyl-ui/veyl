import type { ReactNode } from "react";

/** Small original icons for the floating bubbles. Each one stands for a kind of component. */
export type GlyphName = "navbar" | "sparkles" | "toggle" | "cursor" | "layers" | "bento" | "play" | "code";

/** One colour per icon. The glowing trail on each ring uses the same colour as its icon. */
export const glyphColor: Record<GlyphName, string> = {
  navbar: "#3b82f6",
  sparkles: "#f59e0b",
  toggle: "#22c55e",
  cursor: "#8b5cf6",
  layers: "#ef4444",
  bento: "#14b8a6",
  play: "#f97316",
  code: "#ec4899",
};

const glyphs: Record<GlyphName, ReactNode> = {
  navbar: (
    <>
      <rect x="2.5" y="5" width="19" height="9" rx="4.5" fill="#3b82f6" />
      <rect x="6" y="8.4" width="5" height="2.2" rx="1.1" fill="#fff" />
      <circle cx="17" cy="9.5" r="1.6" fill="#fff" />
      <rect x="6" y="17" width="12" height="2" rx="1" fill="#3b82f6" opacity="0.35" />
    </>
  ),
  sparkles: (
    <>
      <path d="M11 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#f59e0b" />
      <path d="M19 2l.9 2.1L22 5l-2.1.9L19 8l-.9-2.1L16 5l2.1-.9z" fill="#fbbf24" />
    </>
  ),
  toggle: (
    <>
      <rect x="2" y="7" width="20" height="10" rx="5" fill="#22c55e" />
      <circle cx="16.5" cy="12" r="3.6" fill="#fff" />
    </>
  ),
  cursor: <path d="M5 3l14 7.2-6 1.9-2 6.4z" fill="#8b5cf6" strokeLinejoin="round" />,
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5z" fill="#ef4444" />
      <path d="M3 12.2l9 5 9-5" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <path d="M3 16.2l9 5 9-5" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    </>
  ),
  bento: (
    <>
      <rect x="3" y="3" width="8" height="10" rx="2.2" fill="#14b8a6" />
      <rect x="13" y="3" width="8" height="6" rx="2.2" fill="#99f6e4" />
      <rect x="13" y="11" width="8" height="10" rx="2.2" fill="#14b8a6" />
      <rect x="3" y="15" width="8" height="6" rx="2.2" fill="#99f6e4" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9.5" fill="#f97316" />
      <path d="M10 8l6 4-6 4z" fill="#fff" />
    </>
  ),
  code: (
    <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" fill="none" stroke="#ec4899" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  ),
};

export function Glyph({ name, size = 26 }: { name: GlyphName; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      {glyphs[name]}
    </svg>
  );
}