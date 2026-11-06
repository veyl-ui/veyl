"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Measures a box and returns the scale that makes a fixed-size layout (baseW x baseH) fit inside it.
 * Lets a full-size page be shown small, without changing how it lays itself out.
 */
export function useFit(baseW: number, baseH: number, pad = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.max(0.2, Math.min(1, (width - pad * 2) / baseW, (height - pad * 2) / baseH)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseW, baseH, pad]);

  return [ref, scale] as const;
}