"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/components/docs/icons";

/** A small sun and moon switch for the footer. Highlights the mode you are in. */
export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The real theme is only known in the browser, so wait before marking one as selected.
  useEffect(() => setMounted(true), []);

  const current = mounted ? resolvedTheme : undefined;
  const item = (mode: "light" | "dark", label: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => setTheme(mode)}
      aria-label={label}
      aria-pressed={current === mode}
      className={`grid h-7 w-7 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
        current === mode
          ? "bg-background text-brand-ink shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex gap-0.5 rounded-full border border-border bg-muted p-[3px]" role="group" aria-label="Theme">
      {item("light", "Light mode", <SunIcon />)}
      {item("dark", "Dark mode", <MoonIcon />)}
    </div>
  );
}