"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navGroups, type NavIcon } from "@/lib/docs/nav";

const svg = {
  width: 17,
  height: 17,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function GroupIcon({ name }: { name?: NavIcon }) {
  if (name === "book")
    return (
      <svg {...svg}>
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </svg>
    );
  if (name === "grid")
    return (
      <svg {...svg}>
        <rect width="7" height="7" x="3" y="3" rx="1.5" />
        <rect width="7" height="7" x="14" y="3" rx="1.5" />
        <rect width="7" height="7" x="14" y="14" rx="1.5" />
        <rect width="7" height="7" x="3" y="14" rx="1.5" />
      </svg>
    );
  return null;
}

export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  // Every group starts open. The group that holds the current page is opened again whenever you move to a new page.
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const current = navGroups.find((g) => g.items.some((i) => i.href === pathname));
    if (current) setClosed((c) => (c[current.title] ? { ...c, [current.title]: false } : c));
  }, [pathname]);

  return (
    <nav aria-label="Documentation" className="text-sm">
      {navGroups.map((group) => {
        const open = !closed[group.title];
        const hasActive = group.items.some((i) => i.href === pathname);
        const panel = `docs-nav-${group.title.toLowerCase().replace(/\s+/g, "-")}`;
        return (
          <div key={group.title} className="[&+&]:mt-2.5">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panel}
              onClick={() => setClosed((c) => ({ ...c, [group.title]: open }))}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                hasActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <GroupIcon name={group.icon} />
              <span className="flex-1">{group.title}</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={cn("transition-transform duration-300 ease-soft motion-reduce:transition-none", !open && "-rotate-90")}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              id={panel}
              inert={!open}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-soft motion-reduce:transition-none",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <ul className="mb-1 ml-[1.15rem] mt-1.5 space-y-0.5 border-l border-border pl-2.5">
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between gap-2 rounded-[9px] border px-2.5 py-1.5 transition-[background-color,color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none",
                            active
                              ? "border-border bg-background font-medium text-foreground shadow-sm dark:border-white/15 dark:bg-muted"
                              : "border-transparent text-muted-foreground hover:translate-x-0.5 hover:bg-accent hover:text-foreground motion-reduce:hover:translate-x-0",
                          )}
                        >
                          {item.title}
                          {item.hint ? (
                            <span className={cn("text-xs font-normal", active ? "text-muted-foreground" : "text-muted-foreground/60")}>{item.hint}</span>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}