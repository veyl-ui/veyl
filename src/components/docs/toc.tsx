"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** "On this page" list. The link for the part of the page you are reading stays lit while you scroll. */
export function Toc({ toc }: { toc: { id: string; title: string }[] }) {
  const [active, setActive] = useState(toc[0]?.id ?? "");
  // After you click a link the page glides there. Until it arrives, scrolling must not change the highlight.
  const lockUntil = useRef(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      if (Date.now() < lockUntil.current) return;
      // A heading counts as "reached" once it passes the upper third of the window.
      const line = Math.max(120, window.innerHeight * 0.3);
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = toc[0]?.id ?? "";
      for (const item of toc) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }
      if (atBottom && toc.length > 0) current = toc[toc.length - 1].id;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [toc]);

  return (
    <nav aria-label="On this page" className="sticky top-24 text-sm">
      <p className="mb-3 font-medium text-foreground">On this page</p>
      <ul className="space-y-2 border-l border-border">
        {toc.map((item) => {
          const on = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={on ? "location" : undefined}
                onClick={() => {
                  lockUntil.current = Date.now() + 1000;
                  setActive(item.id);
                }}
                className={cn(
                  "-ml-px block border-l pl-4 transition-[color,border-color,box-shadow] duration-200 hover:border-brand hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none",
                  on
                    ? "border-brand text-foreground shadow-[-2px_0_8px_-3px_var(--brand)]"
                    : "border-transparent text-muted-foreground",
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}