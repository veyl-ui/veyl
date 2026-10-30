"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CloseIcon, MenuIcon } from "./icons";
import { DocsSidebar } from "./docs-sidebar";

/** The sidebar as a drop-down panel, for small screens. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close after navigating.
  useEffect(() => setOpen(false), [pathname]);

  // Close with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-docs-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100 dark:focus-visible:outline-neutral-100"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open ? (
        <div
          id="mobile-docs-nav"
          className="absolute inset-x-0 top-14 max-h-[calc(100svh-3.5rem)] overflow-y-auto border-b border-neutral-200 bg-white px-4 py-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-950"
        >
          <DocsSidebar onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}
