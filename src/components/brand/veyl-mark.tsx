import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * The Veyl mark: a V made of warm light on a dark tile. Now and then a band of
 * light sweeps across it. The sweep stops for anyone who prefers reduced motion.
 *
 * The shape is shared with the favicon (src/app/icon.svg and favicon-animator.tsx),
 * so change all three together if you ever redraw it.
 */
export function VeylMark({
  className,
  animate = true,
}: {
  className?: string;
  /** Turn the sweep off for a calm, still mark (for example inside the docs header). */
  animate?: boolean;
}) {
  // Each copy of the mark needs its own ids, or two marks on one page would clash.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const glow = `${uid}glow`;
  const fill = `${uid}fill`;
  const band = `${uid}band`;
  const mask = `${uid}mask`;

  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Veyl"
      className={cn("shrink-0", className)}
    >
      <defs>
        <radialGradient id={glow} cx="32" cy="46" r="22" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f59e0b" stopOpacity="0.45" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={fill} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f7d9b8" />
          <stop offset="1" stopColor="#e8a057" />
        </linearGradient>
        <linearGradient id={band} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
          <path
            d="M19 20 L32 45 L45 20"
            fill="none"
            stroke="#fff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>

      <rect x="0.5" y="0.5" width="63" height="63" rx="14.5" fill="#0a0a0a" stroke="#fff" strokeOpacity="0.14" />
      <circle cx="32" cy="46" r="22" fill={`url(#${glow})`} />
      <path
        d="M19 20 L32 45 L45 20"
        fill="none"
        stroke={`url(#${fill})`}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {animate ? (
        <g mask={`url(#${mask})`}>
          <g transform="skewX(-20)">
            <rect
              x="-26"
              y="0"
              width="24"
              height="64"
              fill={`url(#${band})`}
              className="motion-safe:animate-veyl-sweep"
            />
          </g>
        </g>
      ) : null}
    </svg>
  );
}
