"use client";

import { type RefObject, useEffect, useState } from "react";

/**
 * True once something has been scrolled down a little. Watches the page by default, or a
 * scrolling element if you pass one. It switches on past `on` pixels and only switches off
 * again well below that, so it never flickers near the edge.
 */
export function useScrolled(container: RefObject<HTMLElement | null> | undefined, on: number) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = container?.current ?? null;
    const target: HTMLElement | Window = el ?? window;
    const off = Math.floor(on / 4);
    const read = () => (el ? el.scrollTop : window.scrollY);

    const update = () => {
      const y = read();
      setScrolled((was) => (was ? y > off : y > on));
    };

    update();
    target.addEventListener("scroll", update, { passive: true });
    return () => target.removeEventListener("scroll", update);
  }, [container, on]);

  return scrolled;
}
