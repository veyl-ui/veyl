"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

const managers = [
  { id: "npm", verb: "npm install" },
  { id: "pnpm", verb: "pnpm add" },
  { id: "yarn", verb: "yarn add" },
  { id: "bun", verb: "bun add" },
] as const;

/** An install command with a package-manager switch. */
export function InstallCommand({ packages }: { packages: string[] }) {
  const [manager, setManager] = useState<(typeof managers)[number]["id"]>("npm");
  const verb = managers.find((m) => m.id === manager)?.verb ?? "npm install";
  const command = `${verb} ${packages.join(" ")}`;

  return (
    <div className="overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="flex items-center justify-between border-b border-neutral-200 px-2 py-2 dark:border-neutral-800">
        <div role="tablist" aria-label="Package manager" className="flex gap-1">
          {managers.map((m) => (
            <button
              key={m.id}
              role="tab"
              type="button"
              aria-selected={manager === m.id}
              onClick={() => setManager(m.id)}
              className={cn(
                "rounded-md px-2.5 py-1 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100",
                manager === m.id
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
              )}
            >
              {m.id}
            </button>
          ))}
        </div>
        <CopyButton text={command} />
      </div>
      <pre className="overflow-x-auto px-5 py-4 text-[13px] leading-6">
        <code className="font-mono">{command}</code>
      </pre>
    </div>
  );
}
